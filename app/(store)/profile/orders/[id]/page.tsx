import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { ChevronRight, Package, MapPin, CreditCard, ArrowLeft } from "lucide-react";

// Dummy order data (same as admin mock data)
const DUMMY_ORDERS: Record<string, any> = {
  o1: {
    orderNumber: "SRG-001001",
    date: "Oct 1, 2026",
    status: "delivered",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    customer: { name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 98765 43210" },
    shippingAddress: { line1: "42 MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001" },
    items: [
      { name: "Premium Cotton Oxford Shirt", price: 1299, quantity: 2, size: "L", color: "Sky Blue" },
      { name: "Slim Fit Stretch Jeans", price: 1499, quantity: 1, size: "M", color: "Dark Indigo" },
    ],
    subtotal: 4097,
    shipping: 0,
    discount: 200,
    total: 3897,
  },
  o2: {
    orderNumber: "SRG-001002",
    date: "Oct 2, 2026",
    status: "shipped",
    paymentMethod: "Razorpay",
    paymentStatus: "paid",
    customer: { name: "Priya Patel", email: "priya.p@gmail.com", phone: "+91 87654 32109" },
    shippingAddress: { line1: "15 Nehru Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "380015" },
    items: [
      { name: "Classic Polo T-Shirt", price: 799, quantity: 3, size: "M", color: "Navy" },
    ],
    subtotal: 2397,
    shipping: 99,
    discount: 0,
    total: 2496,
  },
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200/50",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200/50",
  processing: "bg-purple-50 text-purple-700 border-purple-200/50",
  shipped: "bg-cyan-50 text-cyan-700 border-cyan-200/50",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  cancelled: "bg-red-50 text-red-700 border-red-200/50",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = DUMMY_ORDERS[id];
  if (!order) notFound();

  return (
    <section className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
        <Link href="/profile" className="hover:text-zinc-900 transition-colors">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/profile/orders" className="hover:text-zinc-900 transition-colors">Orders</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-medium">{order.orderNumber}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/profile/orders"
            className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Order {order.orderNumber}</h1>
            <p className="text-sm text-zinc-400 mt-0.5">Placed on {order.date}</p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize border ${
            statusStyles[order.status] || "bg-zinc-100 text-zinc-600"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-500" />
              Order Items
            </h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="p-5 sm:p-6 flex items-center gap-4">
                <div className="w-16 h-20 rounded-lg bg-zinc-100 shrink-0 flex items-center justify-center">
                  <Package className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-900 text-sm">{item.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {item.color} · Size {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-zinc-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-5 sm:p-6 bg-zinc-50/50 border-t border-zinc-100 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-zinc-900 pt-2 border-t border-zinc-200">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-zinc-900 flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-zinc-500" />
              Shipping Address
            </h3>
            <div className="text-sm text-zinc-600 space-y-1">
              <p className="font-medium text-zinc-900">{order.customer.name}</p>
              <p>{order.shippingAddress.line1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.pincode}</p>
              <p className="text-zinc-400 mt-2">{order.customer.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-zinc-900 flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-zinc-500" />
              Payment
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Method</span>
                <span className="font-medium text-zinc-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span className="font-medium text-emerald-600 capitalize">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
