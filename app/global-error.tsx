"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Something went wrong
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
              An unexpected error occurred. We&apos;re sorry for the
              inconvenience. Please try again or return to the homepage.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>

          {/* Error digest for debugging */}
          {error.digest && (
            <p className="text-xs text-zinc-600 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
