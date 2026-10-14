import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <span className="text-[120px] sm:text-[160px] font-black text-zinc-100 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg sm:text-xl font-bold text-zinc-900 bg-white px-4 py-1 rounded-full shadow-sm border border-zinc-100">
              Page not found
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-white text-zinc-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-colors border border-zinc-200 w-full sm:w-auto justify-center"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
