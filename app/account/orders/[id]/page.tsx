import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Package,
  Truck,
  ArrowLeft,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: { product: true },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order || (order.userId && order.userId !== session?.user?.id && session?.user?.role !== "ADMIN")) {
    notFound();
  }

  const shippingAddr = (order.shippingAddress as Record<string, string>) || {};
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello CARE SPARE PARTS! 🚗\nI am inquiring about order #${order.orderNumber}.\nCould you provide an update on delivery status?`
  )}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-zinc-800">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-brand-zinc-400 hover:text-brand-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Inquire on WhatsApp
          </Button>
        </a>
      </div>

      {/* Order Status & Header Box */}
      <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-zinc-800">
          <div>
            <div className="text-xs text-brand-zinc-500 uppercase font-semibold">
              Order Number
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-brand-amber mt-0.5">
              {order.orderNumber}
            </div>
            <div className="text-xs text-brand-zinc-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={
                order.status === "DELIVERED"
                  ? "green"
                  : order.status === "SHIPPED"
                  ? "blue"
                  : order.status === "PROCESSING"
                  ? "amber"
                  : "zinc"
              }
              className="text-xs uppercase font-bold px-3 py-1"
            >
              {order.status}
            </Badge>
          </div>
        </div>

        {/* Courier tracking alert if available */}
        {order.trackingNumber && (
          <div className="p-4 rounded-2xl bg-brand-black border border-brand-zinc-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-brand-zinc-300">
              <Truck className="w-5 h-5 text-brand-amber" />
              <div>
                <span className="text-brand-zinc-500">Tracking Number:</span>{" "}
                <strong className="font-mono text-brand-white text-sm">{order.trackingNumber}</strong>
              </div>
            </div>
            <span className="text-emerald-400 font-semibold">In Transit</span>
          </div>
        )}

        {/* Grid: Order Items & Delivery Address */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Order Items List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading font-bold text-sm text-brand-white flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-amber" />
              <span>Items in this Order ({order.items.length})</span>
            </h3>

            <div className="divide-y divide-brand-zinc-800 rounded-2xl bg-brand-zinc-900 border border-brand-zinc-800 overflow-hidden">
              {order.items.map((it) => (
                <div key={it.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-brand-white text-sm">{it.name}</div>
                    <div className="text-brand-zinc-500 font-mono mt-0.5">
                      SKU: {it.partNumber} • Qty: {it.quantity}
                    </div>
                  </div>
                  <div className="font-heading font-bold text-sm text-brand-white">
                    PKR {it.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="p-5 rounded-2xl bg-brand-zinc-900 border border-brand-zinc-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-brand-zinc-300">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-brand-white">
                  PKR {order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-brand-zinc-300">
                <span>Courier Delivery</span>
                <span className="font-mono font-semibold text-brand-white">
                  {order.shippingFee === 0 ? "Free" : `PKR ${order.shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-2 border-t border-brand-zinc-800 flex justify-between items-baseline text-sm">
                <span className="font-heading font-bold text-brand-white">Total Amount</span>
                <span className="font-heading font-extrabold text-lg text-brand-amber">
                  PKR {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info (1 col) */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-brand-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-amber" />
              <span>Shipping Information</span>
            </h3>

            <div className="p-5 rounded-2xl bg-brand-zinc-900 border border-brand-zinc-800 space-y-3 text-xs text-brand-zinc-300">
              <div>
                <span className="text-brand-zinc-500 block">Recipient:</span>
                <strong className="text-brand-white font-medium">{order.customerName}</strong>
              </div>
              <div>
                <span className="text-brand-zinc-500 block">Phone / WhatsApp:</span>
                <strong className="text-brand-white font-mono">{order.customerPhone}</strong>
              </div>
              <div>
                <span className="text-brand-zinc-500 block">Delivery Address:</span>
                <span className="text-brand-zinc-300">
                  {shippingAddr.street}, {shippingAddr.city}, {shippingAddr.province}{" "}
                  {shippingAddr.postalCode}
                </span>
              </div>
              <div className="pt-2 border-t border-brand-zinc-800">
                <span className="text-brand-zinc-500 block">Payment Method:</span>
                <strong className="text-brand-white">
                  {order.paymentMethod === "BANK_TRANSFER"
                    ? "Direct Bank Transfer"
                    : "Cash on Delivery (COD)"}
                </strong>
              </div>
              {order.notes && (
                <div className="pt-2 border-t border-brand-zinc-800">
                  <span className="text-brand-zinc-500 block">Special Notes:</span>
                  <span className="text-brand-zinc-400 italic">{order.notes}</span>
                </div>
              )}
            </div>

            {/* Status History Timeline */}
            {order.statusHistory.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-heading font-semibold text-xs text-brand-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </h4>
                <div className="space-y-2">
                  {order.statusHistory.map((sh) => (
                    <div
                      key={sh.id}
                      className="p-3 rounded-xl bg-brand-black border border-brand-zinc-800 text-xs flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-brand-white">{sh.status}</div>
                        {sh.note && <div className="text-brand-zinc-400 mt-0.5">{sh.note}</div>}
                        <div className="text-[10px] text-brand-zinc-600 mt-1">
                          {new Date(sh.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
