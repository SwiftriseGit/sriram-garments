"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Minus, Plus, Ruler, ShoppingBag } from "lucide-react";
import { SIZE_OPTIONS } from "@/lib/catalog/options";
import type { Product, Size } from "@/lib/catalog/types";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

interface ProductPurchaseProps {
  product: Product;
  availableSizes: Size[];
  inStock: boolean;
}

export default function ProductPurchase({
  product,
  availableSizes,
  inStock,
}: ProductPurchaseProps) {
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  // Connect to persistent Cart and Wishlist stores (same functions used in product card)
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const isWishlisted = wishlistItems.some((i) => i.id === product.id);

  const handleAddToCart = () => {
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError(null);

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      color: product.color,
      size: size,
      quantity: quantity,
      image: product.images?.[0] || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      color: product.color,
      image: product.images?.[0] || "",
    });
  };

  const handleBuyNow = () => {
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError(null);

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      color: product.color,
      size: size,
      quantity: quantity,
      image: product.images?.[0] || "",
    });

    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-zinc-900">
            Size{size && <span className="font-medium text-zinc-500">: {size}</span>}
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-orange-500 underline underline-offset-2 transition-colors cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            Size guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
          {SIZE_OPTIONS.map((option) => {
            const available = inStock && availableSizes.includes(option);
            const selected = size === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!available}
                onClick={() => {
                  setSize(option);
                  setError(null);
                }}
                className={`relative min-w-12 h-11 px-4 rounded-full border text-[13px] font-semibold transition-colors cursor-pointer ${
                  selected
                    ? "bg-zinc-900 border-zinc-900 text-white"
                    : available
                      ? "border-zinc-200 text-zinc-800 hover:border-zinc-900"
                      : "border-zinc-100 text-zinc-300 line-through cursor-not-allowed"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {error && (
          <p role="alert" className="mt-2.5 text-[12px] font-medium text-red-500">
            {error}
          </p>
        )}
      </div>

      {/* Actions: Quantity + Add to Cart + Wishlist (All devices) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between border border-zinc-200 rounded-full h-12 px-1.5 w-28 sm:w-32 shrink-0">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1 || !inStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className="text-[14px] font-semibold text-zinc-900 w-7 sm:w-8 text-center select-none"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= 10 || !inStock}
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className={`flex-1 h-12 px-4 rounded-full flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-semibold transition-all cursor-pointer ${
              !inStock
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : added
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.99]"
            }`}
          >
            {!inStock ? (
              "Sold Out"
            ) : added ? (
              <>
                <Check className="w-4 h-4" /> Added to cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>

          {/* Wishlist Button — Visible on ALL devices */}
          <button
            type="button"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            onClick={handleToggleWishlist}
            className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted
                ? "border-orange-500 bg-orange-50 text-orange-500"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-orange-500" : ""}`} />
          </button>
        </div>

        {/* Buy Now Button with fixed padding, responsive height & alignment */}
        {inStock && (
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full h-12 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[14px] font-semibold transition-all flex items-center justify-center text-center shadow-xs cursor-pointer active:scale-[0.99]"
          >
            Buy it now
          </button>
        )}
      </div>
    </div>
  );
}
