"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCollection } from "./CollectionProvider";

/** [1, "…", 4, 5, 6, "…", 10] */
function getPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

const baseItem =
  "h-9 min-w-9 px-2 rounded-full flex items-center justify-center text-[12px] sm:text-[13px] font-semibold transition-colors";

/**
 * Real <Link>s (crawlable, open-in-new-tab works) that are intercepted for
 * normal clicks so we get the optimistic highlight + dimmed grid.
 */
export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}) {
  const { query, hrefFor, update } = useCollection();
  if (totalPages <= 1) return null;

  const current = Math.min(query.page, totalPages);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, target: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (target !== current) update({ page: target }, { scrollToTop: true });
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 sm:mt-14 flex flex-col items-center gap-4"
    >
      <div className="flex items-center gap-1 sm:gap-1.5">
        {current > 1 ? (
          <Link
            href={hrefFor({ page: current - 1 })}
            onClick={(e) => go(e, current - 1)}
            aria-label="Previous page"
            className={`${baseItem} border border-zinc-200 text-zinc-700 hover:border-zinc-900`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : (
          <span aria-hidden className={`${baseItem} border border-zinc-100 text-zinc-300`}>
            <ChevronLeft className="w-4 h-4" />
          </span>
        )}

        {getPageList(current, totalPages).map((item, index) =>
          item === "…" ? (
            <span key={`gap-${index}`} className={`${baseItem} text-zinc-400`}>
              …
            </span>
          ) : item === current ? (
            <span
              key={item}
              aria-current="page"
              className={`${baseItem} bg-zinc-900 text-white`}
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor({ page: item })}
              onClick={(e) => go(e, item)}
              aria-label={`Page ${item}`}
              className={`${baseItem} text-zinc-700 hover:bg-zinc-100`}
            >
              {item}
            </Link>
          ),
        )}

        {current < totalPages ? (
          <Link
            href={hrefFor({ page: current + 1 })}
            onClick={(e) => go(e, current + 1)}
            aria-label="Next page"
            className={`${baseItem} border border-zinc-200 text-zinc-700 hover:border-zinc-900`}
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span aria-hidden className={`${baseItem} border border-zinc-100 text-zinc-300`}>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>

      <p className="text-[11px] sm:text-[12px] font-medium text-zinc-500">
        Showing {from}–{to} of {total} products
      </p>
    </nav>
  );
}
