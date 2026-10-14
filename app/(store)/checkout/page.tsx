"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, ArrowRight, Lock, Truck, Shield, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">No items to checkout</h1>
            <p className="text-zinc-500 text-sm">Your cart is empty. Add some items first.</p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      toast.success("Order placed successfully!", {
        description: "You will receive a confirmation email shortly.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 sm:py-12">
      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10 text-zinc-400 text-xs font-medium">
        <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure Checkout</span>
        <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free Shipping 999+</span>
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Easy Returns</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-zinc-900 text-lg">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-zinc-900 text-lg">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  placeholder="House/Flat No., Street"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="400001"
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-zinc-900 text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-500" />
              Payment Method
            </h2>
            <div className="space-y-3">
              {["COD (Cash on Delivery)", "UPI", "Credit/Debit Card"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-4 border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 transition-colors has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked={method.startsWith("COD")}
                    className="accent-zinc-900"
                  />
                  <span className="text-sm font-medium text-zinc-900">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
            <h2 className="font-bold text-zinc-900 text-lg">Order Summary</h2>

            {/* Items preview */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 text-sm">
                  <div
                    className="w-10 h-12 rounded-lg shrink-0"
                    style={{ backgroundColor: item.color.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-zinc-900 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-zinc-900 text-base pt-2 border-t border-zinc-200">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full bg-zinc-950 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Placing Order..." : `Place Order · ${formatPrice(grandTotal)}`}
            </button>

            <p className="text-xs text-zinc-400 text-center">
              By placing this order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
