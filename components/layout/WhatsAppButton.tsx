"use client";

import { useGarageStore } from "@/store/garage";
import { MessageCircle } from "lucide-react";
import { PAYMENT_CONFIG } from "@/lib/payment-methods";

export function WhatsAppButton() {
  const activeVehicle = useGarageStore((s) => s.activeVehicle);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PAYMENT_CONFIG.whatsappNumber;

  const message = activeVehicle
    ? `Hello CARE SPARE PARTS, I need help finding genuine or OEM parts for my ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}${activeVehicle.engine ? ` (${activeVehicle.engine})` : ""}.`
    : "Hello CARE SPARE PARTS, I would like to inquire about auto parts and verify fitment for my car.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside
      aria-label="Direct Customer Support"
      className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-center"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        title="Chat on WhatsApp with Care Spare Parts Specialist"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-semibold text-xs tracking-wide">
          Fitment Help on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-amber rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-amber rounded-full border-2 border-brand-black" />
      </a>
    </aside>
  );
}
