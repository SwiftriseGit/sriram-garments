import { Bell, Search, User, Menu } from "lucide-react";
import type { AdminSession } from "@/lib/auth/session";

export default function AdminHeader({
  session,
  onMenuClick,
}: {
  session: AdminSession;
  onMenuClick: () => void;
}) {
  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button
          className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search orders, products, or customers... (Press '/')"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-100/80 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-8 bg-zinc-200 hidden sm:block mx-2"></div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
              {session.name}
            </div>
            <div className="text-xs text-zinc-500 font-medium capitalize">
              {session.role}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-105">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
