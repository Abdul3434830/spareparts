import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Package, Truck, ArrowRight, ExternalLink } from "lucide-react";
import { Button, Badge, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const orders = userId
    ? await db.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-zinc-800">
        <div>
          <h2 className="font-heading font-bold text-xl text-brand-white">
            Order History
          </h2>
          <p className="text-xs text-brand-zinc-400 mt-0.5">
            Track and view previous purchases placed on your account
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders with this account yet. Find guaranteed-fit spare parts for your car in our store."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-4 hover:border-brand-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-zinc-800/80 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-brand-amber">
                      {ord.orderNumber}
                    </span>
                    <Badge
                      variant={
                        ord.status === "DELIVERED"
                          ? "green"
                          : ord.status === "SHIPPED"
                          ? "blue"
                          : ord.status === "PROCESSING"
                          ? "amber"
                          : "zinc"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {ord.status}
                    </Badge>
                  </div>
                  <div className="text-brand-zinc-400 mt-1">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()} at{" "}
                    {new Date(ord.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-brand-zinc-500 uppercase">Total Amount</div>
                    <div className="font-heading font-extrabold text-base text-brand-white">
                      PKR {ord.total.toLocaleString()}
                    </div>
                  </div>
                  <Link href={`/account/orders/${ord.id}`}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Order
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items summary */}
              <div className="divide-y divide-brand-zinc-800/60">
                {ord.items.map((it) => (
                  <div key={it.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-brand-white">{it.name}</span>
                      <span className="text-brand-zinc-500 font-mono ml-2">({it.partNumber})</span>
                    </div>
                    <div className="text-brand-zinc-400 font-mono">
                      {it.quantity} × PKR {it.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Courier Tracking snippet if shipped */}
              {ord.trackingNumber && (
                <div className="p-3 rounded-xl bg-brand-black border border-brand-zinc-700/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-brand-zinc-300">
                    <Truck className="w-4 h-4 text-brand-amber" />
                    <span>Courier Tracking #: <strong className="font-mono text-brand-white">{ord.trackingNumber}</strong></span>
                  </div>
                  <span className="text-brand-amber font-semibold text-[11px] flex items-center gap-1">
                    <span>Track with Courier</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
