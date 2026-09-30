import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, BarChart3, Package, Users, Truck } from "lucide-react";
import { Badge, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-brand-zinc-800 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-zinc-400 hover:text-brand-amber transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Store
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-amber" />
            <Badge variant="amber">ADMIN SECURE CONSOLE</Badge>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-brand-white">
            Admin Management Portal
          </h1>
          <p className="text-sm text-brand-zinc-400 mt-1">
            Logged in as <span className="text-brand-amber font-semibold">{session.user.email}</span> (Administrator)
          </p>
        </div>

        {/* Stat placeholders ready for Phase 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-zinc-400">Total Sales</CardTitle>
              <BarChart3 className="w-4 h-4 text-brand-amber" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-brand-white">PKR 0</div>
              <p className="text-xs text-brand-zinc-500 mt-1">Awaiting real orders</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-zinc-400">Active Inventory</CardTitle>
              <Package className="w-4 h-4 text-brand-amber" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-brand-white">0 Parts</div>
              <p className="text-xs text-brand-zinc-500 mt-1">Ready for catalog entry</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-zinc-400">Orders to Dispatch</CardTitle>
              <Truck className="w-4 h-4 text-brand-amber" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-brand-white">0 Pending</div>
              <p className="text-xs text-brand-zinc-500 mt-1">0 awaiting fitment check</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-zinc-400">Wholesale Requests</CardTitle>
              <Users className="w-4 h-4 text-brand-amber" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-brand-white">0 Pending</div>
              <p className="text-xs text-brand-zinc-500 mt-1">0 awaiting approval</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
