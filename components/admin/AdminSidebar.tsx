"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Settings,
  X,
  Store,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tags },
];

export default function AdminSidebar({
  role,
  isOpen,
  setIsOpen,
}: {
  role: string;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-[#0A0A0A] text-zinc-400 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-zinc-900",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-900/60">
        <Link
          href="/admin"
          className="flex items-center gap-3 text-xl font-bold text-white tracking-tight"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span>SRG Admin</span>
        </Link>
        <button
          className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="px-3 mb-2 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
          Management
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-indigo-400" : "group-hover:text-indigo-400/70"
                )}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {role === "owner" && (
          <>
            <div className="mt-8 mb-4 px-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              System
            </div>
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                pathname.startsWith("/admin/settings")
                  ? "bg-white/10 text-white shadow-sm"
                  : "hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Settings
                className={cn(
                  "w-5 h-5 transition-colors",
                  pathname.startsWith("/admin/settings")
                    ? "text-indigo-400"
                    : "group-hover:text-indigo-400/70"
                )}
              />
              <span className="font-medium">Settings</span>
            </Link>
          </>
        )}
      </nav>

      {/* Backend to Store Route (Redirect to /) */}
      <div className="p-4 border-t border-zinc-900 bg-black/40">
        <Link
          href="/"
          className="group flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/90 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all shadow-sm"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-500/25 transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-zinc-100 group-hover:text-white transition-colors">
                Back to Store
              </p>
              <p className="text-[11px] text-zinc-500 truncate">
                Customer storefront (/)
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
        </Link>
      </div>
    </div>
  );
}
