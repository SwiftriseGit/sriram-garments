"use client";

import { PackageSearch } from "lucide-react";
import { useCollection } from "./CollectionProvider";

export default function EmptyResults() {
  const { update } = useCollection();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed border-zinc-200 rounded-2xl">
      <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-5">
        <PackageSearch className="w-7 h-7 text-orange-500" />
      </div>
      <h2 className="text-lg font-bold text-zinc-900 mb-1.5">No products found</h2>
      <p className="text-[13px] text-zinc-500 max-w-xs mb-6">
        Try removing a filter or two to see more styles.
      </p>
      <button
        type="button"
        onClick={() => update({ category: [], size: [], availability: [], price: [] })}
        className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
