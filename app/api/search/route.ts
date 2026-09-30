import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], categories: [], brands: [] });
    }

    const [products, categories, brands] = await Promise.all([
      db.product.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { partNumber: { contains: q, mode: "insensitive" } },
            { oemNumbers: { has: q } },
            { tags: { has: q } },
            { brand: { name: { contains: q, mode: "insensitive" } } },
            { category: { name: { contains: q, mode: "insensitive" } } },
            {
              fitments: {
                some: {
                  OR: [
                    { make: { contains: q, mode: "insensitive" } },
                    { model: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        },
        include: {
          brand: true,
          category: true,
          images: { where: { isPrimary: true }, take: 1 },
          fitments: true,
        },
        take: 8,
      }),
      db.category.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
        },
        take: 4,
      }),
      db.brand.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
        },
        take: 4,
      }),
    ]);

    return NextResponse.json({ products, categories, brands });
  } catch (error) {
    console.error("Live search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
