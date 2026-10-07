"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  Package,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button, Input, EmptyState } from "@/components/ui";
import { FitmentRecord } from "@/lib/fitment";

interface SearchProduct {
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
  images?: { url: string; alt?: string | null; isPrimary?: boolean }[];
  fitments?: FitmentRecord[];
}

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  // Perform search
  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      });
      performSearch(query.trim());
    }
  };

  const visibleProducts = products;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Search Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-5 shadow-2xl">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-white">
            Search Spare Parts Catalog
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400">
            Find parts by Name, Part Number, OEM Interchange, Brand or Vehicle Application
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by part number, name, or OEM code..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-brand-zinc-400" />}
              className="h-12 text-sm bg-brand-black"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-zinc-500 hover:text-brand-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            className="h-12 px-6 font-heading uppercase tracking-wider text-xs font-bold"
            loading={loading}
          >
            Search
          </Button>
        </form>
      </div>

      {/* Results Header */}
      {query && !loading && (
        <div className="flex items-center justify-between text-xs text-brand-zinc-400 px-1">
          <div>
            Results for &ldquo;<span className="text-brand-white font-semibold">{query}</span>&rdquo;:{" "}
            <span className="text-brand-amber font-semibold">{visibleProducts.length}</span> parts
            found
          </div>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="p-16 text-center text-brand-zinc-400 space-y-3">
          <div className="w-10 h-10 border-2 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Searching database across SKUs, fits, and cross references...</p>
        </div>
      ) : visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : query ? (
        <EmptyState
          icon={Package}
          title={`No parts found for "${query}"`}
          description="We couldn't find an exact match in our online catalogue. Our sourcing team can procure it directly for you."
          action={{
            label: "Request Part on WhatsApp",
            onClick: () =>
              window.open(
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello CARS SPARE PARTS! I searched for: "${query}" but could not find it. Could you check if you have it in stock or can source it?`
                )}`,
                "_blank"
              ),
          }}
          secondaryAction={{
            label: "Browse All Categories",
            onClick: () => router.push("/shop"),
          }}
        />
      ) : (
        <div className="text-center py-16 text-brand-zinc-500 text-xs">
          Enter a part number (e.g. 04465-02220), component name, or vehicle model above.
        </div>
      )}
    </div>
  );
}
