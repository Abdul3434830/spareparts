import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Wrench,
  CheckCircle2,
  Award,
  Sparkles,
  PhoneCall,
  Search,
  ArrowRight,
  Car,
} from "lucide-react";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui";
import { PAYMENT_CONFIG } from "@/lib/payment-methods";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | CARS SPARE PARTS - The Right Part. The Right Fit.",
  description:
    "Learn about CARS SPARE PARTS. Pakistan's trusted automotive parts platform providing genuine OEM components, 100% chassis-verified fitment guarantee, and nationwide delivery.",
};

export default async function AboutPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PAYMENT_CONFIG.whatsappNumber;

  const categories = await db.category.findMany({
    where: { parentId: null },
    include: {
      subcategories: true,
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white selection:bg-brand-amber selection:text-brand-black">
      <Header categories={categories} />

      <main className="flex-1 space-y-16 sm:space-y-24 pb-20 md:pb-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-brand-zinc-800 bg-gradient-to-b from-brand-zinc-900/80 via-brand-black to-brand-black">
          {/* Subtle amber gradient halo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-zinc-800/80 border border-brand-zinc-700 text-xs font-semibold text-brand-amber shadow-inner">
                <Car className="w-4 h-4 text-brand-amber" />
                <span>ABOUT CARS SPARE PARTS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-brand-white tracking-tight leading-tight">
                Engineered for <span className="text-brand-amber">Performance</span>. Built on <span className="text-brand-amber">Trust</span>.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-brand-zinc-300 leading-relaxed">
                We are Pakistan&apos;s premier dedicated automotive spare parts destination. We eliminate counterfeit components and fitment guesswork through certified OEM sourcing, precision chassis verification, and nationwide tracked dispatch.
              </p>

              <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
                <Link href="/shop">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4 text-brand-black" />}
                    className="font-heading uppercase tracking-wider text-xs font-bold px-7"
                  >
                    Explore Catalog
                  </Button>
                </Link>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "Hello CARS SPARE PARTS! I would like to learn more about your genuine parts and chassis fitment services."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<PhoneCall className="w-4 h-4 text-brand-amber" />}
                    className="font-heading uppercase tracking-wider text-xs font-bold"
                  >
                    Contact Part Specialist
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* KEY METRICS BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-14 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-brand-zinc border border-brand-zinc-700 shadow-2xl">
            <div className="text-center space-y-1 p-2">
              <div className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-amber">
                100%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-brand-white">
                Fitment Guarantee
              </div>
              <div className="text-[11px] text-brand-zinc-400">
                Chassis & VIN verification
              </div>
            </div>

            <div className="text-center space-y-1 p-2 border-l border-brand-zinc-800">
              <div className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-amber">
                300+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-brand-white">
                Cities Covered
              </div>
              <div className="text-[11px] text-brand-zinc-400">
                Tracked nationwide courier
              </div>
            </div>

            <div className="text-center space-y-1 p-2 border-t md:border-t-0 md:border-l border-brand-zinc-800">
              <div className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-amber">
                10,000+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-brand-white">
                Part Numbers
              </div>
              <div className="text-[11px] text-brand-zinc-400">
                OEM & performance aftermarket
              </div>
            </div>

            <div className="text-center space-y-1 p-2 border-t md:border-t-0 md:border-l border-brand-zinc-800">
              <div className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-amber">
                24/7
              </div>
              <div className="text-xs sm:text-sm font-semibold text-brand-white">
                WhatsApp Support
              </div>
              <div className="text-[11px] text-brand-zinc-400">
                Direct technician assistance
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY & THE PROBLEM WE SOLVE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-xs font-semibold text-brand-amber">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Mission</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-brand-white leading-tight">
                Why We Built <span className="text-brand-amber">CARS SPARE PARTS</span>
              </h2>

              <p className="text-sm sm:text-base text-brand-zinc-300 leading-relaxed">
                For years, Pakistani car enthusiasts and daily commuters faced the same frustrating ordeal: visiting crowded markets only to receive second-rate knockoffs, wrong generation parts, or unverified replicas masquerading as genuine OEM components.
              </p>

              <p className="text-sm sm:text-base text-brand-zinc-400 leading-relaxed">
                <strong className="text-brand-white">CARS SPARE PARTS</strong> was founded by automotive specialists to bridge this gap. We combine direct manufacturer supply chains with an intelligent vehicle fitment engine. By verifying every order against exact chassis codes, engine models, and OEM schematics, we guarantee that the part that arrives at your doorstep installs seamlessly.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-xs text-brand-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                  <span>Zero counterfeit tolerance</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-brand-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                  <span>Exact OEM part numbers</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-brand-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                  <span>Transparent upfront pricing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-brand-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                  <span>Doorstep delivery across Pakistan</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  100% Genuine & Certified
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  Every product undergoes strict provenance tracking. We stock genuine OEM replacements and certified Tier-1 aftermarket brands.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  Fitment Engine
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  Select your vehicle make, model, year, and engine code. Our algorithm filters components that match your specific vehicle.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  Fast Express Shipping
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  Protected packing with bubble cushions and heavy-duty corrugated cartons so delicate sensors and radiators arrive intact.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-black border border-brand-zinc-700 flex items-center justify-center text-brand-amber">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  Specialized Sourcing
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  Looking for rare European or Japanese imports? Our international logistics team procures hard-to-find components on demand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STEP VERIFICATION PROCESS */}
        <section className="border-y border-brand-zinc-800 bg-brand-zinc-900/40 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                Precision Process
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-brand-white">
                How We Guarantee 100% Fitment
              </h2>
              <p className="text-xs sm:text-sm text-brand-zinc-400">
                Our 4-tier verification protocol eliminates returns, wrong deliveries, and installation downtime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 relative space-y-4">
                <div className="w-8 h-8 rounded-full bg-brand-amber text-brand-black font-heading font-extrabold text-sm flex items-center justify-center">
                  1
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  VIN & Chassis Intake
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  You enter your vehicle details or share your frame/chassis number during checkout or via WhatsApp.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 relative space-y-4">
                <div className="w-8 h-8 rounded-full bg-brand-amber text-brand-black font-heading font-extrabold text-sm flex items-center justify-center">
                  2
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  OEM Part Cross-Check
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  Our system verifies interchange numbers, engine displacements, revision codes, and chassis build dates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 relative space-y-4">
                <div className="w-8 h-8 rounded-full bg-brand-amber text-brand-black font-heading font-extrabold text-sm flex items-center justify-center">
                  3
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  Physical QC & Packing
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  Before sealing the package, our warehouse technicians inspect threads, seals, and plugs for flawless factory quality.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 relative space-y-4">
                <div className="w-8 h-8 rounded-full bg-brand-amber text-brand-black font-heading font-extrabold text-sm flex items-center justify-center">
                  4
                </div>
                <h3 className="font-heading font-bold text-base text-brand-white">
                  Tracked Dispatch
                </h3>
                <p className="text-xs text-brand-zinc-400 leading-relaxed">
                  Dispatched with premier courier partners. You receive live SMS and tracking updates straight to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORTED VEHICLE MAKES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
              Comprehensive Coverage
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-white">
              Parts for All Major Car Lines in Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-brand-zinc-400">
              From reliable local assemblies to imported Japanese kei cars and luxury German saloons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
              <div className="text-sm font-heading font-bold text-brand-amber uppercase tracking-wider">
                Japanese Makes
              </div>
              <div className="text-sm font-semibold text-brand-white">
                Toyota, Honda, Suzuki, Nissan, Mitsubishi, Daihatsu, Mazda
              </div>
              <p className="text-xs text-brand-zinc-400 leading-relaxed">
                Full catalog covering Corolla, Civic, City, Swift, Alto, Vitz, Mira, Yaris, Hilux, Fortuner, Vezel, Prius, and Land Cruiser.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
              <div className="text-sm font-heading font-bold text-brand-amber uppercase tracking-wider">
                European & Luxury
              </div>
              <div className="text-sm font-semibold text-brand-white">
                Mercedes-Benz, BMW, Audi, Volkswagen, Porsche
              </div>
              <p className="text-xs text-brand-zinc-400 leading-relaxed">
                OEM braking systems, turbochargers, air suspension struts, sensors, filters, and high-performance lubricants.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
              <div className="text-sm font-heading font-bold text-brand-amber uppercase tracking-wider">
                Korean & New Entrants
              </div>
              <div className="text-sm font-semibold text-brand-white">
                Hyundai, Kia, Changan, Haval, MG, Chery, Peugeot
              </div>
              <p className="text-xs text-brand-zinc-400 leading-relaxed">
                Genuine maintenance parts for Sportage, Tucson, Elantra, Alsvin, HS, H6, Stonic, and Oshan X7.
              </p>
            </div>
          </div>
        </section>

        {/* CUSTOM SOURCING BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-zinc to-brand-zinc-900 border border-brand-zinc-700 p-8 sm:p-12 shadow-2xl">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-xs font-semibold text-brand-amber">
                <Wrench className="w-3.5 h-3.5" />
                <span>Specialist Auto Desk</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-white tracking-tight">
                Can&apos;t find your part number?
              </h2>
              <p className="text-sm sm:text-base text-brand-zinc-300 leading-relaxed">
                Send your vehicle&apos;s chassis/frame number and the part you need directly to our technical desk. We will locate the exact OEM part number and send you photos and pricing within hours.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "Hello CARS SPARE PARTS! I am looking for a specific part. Here is my car model and chassis number:"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<PhoneCall className="w-4 h-4 text-brand-black" />}
                    className="font-heading uppercase tracking-wider text-xs font-bold"
                  >
                    Send Chassis on WhatsApp
                  </Button>
                </a>

                <Link href="/shop">
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Search className="w-4 h-4 text-brand-amber" />}
                    className="font-heading uppercase tracking-wider text-xs font-bold"
                  >
                    Search Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </div>
  );
}
