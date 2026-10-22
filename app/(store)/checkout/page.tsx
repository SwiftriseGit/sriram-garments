"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, ArrowRight, Lock, Truck, Shield, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { placeOrder } from "@/actions/orders";

interface CheckoutFormValues {
  name: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "COD",
    },
  });

  const total = subtotal();
  const shipping = total >= 999 ? 0 : 79;
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

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color.name,
        })),
        shippingAddress: {
          label: "Home",
          line1: data.line1,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        paymentMethod: data.paymentMethod,
      };

      const result = await placeOrder(orderPayload);
      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      clearCart();
      toast.success("Order placed successfully!");
    } catch (err: any) {
      if (err?.message?.includes("NEXT_REDIRECT")) {
        clearCart();
        return;
      }
      toast.error(err?.message || "Failed to place order. Please make sure you are logged in.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-335 mx-auto px-4 md:px-8 py-8 sm:py-12">
      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10 text-zinc-400 text-xs font-medium">
        <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure Checkout</span>
        <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free Shipping above ₹999</span>
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 7-Day Easy Returns</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Columns: Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-xs space-y-5">
              <h2 className="font-semibold text-zinc-900 text-base">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-hidden transition-all"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-hidden transition-all"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-hidden transition-all"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-xs space-y-5">
              <h2 className="font-semibold text-zinc-900 text-base">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Address Line 1 *</label>
                  <input
                    type="text"
                    {...register("line1", { required: "Address line 1 is required" })}
                    placeholder="House/Flat No., Street, Landmark"
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-hidden transition-all"
                  />
                  {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">City *</label>
                    <input
                      type="text"
                      {...register("city", { required: "City is required" })}
                      placeholder="Mumbai"
                      className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-hidden transition-all"
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">State *</label>
                    <input
                      type="text"
                      {...register("state", { required: "State is required" })}
                      placeholder="Maharashtra"
                      className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-hidden transition-all"
                    />
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Pincode *</label>
                    <input
                      type="text"
                      {...register("pincode", { required: "Pincode is required" })}
                      placeholder="400001"
                      className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 outline-hidden transition-all"
                    />
                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-xs space-y-5">
              <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-500" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { id: "COD", label: "Cash on Delivery (COD)" },
                  { id: "UPI", label: "UPI (Google Pay, PhonePe, Paytm)" },
                  { id: "CARD", label: "Credit / Debit Card" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-3 p-3.5 border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 transition-colors has-checked:border-zinc-950 has-checked:bg-zinc-50"
                  >
                    <input
                      type="radio"
                      value={method.id}
                      {...register("paymentMethod")}
                      className="accent-zinc-950 w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-zinc-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-xs sticky top-24 space-y-5">
              <h2 className="font-bold text-zinc-900 text-base">Order Summary</h2>

              {/* Items preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-zinc-100">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 text-sm pt-2 first:pt-0">
                    <div
                      className="w-10 h-12 rounded-lg shrink-0 border border-zinc-200 overflow-hidden relative"
                      style={{ backgroundColor: item.color.hex }}
                    >
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 truncate text-xs">{item.name}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-zinc-900 shrink-0 text-xs">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 font-medium">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-zinc-900 text-base pt-3 border-t border-zinc-200">
                  <span>Grand Total</span>
                  <span className="text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-950 text-white py-3.5 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <span>Place Order · {formatPrice(grandTotal)}</span>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center leading-normal">
                By placing this order, you agree to our Terms of Service & Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
