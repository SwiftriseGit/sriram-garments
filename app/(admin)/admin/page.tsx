import { requireAuth } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/data/admin/mock-data";
import { formatPrice } from "@/lib/format";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await requireAuth();

  const stats = getDashboardStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-500 bg-white px-3 py-1.5 rounded-full border shadow-sm">
            Last 30 Days
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={IndianRupee}
          trend="+12.5%"
          trendUp={true}
          color="indigo"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingBag}
          trend="+5.2%"
          trendUp={true}
          color="blue"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toString()}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers.toString()}
          icon={Users}
          trend="+18 new"
          trendUp={true}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div>
              <h2 className="font-semibold text-zinc-900 text-lg">Recent Orders</h2>
              <p className="text-xs text-zinc-500 mt-1">Your latest transactions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-zinc-500 font-semibold uppercase tracking-wider bg-white border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-800">{order.customer.name}</div>
                      <div className="text-xs text-zinc-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-zinc-900">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 lg:space-y-8">
          {/* Top Selling Products */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <TrendingUp className="w-32 h-32" />
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="font-semibold text-zinc-900 text-lg">Top Selling</h2>
                <p className="text-xs text-zinc-500 mt-1">Highest performing products</p>
              </div>
            </div>
            <div className="space-y-5 relative z-10">
              {stats.topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 font-bold text-xs flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-zinc-900">
                      {product.salesCount}
                    </div>
                    <div className="text-xs text-zinc-400">sales</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          {stats.lowStockProducts.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-amber-900 text-lg">Low Stock Alerts</h2>
                  <p className="text-xs text-amber-700 mt-0.5">Products running out soon</p>
                </div>
              </div>
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-amber-100"
                  >
                    <span className="text-sm font-medium text-amber-900 truncate pr-4">
                      {product.name}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full whitespace-nowrap shrink-0 shadow-sm">
                      {product.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: "indigo" | "blue" | "emerald" | "purple";
}) {
  const colorStyles = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/20 text-indigo-50",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/20 text-blue-50",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20 text-emerald-50",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/20 text-purple-50",
  };

  const iconBgStyles = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4 relative z-10">
        <h3 className="text-zinc-500 text-sm font-semibold">{title}</h3>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
            iconBgStyles[color]
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={cn(
                "flex items-center text-xs font-semibold px-2 py-0.5 rounded-md",
                trendUp
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {trendUp ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {trend}
            </span>
            <span className="text-xs text-zinc-400 font-medium">vs last month</span>
          </div>
        )}
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-zinc-50 rounded-full blur-2xl group-hover:bg-zinc-100 transition-colors pointer-events-none" />
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
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border shadow-sm",
        styles[status] || "bg-zinc-50 text-zinc-700 border-zinc-200/50"
      )}
    >
      {status}
    </span>
  );
}
