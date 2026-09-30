import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Shield, Wrench, Package, LogOut, ArrowLeft } from "lucide-react";
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-brand-black text-brand-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-zinc-400 hover:text-brand-amber transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
          {user.role === "ADMIN" && (
            <Link href="/admin">
              <Button variant="outline" size="sm" leftIcon={<Shield className="w-4 h-4 text-brand-amber" />}>
                Go to Admin Panel
              </Button>
            </Link>
          )}
        </div>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-bold text-brand-white">
                  {user.name || "Customer Account"}
                </h1>
                <Badge
                  variant={
                    user.role === "ADMIN"
                      ? "amber"
                      : user.role === "WHOLESALE"
                      ? "purple"
                      : "zinc"
                  }
                >
                  {user.role}
                </Badge>
              </div>
              <p className="text-sm text-brand-zinc-400">{user.email}</p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </form>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card hover>
            <CardHeader className="flex flex-row items-center gap-3">
              <Package className="w-5 h-5 text-brand-amber" />
              <CardTitle className="text-base">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-brand-zinc-400">
                Track pending parts shipments and view purchase invoices.
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center gap-3">
              <Wrench className="w-5 h-5 text-brand-amber" />
              <CardTitle className="text-base">My Garage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-brand-zinc-400">
                Manage saved cars for 100% guaranteed fitment matching.
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="w-5 h-5 text-brand-amber" />
              <CardTitle className="text-base">Security & Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-brand-zinc-400">
                Update delivery addresses, phone number, and password.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
