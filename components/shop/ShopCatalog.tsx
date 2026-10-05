"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Filter,
  SlidersHorizontal,
  Car,
  ChevronRight,
  Package,
  CheckCircle,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button, Select, EmptyState, Modal } from "@/components/ui";
import { useGarageStore } from "@/store/garage";
import { checkFitment, FitmentRecord } from "@/lib/fitment";
import { MyGarageModal } from "@/components/fitment/MyGarageModal";

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  partNumber: string;
  price: number;
  salePrice?: number | null;
  type?: string;
  stock: number;
  tags?: string[];
  brand?: { name: string; slug: string } | null;
  category?: { name: string; slug: string } | null;
  subcategory?: { name: string; slug: string } | null;
  images?: { url: string; alt?: string | null; isPrimary?: boolean }[];
  fitments?: FitmentRecord[];
  createdAt: Date | string;
}

export interface ShopCategoryItem {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
}

export interface ShopBrandItem {
  id: string;
  name: string;
  slug: string;
}

interface ShopCatalogProps {
  products: ShopProduct[];
  categories: ShopCategoryItem[];
  brands: ShopBrandItem[];
  initialCategorySlug?: string;
  initialSubcategorySlug?: string;
  initialBrandSlug?: string;
  title?: string;
  description?: string;
}

export function ShopCatalog({
  products,
  categories,
  brands,
  initialCategorySlug,
  initialSubcategorySlug,
  initialBrandSlug,
  title = "Spare Parts Catalog",
  description = "Explore genuine OEM and aftermarket automotive replacement parts.",
}: ShopCatalogProps) {
  const { activeVehicle } = useGarageStore();
  const [garageModalOpen, setGarageModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [filterFitmentOnly, setFilterFitmentOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || "all"
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    initialSubcategorySlug || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(
    initialBrandSlug || "all"
  );
  const [selectedType, setSelectedType] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Keep brand synced with URL parameter if passed
  useEffect(() => {
    if (initialBrandSlug) {
      setSelectedBrand(initialBrandSlug);
    }
  }, [initialBrandSlug]);

  // Current Category object if selected
  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.slug === selectedCategory);
  }, [categories, selectedCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Vehicle fitment filter
        if (filterFitmentOnly && activeVehicle) {
          const fitResult = checkFitment(p, activeVehicle);
          if (fitResult.status !== "fits" && fitResult.status !== "universal") {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "all") {
          if (p.category?.slug !== selectedCategory) return false;
        }

        // Subcategory filter
        if (selectedSubcategory !== "all") {
          if (p.subcategory?.slug !== selectedSubcategory) return false;
        }

        // Brand filter
        if (selectedBrand !== "all") {
          if (p.brand?.slug !== selectedBrand) return false;
        }

        // Type filter (GENUINE, OEM, AFTERMARKET, PERFORMANCE)
        if (selectedType !== "all") {
          if (p.type !== selectedType) return false;
        }

        // In Stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Price range
        const actualPrice = p.salePrice ?? p.price;
        if (actualPrice > priceMax) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    products,
    filterFitmentOnly,
    activeVehicle,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    selectedType,
    inStockOnly,
    priceMax,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedBrand("all");
    setSelectedType("all");
    setInStockOnly(false);
    setFilterFitmentOnly(false);
    setPriceMax(100000);
    setSortBy("newest");
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  return (
    <div className="space-y-8">
      {/* Top Banner / Breadcrumb */}
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-xs text-brand-zinc-400">
          <Link href="/" className="hover:text-brand-amber transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-brand-amber transition-colors">
            Shop
          </Link>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-white font-medium">
                {activeCategoryObj.name}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-white">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          {/* Active Garage Vehicle Quick Indicator */}
          <div className="flex items-center gap-3">
            {activeVehicle ? (
              <div className="px-4 py-2.5 rounded-xl bg-brand-zinc-800 border border-brand-amber/50 flex items-center gap-3">
                <Car className="w-5 h-5 text-brand-amber shrink-0" />
                <div className="text-left text-xs">
                  <div className="text-[10px] text-brand-amber font-semibold uppercase">
                    Filtering For Car
                  </div>
                  <div className="font-heading font-bold text-brand-white">
                    {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGarageModalOpen(true)}
                  className="text-xs text-brand-zinc-400 hover:text-brand-white underline ml-2"
                >
                  Change
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGarageModalOpen(true)}
                leftIcon={<Car className="w-4 h-4 text-brand-amber" />}
              >
                Select Your Vehicle
              </Button>
            )}
          </div>
        </div>
      </div>

      <MyGarageModal
        isOpen={garageModalOpen}
        onClose={() => setGarageModalOpen(false)}
      />

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filters ({filteredProducts.length} Results)
          </Button>

          <div className="w-48">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { label: "Newest First", value: "newest" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
                { label: "Name: A to Z", value: "name_asc" },
              ]}
            />
          </div>
        </div>

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-zinc-800">
              <div className="flex items-center gap-2 font-heading font-bold text-sm text-brand-white">
                <Filter className="w-4 h-4 text-brand-amber" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-brand-zinc-500 hover:text-brand-amber transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Vehicle Match Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-zinc-300">
                Fitment Guarantee
              </label>
              <button
                type="button"
                disabled={!activeVehicle}
                onClick={() => setFilterFitmentOnly(!filterFitmentOnly)}
                className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                  !activeVehicle
                    ? "opacity-50 cursor-not-allowed bg-brand-zinc-900 border-brand-zinc-800"
                    : filterFitmentOnly
                    ? "bg-brand-amber/10 border-brand-amber text-brand-amber font-semibold"
                    : "bg-brand-zinc-900 border-brand-zinc-700 text-brand-zinc-300 hover:border-brand-zinc-600"
                }`}
              >
                <span>Only Show Parts That Fit</span>
                {filterFitmentOnly && <CheckCircle className="w-4 h-4 text-brand-amber" />}
              </button>
              {!activeVehicle && (
                <p className="text-[11px] text-brand-zinc-500">
                  Select a vehicle above to activate fitment filter.
                </p>
              )}
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-zinc-300">
                Category
              </label>
              <Select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("all");
                }}
                options={[
                  { label: "All Categories", value: "all" },
                  ...categories.map((c) => ({ label: c.name, value: c.slug })),
                ]}
              />
            </div>

            {/* Subcategories Filter (if active category has subcategories) */}
            {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-zinc-300">
                  Subcategory
                </label>
                <Select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  options={[
                    { label: "All Subcategories", value: "all" },
                    ...activeCategoryObj.subcategories.map((sub) => ({
                      label: sub.name,
                      value: sub.slug,
                    })),
                  ]}
                />
              </div>
            )}

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-zinc-300">
                  Brand / Manufacturer
                </label>
                <Select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  options={[
                    { label: "All Brands", value: "all" },
                    ...brands.map((b) => ({ label: b.name, value: b.slug })),
                  ]}
                />
              </div>
            )}

            {/* Part Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-zinc-300">
                Part Classification
              </label>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={[
                  { label: "All Types", value: "all" },
                  { label: "Genuine OEM", value: "GENUINE" },
                  { label: "Tier 1 OEM", value: "OEM" },
                  { label: "Premium Aftermarket", value: "AFTERMARKET" },
                  { label: "High Performance", value: "PERFORMANCE" },
                ]}
              />
            </div>

            {/* Stock Availability */}
            <div className="pt-2 border-t border-brand-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-zinc-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded bg-brand-black border-brand-zinc-700 text-brand-amber focus:ring-brand-amber"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-2 border-t border-brand-zinc-800">
              <div className="flex justify-between text-xs text-brand-zinc-400">
                <span>Max Price:</span>
                <span className="font-heading font-bold text-brand-white">
                  PKR {priceMax.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-brand-amber cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Controls for Desktop */}
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-brand-zinc-800">
            <div className="text-xs text-brand-zinc-400">
              Showing <span className="text-brand-amber font-semibold">{filteredProducts.length}</span>{" "}
              available parts
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-zinc-400">Sort By:</span>
              <div className="w-52">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { label: "Newest First", value: "newest" },
                    { label: "Price: Low to High", value: "price_asc" },
                    { label: "Price: High to Low", value: "price_desc" },
                    { label: "Name: A to Z", value: "name_asc" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No parts found matching your criteria"
              description="Try adjusting or clearing your filters, or request hard-to-find part sourcing directly from our team on WhatsApp."
              action={{
                label: "Reset All Filters",
                onClick: resetFilters,
              }}
              secondaryAction={{
                label: "Inquire on WhatsApp",
                onClick: () =>
                  window.open(
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      "Hello CARE SPARE PARTS! I am searching for a specific car part that wasn't found in your catalog. Can you assist me?"
                    )}`,
                    "_blank"
                  ),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Spare Parts"
        description={`Showing ${filteredProducts.length} matching parts`}
      >
        <div className="space-y-4 py-2">
          {/* Fitment toggle */}
          <div>
            <label className="text-xs font-semibold text-brand-zinc-300 block mb-1">
              Vehicle Fitment
            </label>
            <button
              type="button"
              disabled={!activeVehicle}
              onClick={() => setFilterFitmentOnly(!filterFitmentOnly)}
              className={`w-full p-2.5 rounded-lg border text-xs text-left flex items-center justify-between ${
                !activeVehicle
                  ? "opacity-50 cursor-not-allowed bg-brand-zinc-900 border-brand-zinc-800"
                  : filterFitmentOnly
                  ? "bg-brand-amber/10 border-brand-amber text-brand-amber font-semibold"
                  : "bg-brand-zinc-900 border-brand-zinc-700 text-brand-zinc-300"
              }`}
            >
              <span>Only Show Parts That Fit</span>
              {filterFitmentOnly && <CheckCircle className="w-4 h-4 text-brand-amber" />}
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-brand-zinc-300 block mb-1">
              Category
            </label>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("all");
              }}
              options={[
                { label: "All Categories", value: "all" },
                ...categories.map((c) => ({ label: c.name, value: c.slug })),
              ]}
            />
          </div>

          {/* Brand Filter (Mobile) */}
          {brands.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-brand-zinc-300 block mb-1">
                Brand / Manufacturer
              </label>
              <Select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                options={[
                  { label: "All Brands", value: "all" },
                  ...brands.map((b) => ({ label: b.name, value: b.slug })),
                ]}
              />
            </div>
          )}

          {/* Classification */}
          <div>
            <label className="text-xs font-semibold text-brand-zinc-300 block mb-1">
              Classification
            </label>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { label: "All Types", value: "all" },
                { label: "Genuine OEM", value: "GENUINE" },
                { label: "Tier 1 OEM", value: "OEM" },
                { label: "Premium Aftermarket", value: "AFTERMARKET" },
                { label: "High Performance", value: "PERFORMANCE" },
              ]}
            />
          </div>

          {/* In Stock */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-zinc-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded bg-brand-black border-brand-zinc-700 text-brand-amber focus:ring-brand-amber"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-brand-zinc-700">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset All
          </Button>
          <Button variant="primary" onClick={() => setMobileFilterOpen(false)}>
            View Results ({filteredProducts.length})
          </Button>
        </div>
      </Modal>
    </div>
  );
}
