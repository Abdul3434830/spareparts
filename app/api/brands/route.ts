import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: { where: { published: true } } },
        },
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
