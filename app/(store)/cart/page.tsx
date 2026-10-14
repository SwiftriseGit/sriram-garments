"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice, discountPercent } from "@/lib/format";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } =
    useCartStore();

  const total = subtotal();
  const shipping = total > 999 ? 0 : 99;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
              Your Cart is Empty
            </h1>
            <p className="text-zinc-500 text-sm">
              Looks like you haven&apos;t added anything yet.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Shopping Cart
        </h1>
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="text-sm text-zinc-400 hover:text-red-500 transition-colors font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-zinc-100 border border-zinc-200/60 rounded-2xl overflow-hidden bg-white">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="p-5 sm:p-6 flex gap-4 sm:gap-6 group hover:bg-zinc-50/50 transition-colors"
            >
              {/* Color swatch */}
              <div
                className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl shrink-0 flex items-center justify-center"
                style={{ backgroundColor: item.color.hex }}
              >
                <span
                  className={`text-xs font-bold ${
                    item.color.tone === "dark"
                      ? "text-white/60"
                      : "text-zinc-900/30"
                  }`}
                >
                  {item.color.name}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm sm:text-base font-semibold text-zinc-900 hover:text-orange-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-zinc-400 mt-1">
                      {item.color.name} · Size {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      removeItem(item.id, item.size);
                      toast.success("Item removed from cart");
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center gap-0 border border-zinc-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                      className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-zinc-900 border-x border-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                      className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-zinc-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.compareAtPrice && (
                      <p className="text-xs text-zinc-400 line-through">
                        {formatPrice(item.compareAtPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 space-y-5 sticky top-24 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-zinc-900">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span className="font-medium text-zinc-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Free shipping on orders above ₹999
                </p>
              )}
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-zinc-900">Total</span>
                <span className="text-xl font-bold text-zinc-900">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-zinc-950 text-white text-center py-3.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/collections"
              className="block text-center text-sm text-zinc-500 hover:text-orange-600 transition-colors font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
