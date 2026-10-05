import { requireAuth } from "@/lib/auth/session";
import { MOCK_ORDERS } from "@/lib/data/admin/mock-data";
import { formatPrice } from "@/lib/format";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Package, CreditCard } from "lucide-react";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const order = MOCK_ORDERS.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 -ml-2 text-zinc-500 hover:text-zinc-950 transition-colors rounded-lg hover:bg-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Items & Totals) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-zinc-50 flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950">Order Items</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {order.items.map((item, index) => (
                <div key={index} className="p-4 flex gap-4">
                  <div className="w-16 h-20 bg-zinc-100 rounded-md border flex-shrink-0 flex items-center justify-center overflow-hidden">
                     {/* In a real app we'd use next/image. For mock, a simple placeholder */}
                    <div className="text-xs text-zinc-400 font-medium rotate-45">IMG</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-950 text-sm truncate">{item.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span>Size: {item.size}</span>
                      <span>&middot;</span>
                      <span>Color: {item.color}</span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{formatPrice(item.price)}</span>
                      <span className="text-zinc-500 mx-1">x</span>
                      <span>{item.quantity}</span>
                    </div>
                  </div>
                  <div className="font-medium text-zinc-950 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-zinc-50 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-zinc-950 font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span className="text-zinc-950 font-medium">
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t flex justify-between">
                <span className="font-semibold text-zinc-950">Total</span>
                <span className="font-bold text-zinc-950 text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Customer, Shipping, Payment info) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <User className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950">Customer</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="font-medium text-zinc-950">{order.customer.name}</div>
              <div className="text-zinc-600">
                <a href={`mailto:${order.customer.email}`} className="hover:underline text-blue-600">
                  {order.customer.email}
                </a>
              </div>
              <div className="text-zinc-600">{order.customer.phone}</div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <MapPin className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950">Shipping Address</h2>
            </div>
            <div className="space-y-1 text-sm text-zinc-600 leading-relaxed">
              <div>{order.customer.name}</div>
              <div>{order.shippingAddress.line1}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <CreditCard className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950">Payment Info</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Method</span>
                <span className="font-medium text-zinc-950">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status</span>
                <PaymentBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || "bg-zinc-100 text-zinc-800"}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded",
    pending: "text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded",
    refunded: "text-blue-700 bg-blue-50 px-2 py-0.5 rounded",
    failed: "text-red-700 bg-red-50 px-2 py-0.5 rounded",
  };
  return (
    <span className={`text-xs font-semibold capitalize ${styles[status] || "text-zinc-600"}`}>
      {status}
    </span>
  );
}
