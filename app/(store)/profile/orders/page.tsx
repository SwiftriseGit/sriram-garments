import { Suspense } from "react";
import { Package, ChevronRight, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { verifySession } from "@/lib/auth/dal";
import connectDB from "@/lib/db";
import OrderModel from "@/lib/models/Order";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-cyan-50 text-cyan-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function OrdersPage() {
  return (
    <section className="max-w-335 mx-auto px-4 md:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
        <Link href="/profile" className="hover:text-zinc-900 transition-colors">
          My Account
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-medium">My Orders</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-8">
        My Orders
      </h1>

      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersContent />
      </Suspense>
    </section>
  );
}

async function OrdersContent() {
  const session = await verifySession();

  await connectDB();
  const orders = await OrderModel.find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .lean();

  if (orders.length === 0) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-zinc-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              No orders yet
            </h2>
            <p className="text-zinc-500 text-sm">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const itemCount = order.items.reduce(
          (sum: number, i: { quantity: number }) => sum + i.quantity,
          0
        );

        return (
          <Link
            key={order._id.toString()}
            href={`/profile/orders/${order._id}`}
            className="flex items-center gap-5 p-5 sm:p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all group"
          >
            {/* Product thumbnail or fallback icon */}
            <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
              {order.items[0]?.image ? (
                <img
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-6 h-6 text-zinc-400" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-zinc-900">
                  {order.orderNumber}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    statusStyles[order.status] || "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                <span>{date}</span>
                <span>·</span>
                <span>
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
                <span>·</span>
                <span className="font-medium text-zinc-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 group-hover:text-orange-600 transition-colors shrink-0">
              <span className="font-medium">View Details</span>
              <Eye className="w-4 h-4" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 bg-white border border-zinc-200/60 rounded-2xl p-5"
        />
      ))}
    </div>
  );
}
