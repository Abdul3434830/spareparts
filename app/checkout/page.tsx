"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Banknote,
  Building2,
  Lock,
  ChevronRight,
  Car,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useGarageStore } from "@/store/garage";
import { Button, Input, Select } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { activeVehicle } = useGarageStore();

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [province, setProvince] = useState("Punjab");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [requireVinCheck, setRequireVinCheck] = useState(false);
  const [vinNumber, setVinNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">("COD");

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      if (session.user.name) setFullName(session.user.name);
      if (session.user.email) setEmail(session.user.email);
    }
  }, [session]);

  const subtotal = getSubtotal();
  const freeShippingThreshold = 15000;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 450;
  const total = subtotal + shippingCost;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-amber">
        <div className="w-8 h-8 border-2 border-brand-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col justify-between">
        <Header />
        <main className="max-w-md mx-auto p-8 text-center space-y-4">
          <h2 className="text-xl font-heading font-bold text-brand-white">Your Cart is Empty</h2>
          <p className="text-xs text-brand-zinc-400">Please add items to your cart before proceeding to checkout.</p>
          <Link href="/shop">
            <Button variant="primary" size="md">Return to Catalog</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !city.trim()) {
      setErrorMsg("Please fill out all required delivery fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: fullName.trim(),
        customerEmail: email.trim() || (session?.user?.email ?? "guest@carespareparts.com"),
        customerPhone: phone.trim(),
        address: streetAddress.trim(),
        city: city.trim(),
        province,
        postalCode: postalCode.trim(),
        notes: notes.trim(),
        vin: requireVinCheck ? vinNumber.trim().toUpperCase() : undefined,
        paymentMethod,
        items,
        subtotal,
        shippingCost,
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }

      const orderData = await res.json();
      clearCart();
      router.push(`/checkout/success?orderNumber=${orderData.orderNumber}`);
    } catch (err: unknown) {
      console.error("Order error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 md:pb-16 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-zinc-400">
          <Link href="/" className="hover:text-brand-amber transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-brand-amber transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-white font-medium">Checkout</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-white">
          Secure Checkout
        </h1>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-white pb-3 border-b border-brand-zinc-800">
                <span className="w-6 h-6 rounded-full bg-brand-amber text-brand-black text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Customer Contact</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Tariq Mehmood"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Phone / WhatsApp Number *"
                  placeholder="e.g. 0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Email Address (for order receipts)"
                    type="email"
                    placeholder="e.g. tariq@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-white pb-3 border-b border-brand-zinc-800">
                <span className="w-6 h-6 rounded-full bg-brand-amber text-brand-black text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Delivery Address (Pakistan)</span>
              </div>

              <div className="space-y-4">
                <Input
                  label="Complete Street Address *"
                  placeholder="House / Flat #, Street, Sector, Area or Landmark"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-zinc-300 mb-1">
                      City *
                    </label>
                    <Select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      options={[
                        { label: "Lahore", value: "Lahore" },
                        { label: "Karachi", value: "Karachi" },
                        { label: "Islamabad", value: "Islamabad" },
                        { label: "Rawalpindi", value: "Rawalpindi" },
                        { label: "Faisalabad", value: "Faisalabad" },
                        { label: "Multan", value: "Multan" },
                        { label: "Peshawar", value: "Peshawar" },
                        { label: "Quetta", value: "Quetta" },
                        { label: "Sialkot", value: "Sialkot" },
                        { label: "Gujranwala", value: "Gujranwala" },
                        { label: "Other Cities", value: "Other" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-zinc-300 mb-1">
                      Province *
                    </label>
                    <Select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      options={[
                        { label: "Punjab", value: "Punjab" },
                        { label: "Sindh", value: "Sindh" },
                        { label: "Khyber Pakhtunkhwa", value: "KPK" },
                        { label: "Balochistan", value: "Balochistan" },
                        { label: "Islamabad Capital", value: "ICT" },
                        { label: "Azad Kashmir / GB", value: "AJK" },
                      ]}
                    />
                  </div>

                  <Input
                    label="Postal Code (Optional)"
                    placeholder="e.g. 54000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <Input
                  label="Delivery Instructions / Landmark Notes (Optional)"
                  placeholder="e.g. Leave with security guard, call before arrival"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Step 3: Vehicle Fitment Assurance */}
            <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-zinc-800">
                <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-white">
                  <Car className="w-5 h-5 text-brand-amber" />
                  <span>Fitment Confirmation Guarantee</span>
                </div>
                {activeVehicle && (
                  <span className="text-xs text-brand-amber font-semibold">
                    {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-brand-zinc-300">
                  <input
                    type="checkbox"
                    checked={requireVinCheck}
                    onChange={(e) => setRequireVinCheck(e.target.checked)}
                    className="mt-0.5 rounded bg-brand-black border-brand-zinc-700 text-brand-amber focus:ring-brand-amber"
                  />
                  <div>
                    <span className="font-semibold text-brand-white block">
                      Verify compatibility with my car before dispatch (Recommended)
                    </span>
                    <span className="text-brand-zinc-400">
                      Our parts specialist will cross-reference your exact chassis build number so zero wrong parts are shipped.
                    </span>
                  </div>
                </label>

                {requireVinCheck && (
                  <div className="pt-2 pl-6">
                    <Input
                      label="VIN / Chassis Number (17 Digits)"
                      placeholder="e.g. 1HGCR2F83HA123456"
                      value={vinNumber}
                      onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                      className="font-mono uppercase tracking-wider"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Payment Method */}
            <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-white pb-3 border-b border-brand-zinc-800">
                <span className="w-6 h-6 rounded-full bg-brand-amber text-brand-black text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    paymentMethod === "COD"
                      ? "bg-brand-amber/10 border-brand-amber text-brand-white shadow-lg shadow-brand-amber/5"
                      : "bg-brand-zinc-900 border-brand-zinc-800 text-brand-zinc-400 hover:border-brand-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-6 h-6 text-brand-amber" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Most Popular
                    </span>
                  </div>
                  <div className="font-heading font-bold text-sm text-brand-white">
                    Cash on Delivery (COD)
                  </div>
                  <p className="text-xs text-brand-zinc-400 leading-snug">
                    Pay safely in cash to courier agent upon inspection and parcel delivery.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "bg-brand-amber/10 border-brand-amber text-brand-white shadow-lg shadow-brand-amber/5"
                      : "bg-brand-zinc-900 border-brand-zinc-800 text-brand-zinc-400 hover:border-brand-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className="w-6 h-6 text-brand-amber" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-zinc-400">
                      Direct IBFT
                    </span>
                  </div>
                  <div className="font-heading font-bold text-sm text-brand-white">
                    Direct Bank Transfer
                  </div>
                  <p className="text-xs text-brand-zinc-400 leading-snug">
                    Transfer directly to our Meezan Bank / HBL corporate accounts for priority dispatch.
                  </p>
                </button>
              </div>

              {paymentMethod === "BANK_TRANSFER" && (
                <div className="p-4 rounded-2xl bg-brand-black border border-brand-zinc-700 text-xs space-y-2">
                  <div className="font-semibold text-brand-amber">Bank Account Details:</div>
                  <div className="text-brand-zinc-300">
                    <div>Bank: <strong>Meezan Bank Limited</strong></div>
                    <div>Account Title: <strong>CARE SPARE PARTS SMC-PVT LTD</strong></div>
                    <div>Account Number: <strong>02010108923451</strong></div>
                    <div>IBAN: <strong>PK65MEZN0002010108923451</strong></div>
                  </div>
                  <p className="text-[11px] text-brand-zinc-500 pt-1">
                    Please share your payment transaction screenshot on WhatsApp after placing order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Summary (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-6 shadow-2xl sticky top-24">
            <h2 className="font-heading font-bold text-lg text-brand-white border-b border-brand-zinc-800 pb-3">
              Order Summary ({items.length} items)
            </h2>

            {/* Items mini list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-brand-zinc-800/60">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <div className="font-semibold text-brand-white line-clamp-1">{item.name}</div>
                    <div className="text-brand-zinc-400 text-[11px]">
                      Qty: {item.quantity} × PKR {item.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="font-heading font-bold text-brand-white">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-sm pt-4 border-t border-brand-zinc-800">
              <div className="flex justify-between text-brand-zinc-300">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-brand-white">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-brand-zinc-300">
                <span>Courier Delivery</span>
                <span className="font-mono font-semibold text-brand-white">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400 uppercase text-xs font-bold">Free</span>
                  ) : (
                    `PKR ${shippingCost.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-brand-zinc-800 flex justify-between items-baseline">
                <span className="font-heading font-bold text-base text-brand-white">Grand Total</span>
                <span className="font-heading font-extrabold text-2xl text-brand-amber">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              loading={submitting}
              className="w-full h-12 font-heading uppercase tracking-wider text-xs font-bold"
              leftIcon={<Lock className="w-4 h-4 text-brand-black" />}
            >
              Confirm & Place Order
            </Button>

            <div className="text-[11px] text-brand-zinc-500 text-center leading-relaxed">
              By placing your order, you agree to CARE SPARE PARTS Terms of Service and Fitment Exchange Policy.
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
