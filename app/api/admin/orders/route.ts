import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

const updateOrderSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  trackingNumber: z.string().optional().nullable(),
  note: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as OrderStatus | null;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const where: Prisma.OrderWhereInput = {};
  if (status && status in OrderStatus) {
    where.status = status;
  }

  const [total, orders] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    orders,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { id, status, paymentStatus, trackingNumber, note } = parsed.data;

    const currentOrder = await db.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const dataToUpdate: Prisma.OrderUpdateInput = {};
    if (status) dataToUpdate.status = status;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) dataToUpdate.trackingNumber = trackingNumber;

    const updated = await db.order.update({
      where: { id },
      data: {
        ...dataToUpdate,
        ...(status && status !== currentOrder.status
          ? {
              statusHistory: {
                create: {
                  status,
                  note: note || `Status changed from ${currentOrder.status} to ${status} by admin`,
                },
              },
            }
          : {}),
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
