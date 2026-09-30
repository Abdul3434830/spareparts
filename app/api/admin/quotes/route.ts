import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { QuoteStatus } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quotes = await db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotes);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, notes } = await req.json();
    if (!id || !(status in QuoteStatus)) {
      return NextResponse.json({ error: "Invalid status or missing ID" }, { status: 400 });
    }

    const updated = await db.quoteRequest.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
