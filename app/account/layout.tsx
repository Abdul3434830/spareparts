import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Shield,
  Package,
  Wrench,
  Heart,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const { user } = session;

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 md:pb-16 space-y-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-brand-zinc border border-brand-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-white">
                  {user.name || "Customer Account"}
                </h1>
                <Badge
                  variant={user.role === "ADMIN" ? "amber" : "zinc"}
                  className="uppercase font-mono text-[10px]"
                >
                  {user.role}
                </Badge>
              </div>
              <p className="text-xs text-brand-zinc-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {user.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Shield className="w-4 h-4 text-brand-amber" />}
                >
                  Admin Console
                </Button>
              </Link>
            )}

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* Account Sub-Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-brand-zinc-800 overflow-x-auto pb-1 text-xs">
          <Link
            href="/account"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc transition-colors whitespace-nowrap"
          >
            <LayoutDashboard className="w-4 h-4 text-brand-amber" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/account/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc transition-colors whitespace-nowrap"
          >
            <Package className="w-4 h-4 text-brand-amber" />
            <span>My Orders</span>
          </Link>

          <Link
            href="/account/garage"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc transition-colors whitespace-nowrap"
          >
            <Wrench className="w-4 h-4 text-brand-amber" />
            <span>My Garage</span>
          </Link>

          <Link
            href="/account/wishlist"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc transition-colors whitespace-nowrap"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Saved Wishlist</span>
          </Link>
        </div>

        {/* Child Pages Content */}
        <div>{children}</div>
      </main>

      <Footer />
    </div>
  );
}
