import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
      subcategory: { select: { name: true } },
    },
  });

  const headers = [
    "PartNumber",
    "Name",
    "Brand",
    "Category",
    "Subcategory",
    "Type",
    "Condition",
    "Price",
    "SalePrice",
    "SupplierPrice",
    "Stock",
    "Position",
    "CountryOfOrigin",
    "Warranty",
    "Published",
  ];

  const rows = products.map((p) => [
    `"${p.partNumber.replace(/"/g, '""')}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.brand.name.replace(/"/g, '""')}"`,
    `"${p.category.name.replace(/"/g, '""')}"`,
    `"${(p.subcategory?.name || "").replace(/"/g, '""')}"`,
    p.type,
    p.condition,
    p.price,
    p.salePrice ?? "",
    p.supplierPrice,
    p.stock,
    `"${(p.position || "").replace(/"/g, '""')}"`,
    `"${(p.countryOfOrigin || "").replace(/"/g, '""')}"`,
    `"${(p.warranty || "").replace(/"/g, '""')}"`,
    p.published ? "TRUE" : "FALSE",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cars-spare-parts-catalog-${Date.now()}.csv"`,
    },
  });
}
