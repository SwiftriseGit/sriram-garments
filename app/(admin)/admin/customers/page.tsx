import { requireAuth } from "@/lib/auth/session";
import { MOCK_CUSTOMERS } from "@/lib/data/admin/mock-data";
import { formatPrice } from "@/lib/format";
import { Search, Mail, Phone, User } from "lucide-react";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const q = (params.q || "").toLowerCase();

  const customers = q
    ? MOCK_CUSTOMERS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
      )
    : MOCK_CUSTOMERS;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Customers</h1>
        <p className="text-sm text-zinc-500 mt-1 font-medium">
          View and manage your customer base. ({customers.length} customers)
        </p>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <form>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search customers by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all shadow-sm"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-zinc-500 font-semibold uppercase tracking-wider bg-white border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-400">
                      <User className="w-12 h-12 mb-3 text-zinc-300" />
                      <p className="text-sm font-medium">
                        {q ? "No customers found matching your search." : "No customers yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200/50 shadow-sm shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                          {customer.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-xs font-medium">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-xs font-medium">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-zinc-900">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">
                      {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
