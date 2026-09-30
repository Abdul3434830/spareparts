"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Wrench, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useGarageStore } from "@/store/garage";

export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const activeVehicle = useGarageStore((s) => s.activeVehicle);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Catalog", icon: Grid },
    { href: "/account/garage", label: "My Garage", icon: Wrench, hasBadge: !!activeVehicle },
    { href: "/cart", label: "Cart", icon: ShoppingCart, count: cartCount },
    { href: "/account", label: "Account", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-zinc/95 backdrop-blur-md border-t border-brand-zinc-800 pb-safe">
      <div className="grid grid-cols-5 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center relative transition-colors ${
                isActive ? "text-brand-amber" : "text-brand-zinc-400 hover:text-brand-white"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {mounted && item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-brand-amber text-brand-black text-[10px] font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
                {mounted && item.hasBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 ring-2 ring-brand-zinc animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
