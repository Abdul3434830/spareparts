import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role, Prisma } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isApproved: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          garage: true,
        },
      },
    },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, isApproved, role } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

    const data: Prisma.UserUpdateInput = {};
    if (isApproved !== undefined) data.isApproved = Boolean(isApproved);
    if (role && role in Role) data.role = role as Role;

    const updated = await db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
