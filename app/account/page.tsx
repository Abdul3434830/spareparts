import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Package, Wrench, Heart, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [orders, vehiclesCount] = userId
    ? await Promise.all([
        db.order.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 3,
          include: {
            items: true,
          },
        }),
        db.savedVehicle.count({
          where: { userId },
        }),
      ])
    : [[], 0];

  const totalSpent = orders.reduce((sum, ord) => sum + ord.total, 0);

  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-brand-zinc-400 text-xs">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-brand-white">
            {orders.length}
          </div>
          <div className="text-[11px] text-brand-zinc-500">Orders placed on CARS SPARE PARTS</div>
        </div>

        <div className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-brand-zinc-400 text-xs">
            <span>Total Value</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-brand-white">
            PKR {totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-brand-zinc-500">Total verified purchases</div>
        </div>

        <div className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-brand-zinc-400 text-xs">
            <span>My Garage</span>
            <Wrench className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-brand-white">
            {vehiclesCount} {vehiclesCount === 1 ? "Vehicle" : "Vehicles"}
          </div>
          <div className="text-[11px] text-brand-zinc-500">
            Saved for precision part fitment check
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-zinc-800">
          <h2 className="font-heading font-bold text-base text-brand-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-amber" />
            <span>Recent Orders</span>
          </h2>
          <Link
            href="/account/orders"
            className="text-xs text-brand-amber hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-brand-zinc-500 space-y-3">
            <Package className="w-8 h-8 mx-auto text-brand-zinc-600" />
            <p>You haven&apos;t placed any orders yet.</p>
            <Link href="/shop">
              <Button variant="primary" size="sm">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-brand-zinc-800/80">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-white">
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
                    {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} {ord.items.length === 1 ? "Item" : "Items"}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="font-heading font-bold text-sm text-brand-white">
                    PKR {ord.total.toLocaleString()}
                  </div>
                  <Link href={`/account/orders/${ord.id}`}>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/garage"
          className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 hover:border-brand-amber/50 hover:bg-brand-zinc-800 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-brand-white group-hover:text-brand-amber transition-colors">
                My Garage
              </div>
              <div className="text-xs text-brand-zinc-400">
                Manage your saved vehicles for instant fitment filtering
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-brand-zinc-500 group-hover:text-brand-amber group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/account/wishlist"
          className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 hover:border-rose-500/50 hover:bg-brand-zinc-800 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-brand-white group-hover:text-rose-400 transition-colors">
                Wishlist
              </div>
              <div className="text-xs text-brand-zinc-400">
                View your saved auto parts and purchase when ready
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-brand-zinc-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
