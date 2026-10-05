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
        "fixed inset-y-0 left-0 z-40 w-72 bg-[#0A0A0A] text-zinc-400 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-6">
        <Link
          href="/admin"
          className="flex items-center gap-3 text-xl font-bold text-white tracking-tight"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Store className="w-4 h-4 text-white" />
          </div>
          SRG Admin
        </Link>
        <button
          className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4 scrollbar-hide">
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
                "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
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
            <div className="mt-8 mb-4 px-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              System
            </div>
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
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
    </div>
  );
}
