"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Building2,
  Lock,
  ChevronRight,
  Car,
  AlertCircle,
  Smartphone,
  Copy,
  Check,
  MessageSquare,
  Wallet,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useGarageStore } from "@/store/garage";
import { Button, Input, Select } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PAYMENT_CONFIG } from "@/lib/payment-methods";

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
  const [paymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "EASYPAISA" | "JAZZ_CASH">("BANK_TRANSFER");
  const [transactionId, setTransactionId] = useState("");
  const [senderAccount, setSenderAccount] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      if (session.user.name) setFullName(session.user.name);
      if (session.user.email) setEmail(session.user.email);
    }
  }, [session]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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

    if (!transactionId.trim()) {
      setErrorMsg("Please enter the Payment Transaction ID / Reference Number (TID) from your bank/wallet receipt.");
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
        transactionId: transactionId.trim(),
        senderAccount: senderAccount.trim() || undefined,
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
      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(orderData.orderNumber)}&method=${encodeURIComponent(
          paymentMethod
        )}&tid=${encodeURIComponent(transactionId.trim())}&total=${total}`
      );
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
            <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-brand-zinc-800">
                <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-white">
                  <span className="w-6 h-6 rounded-full bg-brand-amber text-brand-black text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <span>Select Payment Method</span>
                </div>
                <span className="text-[11px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                  Pre-Payment Only
                </span>
              </div>

              {/* 3 Payment Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Bank Transfer (Meezan) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "bg-brand-amber/10 border-brand-amber text-brand-white shadow-lg shadow-brand-amber/5 ring-1 ring-brand-amber"
                      : "bg-brand-zinc-900 border-brand-zinc-800 text-brand-zinc-400 hover:border-brand-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className={`w-5 h-5 ${paymentMethod === "BANK_TRANSFER" ? "text-brand-amber" : "text-brand-zinc-400"}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-amber">
                      Meezan Bank
                    </span>
                  </div>
                  <div className="font-heading font-bold text-sm text-brand-white">
                    Bank Transfer
                  </div>
                  <p className="text-[11px] text-brand-zinc-400 leading-snug">
                    Raast / IBFT directly to Meezan Bank.
                  </p>
                </button>

                {/* Easypaisa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("EASYPAISA")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    paymentMethod === "EASYPAISA"
                      ? "bg-brand-amber/10 border-brand-amber text-brand-white shadow-lg shadow-brand-amber/5 ring-1 ring-brand-amber"
                      : "bg-brand-zinc-900 border-brand-zinc-800 text-brand-zinc-400 hover:border-brand-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className={`w-5 h-5 ${paymentMethod === "EASYPAISA" ? "text-brand-amber" : "text-brand-zinc-400"}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Instant
                    </span>
                  </div>
                  <div className="font-heading font-bold text-sm text-brand-white">
                    Easypaisa
                  </div>
                  <p className="text-[11px] text-brand-zinc-400 leading-snug">
                    Send to 03188303434 via Easypaisa App.
                  </p>
                </button>

                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("JAZZ_CASH")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    paymentMethod === "JAZZ_CASH"
                      ? "bg-brand-amber/10 border-brand-amber text-brand-white shadow-lg shadow-brand-amber/5 ring-1 ring-brand-amber"
                      : "bg-brand-zinc-900 border-brand-zinc-800 text-brand-zinc-400 hover:border-brand-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Wallet className={`w-5 h-5 ${paymentMethod === "JAZZ_CASH" ? "text-brand-amber" : "text-brand-zinc-400"}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Instant
                    </span>
                  </div>
                  <div className="font-heading font-bold text-sm text-brand-white">
                    JazzCash
                  </div>
                  <p className="text-[11px] text-brand-zinc-400 leading-snug">
                    Send to 03210803434 via JazzCash App.
                  </p>
                </button>
              </div>

              {/* Dynamic Account Details Card */}
              <div className="p-4 rounded-2xl bg-brand-black border border-brand-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-zinc-800/80">
                  <span className="font-semibold text-brand-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Account Details to Transfer (PKR {total.toLocaleString()})
                  </span>
                  <span className="text-brand-zinc-400 text-[11px]">Click to copy</span>
                </div>

                {paymentMethod === "BANK_TRANSFER" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">Bank Name</div>
                        <div className="font-bold text-brand-white">{PAYMENT_CONFIG.bank.bankName}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">Account Title</div>
                        <div className="font-bold text-brand-amber">{PAYMENT_CONFIG.bank.accountTitle}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PAYMENT_CONFIG.bank.accountTitle, "bank_title")}
                        className="p-1.5 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "bank_title" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "bank_title" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">Account Number</div>
                        <div className="font-mono font-bold text-brand-white tracking-wide">{PAYMENT_CONFIG.bank.accountNumber}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PAYMENT_CONFIG.bank.accountNumber, "bank_acc")}
                        className="p-1.5 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "bank_acc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "bank_acc" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">IBAN</div>
                        <div className="font-mono font-bold text-brand-white text-[11px] tracking-wide">{PAYMENT_CONFIG.bank.iban}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PAYMENT_CONFIG.bank.iban, "bank_iban")}
                        className="p-1.5 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "bank_iban" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "bank_iban" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === "EASYPAISA" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">Account Title</div>
                        <div className="font-bold text-brand-amber">{PAYMENT_CONFIG.easypaisa.accountTitle}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PAYMENT_CONFIG.easypaisa.accountTitle, "ep_title")}
                        className="p-1.5 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "ep_title" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "ep_title" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">Easypaisa Mobile Number</div>
                        <div className="font-mono font-bold text-lg text-emerald-400 tracking-wider">{PAYMENT_CONFIG.easypaisa.mobileNumber}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PAYMENT_CONFIG.easypaisa.mobileNumber, "ep_num")}
                        className="p-1.5 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "ep_num" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "ep_num" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === "JAZZ_CASH" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">Account Title</div>
                        <div className="font-bold text-brand-amber">{PAYMENT_CONFIG.jazzcash.accountTitle}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PAYMENT_CONFIG.jazzcash.accountTitle, "jc_title")}
                        className="p-1.5 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "jc_title" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "jc_title" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-zinc-900/60 border border-brand-zinc-800">
                      <div>
                        <div className="text-[10px] text-brand-zinc-400 uppercase font-semibold">JazzCash Mobile Number</div>
                        <div className="font-mono font-bold text-lg text-amber-400 tracking-wider">{PAYMENT_CONFIG.jazzcash.mobileNumber}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(PAYMENT_CONFIG.jazzcash.mobileNumber, "jc_num")}
                        className="p-1.5 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "jc_num" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "jc_num" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction ID & Sender Verification Inputs */}
              <div className="p-4 rounded-2xl bg-brand-zinc-900/90 border border-brand-amber/30 space-y-3">
                <div className="text-xs font-semibold text-brand-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-amber" />
                  Enter Payment Confirmation Details
                </div>

                <div className="space-y-3">
                  <Input
                    label="Transaction ID / Reference Number (TID) *"
                    placeholder="e.g. 11370110610915 or 8291039472"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                    className="font-mono"
                  />

                  <Input
                    label="Sender Name or Mobile Number (Optional)"
                    placeholder="e.g. 0300 1234567 or Tariq Mehmood"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                  />
                </div>

                {/* WhatsApp Notice Banner */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-emerald-200">
                      Send Payment Screenshot on WhatsApp
                    </span>
                    <span className="text-[11px] text-emerald-300/80 leading-relaxed block mt-0.5">
                      After placing order, please send your payment receipt / screenshot on WhatsApp to{" "}
                      <strong className="text-emerald-200 font-mono">03188303434</strong> for immediate admin confirmation & dispatch.
                    </span>
                  </div>
                </div>
              </div>
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
