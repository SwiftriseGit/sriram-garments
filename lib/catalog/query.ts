import {
  AVAILABILITY_OPTIONS,
  CATEGORY_OPTIONS,
  DEFAULT_SORT,
  PRICE_OPTIONS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
  type SortValue,
} from "./options";

/**
 * The collection page state lives in the URL (shareable, back-button friendly,
 * server-rendered). This module converts between raw `searchParams` and a
 * normalised, typed query object.
 *
 * Normalising matters: the query is an argument to a `'use cache'` function,
 * so `?size=M,S` and `?size=S,M` must produce the same cache key.
 */
export interface CollectionQuery {
  category: string[];
  size: string[];
  availability: string[];
  price: string[];
  sort: SortValue;
  page: number;
}

export type FilterKey = "category" | "size" | "availability" | "price";

export const FILTER_KEYS: FilterKey[] = ["category", "size", "availability", "price"];

type RawSearchParams = Record<string, string | string[] | undefined>;

const ALLOWED: Record<FilterKey, readonly string[]> = {
  category: CATEGORY_OPTIONS.map((o) => o.value),
  size: SIZE_OPTIONS,
  availability: AVAILABILITY_OPTIONS.map((o) => o.value),
  price: PRICE_OPTIONS.map((o) => o.value),
};

function readList(raw: RawSearchParams, key: FilterKey): string[] {
  const value = raw[key];
  const joined = Array.isArray(value) ? value.join(",") : (value ?? "");
  const picked = new Set(joined.split(",").map((v) => v.trim()));
  // Keep only known values, in canonical order
  return ALLOWED[key].filter((allowed) => picked.has(allowed));
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseCollectionQuery(raw: RawSearchParams): CollectionQuery {
  const sortParam = first(raw.sort);
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam)
    ? (sortParam as SortValue)
    : DEFAULT_SORT;

  const pageNumber = Number.parseInt(first(raw.page) ?? "1", 10);
  const page = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  return {
    category: readList(raw, "category"),
    size: readList(raw, "size"),
    availability: readList(raw, "availability"),
    price: readList(raw, "price"),
    sort,
    page,
  };
}

/** Builds `?a=b&c=d` (or `""`), omitting defaults to keep URLs clean. */
export function serializeCollectionQuery(query: CollectionQuery): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const values = ALLOWED[key].filter((v) => query[key].includes(v));
    if (values.length) params.set(key, values.join(","));
  }
  if (query.sort !== DEFAULT_SORT) params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));

  const str = params.toString();
  return str ? `?${str}` : "";
}

export function countActiveFilters(query: CollectionQuery) {
  return FILTER_KEYS.reduce((sum, key) => sum + query[key].length, 0);
}
