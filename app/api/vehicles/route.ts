import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const makeId = searchParams.get("makeId");
    const modelId = searchParams.get("modelId");

    // If modelId is provided, return model with years and engines
    if (modelId) {
      const model = await db.model.findUnique({
        where: { id: modelId },
        include: { make: true },
      });
      if (!model) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }
      return NextResponse.json(model);
    }

    // If makeId is provided, return models for this make
    if (makeId) {
      const models = await db.model.findMany({
        where: { makeId },
        orderBy: { name: "asc" },
      });
      return NextResponse.json(models);
    }

    // Otherwise return all makes
    const makes = await db.make.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { models: true },
        },
      },
    });

    return NextResponse.json(makes);
  } catch (error) {
    console.error("Public vehicles fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
