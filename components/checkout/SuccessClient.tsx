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
} from "lucide-react";
import { Button } from "@/components/ui";

export function SuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "CSP-CONFIRMED";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello CARE SPARE PARTS! 🚗\nI just placed order #${orderNumber} on your website.\nCould you please confirm receipt and dispatch schedule? Thank you!`
  )}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-zinc-800 border border-brand-zinc-700 text-xs font-semibold text-brand-amber">
          <span>Order Successfully Placed</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-white">
          Thank you for choosing CARE SPARE PARTS!
        </h1>

        <p className="text-sm text-brand-zinc-400 max-w-md mx-auto">
          Your order has been recorded into our fulfillment system. Our logistics team will call or message to confirm courier booking.
        </p>
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
          <span className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-semibold self-start sm:self-auto">
            Processing Dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-brand-white">Estimated Delivery</div>
              <div className="text-brand-zinc-400">2 to 3 Business Days via TCS / Leopard</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Package className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-brand-white">Inspection at Delivery</div>
              <div className="text-brand-zinc-400">Inspect parcel and verify part number</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto font-heading uppercase tracking-wider text-xs font-bold"
            leftIcon={<MessageSquare className="w-4 h-4 text-brand-black" />}
          >
            Confirm on WhatsApp
          </Button>
        </a>

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
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
