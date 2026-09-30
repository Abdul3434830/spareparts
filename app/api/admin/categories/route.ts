import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      subcategories: {
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { subcategoryProducts: true } },
        },
      },
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { id, name, description, image, parentId, sortOrder } = parsed.data;

    if (id) {
      // Update existing
      const updated = await db.category.update({
        where: { id },
        data: {
          name,
          description,
          image,
          sortOrder,
        },
      });
      return NextResponse.json(updated);
    } else {
      // Create new subcategory or category
      const slug = slugify(name);
      const created = await db.category.create({
        data: {
          name,
          slug,
          description,
          image,
          parentId,
          sortOrder,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
