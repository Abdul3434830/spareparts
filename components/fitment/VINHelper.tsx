"use client";

import { useState } from "react";
import { MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";

interface VINHelperProps {
  productName?: string;
  partNumber?: string;
  triggerButton?: boolean;
}

export function VINHelper({
  productName = "Automotive Part",
  partNumber = "N/A",
  triggerButton = true,
}: VINHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [vin, setVin] = useState("");
  const [vehicleNote, setVehicleNote] = useState("");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello CARS SPARE PARTS! 🚗\nI want to verify if this part fits my vehicle:\n\nPart: ${productName}\nSKU / Part #: ${partNumber}\n\nVehicle VIN / Chassis #: ${vin.toUpperCase()}\nAdditional Notes: ${
        vehicleNote.trim() || "None"
      }\n\nPlease confirm compatibility. Thank you!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
    setIsOpen(false);
  };

  return (
    <>
      {triggerButton && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-brand-amber hover:text-brand-amber-400 hover:underline transition-colors font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Not sure? Verify with VIN / Chassis #</span>
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="100% Fitment Guarantee via VIN"
        description="Share your 17-digit VIN or Chassis number with our parts specialist on WhatsApp for manual verification."
      >
        <div className="space-y-4 py-2">
          <div className="p-3.5 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
            <div className="text-xs text-brand-zinc-300">
              <span className="font-semibold text-brand-white">Zero Guesswork: </span>
              Your VIN (Vehicle Identification Number) contains the exact factory build code, brake size, and engine spec.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-zinc-300 mb-1">
              VIN / Chassis Number (17 digits)
            </label>
            <Input
              placeholder="e.g. 1HGCR2F83HA123456"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
              className="font-mono uppercase tracking-wider"
            />
            <span className="text-[11px] text-brand-zinc-500 mt-1 block">
              Found on your registration certificate or door jamb sticker.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-zinc-300 mb-1">
              Vehicle Year, Make & Model (Optional)
            </label>
            <Input
              placeholder="e.g. 2017 Honda Civic 1.5T"
              value={vehicleNote}
              onChange={(e) => setVehicleNote(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-lg bg-brand-black border border-brand-zinc-800 text-xs text-brand-zinc-400 space-y-1">
            <div><span className="text-brand-zinc-500">Checking Part:</span> {productName}</div>
            <div><span className="text-brand-zinc-500">Part SKU:</span> {partNumber}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-brand-zinc-700">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!vin.trim()}
            onClick={handleSendToWhatsApp}
            leftIcon={<MessageSquare className="w-4 h-4 text-brand-black" />}
          >
            Verify on WhatsApp
          </Button>
        </div>
      </Modal>
    </>
  );
}
