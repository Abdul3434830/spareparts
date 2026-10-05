"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  MessageSquare,
  Home,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui";
import { PAYMENT_CONFIG } from "@/lib/payment-methods";

export function SuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "CSP-CONFIRMED";
  const method = searchParams.get("method") || "BANK_TRANSFER";
  const tid = searchParams.get("tid") || "";
  const total = searchParams.get("total") || "";

  const whatsappNumber = PAYMENT_CONFIG.whatsappNumber; // 923188303434

  const methodName =
    method === "BANK_TRANSFER"
      ? "Meezan Bank Transfer"
      : method === "EASYPAISA"
      ? "Easypaisa"
      : method === "JAZZ_CASH"
      ? "JazzCash"
      : method;

  const whatsappMessage = `Assalam-o-Alaikum CARE SPARE PARTS! 🚗
I have placed Order #${orderNumber}${total ? ` for PKR ${Number(total).toLocaleString()}` : ""}.
Payment Method: ${methodName}
Transaction ID: ${tid || "Sent in receipt"}

I am attaching my payment screenshot here. Please verify payment and confirm my parcel dispatch. Thank you!`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-zinc-800 border border-brand-zinc-700 text-xs font-semibold text-brand-amber">
          <span>Order Placed & Awaiting Verification</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-white">
          Thank you for your order!
        </h1>

        <p className="text-sm text-brand-zinc-400 max-w-md mx-auto">
          Your order has been recorded into our system. Once our team verifies your payment transaction ID, your order will be confirmed and booked for courier dispatch.
        </p>
      </div>

      {/* WhatsApp Screenshot Callout - Most Important Step */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-950/60 to-brand-zinc border-2 border-emerald-500/50 space-y-4 text-left shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div className="space-y-1">
            <div className="font-heading font-extrabold text-base text-white">
              Action Required: Send Screenshot on WhatsApp
            </div>
            <p className="text-xs text-brand-zinc-300 leading-relaxed">
              Please click the button below to send your payment screenshot & Transaction ID (TID) to our official WhatsApp (
              <strong className="text-emerald-400 font-mono">03188303434</strong>). Our admin will verify receipt and mark your order as <span className="text-emerald-400 font-bold">Confirmed</span>.
            </p>
          </div>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
          <button
            type="button"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-heading font-bold text-sm tracking-wide transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Send Payment Screenshot on WhatsApp (03188303434)</span>
          </button>
        </a>
      </div>

      {/* Order Reference Box */}
      <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4 text-left shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-zinc-800 gap-2">
          <div>
            <div className="text-[11px] text-brand-zinc-500 uppercase font-semibold">
              Order Reference Number
            </div>
            <div className="text-lg font-mono font-bold text-brand-amber mt-0.5">
              {orderNumber}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-semibold self-start sm:self-auto flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Payment Confirmation</span>
          </span>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-brand-black/60 p-3.5 rounded-2xl border border-brand-zinc-800/80">
          <div>
            <span className="text-brand-zinc-400 text-[11px] block">Payment Method</span>
            <span className="font-semibold text-brand-white font-heading">{methodName}</span>
          </div>

          <div>
            <span className="text-brand-zinc-400 text-[11px] block">Recorded Transaction ID (TID)</span>
            <span className="font-mono font-bold text-emerald-400">{tid || "Under Verification"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-brand-white">Fast Courier Dispatch</div>
              <div className="text-brand-zinc-400">TCS / Leopards courier booked upon confirmation</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Package className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-brand-white">Fitment Protection</div>
              <div className="text-brand-zinc-400">Guaranteed part compatibility with your car</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link href="/account/orders" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-xs"
            leftIcon={<FileText className="w-4 h-4" />}
          >
            View My Orders
          </Button>
        </Link>

        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto text-xs"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
