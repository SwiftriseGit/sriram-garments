"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useCollection } from "./CollectionProvider";
import {
  AVAILABILITY_OPTIONS,
  CATEGORY_OPTIONS,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  type SortValue,
} from "@/lib/catalog/options";
import { countActiveFilters, FILTER_KEYS, type FilterKey } from "@/lib/catalog/query";

const LABELS: Record<FilterKey, Record<string, string>> = {
  category: Object.fromEntries(CATEGORY_OPTIONS.map((o) => [o.value, o.label])),
  availability: Object.fromEntries(AVAILABILITY_OPTIONS.map((o) => [o.value, o.label])),
  price: Object.fromEntries(PRICE_OPTIONS.map((o) => [o.value, o.label])),
  size: {},
};

export default function CollectionToolbar({ total }: { total: number }) {
  const { query, update, desktopFiltersOpen, toggleDesktopFilters, setMobileFiltersOpen } =
    useCollection();
  const activeCount = countActiveFilters(query);

  const openFilters = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) toggleDesktopFilters();
    else setMobileFiltersOpen(true);
  };

  const removeFilter = (key: FilterKey, value: string) =>
    update({ [key]: query[key].filter((v) => v !== value) });

  return (
    <div id="collection-top" className="scroll-mt-28 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openFilters}
            aria-expanded={desktopFiltersOpen}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-full text-[12px] sm:text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
            {activeCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
          <span className="text-[12px] sm:text-[13px] font-medium text-zinc-500">
            {total} {total === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <label htmlFor="collection-sort" className="text-[12px] sm:text-[13px] font-medium text-zinc-500">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="collection-sort"
              value={query.sort}
              onChange={(e) => update({ sort: e.target.value as SortValue })}
              className="appearance-none pl-3.5 pr-9 py-2 border border-zinc-200 rounded-full text-[12px] sm:text-[13px] font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {FILTER_KEYS.flatMap((key) =>
            query[key].map((value) => (
              <button
                key={`${key}:${value}`}
                type="button"
                onClick={() => removeFilter(key, value)}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[11px] sm:text-[12px] font-medium text-zinc-700 transition-colors"
              >
                {key === "size" ? `Size: ${value}` : LABELS[key][value]}
                <X className="w-3 h-3" aria-label="Remove filter" />
              </button>
            )),
          )}
          <button
            type="button"
            onClick={() => update({ category: [], size: [], availability: [], price: [] })}
            className="text-[11px] sm:text-[12px] font-medium text-zinc-500 hover:text-orange-500 underline underline-offset-2 ml-1 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
