import type { CategorySlug, Size } from "./types";

/** Products shown per page on collection listings */
export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "newest", label: "Date, new to old" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "best-selling", label: "Best selling" },
  { value: "rating", label: "Top rated" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
export const DEFAULT_SORT: SortValue = "newest";

export const CATEGORY_OPTIONS: { value: CategorySlug; label: string }[] = [
  { value: "shirts", label: "Shirts" },
  { value: "t-shirts", label: "T-Shirts" },
  { value: "jeans", label: "Jeans" },
  { value: "trousers", label: "Trousers" },
];

export const SIZE_OPTIONS: Size[] = ["S", "M", "L", "XL", "XXL"];

export const AVAILABILITY_OPTIONS = [
  { value: "in-stock", label: "In stock" },
  { value: "out-of-stock", label: "Out of stock" },
] as const;

export const PRICE_OPTIONS = [
  { value: "under-500", label: "Under ₹500", min: 0, max: 499 },
  { value: "500-1000", label: "₹500 – ₹1000", min: 500, max: 1000 },
  { value: "1000-1500", label: "₹1000 – ₹1500", min: 1001, max: 1500 },
  { value: "above-1500", label: "Above ₹1500", min: 1501, max: Number.POSITIVE_INFINITY },
] as const;

export function categoryLabel(slug: CategorySlug) {
  return CATEGORY_OPTIONS.find((c) => c.value === slug)?.label ?? slug;
}
