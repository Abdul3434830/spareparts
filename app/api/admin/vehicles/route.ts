import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const makeSchema = z.object({
  name: z.string().min(1, "Make name is required"),
  logo: z.string().optional(),
});

const modelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  makeId: z.string().min(1, "Make ID is required"),
  yearFrom: z.number().int().optional(),
  yearTo: z.number().int().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const makes = await db.make.findMany({
    orderBy: { name: "asc" },
    include: {
      models: {
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { fitments: true },
          },
        },
      },
    },
  });

  return NextResponse.json(makes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const type = body.type; // "make" or "model"

    if (type === "make") {
      const parsed = makeSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const { name, logo } = parsed.data;
      const make = await db.make.create({
        data: {
          name,
          slug: slugify(name),
          logo,
        },
      });
      return NextResponse.json(make, { status: 201 });
    }

    if (type === "model") {
      const parsed = modelSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const { name, makeId, yearFrom, yearTo } = parsed.data;
      const model = await db.model.create({
        data: {
          name,
          slug: slugify(name),
          makeId,
          yearFrom,
          yearTo,
        },
      });
      return NextResponse.json(model, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
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
  const type = searchParams.get("type"); // "make" or "model"
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  if (type === "make") {
    await db.make.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  if (type === "model") {
    await db.model.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
