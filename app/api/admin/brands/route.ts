import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { DEFAULT_BRANDS } from "@/lib/default-brands";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().optional(),
  country: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
});

const updateBrandSchema = brandSchema.extend({
  id: z.string().min(1, "Brand ID is required"),
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

    // Handle Seed Request
    if (body.action === "seed") {
      let createdCount = 0;
      for (const b of DEFAULT_BRANDS) {
        const existing = await db.brand.findUnique({ where: { slug: b.slug } });
        if (!existing) {
          await db.brand.create({
            data: {
              name: b.name,
              slug: b.slug,
              country: b.country,
              description: b.description,
            },
          });
          createdCount++;
        }
      }
      return NextResponse.json({
        message: `Successfully seeded ${createdCount} new brands.`,
        createdCount,
      });
    }

    const result = brandSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { name, country, description, logo } = result.data;
    const baseSlug = result.data.slug || slugify(name);

    // Ensure unique slug
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await db.brand.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const brand = await db.brand.create({
      data: {
        name,
        slug: uniqueSlug,
        country: country || null,
        description: description || null,
        logo: logo || null,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/brands");
    revalidatePath("/shop");
    revalidatePath("/sitemap.xml");

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = updateBrandSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { id, name, country, description, logo } = result.data;
    const slug = result.data.slug || slugify(name);

    const brand = await db.brand.update({
      where: { id },
      data: {
        name,
        slug,
        country: country || null,
        description: description || null,
        logo: logo || null,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/brands");
    revalidatePath("/shop");
    revalidatePath("/sitemap.xml");

    return NextResponse.json(brand);
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
    // 1. Find all products associated with this brand
    const products = await db.product.findMany({
      where: { brandId: id },
      select: { id: true, slug: true },
    });

    const productIds = products.map((p) => p.id);

    if (productIds.length > 0) {
      // Clean up all related child records first to satisfy foreign key constraints
      await db.productImage.deleteMany({
        where: { productId: { in: productIds } },
      });
      await db.fitment.deleteMany({
        where: { productId: { in: productIds } },
      });
      await db.review.deleteMany({
        where: { productId: { in: productIds } },
      });
      await db.wishlistItem.deleteMany({
        where: { productId: { in: productIds } },
      });
      await db.orderItem.deleteMany({
        where: { productId: { in: productIds } },
      });

      // Delete the products belonging to this brand
      await db.product.deleteMany({
        where: { id: { in: productIds } },
      });
    }

    // 2. Delete the brand itself from database
    await db.brand.delete({
      where: { id },
    });

    // 3. Invalidate website cache across the entire application
    revalidatePath("/", "layout");
    revalidatePath("/brands");
    revalidatePath("/shop");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      success: true,
      message: `Brand and associated ${productIds.length} products permanently deleted from database and removed from website.`,
    });
  } catch (error) {
    console.error("Brand delete error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

