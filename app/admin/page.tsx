import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  BarChart3,
  Package,
  Truck,
  AlertTriangle,
  Plus,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  // Aggregate live statistics from database
  const [
    salesAgg,
    totalProducts,
    lowStockCount,
    pendingOrdersCount,
    pendingQuotesCount,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    db.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    db.product.count(),
    db.product.count({ where: { stock: { lte: 5 } } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.quoteRequest.count({ where: { status: "PENDING" } }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    db.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: {
        id: true,
        name: true,
        partNumber: true,
        stock: true,
        lowStockThreshold: true,
        price: true,
      },
    }),
  ]);

  const totalSales = salesAgg._sum.total || 0;

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Store metrics, active inventory, and dispatch queues
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="secondary" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Inventory & CSV
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-brand-zinc-400 uppercase tracking-wider">
              Paid Sales
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-brand-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-brand-amber">
              {formatPrice(totalSales)}
            </div>
            <p className="text-xs text-brand-zinc-500 mt-1">Confirmed customer orders</p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-brand-zinc-400 uppercase tracking-wider">
              Active Inventory
            </CardTitle>
            <Package className="w-4 h-4 text-brand-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-brand-white">
              {totalProducts} Parts
            </div>
            <p className="text-xs text-brand-zinc-500 mt-1">Catalog items listed</p>
          </CardContent>
        </Card>

        <Card hover className={lowStockCount > 0 ? "border-amber-700/60 bg-amber-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-brand-zinc-400 uppercase tracking-wider">
              Low Stock Alert
            </CardTitle>
            <AlertTriangle
              className={`w-4 h-4 ${
                lowStockCount > 0 ? "text-brand-amber animate-pulse" : "text-brand-zinc-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold font-heading ${
                lowStockCount > 0 ? "text-brand-amber" : "text-brand-white"
              }`}
            >
              {lowStockCount} Parts
            </div>
            <p className="text-xs text-brand-zinc-500 mt-1">&le; 5 units remaining</p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-brand-zinc-400 uppercase tracking-wider">
              Pending Action
            </CardTitle>
            <Truck className="w-4 h-4 text-brand-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-brand-white">
              {pendingOrdersCount} Orders
            </div>
            <p className="text-xs text-brand-zinc-500 mt-1">
              {pendingQuotesCount} wholesale quote requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-heading">Recent Orders</CardTitle>
            <Link
              href="/admin/orders"
              className="text-xs text-brand-amber font-semibold hover:underline inline-flex items-center gap-1"
            >
              View all &rarr;
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-zinc-500">
                No orders placed yet. Real orders will populate here automatically.
              </div>
            ) : (
              <div className="divide-y divide-brand-zinc-800">
                {recentOrders.map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-brand-white">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-brand-zinc-400">
                        {order.customerName} • {order.items.length} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-brand-amber">
                        {formatPrice(order.total)}
                      </div>
                      <Badge
                        size="sm"
                        variant={
                          order.status === "DELIVERED"
                            ? "green"
                            : order.status === "CANCELLED"
                            ? "red"
                            : "amber"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-amber" />
              <CardTitle className="text-base font-heading">Low Inventory Items</CardTitle>
            </div>
            <Link
              href="/admin/products?lowStock=true"
              className="text-xs text-brand-amber font-semibold hover:underline inline-flex items-center gap-1"
            >
              Manage &rarr;
            </Link>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-zinc-500">
                All inventory levels are healthy.
              </div>
            ) : (
              <div className="divide-y divide-brand-zinc-800">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-brand-white truncate max-w-xs">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-brand-zinc-400">
                        SKU: {p.partNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-red-400">
                        {p.stock} in stock
                      </span>
                      <div className="text-[10px] text-brand-zinc-500">
                        Alert at &le; {p.lowStockThreshold}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
