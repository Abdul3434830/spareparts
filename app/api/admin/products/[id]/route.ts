import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ProductType, ProductCondition, Prisma } from "@prisma/client";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  partNumber: z.string().min(1).optional(),
  oemNumbers: z.array(z.string()).optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional().nullable(),
  type: z.nativeEnum(ProductType).optional(),
  condition: z.nativeEnum(ProductCondition).optional(),
  warranty: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().optional().nullable(),
  supplierPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().optional(),
  weight: z.number().optional().nullable(),
  countryOfOrigin: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  installationNotes: z.string().optional().nullable(),
  professionalInstall: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  published: z.boolean().optional(),
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string().optional().nullable(),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    })
  ).optional(),
  fitments: z.array(
    z.object({
      make: z.string(),
      model: z.string(),
      yearFrom: z.number().int(),
      yearTo: z.number().int(),
      engine: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
    })
  ).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      fitments: true,
      brand: true,
      category: true,
      subcategory: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // Update images if provided
    if (data.images) {
      await db.productImage.deleteMany({ where: { productId: params.id } });
      await db.productImage.createMany({
        data: data.images.map((img, i) => ({
          productId: params.id,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary ?? i === 0,
          sortOrder: img.sortOrder ?? i,
        })),
      });
    }

    // Update fitments if provided
    if (data.fitments) {
      await db.fitment.deleteMany({ where: { productId: params.id } });
      await db.fitment.createMany({
        data: data.fitments.map((fit) => ({
          productId: params.id,
          make: fit.make,
          model: fit.model,
          yearFrom: fit.yearFrom,
          yearTo: fit.yearTo,
          engine: fit.engine,
          notes: fit.notes,
        })),
      });
    }

    const fieldsToUpdate = { ...data };
    delete fieldsToUpdate.images;
    delete fieldsToUpdate.fitments;

    const updated = await db.product.update({
      where: { id: params.id },
      data: fieldsToUpdate as Prisma.ProductUncheckedUpdateInput,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        fitments: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
