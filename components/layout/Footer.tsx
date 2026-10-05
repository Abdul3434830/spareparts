import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, MessageSquare, Phone, Mail } from "lucide-react";
import { PAYMENT_CONFIG } from "@/lib/payment-methods";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PAYMENT_CONFIG.whatsappNumber;

  return (
    <footer className="bg-brand-black border-t border-brand-zinc-800 text-brand-zinc-400 text-xs">
      {/* Trust & Guarantee Bar */}
      <div className="border-b border-brand-zinc-800 bg-brand-zinc-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-brand-white text-sm">
                100% Fitment Guarantee
              </div>
              <div className="text-[11px] text-brand-zinc-500">
                Verified against chassis & engine codes
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-brand-white text-sm">
                Nationwide Fast Dispatch
              </div>
              <div className="text-[11px] text-brand-zinc-500">
                Tracked courier delivery across Pakistan
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-brand-white text-sm">
                Verified Fitment Returns
              </div>
              <div className="text-[11px] text-brand-zinc-500">
                Hassle-free replacement for verified fits
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-brand-amber shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-brand-white text-sm">
                Expert WhatsApp Help
              </div>
              <div className="text-[11px] text-brand-zinc-500">
                Send VIN for instant manual verification
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Col 1: Brand & Bio */}
        <div className="lg:col-span-2 space-y-4">
          <Logo href="/" />
          <p className="text-xs uppercase tracking-widest text-brand-amber font-semibold font-heading">
            THE RIGHT PART. THE RIGHT FIT.
          </p>
          <p className="text-xs text-brand-zinc-400 max-w-sm leading-relaxed">
            Pakistan&apos;s premier auto parts destination. Supplying genuine factory components, OEM replacements, and high-performance upgrades for Japanese, German, and local car lines.
          </p>
          <div className="pt-2 space-y-1.5 text-xs text-brand-zinc-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-amber" />
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-white">
                +{whatsappNumber} (03188303434)
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-amber" />
              <a href={`mailto:${PAYMENT_CONFIG.supportEmail}`} className="hover:text-brand-white">
                {PAYMENT_CONFIG.supportEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Top Categories */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-brand-white">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/shop/engine-parts" className="hover:text-brand-amber transition-colors">
                Engine Parts
              </Link>
            </li>
            <li>
              <Link href="/shop/brakes" className="hover:text-brand-amber transition-colors">
                Brakes & Rotors
              </Link>
            </li>
            <li>
              <Link href="/shop/suspension-steering" className="hover:text-brand-amber transition-colors">
                Suspension & Steering
              </Link>
            </li>
            <li>
              <Link href="/shop/transmission-clutch" className="hover:text-brand-amber transition-colors">
                Transmission & Clutch
              </Link>
            </li>
            <li>
              <Link href="/shop/cooling-heating" className="hover:text-brand-amber transition-colors">
                Cooling & Radiators
              </Link>
            </li>
            <li>
              <Link href="/shop/performance-parts" className="hover:text-brand-amber transition-colors">
                Performance Upgrades
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Service */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-brand-white">Customer Support</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/account/garage" className="hover:text-brand-amber transition-colors">
                My Garage Vehicle Match
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-brand-amber transition-colors">
                Checkout & Payments
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-amber transition-colors">
                About Our Parts
              </Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-brand-amber transition-colors">
                Order Tracking
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Popular Car Makes */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-brand-white">Popular Makes</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/search?q=toyota" className="hover:text-brand-amber transition-colors">
                Toyota Spare Parts
              </Link>
            </li>
            <li>
              <Link href="/search?q=honda" className="hover:text-brand-amber transition-colors">
                Honda Spare Parts
              </Link>
            </li>
            <li>
              <Link href="/search?q=suzuki" className="hover:text-brand-amber transition-colors">
                Suzuki Spare Parts
              </Link>
            </li>
            <li>
              <Link href="/search?q=nissan" className="hover:text-brand-amber transition-colors">
                Nissan Spare Parts
              </Link>
            </li>
            <li>
              <Link href="/search?q=hyundai" className="hover:text-brand-amber transition-colors">
                Hyundai Spare Parts
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Critical Returns Notice & Payment Policy */}
      <div className="border-t border-brand-zinc-800/80 bg-brand-zinc-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="p-3.5 rounded-xl bg-brand-zinc-900 border border-brand-zinc-800 text-[11px] text-brand-zinc-400 leading-relaxed">
            <span className="font-bold text-brand-amber">Returns Policy Note:</span> All electronic and electrical parts (sensors, ECUs, modules, ignition coils) are non-returnable once opened. Fitment returns are accepted within 7 days exclusively when checked against our verified My Garage vehicle matching database.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-zinc-500 pt-2">
            <div>
              &copy; {new Date().getFullYear()} CARS SPARE PARTS. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <span>Accepted Payments: Meezan Bank Transfer (IBFT) • Easypaisa • JazzCash</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
