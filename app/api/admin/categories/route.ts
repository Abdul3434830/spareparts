import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/sitemap.xml");
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
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/sitemap.xml");
      return NextResponse.json(created, { status: 201 });
    }
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

  try {
    const category = await db.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.parentId) {
      // Subcategory deletion: nullify subcategoryId on products
      await db.product.updateMany({
        where: { subcategoryId: id },
        data: { subcategoryId: null },
      });
      await db.category.delete({ where: { id } });
    } else {
      // Parent category deletion:
      // 1. Find all products belonging to this category or its subcategories
      const subcategoryIds = category.subcategories.map((s) => s.id);
      const allCategoryIds = [id, ...subcategoryIds];

      const products = await db.product.findMany({
        where: {
          OR: [
            { categoryId: { in: allCategoryIds } },
            { subcategoryId: { in: allCategoryIds } },
          ],
        },
        select: { id: true },
      });

      const productIds = products.map((p) => p.id);

      if (productIds.length > 0) {
        await db.productImage.deleteMany({ where: { productId: { in: productIds } } });
        await db.fitment.deleteMany({ where: { productId: { in: productIds } } });
        await db.review.deleteMany({ where: { productId: { in: productIds } } });
        await db.wishlistItem.deleteMany({ where: { productId: { in: productIds } } });
        await db.orderItem.deleteMany({ where: { productId: { in: productIds } } });
        await db.product.deleteMany({ where: { id: { in: productIds } } });
      }

      // Delete subcategories and category
      await db.category.deleteMany({ where: { parentId: id } });
      await db.category.delete({ where: { id } });
    }

    // Invalidate caches across website
    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, message: "Category permanently deleted from database and removed from website." });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
