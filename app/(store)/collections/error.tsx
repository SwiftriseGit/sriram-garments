"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

/** Catches unexpected errors in the collection segment (header/footer stay intact). */
export default function CollectionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-20 flex flex-col items-center text-center">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
        We couldn&apos;t load the products
      </h1>
      <p className="text-[13px] text-zinc-500 max-w-sm mb-7">
        Something went wrong on our side. Please try again in a moment.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full border border-zinc-200 hover:border-zinc-900 text-zinc-700 text-[13px] font-semibold transition-colors"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
