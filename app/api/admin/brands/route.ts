import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return NextResponse.json(brands);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = brandSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { name, country, description, logo } = result.data;
    const slug = result.data.slug || slugify(name);

    const brand = await db.brand.create({
      data: {
        name,
        slug,
        country,
        description,
        logo,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await db.brand.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
