"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";

export default function AccountWishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-12 text-center text-brand-amber">
        <div className="w-8 h-8 border-2 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      partNumber: item.partNumber,
      price: item.price,
      image: item.image,
      stock: 10,
    });

    setAddedItemIds((prev) => [...prev, item.productId]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.productId));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-zinc-800">
        <div>
          <h2 className="font-heading font-bold text-xl text-brand-white">
            Saved Wishlist ({items.length})
          </h2>
          <p className="text-xs text-brand-zinc-400 mt-0.5">
            Auto parts you saved for future replacement or service
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-brand-zinc-500 hover:text-rose-400 transition-colors"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse our parts catalog and click the heart icon to save products for later."
          action={{
            label: "Browse Catalog",
            onClick: () => (window.location.href = "/shop"),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isAdded = addedItemIds.includes(item.productId);
            return (
              <div
                key={item.productId}
                className="p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-800 flex flex-col justify-between space-y-4 hover:border-brand-zinc-700 transition-colors"
              >
                <div className="flex gap-4 items-start">
                  <div className="relative w-20 h-20 rounded-xl bg-brand-black border border-brand-zinc-700 overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-zinc-600">
                        <Heart className="w-6 h-6 opacity-30" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-mono text-brand-zinc-500 uppercase">
                      SKU: {item.partNumber}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-brand-white line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="text-sm font-heading font-bold text-brand-amber">
                      PKR {item.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-zinc-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-brand-zinc-500 hover:text-rose-400 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Button
                    variant={isAdded ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleMoveToCart(item)}
                    leftIcon={
                      <ShoppingCart className="w-3.5 h-3.5 text-brand-black" />
                    }
                  >
                    {isAdded ? "Added to Cart" : "Move To Cart"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
