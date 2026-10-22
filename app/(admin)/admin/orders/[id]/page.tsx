import { requireAdmin } from "@/lib/auth/dal";
import connectDB from "@/lib/db";
import OrderModel from "@/lib/models/Order";
import { formatPrice } from "@/lib/format";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, MapPin, Package, CreditCard, Tag } from "lucide-react";
import mongoose from "mongoose";
import { updateOrderStatus } from "@/actions/orders";

export const instant = false;

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  await connectDB();

  let order = null;
  if (mongoose.isValidObjectId(id)) {
    order = await OrderModel.findById(id).lean();
  } else {
    order = await OrderModel.findOne({ orderNumber: id }).lean();
  }

  if (!order) {
    notFound();
  }

  const customerName = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() || "Customer";
  const customerEmail = order.customer?.email || "No email";
  const customerPhone = order.customer?.phone || "No phone";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <p className="text-sm text-zinc-500 mt-0.5">
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
        </div>

        {/* Status management toolbar */}
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus || "pending"} />

          <form
            action={async (formData: FormData) => {
              "use server";
              await updateOrderStatus(formData);
            }}
            className="flex items-center gap-2"
          >
            <input type="hidden" name="orderId" value={order._id.toString()} />
            <select
              name="status"
              defaultValue={order.status}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xs focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              type="submit"
              className="text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              Update
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Items & Totals) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-zinc-50/70 flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950 text-sm">
                Order Items ({order.items?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="p-4 flex gap-4 items-center">
                  <div className="w-16 h-20 bg-zinc-100 rounded-lg border border-zinc-200/80 shrink-0 flex items-center justify-center overflow-hidden relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">
                        No IMG
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-950 text-sm truncate">
                      {item.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span>Size: {item.size}</span>
                      <span>&middot;</span>
                      <span>Color: {item.color}</span>
                    </div>
                    <div className="mt-2 text-sm text-zinc-700">
                      <span className="font-semibold">{formatPrice(item.price)}</span>
                      <span className="text-zinc-400 mx-1.5">×</span>
                      <span>{item.quantity}</span>
                    </div>
                  </div>
                  <div className="font-bold text-zinc-950 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-zinc-50/50 border-t space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-zinc-950 font-medium">{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span className="text-zinc-950 font-medium">
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping || 0)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Discount {order.couponCode && `(${order.couponCode})`}
                  </span>
                  <span className="font-semibold">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="pt-3 mt-3 border-t border-zinc-200 flex justify-between items-baseline">
                <span className="font-bold text-zinc-950 text-base">Grand Total</span>
                <span className="font-extrabold text-zinc-950 text-xl">{formatPrice(order.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Customer, Shipping, Payment info) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl shadow-xs p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <User className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950 text-sm">Customer Info</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="font-bold text-zinc-950">{customerName}</div>
              <div className="text-zinc-600 text-xs">
                <a href={`mailto:${customerEmail}`} className="hover:underline text-indigo-600 font-medium">
                  {customerEmail}
                </a>
              </div>
              <div className="text-zinc-600 text-xs">{customerPhone}</div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-xs p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <MapPin className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950 text-sm">Shipping Address</h2>
            </div>
            <div className="space-y-1 text-xs text-zinc-600 leading-relaxed">
              <div className="font-semibold text-zinc-900">{customerName}</div>
              <div>{order.shippingAddress?.line1}</div>
              {order.shippingAddress?.line2 && <div>{order.shippingAddress.line2}</div>}
              <div>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                <span className="font-semibold text-zinc-900">{order.shippingAddress?.pincode}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-xs p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <CreditCard className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950 text-sm">Payment Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Method</span>
                <span className="font-bold text-zinc-950 uppercase">{order.paymentMethod || "COD"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Status</span>
                <PaymentBadge status={order.paymentStatus || "pending"} />
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
    pending: "bg-amber-50 text-amber-700 border-amber-200/60",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200/60",
    processing: "bg-purple-50 text-purple-700 border-purple-200/60",
    shipped: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200/60",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border shadow-2xs ${
        styles[status] || "bg-zinc-50 text-zinc-700 border-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "text-emerald-700 bg-emerald-50 border border-emerald-200/60",
    pending: "text-amber-700 bg-amber-50 border border-amber-200/60",
    refunded: "text-blue-700 bg-blue-50 border border-blue-200/60",
    failed: "text-rose-700 bg-rose-50 border border-rose-200/60",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md capitalize shadow-2xs ${
        styles[status] || "text-zinc-600 bg-zinc-50 border border-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}
