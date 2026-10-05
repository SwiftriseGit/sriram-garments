"use client";

import { Check } from "lucide-react";
import { useCollection } from "./CollectionProvider";
import {
  AVAILABILITY_OPTIONS,
  CATEGORY_OPTIONS,
  PRICE_OPTIONS,
  SIZE_OPTIONS,
} from "@/lib/catalog/options";
import { countActiveFilters, type FilterKey } from "@/lib/catalog/query";
import type { FacetCounts } from "@/lib/catalog/types";

interface Option {
  value: string;
  label: string;
}

export default function FilterPanel({
  facets,
  showHeader = true,
}: {
  facets: FacetCounts;
  showHeader?: boolean;
}) {
  const { query, update } = useCollection();
  const activeCount = countActiveFilters(query);

  const toggle = (key: FilterKey, value: string) => {
    const current = query[key];
    update({
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  const clearAll = () => update({ category: [], size: [], availability: [], price: [] });

  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[14px] sm:text-[15px] text-zinc-900">Filters</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] sm:text-[12px] font-medium text-zinc-500 hover:text-orange-500 underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <CheckboxGroup
        title="Category"
        filterKey="category"
        options={CATEGORY_OPTIONS}
        selected={query.category}
        facets={facets}
        onToggle={toggle}
      />

      {/* Size chips */}
      <fieldset className="border-t border-zinc-100 pt-5 mb-5">
        <legend className="font-semibold text-[13px] text-zinc-900 mb-4 float-left w-full">
          Size
        </legend>
        <div className="clear-left flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => {
            const active = query.size.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => toggle("size", size)}
                className={`min-w-10 h-9 px-3 rounded-full border text-[12px] font-semibold transition-colors ${
                  active
                    ? "bg-zinc-900 border-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-700 hover:border-zinc-900"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <CheckboxGroup
        title="Availability"
        filterKey="availability"
        options={AVAILABILITY_OPTIONS}
        selected={query.availability}
        facets={facets}
        onToggle={toggle}
      />

      <CheckboxGroup
        title="Price"
        filterKey="price"
        options={PRICE_OPTIONS}
        selected={query.price}
        facets={facets}
        onToggle={toggle}
      />
    </div>
  );
}

function CheckboxGroup({
  title,
  filterKey,
  options,
  selected,
  facets,
  onToggle,
}: {
  title: string;
  filterKey: FilterKey;
  options: readonly Option[];
  selected: string[];
  facets: FacetCounts;
  onToggle: (key: FilterKey, value: string) => void;
}) {
  return (
    <fieldset className="border-t border-zinc-100 pt-5 mb-5">
      <legend className="font-semibold text-[13px] text-zinc-900 mb-4 float-left w-full">
        {title}
      </legend>
      <div className="clear-left space-y-3">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          const count = facets[`${filterKey}:${option.value}`] ?? 0;
          return (
            <label
              key={option.value}
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="flex items-center gap-2.5">
                <span className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(filterKey, option.value)}
                    className="peer appearance-none w-4 h-4 rounded border border-zinc-300 checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  />
                  <Check
                    className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                    strokeWidth={3}
                    aria-hidden
                  />
                </span>
                <span
                  className={`text-[12px] sm:text-[13px] font-medium transition-colors ${
                    checked ? "text-zinc-900" : "text-zinc-600 group-hover:text-zinc-900"
                  }`}
                >
                  {option.label}
                </span>
              </span>
              <span className="text-[11px] font-medium text-zinc-400">{count}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
