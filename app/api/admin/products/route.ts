import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { ProductType, ProductCondition, Prisma } from "@prisma/client";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  partNumber: z.string().min(1, "Part number / SKU is required"),
  oemNumbers: z.array(z.string()).default([]),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().optional().nullable(),
  type: z.nativeEnum(ProductType).default(ProductType.AFTERMARKET),
  condition: z.nativeEnum(ProductCondition).default(ProductCondition.NEW),
  warranty: z.string().optional().nullable(),
  price: z.number().positive("Retail price must be greater than 0"),
  salePrice: z.number().positive().optional().nullable(),
  supplierPrice: z.number().min(0, "Supplier price cannot be negative"),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().default(5),
  weight: z.number().optional().nullable(),
  countryOfOrigin: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  installationNotes: z.string().optional().nullable(),
  professionalInstall: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  published: z.boolean().default(true),
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string().optional().nullable(),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    })
  ).default([]),
  fitments: z.array(
    z.object({
      make: z.string(),
      model: z.string(),
      yearFrom: z.number().int(),
      yearTo: z.number().int(),
      engine: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
    })
  ).default([]),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const lowStock = searchParams.get("lowStock") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const where: Prisma.ProductWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { partNumber: { contains: q, mode: "insensitive" } },
      { oemNumbers: { has: q } },
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (lowStock) {
    where.stock = { lte: 5 };
  }

  const [total, products] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: "asc" } },
        _count: { select: { fitments: true } },
      },
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    products,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const slug = `${slugify(data.name)}-${slugify(data.partNumber)}`;

    const product = await db.product.create({
      data: {
        slug,
        name: data.name,
        partNumber: data.partNumber.trim().toUpperCase(),
        oemNumbers: data.oemNumbers,
        brandId: data.brandId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        type: data.type,
        condition: data.condition,
        warranty: data.warranty,
        price: data.price,
        salePrice: data.salePrice,
        supplierPrice: data.supplierPrice,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        weight: data.weight,
        countryOfOrigin: data.countryOfOrigin,
        position: data.position,
        installationNotes: data.installationNotes,
        professionalInstall: data.professionalInstall,
        tags: data.tags,
        featured: data.featured,
        bestseller: data.bestseller,
        published: data.published,
        images: {
          create: data.images.map((img, i) => ({
            url: img.url,
            alt: img.alt || data.name,
            isPrimary: img.isPrimary ?? i === 0,
            sortOrder: img.sortOrder ?? i,
          })),
        },
        fitments: {
          create: data.fitments.map((fit) => ({
            make: fit.make,
            model: fit.model,
            yearFrom: fit.yearFrom,
            yearTo: fit.yearTo,
            engine: fit.engine,
            notes: fit.notes,
          })),
        },
      },
      include: {
        images: true,
        fitments: true,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/brands");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
