"use client";

import { createContext, use, useOptimistic, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type CollectionQuery, serializeCollectionQuery } from "@/lib/catalog/query";

interface UpdateOptions {
  /** Smoothly scroll back to the top of the listing (used by pagination) */
  scrollToTop?: boolean;
}

interface CollectionContextValue {
  /** Optimistic query — updates instantly on click, before the server responds */
  query: CollectionQuery;
  isPending: boolean;
  hrefFor: (patch: Partial<CollectionQuery>) => string;
  update: (patch: Partial<CollectionQuery>, options?: UpdateOptions) => void;
  desktopFiltersOpen: boolean;
  toggleDesktopFilters: () => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function useCollection() {
  const ctx = use(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used inside <CollectionProvider>");
  return ctx;
}

/**
 * Client boundary for the collection page.
 *
 * - The URL is the single source of truth (filters, sort, page).
 * - Navigation runs inside a transition, so the current grid stays on screen
 *   (dimmed) instead of flashing a skeleton.
 * - `useOptimistic` makes checkboxes / pagination respond instantly.
 */
export default function CollectionProvider({
  query,
  children,
}: {
  query: CollectionQuery;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(query);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Any filter/sort change resets to page 1 unless a page is explicitly given
  const resolve = (patch: Partial<CollectionQuery>): CollectionQuery => ({
    ...optimisticQuery,
    page: 1,
    ...patch,
  });

  const hrefFor = (patch: Partial<CollectionQuery>) =>
    `${pathname}${serializeCollectionQuery(resolve(patch))}`;

  const update = (patch: Partial<CollectionQuery>, options: UpdateOptions = {}) => {
    const next = resolve(patch);

    if (options.scrollToTop) {
      document
        .getElementById("collection-top")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    startTransition(() => {
      setOptimisticQuery(next);
      router.push(`${pathname}${serializeCollectionQuery(next)}`, { scroll: false });
    });
  };

  return (
    <CollectionContext
      value={{
        query: optimisticQuery,
        isPending,
        hrefFor,
        update,
        desktopFiltersOpen,
        toggleDesktopFilters: () => setDesktopFiltersOpen((open) => !open),
        mobileFiltersOpen,
        setMobileFiltersOpen,
      }}
    >
      {children}
    </CollectionContext>
  );
}

/** Dims the results while a filter/sort/page navigation is in flight. */
export function CollectionResults({ children }: { children: React.ReactNode }) {
  const { isPending } = useCollection();
  return (
    <div
      aria-busy={isPending}
      className={`transition-opacity duration-200 ${
        isPending ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
