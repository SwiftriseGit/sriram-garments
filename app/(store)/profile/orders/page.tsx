import { Package, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

// Dummy order data
const DUMMY_ORDERS = [
  {
    id: "o1",
    orderNumber: "SRG-001001",
    date: "Oct 1, 2026",
    total: 3897,
    status: "delivered",
    items: 3,
    image: null,
  },
  {
    id: "o2",
    orderNumber: "SRG-001002",
    date: "Oct 2, 2026",
    total: 2496,
    status: "shipped",
    items: 3,
    image: null,
  },
  {
    id: "o3",
    orderNumber: "SRG-001003",
    date: "Oct 3, 2026",
    total: 2197,
    status: "processing",
    items: 3,
    image: null,
  },
  {
    id: "o4",
    orderNumber: "SRG-001004",
    date: "Oct 4, 2026",
    total: 1698,
    status: "confirmed",
    items: 1,
    image: null,
  },
];

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
    <section className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 sm:py-12">
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

      {DUMMY_ORDERS.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="text-zinc-500">No orders yet</p>
            <Link
              href="/collections"
              className="inline-block bg-zinc-950 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {DUMMY_ORDERS.map((order) => (
            <Link
              key={order.id}
              href={`/profile/orders/${order.id}`}
              className="flex items-center gap-5 p-5 sm:p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-zinc-400" />
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
                  <span>{order.date}</span>
                  <span>·</span>
                  <span>
                    {order.items} {order.items === 1 ? "item" : "items"}
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
          ))}
        </div>
      )}
    </section>
  );
}
