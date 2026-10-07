"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Zap,
  Heart,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { ProductImageLightbox } from "@/components/product/ProductImageLightbox";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { FitmentRecord } from "@/lib/fitment";

export interface ProductDetailProps {
  product: {
    id: string;
    slug: string;
    name: string;
    partNumber: string;
    oemNumbers: string[];
    price: number;
    salePrice?: number | null;
    type: string;
    condition: string;
    warranty?: string | null;
    stock: number;
    weight?: number | null;
    countryOfOrigin?: string | null;
    position?: string | null;
    installationNotes?: string | null;
    professionalInstall: boolean;
    tags: string[];
    brand?: { name: string; slug: string; logo?: string | null } | null;
    category: { name: string; slug: string };
    subcategory?: { name: string; slug: string } | null;
    images: { id: string; url: string; alt?: string | null; isPrimary: boolean }[];
    fitments: FitmentRecord[];
    reviews?: {
      id: string;
      rating: number;
      title?: string | null;
      comment: string;
      createdAt: Date | string;
      user: { name?: string | null };
      isVerified: boolean;
    }[];
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "warranty" | "reviews">("specs");

  const images = product.images.length > 0
    ? product.images
    : [{ id: "fallback", url: "", alt: product.name, isPrimary: true }];

  const currentImage = images[selectedImageIndex]?.url;
  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (redirectCheckout = false) => {
    addItem(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        partNumber: product.partNumber,
        price: currentPrice,
        image: images[0]?.url || undefined,
        brandName: product.brand?.name,
        stock: product.stock,
        fitmentConfirmed: true,
      },
      quantity
    );

    if (redirectCheckout) {
      router.push("/checkout");
    } else {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello CARS SPARE PARTS! 🚗\nI have a question about this part:\n\n*${product.name}*\nPart / SKU: ${product.partNumber}\nPrice: PKR ${currentPrice.toLocaleString()}\n${
      typeof window !== "undefined" ? window.location.href : ""
    }\n\nCould you please assist me with availability & details?`
  )}`;

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-brand-zinc-400 overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-brand-amber transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-brand-amber transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/shop/${product.category.slug}`}
          className="hover:text-brand-amber transition-colors"
        >
          {product.category.name}
        </Link>
        {product.subcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/shop/${product.category.slug}/${product.subcategory.slug}`}
              className="hover:text-brand-amber transition-colors"
            >
              {product.subcategory.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-brand-zinc-200 font-medium truncate max-w-[200px]">
          {product.partNumber}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onClick={() => setLightboxOpen(true)}
            className="group relative aspect-square w-full rounded-3xl bg-brand-zinc border border-brand-zinc-800 overflow-hidden shadow-2xl cursor-zoom-in transition-all"
            title="Click to view full-screen image gallery"
          >
            {currentImage ? (
              <Image
                src={currentImage}
                alt={images[selectedImageIndex]?.alt || `${product.name} - ${product.brand?.name || "Auto Part"} (SKU: ${product.partNumber})`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-brand-zinc-600 bg-brand-zinc-950">
                <svg
                  className="w-24 h-24 stroke-current stroke-1 mb-3 opacity-30"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-zinc-500">
                  {product.partNumber}
                </span>
              </div>
            )}

            {/* Badges on Gallery */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {hasDiscount && (
                <Badge variant="amber" className="font-heading font-extrabold text-xs">
                  -{discountPercent}% OFF
                </Badge>
              )}
              <Badge variant="zinc" className="text-xs uppercase font-semibold">
                {product.type}
              </Badge>
              <Badge variant="blue" className="text-[10px] uppercase font-semibold">
                {product.condition}
              </Badge>
            </div>

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist({
                  productId: product.id,
                  name: product.name,
                  partNumber: product.partNumber,
                  price: currentPrice,
                  image: images[0]?.url || undefined,
                });
              }}
              className={`absolute top-4 right-4 p-3 rounded-full transition-colors z-10 ${
                inWishlist
                  ? "bg-rose-500 text-white"
                  : "bg-brand-black/70 text-brand-zinc-300 hover:text-rose-400 hover:bg-brand-black"
              } backdrop-blur-md`}
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
            </button>

            {/* Navigation Arrows on Main Image (Hover / Touch) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-black/75 hover:bg-brand-amber hover:text-brand-black text-brand-white border border-brand-zinc-700/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev + 1) % images.length);
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-black/75 hover:bg-brand-amber hover:text-brand-black text-brand-white border border-brand-zinc-700/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter & Enlarge Hint */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
              {images.length > 1 && (
                <div className="px-2.5 py-1 rounded-lg bg-brand-black/75 border border-brand-zinc-800 text-[11px] font-mono text-brand-zinc-300 backdrop-blur-md shadow">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <span className="px-3 py-1.5 rounded-xl bg-brand-black/75 border border-brand-zinc-700/80 text-brand-zinc-300 text-xs font-semibold backdrop-blur-md inline-flex items-center gap-1.5 group-hover:bg-brand-amber group-hover:text-brand-black group-hover:border-brand-amber transition-all shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen View</span>
              </span>
            </div>
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-brand-zinc-700 scrollbar-track-transparent">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl bg-brand-zinc border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? "border-brand-amber ring-2 ring-brand-amber/30 scale-105 shadow-amber"
                      : "border-brand-zinc-800 hover:border-brand-zinc-700 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Select product image ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                {product.brand?.name || "Genuine Quality"}
              </span>
              <span className="text-brand-zinc-600">•</span>
              <span className="text-xs font-mono text-brand-zinc-400">
                SKU: {product.partNumber}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-brand-white tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Area */}
          <div className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-white">
                PKR {currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-base text-brand-zinc-500 line-through font-mono">
                  PKR {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Out of Stock (Available via Backorder)
                </span>
              )}

              <span className="text-brand-zinc-500">•</span>
              <span className="text-brand-zinc-400">Inclusive of all local sales taxes</span>
            </div>
          </div>

          {/* Quantity & CTA Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center rounded-xl border border-brand-zinc-700 bg-brand-black p-1">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-brand-zinc-400 hover:text-brand-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-heading font-bold text-sm text-brand-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-brand-zinc-400 hover:text-brand-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="primary"
                size="lg"
                disabled={product.stock <= 0}
                onClick={() => handleAddToCart(false)}
                className="flex-1 font-heading uppercase tracking-wider text-xs font-bold"
                leftIcon={<ShoppingCart className="w-4 h-4 text-brand-black" />}
              >
                Add To Cart
              </Button>
            </div>

            {/* Buy Now & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="md"
                disabled={product.stock <= 0}
                onClick={() => handleAddToCart(true)}
                className="font-heading uppercase tracking-wider text-xs font-semibold"
                leftIcon={<Zap className="w-4 h-4 text-brand-amber" />}
              >
                Buy Now (Instant Checkout)
              </Button>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full font-heading uppercase tracking-wider text-xs font-semibold"
                  leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}
                >
                  Ask on WhatsApp
                </Button>
              </a>
            </div>

            {addedToast && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Item added to your shopping cart!</span>
                </div>
                <Link href="/cart" className="underline font-semibold hover:text-white">
                  View Cart
                </Link>
              </div>
            )}
          </div>

          {/* Quick Value Props */}
          <div className="p-4 rounded-2xl bg-brand-zinc/60 border border-brand-zinc-800 space-y-3 text-xs text-brand-zinc-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-brand-amber shrink-0" />
              <span>100% Genuine Quality Guarantee or 7-day return</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-brand-amber shrink-0" />
              <span>Express courier dispatch across Pakistan within 24 hours</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-brand-amber shrink-0" />
              <span>7-Day exchange guarantee on mechanical parts</span>
            </div>
          </div>

          {/* OEM Cross Reference Numbers */}
          {product.oemNumbers.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-brand-zinc-800">
              <h4 className="text-xs font-heading font-semibold text-brand-zinc-300 uppercase tracking-wider">
                OEM Interchange Numbers
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.oemNumbers.map((oem, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-brand-black border border-brand-zinc-700 font-mono text-xs text-brand-zinc-300"
                  >
                    {oem}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section: Specifications, Warranty, Reviews */}
      <div className="space-y-6 pt-8 border-t border-brand-zinc-800">
        <div className="flex items-center gap-4 border-b border-brand-zinc-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={`pb-3 px-1 text-sm font-heading font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "specs"
                ? "border-brand-amber text-brand-white"
                : "border-transparent text-brand-zinc-500 hover:text-brand-zinc-300"
            }`}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("warranty")}
            className={`pb-3 px-1 text-sm font-heading font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "warranty"
                ? "border-brand-amber text-brand-white"
                : "border-transparent text-brand-zinc-500 hover:text-brand-zinc-300"
            }`}
          >
            Warranty & Returns
          </button>
          {product.reviews && product.reviews.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 px-1 text-sm font-heading font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-brand-amber text-brand-white"
                  : "border-transparent text-brand-zinc-500 hover:text-brand-zinc-300"
              }`}
            >
              Verified Reviews ({product.reviews.length})
            </button>
          )}
        </div>

        {/* Tab 2: Specs */}
        {activeTab === "specs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 text-xs">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Manufacturer / Brand</span>
                <span className="font-semibold text-brand-white">
                  {product.brand?.name || "CARS Quality"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Part SKU / Number</span>
                <span className="font-mono font-semibold text-brand-white">
                  {product.partNumber}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Position / Axle</span>
                <span className="font-semibold text-brand-white">
                  {product.position || "Universal / Axle Independent"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Product Classification</span>
                <span className="font-semibold text-brand-white">{product.type}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Warranty Coverage</span>
                <span className="font-semibold text-brand-white">
                  {product.warranty || "Standard 6 Months Limited"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Country of Manufacture</span>
                <span className="font-semibold text-brand-white">
                  {product.countryOfOrigin || "Imported"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Approx. Shipping Weight</span>
                <span className="font-semibold text-brand-white">
                  {product.weight ? `${product.weight} kg` : "Standard Box"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-brand-zinc-800">
                <span className="text-brand-zinc-400">Installation Requirement</span>
                <span className="font-semibold text-brand-white">
                  {product.professionalInstall
                    ? "Professional Mechanic Required"
                    : "Standard DIY / Mechanic"}
                </span>
              </div>
            </div>

            {product.installationNotes && (
              <div className="md:col-span-2 pt-4">
                <h5 className="font-semibold text-brand-zinc-300 mb-1">
                  Installation & Torque Notes
                </h5>
                <p className="text-brand-zinc-400 leading-relaxed">
                  {product.installationNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Warranty */}
        {activeTab === "warranty" && (
          <div className="p-6 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-4 text-xs text-brand-zinc-300">
            <h4 className="font-heading font-bold text-sm text-brand-white uppercase">
              CARS SPARE PARTS Guarantee & Returns Guidelines
            </h4>
            <div className="space-y-2 leading-relaxed">
              <p>
                • <strong className="text-brand-white">Quality Guarantee:</strong> All components are guaranteed 100% genuine and authentic. 7-day replacement warranty on manufacturing defects.
              </p>
              <p>
                • <strong className="text-brand-white">Mechanical Exchange:</strong> Uninstalled mechanical components in original packaging can be exchanged within 7 days of delivery.
              </p>
              <p className="text-rose-400 font-semibold">
                • Electrical & Sensor Policy: Due to electrical surge risks in diagnostic testing, electronic components (ECUs, sensors, fuel pumps, coils) are strictly non-returnable once connected or installed.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews (if any) */}
        {activeTab === "reviews" && product.reviews && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 space-y-2"
                >
                  <div className="flex items-center gap-1 text-brand-amber text-xs">
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </div>
                  {rev.title && (
                    <div className="font-heading font-bold text-sm text-brand-white">
                      {rev.title}
                    </div>
                  )}
                  <p className="text-xs text-brand-zinc-300">{rev.comment}</p>
                  <div className="text-[11px] text-brand-zinc-500 pt-2 border-t border-brand-zinc-800 flex justify-between">
                    <span>{rev.user.name || "Customer"}</span>
                    <span className="text-emerald-400">Verified Buyer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Gallery Modal */}
      <ProductImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        currentIndex={selectedImageIndex}
        onSelectIndex={setSelectedImageIndex}
        productName={product.name}
        partNumber={product.partNumber}
      />
    </div>
  );
}
