/**
 * Shared catalog types.
 * Safe to import from both Server and Client Components (no runtime code).
 */

export type CategorySlug = "shirts" | "t-shirts" | "jeans" | "trousers";

export type JeansSubType = "slim" | "ankle" | "straight" | "baggy";
export type TShirtSubType = "half" | "full";
export type SubType = JeansSubType | TShirtSubType;

export type Size = "S" | "M" | "L" | "XL" | "XXL";

export interface ProductColor {
  name: string;
  /** Swatch / placeholder background colour */
  hex: string;
  /** Whether the colour is dark — used to pick readable overlay colours */
  tone: "dark" | "light";
}

export interface Product {
  id: string;
  slug: string;
  /** Groups colourways of the same garment together */
  styleId: string;
  name: string;
  category: CategorySlug;
  price: number;
  /** Original price — `null` when the item is not on sale */
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sizes: Size[];
  color: ProductColor;
  /** Optional real image URLs — when absent a colour placeholder is rendered */
  images?: string[];
  description: string;
  highlights: string[];
  fabric: string;
  fit: string;
  subType?: string | null;
  /** Higher = newer (used for "Date, new to old") */
  addedRank: number;
  salesCount: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

export type FacetCounts = Record<string, number>;
