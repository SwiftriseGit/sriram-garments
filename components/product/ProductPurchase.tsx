"use client";

import { useState } from "react";
import { Check, Heart, Minus, Plus, Ruler, ShoppingBag } from "lucide-react";
import { SIZE_OPTIONS } from "@/lib/catalog/options";
import type { Size } from "@/lib/catalog/types";

/**
 * The only interactive part of the product details — kept as a small client
 * island so the rest of the page stays server-rendered.
 */
export default function ProductPurchase({
  availableSizes,
  inStock,
}: {
  availableSizes: Size[];
  inStock: boolean;
}) {
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    // Expected validation problem → show as UI state, not an exception
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError(null);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-zinc-900">
            Size{size && <span className="font-medium text-zinc-500">: {size}</span>}
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-orange-500 underline underline-offset-2 transition-colors"
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
                className={`relative min-w-12 h-11 px-4 rounded-full border text-[13px] font-semibold transition-colors ${
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

      {/* Quantity + actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center justify-between sm:justify-start border border-zinc-200 rounded-full h-12 px-1.5 sm:w-32 shrink-0">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !inStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[14px] font-semibold text-zinc-900 w-8 text-center" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= 10 || !inStock}
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          disabled={!inStock}
          onClick={handleAddToCart}
          className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-[14px] font-semibold transition-all ${
            !inStock
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : added
                ? "bg-emerald-500 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
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

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((w) => !w)}
          className={`hidden sm:flex w-12 h-12 shrink-0 rounded-full border items-center justify-center transition-colors ${
            wishlisted
              ? "border-orange-500 bg-orange-50 text-orange-500"
              : "border-zinc-200 text-zinc-600 hover:border-zinc-900"
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-orange-500" : ""}`} />
        </button>
      </div>

      {inStock && (
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[14px] font-semibold transition-colors"
        >
          Buy it now
        </button>
      )}
    </div>
  );
}
