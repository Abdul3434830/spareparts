import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import {
  LayoutDashboard,
  Package,
  Car,
  Tag,
  FolderTree,
  ShoppingBag,
  Users,
  FileText,
  ExternalLink,
  Shield,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/vehicles", label: "Vehicles & Fitment", icon: Car },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Strict server-side verification: ADMIN role only
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-zinc border-r border-brand-zinc-800 flex flex-col shrink-0">
        {/* Brand Wordmark */}
        <div className="p-5 border-b border-brand-zinc-800">
          <Logo href="/admin" />
          <div className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-brand-amber">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc-800 transition-colors"
              >
                <Icon className="w-4 h-4 text-brand-amber shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info & Logout */}
        <div className="p-4 border-t border-brand-zinc-800 bg-brand-zinc-800/40 space-y-3">
          <div className="text-xs">
            <div className="text-brand-zinc-400">Signed in as:</div>
            <div className="font-semibold text-brand-white truncate">
              {session.user.email}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-zinc-700/60">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] text-brand-zinc-400 hover:text-brand-amber transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
