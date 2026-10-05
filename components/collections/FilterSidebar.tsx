"use client";

import { Loader2 } from "lucide-react";
import { useCollection } from "./CollectionProvider";
import FilterPanel from "./FilterPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FacetCounts } from "@/lib/catalog/types";

/**
 * Desktop: sticky sidebar that stays in view while the product grid scrolls.
 *   - `sticky top-24` sits just below the sticky site header
 *   - `self-start` stops the flex parent stretching it (sticky needs that)
 *   - inner panel scrolls on its own if it's taller than the viewport
 * Mobile/tablet: the same panel inside a slide-in sheet.
 */
export default function FilterSidebar({
  facets,
  total,
}: {
  facets: FacetCounts;
  total: number;
}) {
  const { desktopFiltersOpen, mobileFiltersOpen, setMobileFiltersOpen, isPending } =
    useCollection();

  return (
    <>
      <aside
        aria-label="Product filters"
        aria-hidden={!desktopFiltersOpen}
        inert={!desktopFiltersOpen}
        className={`hidden lg:block shrink-0 self-start sticky top-24 overflow-hidden transition-[width,margin,opacity] duration-300 ease-out ${
          desktopFiltersOpen ? "w-60 mr-10 opacity-100" : "w-0 mr-0 opacity-0"
        }`}
      >
        <div className="w-60 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain pr-3 pb-6 filter-scroll">
          <FilterPanel facets={facets} />
        </div>
      </aside>

      <Sheet open={mobileFiltersOpen} onOpenChange={(open) => setMobileFiltersOpen(open)}>
        <SheetContent
          side="left"
          className="w-[86%] sm:max-w-sm bg-white border-r border-zinc-200 p-0 gap-0 flex flex-col"
        >
          <SheetHeader className="border-b border-zinc-100 px-5 py-4">
            <SheetTitle className="text-lg font-bold text-zinc-900">Filters</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 pt-1 pb-4">
            <FilterPanel facets={facets} showHeader={false} />
          </div>

          <div className="border-t border-zinc-100 p-4">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full py-3 text-[13px] font-semibold transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                `Show ${total} ${total === 1 ? "result" : "results"}`
              )}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
