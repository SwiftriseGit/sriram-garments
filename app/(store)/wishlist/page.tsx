"use client";

import { useWishlistStore } from "@/lib/store/wishlist";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-pink-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
              Your Wishlist is Empty
            </h1>
            <p className="text-zinc-500 text-sm">
              Save items you love to your wishlist and come back to them later.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <button
          onClick={() => {
            clearWishlist();
            toast.success("Wishlist cleared");
          }}
          className="text-sm text-zinc-400 hover:text-red-500 transition-colors font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image / swatch */}
            <Link href={`/products/${item.slug}`}>
              <div
                className="aspect-[3/4] relative flex items-center justify-center"
                style={{ backgroundColor: item.color.hex }}
              >
                <span
                  className={`text-sm font-bold ${
                    item.color.tone === "dark"
                      ? "text-white/40"
                      : "text-zinc-900/20"
                  }`}
                >
                  {item.color.name}
                </span>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.id);
                    toast.success("Removed from wishlist");
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Link>

            <div className="p-4 space-y-3">
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-semibold text-zinc-900 hover:text-orange-600 transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-zinc-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.compareAtPrice && (
                    <span className="text-xs text-zinc-400 line-through">
                      {formatPrice(item.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    ...item,
                    size: "M",
                    quantity: 1,
                  });
                  openCart();
                  toast.success("Added to cart");
                }}
                className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
