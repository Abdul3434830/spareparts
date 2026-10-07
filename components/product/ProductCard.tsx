"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Check, Eye } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { FitmentRecord } from "@/lib/fitment";

export interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    null;

  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      partNumber: product.partNumber,
      price: currentPrice,
      image: primaryImage || undefined,
      brandName: product.brand?.name,
      stock: product.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      partNumber: product.partNumber,
      price: currentPrice,
      image: primaryImage || undefined,
    });
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-brand-zinc border border-brand-zinc-800 hover:border-brand-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 overflow-hidden">
      {/* Top Image area */}
      <div className="relative aspect-square w-full bg-brand-zinc-900 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={`${product.name} - ${product.brand?.name || "Auto Part"} (${product.partNumber})`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-brand-zinc-600 bg-brand-zinc-950">
            <svg
              className="w-16 h-16 stroke-current stroke-1 mb-2 opacity-40"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-zinc-500">
              {product.partNumber}
            </span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <Badge variant="amber" className="font-heading font-extrabold text-[11px] shadow-md">
              -{discountPercent}% OFF
            </Badge>
          )}
          {product.type === "GENUINE" && (
            <Badge variant="amber" className="text-[10px] uppercase font-bold">
              GENUINE
            </Badge>
          )}
          {product.type === "OEM" && (
            <Badge variant="blue" className="text-[10px] uppercase font-bold">
              OEM
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors z-10 ${
            inWishlist
              ? "bg-rose-500 text-white"
              : "bg-brand-black/60 text-brand-zinc-300 hover:text-rose-400 hover:bg-brand-black"
          } backdrop-blur-sm`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Stock status indicator */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-heading font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Brand & Category line */}
        <div className="flex items-center justify-between text-[11px] text-brand-zinc-400">
          <span className="font-medium text-brand-amber uppercase tracking-wider">
            {product.brand?.name || "Premium Part"}
          </span>
          <span className="font-mono text-brand-zinc-500">{product.partNumber}</span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group-hover:text-brand-amber transition-colors">
          <h3 className="font-heading font-bold text-sm text-brand-white line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action Bottom */}
        <div className="mt-auto pt-3 border-t border-brand-zinc-800 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-heading font-bold text-brand-white">
              PKR {currentPrice.toLocaleString()}
            </div>
            {hasDiscount && (
              <div className="text-xs text-brand-zinc-500 line-through font-mono">
                PKR {product.price.toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-lg bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 hover:text-brand-white transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <Button
              variant={added ? "secondary" : "primary"}
              size="sm"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              className="px-3"
              leftIcon={
                added ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ShoppingCart className="w-3.5 h-3.5 text-brand-black" />
                )
              }
            >
              {added ? "Added" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
