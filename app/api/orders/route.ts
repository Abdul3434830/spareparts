import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      province,
      postalCode,
      notes,
      vin,
      paymentMethod,
      transactionId,
      senderAccount,
      bankTransferProofUrl,
      items,
      subtotal,
      shippingCost,
      total,
    } = body;

    if (!customerName || !customerPhone || !address || !city || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Please provide all required shipping and contact fields" },
        { status: 400 }
      );
    }

    if (!transactionId || !transactionId.toString().trim()) {
      return NextResponse.json(
        { error: "Payment Transaction ID / Reference Number is required to place your order." },
        { status: 400 }
      );
    }

    // Generate unique order number: CSP-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CSP-${dateStr}-${randSuffix}`;

    let parsedPaymentMethod: "BANK_TRANSFER" | "JAZZ_CASH" | "EASYPAISA" = "BANK_TRANSFER";
    if (paymentMethod === "JAZZ_CASH") {
      parsedPaymentMethod = "JAZZ_CASH";
    } else if (paymentMethod === "EASYPAISA") {
      parsedPaymentMethod = "EASYPAISA";
    } else {
      parsedPaymentMethod = "BANK_TRANSFER";
    }

    // Create order with order items in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || undefined,
          customerName,
          customerEmail: customerEmail || "customer@carespareparts.com",
          customerPhone,
          shippingAddress: {
            street: address,
            city,
            province: province || "Punjab",
            postalCode: postalCode || "00000",
            country: "Pakistan",
          },
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: parsedPaymentMethod,
          transactionId: transactionId ? String(transactionId).trim() : null,
          senderAccount: senderAccount ? String(senderAccount).trim() : null,
          bankTransferProofUrl: bankTransferProofUrl || null,
          subtotal: Number(subtotal),
          shippingFee: Number(shippingCost),
          discount: 0,
          total: Number(total),
          fitmentConfirmed: Boolean(vin),
          notes: notes ? `${notes} ${vin ? `| VIN: ${vin}` : ""}` : vin ? `VIN: ${vin}` : null,
          items: {
            create: items.map(
              (item: {
                productId?: string;
                id?: string;
                name: string;
                partNumber: string;
                price: number;
                quantity: number;
              }) => ({
                productId: (item.productId || item.id) as string,
                name: item.name,
                partNumber: item.partNumber,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity,
              })
            ),
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: `Order placed via ${parsedPaymentMethod}. TID: ${transactionId ? String(transactionId).trim() : "None"}`,
            },
          },
        },
        include: {
          items: true,
        },
      });

      // Adjust product stock
      for (const item of items) {
        const prodId = item.productId || item.id;
        await tx.product.update({
          where: { id: prodId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
