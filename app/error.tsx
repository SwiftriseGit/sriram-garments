"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { toast } from "sonner";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RootError]", error);
    toast.error("Something went wrong", {
      description: "An unexpected error occurred. Please try again.",
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Oops! Something went wrong
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            We encountered an unexpected error. Please try again or go back to
            the homepage.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-colors border border-zinc-200"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
