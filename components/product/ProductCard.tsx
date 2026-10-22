"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/catalog/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export default function ProductCard({
  product,
  className = "",
  priority = false,
}: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images =
    product.images && product.images.length > 0
      ? product.images.filter(Boolean)
      : [];
  const hasMultipleImages = images.length > 1;
  const hasImage = images.length > 0;

  // Auto-slide images in loop when multiple images exist, pause on hover
  useEffect(() => {
    if (!hasMultipleImages || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [hasMultipleImages, isHovered, images.length]);

  // Cart & Wishlist from localStorage
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const isWishlisted = wishlistItems.some((i) => i.id === product.id);

  const isOnSale =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;

  const discountPercent = isOnSale
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      color: product.color,
      size: product.sizes?.[0] || "M",
      quantity: 1,
      image: product.images?.[0] || "",
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col h-full bg-white rounded-xl sm:rounded-2xl border border-zinc-200/70 overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-300",
        className
      )}
    >
      {/* ── Image Area with Link ── */}
      <div className="relative aspect-[3/3.6] w-full bg-zinc-100 overflow-hidden">
        {/* Sale Badge (Top Left) */}
        {isOnSale && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 bg-linear-to-r from-orange-500 to-amber-500 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs tracking-wider uppercase">
            {discountPercent > 0 ? `-${discountPercent}%` : "SALE"}
          </span>
        )}

        {/* Sold Out Badge */}
        {!product.inStock && (
          <span className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-10 bg-zinc-900/90 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs">
            Sold out
          </span>
        )}

        {/* Love / Wishlist Button (Top Right over Picture) */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center shadow-xs hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
            isWishlisted ? "text-rose-500" : "text-zinc-400 hover:text-rose-500"
          )}
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors",
              isWishlisted && "fill-rose-500"
            )}
          />
        </button>

        {/* Pagination Dots (Middle lower part of image) */}
        {hasMultipleImages && (
          <div
            className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-full bg-black/35 backdrop-blur-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show image ${idx + 1} of ${images.length}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={cn(
                  "rounded-full transition-all duration-300 cursor-pointer",
                  currentImageIndex === idx
                    ? "w-3 sm:w-3.5 h-1.5 bg-white shadow-xs"
                    : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                )}
              />
            ))}
          </div>
        )}

        {/* Clickable Image linking to product */}
        <Link
          href={`/products/${product.slug}`}
          className="block w-full h-full relative cursor-pointer"
        >
          {hasMultipleImages ? (
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((img, idx) => (
                <div key={idx} className="relative w-full h-full shrink-0">
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    priority={priority && idx === 0}
                    sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              ))}
            </div>
          ) : hasImage ? (
            <Image
              src={images[0]}
              alt={product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
              style={{ backgroundColor: product.color?.hex || "#f4f4f5" }}
            >
              <span
                className={`text-xs font-semibold ${
                  product.color?.tone === "dark"
                    ? "text-white/90"
                    : "text-zinc-800"
                }`}
              >
                {product.color?.name || "Garment"}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Product Info & Separate Cart Button ── */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-2">
        <div className="flex items-start justify-between gap-1.5">
          {/* Name & Subtitle (Separate Link) */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="block font-semibold text-[11px] sm:text-[13px] text-zinc-900 leading-snug line-clamp-1 hover:text-orange-600 transition-colors"
            >
              {product.name}
            </Link>
            <p className="text-[10px] sm:text-[11px] font-medium text-zinc-400 truncate mt-0.5">
              {product.color?.name || product.category}
            </p>
          </div>

          {/* Cart Icon beside Name/Price (Separate button with click handler) */}
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAddToCart}
            className={cn(
              "w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95",
              justAdded
                ? "bg-emerald-500 text-white"
                : "bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white"
            )}
          >
            {justAdded ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-zinc-100/70">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-xs sm:text-sm text-zinc-900">
              {formatPrice(product.price)}
            </span>
            {isOnSale && product.compareAtPrice && (
              <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="hidden sm:flex items-center gap-0.5 text-zinc-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-semibold">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl sm:rounded-2xl border border-zinc-200/60 p-2 sm:p-2.5">
      <div className="aspect-[3/3.6] rounded-lg sm:rounded-xl bg-zinc-100 mb-2 sm:mb-2.5" />
      <div className="h-3 w-4/5 bg-zinc-100 rounded mb-1.5" />
      <div className="h-2.5 w-1/2 bg-zinc-100 rounded mb-2" />
      <div className="h-3.5 w-2/5 bg-zinc-100 rounded" />
    </div>
  );
}
