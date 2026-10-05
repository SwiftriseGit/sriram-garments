"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, User } from "lucide-react";
import type { AdminSession } from "@/lib/auth/session";

export default function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: AdminSession;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full bg-[#F8F9FC] overflow-hidden">
      <AdminSidebar
        role={session.role}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white border-b border-zinc-200/60 flex items-center justify-between px-4 shrink-0 z-20 sticky top-0">
          <button
            className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-semibold text-zinc-900">{session.name}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
