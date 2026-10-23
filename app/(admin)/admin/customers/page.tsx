import { requireAdmin } from "@/lib/auth/dal";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/User";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { Search, Mail, Phone, User, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const instant = false;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const q = (params.q || "").toLowerCase();
  const roleFilter = params.role || ""; // "" = all, "customer", "admin"

  // Direct DB call in Server Component
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (roleFilter && (roleFilter === "customer" || roleFilter === "admin")) {
    filter.role = roleFilter;
  }

  if (q) {
    filter.$or = [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
    ];
  }

  const [users, allCount, customerCount, adminCount] = await Promise.all([
    UserModel.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean(),
    UserModel.countDocuments(),
    UserModel.countDocuments({ role: "customer" }),
    UserModel.countDocuments({ role: "admin" }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Customers & Users</h1>
        <p className="text-sm text-zinc-500 mt-1 font-medium">
          View and manage registered customers and administrators ({users.length} {users.length === 1 ? "user" : "users"} shown).
        </p>
      </div>

      {/* Role filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Link
          href={`/admin/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs whitespace-nowrap flex items-center gap-2",
            !roleFilter
              ? "bg-indigo-600 text-white shadow-indigo-500/20"
              : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200/60"
          )}
        >
          <Users className="w-4 h-4" />
          All Users ({allCount})
        </Link>
        <Link
          href={`/admin/customers?role=customer${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs whitespace-nowrap flex items-center gap-2",
            roleFilter === "customer"
              ? "bg-indigo-600 text-white shadow-indigo-500/20"
              : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200/60"
          )}
        >
          <User className="w-4 h-4" />
          Customers ({customerCount})
        </Link>
        <Link
          href={`/admin/customers?role=admin${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs whitespace-nowrap flex items-center gap-2",
            roleFilter === "admin"
              ? "bg-indigo-600 text-white shadow-indigo-500/20"
              : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200/60"
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          Admins ({adminCount})
        </Link>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <form>
              {roleFilter && <input type="hidden" name="role" value={roleFilter} />}
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all shadow-sm"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-zinc-500 font-semibold uppercase tracking-wider bg-white border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-400">
                      <User className="w-12 h-12 mb-3 text-zinc-300" />
                      <p className="text-sm font-medium">
                        {q ? "No users found matching your search." : "No users found."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const fullName =
                    [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
                  const initial = (user.firstName?.[0] || user.email?.[0] || "U").toUpperCase();
                  const isAdmin = user.role === "admin";

                  return (
                    <tr key={user._id.toString()} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-xs shrink-0 border",
                              isAdmin
                                ? "bg-linear-to-tr from-purple-100 to-indigo-100 text-purple-700 border-purple-200/60"
                                : "bg-linear-to-tr from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200/50"
                            )}
                          >
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                              {fullName}
                            </div>
                            <div className="text-xs text-zinc-400 font-mono">
                              ID: {user._id.toString().slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-zinc-600">
                            <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="text-xs font-medium">{user.email}</span>
                          </div>
                          {user.phone ? (
                            <div className="flex items-center gap-2 text-zinc-600">
                              <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="text-xs font-medium">{user.phone}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Phone className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                              <span className="text-xs italic">No phone</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 shadow-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100">
                          {user.totalOrders || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-zinc-900">
                        {formatPrice(user.totalSpent || 0)}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
