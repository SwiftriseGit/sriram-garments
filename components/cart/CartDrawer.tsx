"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const total = subtotal();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-zinc-700" />
            <h2 className="text-lg font-bold text-zinc-900">
              Your Cart{" "}
              <span className="text-sm font-normal text-zinc-400">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 -mr-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="text-zinc-900 font-semibold mb-1">
                Your cart is empty
              </p>
              <p className="text-sm text-zinc-400 mb-6">
                Add items to get started
              </p>
              <button
                onClick={closeCart}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Continue Shopping →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="px-6 py-5 flex gap-4 group"
                >
                  {/* Color swatch / image placeholder */}
                  <div
                    className="w-20 h-24 rounded-xl shrink-0 flex items-center justify-center"
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

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {item.color.name} · Size {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-0 border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-zinc-900 border-x border-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-bold text-zinc-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-6 py-5 space-y-4 bg-zinc-50/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500">
                Subtotal
              </span>
              <span className="text-lg font-bold text-zinc-900">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Shipping and taxes calculated at checkout
            </p>
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-zinc-950 text-white text-center py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full bg-white text-zinc-700 text-center py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors border border-zinc-200"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
