"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Search,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  Car,
  Package,
  Layers,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Select,
  Modal,
  Spinner,
  Skeleton,
  EmptyState,
} from "@/components/ui";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMake, setSelectedMake] = useState("");

  return (
    <div className="min-h-screen bg-brand-black text-brand-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Brand Header & Quick Auth Navigation */}
        <header className="space-y-6 border-b border-brand-zinc-800 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-zinc-800 border border-brand-zinc-700 text-xs font-semibold text-brand-amber">
              <Wrench className="w-3.5 h-3.5" />
              Phase 1 & 2 Completed • Phase 3: Auth Active
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="primary" size="sm">
                  My Account
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center space-y-4 pt-4">
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight">
              CARE <span className="text-brand-amber">SPARE PARTS</span>
            </h1>
            <p className="text-xl sm:text-2xl font-heading font-semibold text-brand-zinc-200 uppercase tracking-widest">
              THE RIGHT PART. THE RIGHT FIT.
            </p>
            <p className="text-brand-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
              Genuine, OEM and performance parts for your car. Dark, premium, mobile-first design system.
            </p>
          </div>
        </header>

        {/* Brand Tokens Showcase */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="text-brand-amber w-6 h-6" />
            <h2 className="text-2xl font-heading font-bold text-brand-white">Brand Tokens & Colors</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-brand-black border border-brand-zinc-700 space-y-2">
              <div className="h-10 rounded-lg bg-[#0A0A0A] border border-brand-zinc-700" />
              <div className="text-xs font-semibold">Black (#0A0A0A)</div>
              <div className="text-xs text-brand-zinc-400">Primary Background</div>
            </div>
            <div className="p-4 rounded-xl bg-brand-zinc border border-brand-zinc-700 space-y-2">
              <div className="h-10 rounded-lg bg-brand-amber" />
              <div className="text-xs font-semibold text-brand-amber">Amber (#F59E0B)</div>
              <div className="text-xs text-brand-zinc-400">Accent & Action</div>
            </div>
            <div className="p-4 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 space-y-2">
              <div className="h-10 rounded-lg bg-[#18181B] border border-brand-zinc-700" />
              <div className="text-xs font-semibold">Zinc (#18181B)</div>
              <div className="text-xs text-brand-zinc-400">Card & Containers</div>
            </div>
            <div className="p-4 rounded-xl bg-brand-zinc border border-brand-zinc-700 space-y-2">
              <div className="h-10 rounded-lg bg-[#F9FAFB]" />
              <div className="text-xs font-semibold text-brand-white">White (#F9FAFB)</div>
              <div className="text-xs text-brand-zinc-400">Headings & Text</div>
            </div>
          </div>
        </section>

        {/* Buttons Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-brand-white">Buttons</h2>
          <div className="p-6 rounded-xl bg-brand-zinc border border-brand-zinc-700 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Amber</Button>
              <Button variant="secondary">Secondary Zinc</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link Button</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-brand-zinc-700">
              <Button size="sm">Small</Button>
              <Button size="md">Medium (Default)</Button>
              <Button size="lg">Large</Button>
              <Button loading>Loading...</Button>
              <Button leftIcon={<ShoppingCart className="w-4 h-4" />}>With Left Icon</Button>
              <Button rightIcon={<Car className="w-4 h-4" />}>With Right Icon</Button>
            </div>
          </div>
        </section>

        {/* Badges Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-brand-white">Badges & Fitment Status</h2>
          <div className="p-6 rounded-xl bg-brand-zinc border border-brand-zinc-700 flex flex-wrap gap-3">
            <Badge variant="amber">GENUINE OEM</Badge>
            <Badge variant="green" dot>
              Fits Your Vehicle
            </Badge>
            <Badge variant="red" dot>
              Does Not Fit
            </Badge>
            <Badge variant="zinc">AFTERMARKET</Badge>
            <Badge variant="blue">IN STOCK</Badge>
            <Badge variant="yellow">LOW STOCK</Badge>
            <Badge variant="purple">PERFORMANCE</Badge>
          </div>
        </section>

        {/* Cards Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-brand-white">Cards (Standard & Glassmorphism)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hover>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="amber">OEM Quality</Badge>
                  <span className="text-xs text-brand-zinc-400">SKU: BRK-2024-X</span>
                </div>
                <CardTitle className="mt-2">Ceramic Brake Pads Set</CardTitle>
                <CardDescription>Front Axle • Low Dust Formula</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-brand-zinc-300">
                  Precision-engineered friction formulation offering exceptional stopping power and extended rotor life.
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-heading font-bold text-brand-amber">PKR 14,500</span>
                  <span className="text-sm text-brand-zinc-500 line-through">PKR 17,000</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="secondary" size="sm">Details</Button>
                <Button variant="primary" size="sm" leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}>Add to Cart</Button>
              </CardFooter>
            </Card>

            <Card glass hover>
              <CardHeader>
                <Badge variant="green" dot>Fitment Guaranteed</Badge>
                <CardTitle className="mt-2">Vehicle Match Engine</CardTitle>
                <CardDescription>Verified for Honda Civic 2016-2021</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-brand-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Exact bolt-on replacement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>1 Year replacement warranty</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setModalOpen(true)}>
                  Open Specs Modal
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Inputs & Selects */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-brand-white">Forms: Inputs & Selects</h2>
          <div className="p-6 rounded-xl bg-brand-zinc border border-brand-zinc-700 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Part Number or Name"
              placeholder="e.g. 04465-02220 or Oil Filter"
              leftIcon={<Search className="w-4 h-4 text-brand-zinc-400" />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              hint="Search across genuine OEM and aftermarket catalogue"
            />
            <Select
              label="Select Car Make"
              placeholder="Choose Vehicle Make..."
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              options={[
                { label: "Toyota", value: "toyota" },
                { label: "Honda", value: "honda" },
                { label: "Suzuki", value: "suzuki" },
                { label: "Nissan", value: "nissan" },
                { label: "Hyundai", value: "hyundai" },
              ]}
            />
          </div>
        </section>

        {/* Skeletons & Spinners */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-brand-white">Loaders & Skeletons</h2>
          <div className="p-6 rounded-xl bg-brand-zinc border border-brand-zinc-700 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="flex items-center justify-around">
              <Spinner size="sm" color="amber" />
              <Spinner size="md" color="amber" />
              <Spinner size="lg" color="white" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </section>

        {/* Empty State Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-brand-white">Empty State Pattern (Rule 3 Compliant)</h2>
          <EmptyState
            icon={Package}
            title="No parts found in this category"
            description="We haven't added items in this specific category yet. Our inventory updates daily."
            action={{
              label: "Browse All Categories",
              onClick: () => alert("Navigating to all categories"),
            }}
            secondaryAction={{
              label: "Request a Part on WhatsApp",
              onClick: () => alert("Opening WhatsApp inquiry"),
            }}
          />
        </section>

        {/* Interactive Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Vehicle Fitment Confirmation"
          description="CARE SPARE PARTS verified compatibility report"
        >
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-lg bg-brand-zinc-800 border border-brand-zinc-700">
              <div className="text-xs text-brand-zinc-400">Target Vehicle</div>
              <div className="text-lg font-heading font-bold text-brand-white mt-1">
                Toyota Corolla (2014 - 2019) • 1.8L 2ZR-FE
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-brand-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <span>Direct OEM replacement with matching bolt pattern and factory wiring plug.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-brand-zinc-300">
              <AlertTriangle className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
              <span>Professional installation recommended for optimal warranty coverage.</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-zinc-700">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Confirm Fitment
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
