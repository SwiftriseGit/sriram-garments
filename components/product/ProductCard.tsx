import Link from "next/link";
import { Heart, Star } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog/types";

/** Server Component — rendered on the server and streamed as HTML. */
export default function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const onSale = product.compareAtPrice !== null;

  return (
    <article className="group relative">
      <Link href={href} className="block">
        {/* Image */}
        <div className="relative aspect-[3/3.5] rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-2.5">
          <ProductImage
            product={product}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          {!product.inStock && (
            <span className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 bg-white/95 text-zinc-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Sold out
            </span>
          )}
        </div>

        {/* Info */}
        <div className="px-0.5">
          <div className="flex items-center justify-between mb-1.5 min-h-[18px]">
            {onSale && (
              <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Sale
              </span>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" aria-hidden />
              <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-600">
                {product.rating}
              </span>
            </div>
          </div>

          <h3 className="font-semibold text-[11px] sm:text-[13px] text-zinc-900 uppercase leading-tight truncate group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-[11px] font-medium text-zinc-500 mt-0.5">
            {product.color.name}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-[11px] sm:text-[13px] text-zinc-900">
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-[10px] sm:text-[11px] font-medium text-red-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Kept outside the <Link> — interactive elements must not be nested in anchors */}
      <button
        type="button"
        aria-label={`Add ${product.name} to wishlist`}
        className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow"
      >
        <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 hover:text-orange-500 transition-colors" />
      </button>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/3.5] rounded-lg sm:rounded-xl bg-zinc-100 mb-2 sm:mb-2.5" />
      <div className="h-3 w-10 bg-zinc-100 rounded-full mb-2" />
      <div className="h-3 w-4/5 bg-zinc-100 rounded mb-1.5" />
      <div className="h-3 w-1/2 bg-zinc-100 rounded" />
    </div>
  );
}
