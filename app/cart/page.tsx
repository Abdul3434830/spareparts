"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Car,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useGarageStore } from "@/store/garage";
import { Button, EmptyState } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MyGarageModal } from "@/components/fitment/MyGarageModal";

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);

  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const { activeVehicle } = useGarageStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-amber">
        <div className="w-8 h-8 border-2 border-brand-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const freeShippingThreshold = 15000;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 450;
  const total = subtotal + shippingCost;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 md:pb-12 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-zinc-400">
          <Link href="/" className="hover:text-brand-amber transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-brand-amber transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-white font-medium">Shopping Cart</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-white">
            Shopping Cart ({items.length} {items.length === 1 ? "Item" : "Items"})
          </h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-brand-zinc-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your shopping cart is empty"
            description="Explore our inventory of genuine, OEM and performance parts with guaranteed fitment for your vehicle."
            action={{
              label: "Browse All Parts",
              onClick: () => router.push("/shop"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Bar */}
              <div className="p-4 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Truck className="w-4 h-4" />
                      Congratulations! You qualify for Free Delivery across Pakistan!
                    </span>
                  ) : (
                    <span className="text-brand-zinc-300">
                      Add{" "}
                      <strong className="text-brand-amber">
                        PKR {(freeShippingThreshold - subtotal).toLocaleString()}
                      </strong>{" "}
                      more to get <strong className="text-brand-white">Free Express Delivery</strong>!
                    </span>
                  )}
                  <span className="font-heading font-bold text-brand-amber">
                    {progressToFreeShipping}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-brand-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-brand-amber transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="divide-y divide-brand-zinc-800 rounded-2xl bg-brand-zinc border border-brand-zinc-800 overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-xl bg-brand-black border border-brand-zinc-700 overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-zinc-600">
                          <ShoppingCart className="w-8 h-8 opacity-30" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-brand-zinc-400">
                        <span className="text-brand-amber font-semibold uppercase">
                          {item.brandName || "Quality Part"}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{item.partNumber}</span>
                      </div>

                      <h3 className="font-heading font-bold text-sm sm:text-base text-brand-white leading-snug">
                        {item.name}
                      </h3>

                      {/* Active car fitment badge on cart item */}
                      {activeVehicle && (
                        <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            Fits your {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-xl border border-brand-zinc-700 bg-brand-black p-1 shrink-0">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 text-brand-zinc-400 hover:text-brand-white disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-heading font-bold text-xs text-brand-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 text-brand-zinc-400 hover:text-brand-white disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 sm:min-w-[120px]">
                      <div className="font-heading font-bold text-base text-brand-white">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-brand-zinc-500 font-mono">
                        PKR {item.price.toLocaleString()} each
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-brand-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shopping Guarantee Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-brand-zinc-400">
                <div className="p-3.5 rounded-xl bg-brand-zinc border border-brand-zinc-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-amber shrink-0" />
                  <span>100% Fitment Guarantee</span>
                </div>
                <div className="p-3.5 rounded-xl bg-brand-zinc border border-brand-zinc-800 flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-brand-amber shrink-0" />
                  <span>Nationwide Express Courier</span>
                </div>
                <div className="p-3.5 rounded-xl bg-brand-zinc border border-brand-zinc-800 flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-brand-amber shrink-0" />
                  <span>7-Day Return / Exchange</span>
                </div>
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-6 shadow-2xl sticky top-24">
              <h2 className="font-heading font-bold text-lg text-brand-white border-b border-brand-zinc-800 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-brand-zinc-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-brand-white">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-brand-zinc-300">
                  <span>Estimated Shipping</span>
                  <span className="font-mono font-semibold text-brand-white">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-400 uppercase text-xs font-bold">Free</span>
                    ) : (
                      `PKR ${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-brand-zinc-300">
                  <span>Sales Tax (0%)</span>
                  <span className="font-mono font-semibold text-brand-zinc-400">PKR 0</span>
                </div>

                <div className="pt-3 border-t border-brand-zinc-800 flex justify-between items-baseline">
                  <span className="font-heading font-bold text-base text-brand-white">Total</span>
                  <span className="font-heading font-extrabold text-2xl text-brand-amber">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/checkout" className="block w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full font-heading uppercase tracking-wider text-xs font-bold h-12"
                    rightIcon={<ArrowRight className="w-4 h-4 text-brand-black" />}
                  >
                    Proceed To Checkout
                  </Button>
                </Link>

                <Link href="/shop" className="block w-full">
                  <Button variant="outline" size="md" className="w-full text-xs">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Active Vehicle reminder */}
              {!activeVehicle && (
                <div className="p-3.5 rounded-xl bg-brand-black border border-brand-zinc-700/80 text-xs text-brand-zinc-400 space-y-1">
                  <div className="font-semibold text-brand-amber flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" />
                    <span>Vehicle Not Specified</span>
                  </div>
                  <p>
                    Select your vehicle in My Garage to ensure every part in your cart fits without error.
                  </p>
                  <button
                    type="button"
                    onClick={() => setGarageOpen(true)}
                    className="text-brand-white underline pt-1 block"
                  >
                    Select vehicle now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <MyGarageModal isOpen={garageOpen} onClose={() => setGarageOpen(false)} />
      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
