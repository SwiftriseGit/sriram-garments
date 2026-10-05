import Image from "next/image";
import type { Product } from "@/lib/catalog/types";

/** Subtle lighting variations so gallery "views" are distinguishable */
const VIEW_OVERLAYS = [
  "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.06) 100%)",
  "linear-gradient(200deg, rgba(0,0,0,0.14) 0%, rgba(255,255,255,0.04) 70%)",
  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16) 0%, rgba(0,0,0,0.08) 75%)",
  "linear-gradient(0deg, rgba(0,0,0,0.18) 0%, rgba(255,255,255,0.06) 100%)",
];

interface ProductImageProps {
  product: Pick<Product, "name" | "color" | "images">;
  /** Gallery view index (0 = main) */
  view?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renders the real product photo when available, otherwise a colour
 * placeholder matching the rest of the site. Drop image URLs into
 * `product.images` and every card / gallery picks them up automatically.
 */
export default function ProductImage({
  product,
  view = 0,
  sizes = "(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw",
  priority = false,
  className = "",
}: ProductImageProps) {
  const src = product.images?.[view] ?? product.images?.[0];

  if (src) {
    return (
      <Image
        src={src}
        alt={`${product.name} — ${product.color.name}`}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${product.name} — ${product.color.name}`}
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundColor: product.color.hex,
        backgroundImage: VIEW_OVERLAYS[view % VIEW_OVERLAYS.length],
      }}
    />
  );
}
