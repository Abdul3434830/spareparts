"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  Wrench,
  User,
  Menu,
  X,
  ChevronDown,
  Shield,
  Phone,
  LogOut,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useGarageStore } from "@/store/garage";
import { Button } from "@/components/ui";
import { MyGarageModal } from "@/components/fitment/MyGarageModal";

interface CategoryNav {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
}

export function Header({
  categories = [],
}: {
  categories?: CategoryNav[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);

  const cartItemsCount = useCartStore((s) => s.getTotalItems());
  const activeVehicle = useGarageStore((s) => s.activeVehicle);
  const vehiclesCount = useGarageStore((s) => s.vehicles.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-black/95 backdrop-blur-md border-b border-brand-zinc-800">
      {/* Top Banner */}
      <div className="bg-brand-zinc-900 border-b border-brand-zinc-800 py-1.5 px-4 text-center text-[11px] text-brand-zinc-400 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-brand-amber font-semibold">THE RIGHT PART. THE RIGHT FIT.</span>
          <span>• Genuine, OEM and performance parts</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-4">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hello CARE SPARE PARTS, I need help checking part fitment for my car."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-brand-zinc-300 hover:text-brand-amber flex items-center gap-1 transition-colors"
          >
            <Phone className="w-3 h-3 text-brand-amber" />
            <span>WhatsApp Support: +{whatsappNumber}</span>
          </a>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-brand-amber font-semibold hover:underline flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-brand-zinc-400 hover:text-brand-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo Wordmark */}
        <Link href="/" className="shrink-0">
          <span className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-brand-white">
            CARE <span className="text-brand-amber">SPARE PARTS</span>
          </span>
        </Link>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-lg mx-4 relative items-center"
        >
          <input
            type="text"
            placeholder="Search by Part #, OEM number, car model, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-zinc-800 border border-brand-zinc-700 hover:border-brand-zinc-600 focus:border-brand-amber text-brand-white placeholder-brand-zinc-400 rounded-full pl-4 pr-10 py-2 text-xs transition-all focus:outline-none focus:ring-1 focus:ring-brand-amber"
          />
          <button
            type="submit"
            className="absolute right-2 p-1.5 text-brand-zinc-400 hover:text-brand-amber transition-colors"
            title="Search catalog"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions: My Garage, Cart, Account */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* My Garage Button */}
          <button
            type="button"
            onClick={() => setGarageOpen(true)}
            className="hidden sm:flex items-center gap-2 p-2 rounded-lg bg-brand-zinc-800/80 hover:bg-brand-zinc-800 border border-brand-zinc-700/80 text-xs text-brand-zinc-200 transition-colors"
          >
            <div className="relative">
              <Wrench className="w-4 h-4 text-brand-amber" />
              {mounted && activeVehicle && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="text-left">
              <div className="text-[10px] text-brand-zinc-400 font-semibold uppercase">My Garage</div>
              <div className="font-semibold text-brand-white max-w-[120px] truncate">
                {mounted && activeVehicle
                  ? `${activeVehicle.year} ${activeVehicle.model}`
                  : mounted && vehiclesCount > 0
                  ? `${vehiclesCount} Cars`
                  : "Add Vehicle"}
              </div>
            </div>
          </button>

          <MyGarageModal isOpen={garageOpen} onClose={() => setGarageOpen(false)} />

          {/* Cart Icon & Count */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-lg bg-brand-zinc-800/80 hover:bg-brand-zinc-800 border border-brand-zinc-700/80 text-brand-white transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 text-brand-amber" />
            {mounted && cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-brand-amber text-brand-black text-[11px] font-extrabold flex items-center justify-center shadow-amber">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Account Button */}
          {session?.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-brand-zinc-800/80 hover:bg-brand-zinc-800 border border-brand-zinc-700/80 text-xs font-semibold text-brand-white transition-colors"
              >
                <User className="w-4 h-4 text-brand-amber" />
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {session.user.name || "Account"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-zinc-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-brand-zinc border border-brand-zinc-700 shadow-2xl py-2 z-50 text-xs divide-y divide-brand-zinc-800"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2">
                    <div className="font-semibold text-brand-white truncate">
                      {session.user.name}
                    </div>
                    <div className="text-[11px] text-brand-zinc-400 truncate">
                      {session.user.email}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc-800"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc-800"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account/garage"
                      className="block px-4 py-2 text-brand-zinc-300 hover:text-brand-white hover:bg-brand-zinc-800"
                    >
                      Saved Vehicles
                    </Link>
                  </div>

                  {session.user.role === "ADMIN" && (
                    <div className="py-1">
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-brand-amber font-semibold hover:bg-brand-zinc-800"
                      >
                        Admin Console
                      </Link>
                    </div>
                  )}

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-brand-zinc-800 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" leftIcon={<User className="w-4 h-4" />}>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <nav className="hidden md:block bg-brand-zinc/80 border-t border-brand-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6 py-2.5">
            {/* Categories Mega Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1.5 font-bold text-brand-white hover:text-brand-amber transition-colors"
              >
                <span>ALL CATEGORIES</span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-amber" />
              </button>

              {categoriesOpen && (
                <div
                  onMouseLeave={() => setCategoriesOpen(false)}
                  className="absolute left-0 top-full mt-2 w-[600px] rounded-2xl bg-brand-zinc border border-brand-zinc-700 shadow-2xl p-6 grid grid-cols-2 gap-4 z-50"
                >
                  {categories.slice(0, 12).map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <Link
                        href={`/shop/${cat.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="font-bold text-brand-white hover:text-brand-amber block transition-colors"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-brand-zinc-400">
                          {cat.subcategories.slice(0, 3).map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/shop/${cat.slug}/${sub.slug}`}
                              onClick={() => setCategoriesOpen(false)}
                              className="hover:text-brand-amber"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/shop" className="font-semibold text-brand-zinc-300 hover:text-brand-white">
              Shop All Parts
            </Link>
            <Link
              href="/shop?type=PERFORMANCE"
              className="font-semibold text-brand-amber hover:text-brand-amber-light"
            >
              Performance
            </Link>
            <Link href="/brands" className="font-semibold text-brand-zinc-300 hover:text-brand-white">
              Brands
            </Link>
            <Link href="/about" className="font-semibold text-brand-zinc-300 hover:text-brand-white">
              About CARE
            </Link>
          </div>

          <div className="text-[11px] text-brand-zinc-400">
            <span>Guaranteed Genuine & OEM Auto Components</span>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-zinc-800 bg-brand-zinc p-4 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search spare parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-zinc-800 border border-brand-zinc-700 text-brand-white rounded-lg p-2.5 text-xs pr-9"
            />
            <button type="submit" className="absolute right-2.5 top-2.5 text-brand-zinc-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 text-xs font-semibold">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg bg-brand-zinc-800 text-brand-white"
            >
              All Categories & Parts
            </Link>
            <Link
              href="/account/garage"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg bg-brand-zinc-800 text-brand-white"
            >
              My Garage ({mounted ? vehiclesCount : 0} Vehicles)
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg bg-brand-zinc-800 text-brand-white"
            >
              Shopping Cart ({mounted ? cartItemsCount : 0})
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg bg-brand-zinc-800 text-brand-zinc-300"
            >
              About CARE
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
