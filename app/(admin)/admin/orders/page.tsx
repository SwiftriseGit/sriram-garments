import { requireAuth } from "@/lib/auth/session";
import { MOCK_ORDERS } from "@/lib/data/admin/mock-data";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { Search, Eye, Filter, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const statusFilter = params.status || "";
  const q = (params.q || "").toLowerCase();

  let orders = MOCK_ORDERS;
  if (statusFilter) {
    orders = orders.filter((o) => o.status === statusFilter);
  }
  if (q) {
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
    );
  }

  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Orders</h1>
        <p className="text-sm text-zinc-500 mt-1 font-medium">
          Manage and track customer orders. ({orders.length} orders)
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Link
          href="/admin/orders"
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap",
            !statusFilter
              ? "bg-indigo-600 text-white shadow-indigo-500/20"
              : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200/60"
          )}
        >
          All ({MOCK_ORDERS.length})
        </Link>
        {statuses.map((s) => {
          const count = MOCK_ORDERS.filter((o) => o.status === s).length;
          if (count === 0) return null;
          return (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap capitalize",
                statusFilter === s
                  ? "bg-indigo-600 text-white shadow-indigo-500/20"
                  : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200/60"
              )}
            >
              {s} ({count})
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <form>
              <input type="hidden" name="status" value={statusFilter} />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search by order ID or customer..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all shadow-sm"
              />
            </form>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4 text-zinc-400" />
            More Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-zinc-500 font-semibold uppercase tracking-wider bg-white border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-400">
                      <ShoppingCart className="w-12 h-12 mb-3 text-zinc-300" />
                      <p className="text-sm font-medium">No orders found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                        {order.orderNumber}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">{order.items.length} item(s)</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-800">{order.customer.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PaymentBadge status={order.paymentStatus} />
                      <div className="text-xs text-zinc-500 mt-1">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-zinc-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 inline-flex text-zinc-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200/50",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200/50",
    processing: "bg-purple-50 text-purple-700 border-purple-200/50",
    shipped: "bg-cyan-50 text-cyan-700 border-cyan-200/50",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    cancelled: "bg-red-50 text-red-700 border-red-200/50",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border shadow-sm", styles[status] || "bg-zinc-50 text-zinc-700 border-zinc-200/50")}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "text-emerald-700 bg-emerald-50 border-emerald-200/50",
    pending: "text-yellow-700 bg-yellow-50 border-yellow-200/50",
    refunded: "text-blue-700 bg-blue-50 border-blue-200/50",
    failed: "text-red-700 bg-red-50 border-red-200/50",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize border shadow-sm", styles[status] || "text-zinc-600 bg-zinc-50 border-zinc-200/50")}>
      {status}
    </span>
  );
}
