"use client";

import { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Truck,
  Percent,
  MessageSquare,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button, Input } from "@/components/ui";

export function WholesaleClient() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [partsList, setPartsList] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("PKR 200k - 500k");

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello CARE SPARE PARTS! 🛠️\nI am reaching out regarding a Wholesale B2B Account / Bulk Quote Request.\nBusiness: ${companyName || "Workshop / Retailer"}\nLocation: ${city}\nContact: ${contactName || "Owner"}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!contactName.trim() || !phone.trim() || !partsList.trim() || !email.trim()) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: companyName.trim() || undefined,
        vehicleInfo: vehicleInfo.trim() || undefined,
        partsList: partsList.trim(),
        notes: `City: ${city} | Est. Monthly Volume: ${monthlySpend}`,
      };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit quote request.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Quote error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit quote request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-zinc via-brand-zinc-900 to-brand-black border border-brand-zinc-800 space-y-5 text-center max-w-4xl mx-auto shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-xs font-semibold text-brand-amber">
          <Building2 className="w-3.5 h-3.5" />
          <span>Workshops, Fleets & Auto Retailers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-brand-white tracking-tight">
          Wholesale & B2B Parts Supply
        </h1>

        <p className="text-sm sm:text-base text-brand-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Partner with CARE SPARE PARTS for tiered distributor pricing, bulk delivery crates, credit terms for verified workshops, and guaranteed OEM authenticity.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<MessageSquare className="w-4 h-4 text-brand-black" />}
              className="font-heading uppercase tracking-wider text-xs font-bold"
            >
              Chat With B2B Manager
            </Button>
          </a>
        </div>
      </div>

      {/* 4 Pillars of Wholesale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
            <Percent className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-brand-white">
            Volume Discounts
          </h3>
          <p className="text-xs text-brand-zinc-400 leading-relaxed">
            Tiered pricing up to 25% below retail on high-wear maintenance parts (brake pads, filters, plugs).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-brand-white">
            Priority Fleet Dispatch
          </h3>
          <p className="text-xs text-brand-zinc-400 leading-relaxed">
            Same-day dispatch for corporate and workshop orders with bulk palletized cargo options.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-brand-white">
            Certified Authentic
          </h3>
          <p className="text-xs text-brand-zinc-400 leading-relaxed">
            Official distributor paperwork, customs bill of entry, and batch traceability certificates.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-brand-white">
            Dedicated Parts Specialist
          </h3>
          <p className="text-xs text-brand-zinc-400 leading-relaxed">
            Single point of contact on WhatsApp for instant chassis fitment verification and quote generation.
          </p>
        </div>
      </div>

      {/* Quote Request Form */}
      <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-brand-zinc border border-brand-zinc-800 shadow-2xl space-y-6">
        <div className="border-b border-brand-zinc-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-white">
            Request Formal Wholesale Quote / Open Account
          </h2>
          <p className="text-xs text-brand-zinc-400 mt-1">
            Submit your parts bill of materials or workshop details for a quotation within 4 hours.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg text-brand-white">
              Quote Request Submitted Successfully!
            </h3>
            <p className="text-xs text-brand-zinc-400 max-w-md mx-auto">
              Our B2B operations desk has received your request. A dedicated specialist will contact you on WhatsApp / Phone with formal tier pricing.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Inquiry
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Workshop / Business Name"
                placeholder="e.g. Apex Auto Care & Workshop"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <Input
                label="Contact Person Name *"
                placeholder="e.g. Engr. Usman Ali"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />

              <Input
                label="Phone / WhatsApp Number *"
                placeholder="e.g. 0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Business Email *"
                type="email"
                placeholder="e.g. usman@apexautocare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="City / Region *"
                placeholder="e.g. Lahore, Karachi, Islamabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-brand-zinc-300 mb-1">
                  Est. Monthly Volume
                </label>
                <select
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-brand-black border border-brand-zinc-700 text-sm text-brand-white focus:outline-none focus:border-brand-amber transition-colors"
                >
                  <option value="Under PKR 200k">Under PKR 200,000 / month</option>
                  <option value="PKR 200k - 500k">PKR 200,000 – 500,000 / month</option>
                  <option value="PKR 500k - 2M">PKR 500,000 – 2,000,000 / month</option>
                  <option value="Above PKR 2M">Above PKR 2,000,000 / month</option>
                </select>
              </div>
            </div>

            <Input
              label="Applicable Vehicles / Fleets (Optional)"
              placeholder="e.g. Toyota Corolla (2014-2022), Honda Civic X, Hilux Revo"
              value={vehicleInfo}
              onChange={(e) => setVehicleInfo(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold text-brand-zinc-300 mb-1">
                Requested Parts List / SKU Quantities *
              </label>
              <textarea
                rows={4}
                placeholder="Paste your bill of materials, part numbers, or required quantities:&#10;e.g.&#10;10x Front Brake Pads (04465-02220)&#10;20x Oil Filters Denso 90915-YZZE1&#10;5x Front Shock Absorbers"
                value={partsList}
                onChange={(e) => setPartsList(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-black border border-brand-zinc-700 text-sm text-brand-white placeholder-brand-zinc-500 focus:outline-none focus:border-brand-amber transition-colors resize-y font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                loading={submitting}
                className="font-heading uppercase tracking-wider text-xs font-bold px-8 h-12"
              >
                Submit Quote Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
