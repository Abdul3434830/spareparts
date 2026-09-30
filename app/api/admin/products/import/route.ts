import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { ProductType, ProductCondition } from "@prisma/client";

function parseCsv(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.map((line) => {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { csvContent } = await req.json();
    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json({ error: "Missing csvContent" }, { status: 400 });
    }

    const rows = parseCsv(csvContent);
    if (rows.length < 2) {
      return NextResponse.json({ error: "CSV file contains no data rows" }, { status: 400 });
    }

    const header = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const dataRows = rows.slice(1);

    const partNumberIdx = header.indexOf("partnumber");
    const nameIdx = header.indexOf("name");
    const brandIdx = header.indexOf("brand");
    const categoryIdx = header.indexOf("category");
    const subcategoryIdx = header.indexOf("subcategory");
    const typeIdx = header.indexOf("type");
    const conditionIdx = header.indexOf("condition");
    const priceIdx = header.indexOf("price");
    const salePriceIdx = header.indexOf("saleprice");
    const wholesalePriceIdx = header.indexOf("wholesaleprice");
    const supplierPriceIdx = header.indexOf("supplierprice");
    const stockIdx = header.indexOf("stock");

    if (partNumberIdx === -1 || nameIdx === -1 || brandIdx === -1 || categoryIdx === -1 || priceIdx === -1) {
      return NextResponse.json(
        {
          error:
            "Missing required CSV columns: PartNumber, Name, Brand, Category, Price are required.",
        },
        { status: 400 }
      );
    }

    // Pre-cache brands and categories to minimize DB hits
    const [allBrands, allCategories] = await Promise.all([
      db.brand.findMany(),
      db.category.findMany(),
    ]);

    const brandMap = new Map(allBrands.map((b) => [b.name.toLowerCase(), b.id]));
    const categoryMap = new Map(allCategories.map((c) => [c.name.toLowerCase(), c.id]));

    let createdCount = 0;
    let updatedCount = 0;
    const errors: { row: number; partNumber?: string; reason: string }[] = [];

    // Process in chunks of 25 to respect serverless compute limits
    const CHUNK_SIZE = 25;
    for (let c = 0; c < dataRows.length; c += CHUNK_SIZE) {
      const chunk = dataRows.slice(c, c + CHUNK_SIZE);

      for (let i = 0; i < chunk.length; i++) {
        const row = chunk[i];
        const rowNum = c + i + 2; // 1-indexed, accounting for header
        const partNumber = row[partNumberIdx]?.trim().toUpperCase();
        const name = row[nameIdx]?.trim();
        const brandName = row[brandIdx]?.trim();
        const catName = row[categoryIdx]?.trim();
        const rawPrice = row[priceIdx]?.trim();

        if (!partNumber || !name || !brandName || !catName || !rawPrice) {
          errors.push({
            row: rowNum,
            partNumber: partNumber || "N/A",
            reason: "Missing mandatory fields (partNumber, name, brand, category, price)",
          });
          continue;
        }

        const price = parseFloat(rawPrice);
        if (isNaN(price) || price <= 0) {
          errors.push({
            row: rowNum,
            partNumber,
            reason: `Invalid retail price: "${rawPrice}"`,
          });
          continue;
        }

        // Resolve or create brand
        let brandId = brandMap.get(brandName.toLowerCase());
        if (!brandId) {
          const newBrand = await db.brand.create({
            data: { name: brandName, slug: slugify(brandName) },
          });
          brandId = newBrand.id;
          brandMap.set(brandName.toLowerCase(), brandId);
        }

        // Resolve or create category
        let categoryId = categoryMap.get(catName.toLowerCase());
        if (!categoryId) {
          const newCat = await db.category.create({
            data: { name: catName, slug: slugify(catName) },
          });
          categoryId = newCat.id;
          categoryMap.set(catName.toLowerCase(), categoryId);
        }

        // Optional subcategory
        let subcategoryId: string | null = null;
        if (subcategoryIdx !== -1 && row[subcategoryIdx]?.trim()) {
          const subName = row[subcategoryIdx].trim();
          subcategoryId = categoryMap.get(subName.toLowerCase()) || null;
          if (!subcategoryId) {
            const newSub = await db.category.create({
              data: { name: subName, slug: slugify(subName), parentId: categoryId },
            });
            subcategoryId = newSub.id;
            categoryMap.set(subName.toLowerCase(), subcategoryId);
          }
        }

        const supplierPrice = supplierPriceIdx !== -1 && row[supplierPriceIdx] ? parseFloat(row[supplierPriceIdx]) || 0 : 0;
        const salePrice = salePriceIdx !== -1 && row[salePriceIdx] ? parseFloat(row[salePriceIdx]) || null : null;
        const wholesalePrice = wholesalePriceIdx !== -1 && row[wholesalePriceIdx] ? parseFloat(row[wholesalePriceIdx]) || null : null;
        const stock = stockIdx !== -1 && row[stockIdx] ? parseInt(row[stockIdx], 10) || 0 : 0;

        let type: ProductType = ProductType.AFTERMARKET;
        if (typeIdx !== -1 && row[typeIdx]) {
          const t = row[typeIdx].toUpperCase();
          if (t in ProductType) type = t as ProductType;
        }

        let condition: ProductCondition = ProductCondition.NEW;
        if (conditionIdx !== -1 && row[conditionIdx]) {
          const cd = row[conditionIdx].toUpperCase();
          if (cd in ProductCondition) condition = cd as ProductCondition;
        }

        try {
          const existing = await db.product.findUnique({
            where: { partNumber },
          });

          if (existing) {
            await db.product.update({
              where: { partNumber },
              data: {
                name,
                brandId,
                categoryId,
                subcategoryId,
                type,
                condition,
                price,
                salePrice,
                wholesalePrice,
                supplierPrice,
                stock,
              },
            });
            updatedCount++;
          } else {
            const slug = `${slugify(name)}-${slugify(partNumber)}`;
            await db.product.create({
              data: {
                slug,
                partNumber,
                name,
                brandId,
                categoryId,
                subcategoryId,
                type,
                condition,
                price,
                salePrice,
                wholesalePrice,
                supplierPrice,
                stock,
                oemNumbers: [],
                tags: [],
              },
            });
            createdCount++;
          }
        } catch (rowErr) {
          errors.push({
            row: rowNum,
            partNumber,
            reason: (rowErr as Error).message,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalRows: dataRows.length,
        created: createdCount,
        updated: updatedCount,
        failed: errors.length,
      },
      errors,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
