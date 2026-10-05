"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "./ProductImage";
import type { Product } from "@/lib/catalog/types";

const VIEWS = ["Front", "Back", "Detail", "Styled"];

export default function ProductGallery({
  product,
  discount,
}: {
  product: Pick<Product, "name" | "color" | "images" | "inStock">;
  discount: number;
}) {
  const [active, setActive] = useState(0);
  const count = product.images?.length || VIEWS.length;
  const step = (delta: number) => setActive((i) => (i + delta + count) % count);

  return (
    <div className="lg:sticky lg:top-28 flex flex-col-reverse sm:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-2.5 sm:w-20 shrink-0" role="tablist" aria-label="Product images">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`${VIEWS[i] ?? `Image ${i + 1}`} view`}
            onClick={() => setActive(i)}
            className={`relative w-16 sm:w-20 aspect-[4/5] rounded-lg overflow-hidden transition-all ${
              active === i
                ? "ring-2 ring-orange-500 ring-offset-2"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <ProductImage product={product} view={i} sizes="80px" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="group relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100">
        <ProductImage
          product={product}
          view={active}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
        />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-white text-zinc-900 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-zinc-800 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-zinc-800 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots (mobile) */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 sm:hidden">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
