"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export interface GalleryImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface ProductImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  productName: string;
  partNumber?: string;
}

export function ProductImageLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onSelectIndex,
  productName,
  partNumber,
}: ProductImageLightboxProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const total = images.length;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((currentIndex + 1) % total);
  }, [currentIndex, total, onSelectIndex]);

  // Keyboard navigation (Escape, Left, Right)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!isOpen || !thumbnailsRef.current) return;
    const activeEl = thumbnailsRef.current.children[currentIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex, isOpen]);

  // Touch Swipe Handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const swipeThreshold = 50; // px threshold
    if (touchDeltaX > swipeThreshold) {
      handlePrev();
    } else if (touchDeltaX < -swipeThreshold) {
      handleNext();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product Image Lightbox"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-8 py-4 z-20 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col max-w-[70%] sm:max-w-[80%]">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-amber font-semibold truncate">
            {partNumber ? `SKU: ${partNumber}` : "Product Gallery"}
          </span>
          <h3 className="text-sm sm:text-base font-heading font-bold text-brand-white truncate">
            {productName}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {total > 1 && (
            <div className="hidden sm:inline-flex px-3 py-1 rounded-full bg-brand-zinc-900/90 border border-brand-zinc-700 text-xs font-mono text-brand-zinc-300">
              {currentIndex + 1} / {total}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Lightbox"
            className="p-2.5 sm:p-3 rounded-full bg-brand-zinc-900/90 hover:bg-brand-zinc-800 border border-brand-zinc-700 text-brand-zinc-300 hover:text-brand-white transition-all hover:scale-105 active:scale-95"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Main Large Viewport Area */}
      <div
        className="relative flex-1 w-full flex items-center justify-center px-2 sm:px-16 md:px-24 py-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Image"
            className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-4 rounded-full bg-brand-zinc-900/80 hover:bg-brand-amber hover:text-brand-black border border-brand-zinc-700/80 text-brand-white transition-all shadow-2xl hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-amber"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Large Image Container */}
        <div className="relative w-full h-[60vh] sm:h-[72vh] md:h-[76vh] max-w-5xl flex items-center justify-center">
          {currentImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || `${productName} view ${currentIndex + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-contain filter drop-shadow-2xl transition-all duration-300"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-brand-zinc-500">
              <ZoomIn className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-xs">No image available</span>
            </div>
          )}
        </div>

        {/* Right Arrow Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Image"
            className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-4 rounded-full bg-brand-zinc-900/80 hover:bg-brand-amber hover:text-brand-black border border-brand-zinc-700/80 text-brand-white transition-all shadow-2xl hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-amber"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div
        className="w-full py-4 px-4 sm:px-8 z-20 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <div className="sm:hidden text-[11px] font-mono text-brand-zinc-400">
            {currentIndex + 1} of {total} • Swipe left or right
          </div>
        )}

        {total > 1 && (
          <div
            ref={thumbnailsRef}
            className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto max-w-full px-2 py-1.5 scrollbar-thin scrollbar-thumb-brand-zinc-700 scrollbar-track-transparent"
          >
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                    isActive
                      ? "border-brand-amber ring-2 ring-brand-amber/50 scale-105 shadow-amber"
                      : "border-brand-zinc-800 opacity-50 hover:opacity-100 hover:border-brand-zinc-600"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `Thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
