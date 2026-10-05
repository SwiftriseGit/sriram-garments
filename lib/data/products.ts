import { cacheLife, cacheTag } from "next/cache";
import { PAGE_SIZE, PRICE_OPTIONS, SIZE_OPTIONS } from "@/lib/catalog/options";
import type { CollectionQuery } from "@/lib/catalog/query";
import type {
  CategorySlug,
  FacetCounts,
  Product,
  ProductColor,
  ProductPage,
} from "@/lib/catalog/types";

/**
 * Product data layer.
 *
 * Server-only: import this from Server Components / Server Actions only.
 * The catalog is public and identical for every visitor, so it is a good
 * fit for function-level `'use cache'` + `cacheLife` + `cacheTag`.
 * When a real DB/CMS is plugged in, call `updateTag("products")` (or
 * `updateTag(\`product:${slug}\`)`) from the Server Action that edits it.
 */

// ---------------------------------------------------------------------------
// Mock catalog (swap for a DB / CMS query later — the API below stays the same)
// ---------------------------------------------------------------------------

const COLORS = {
  black: { name: "Jet Black", hex: "#1c1c1f", tone: "dark" },
  charcoal: { name: "Charcoal", hex: "#3f3f46", tone: "dark" },
  offWhite: { name: "Off White", hex: "#ececee", tone: "light" },
  stone: { name: "Stone", hex: "#e2dfdc", tone: "light" },
  sand: { name: "Sand Beige", hex: "#e6dac6", tone: "light" },
  olive: { name: "Olive", hex: "#4d5b3a", tone: "dark" },
  navy: { name: "Navy", hex: "#1f3a5c", tone: "dark" },
  maroon: { name: "Maroon", hex: "#7a1f1f", tone: "dark" },
  mint: { name: "Mint", hex: "#c9eedb", tone: "light" },
  sky: { name: "Sky Blue", hex: "#c3d9f5", tone: "light" },
  indigo: { name: "Indigo", hex: "#2b3a67", tone: "dark" },
  lightWash: { name: "Light Wash", hex: "#a9bcd4", tone: "light" },
  rust: { name: "Rust", hex: "#9a3d1c", tone: "dark" },
} satisfies Record<string, ProductColor>;

type ColorKey = keyof typeof COLORS;

interface Style {
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice: number;
  colors: [ColorKey, ColorKey, ColorKey];
  fabric: string;
  fit: string;
  description: string;
  highlights: string[];
}

const STYLES: Style[] = [
  {
    name: "Wide Leg Stan Collar Tee",
    category: "t-shirts",
    price: 1350,
    compareAtPrice: 1499,
    colors: ["black", "offWhite", "olive"],
    fabric: "100% combed cotton, 240 GSM",
    fit: "Relaxed fit with dropped shoulders",
    description:
      "A heavyweight tee with a structured stand collar that sits clean around the neck. Built for everyday wear with a relaxed silhouette that drapes well.",
    highlights: ["Stand collar", "Dropped shoulders", "Pre-shrunk fabric"],
  },
  {
    name: "Crop Boxy Tee",
    category: "t-shirts",
    price: 899,
    compareAtPrice: 1099,
    colors: ["maroon", "black", "sand"],
    fabric: "100% cotton jersey, 220 GSM",
    fit: "Boxy cropped fit",
    description:
      "Short, square and easy. The boxy crop hits just above the hip so it pairs perfectly with high-rise trousers and wide-leg denim.",
    highlights: ["Cropped length", "Ribbed crew neck", "Bio-washed for softness"],
  },
  {
    name: "Boxfit Wide Leg Combo",
    category: "trousers",
    price: 1499,
    compareAtPrice: 1699,
    colors: ["mint", "charcoal", "stone"],
    fabric: "Cotton-poly twill blend",
    fit: "Wide leg, mid rise",
    description:
      "A matching boxfit top and wide-leg trouser set. Wear it together for an effortless co-ord or split it up to mix with your wardrobe.",
    highlights: ["Two-piece set", "Elasticated back waist", "Side pockets"],
  },
  {
    name: "Check Shirt Light",
    category: "shirts",
    price: 999,
    compareAtPrice: 1299,
    colors: ["stone", "sky", "olive"],
    fabric: "100% cotton yarn-dyed check",
    fit: "Regular fit",
    description:
      "A lightweight checked shirt that works buttoned up or thrown open over a tee. Breathable yarn-dyed cotton keeps it comfortable all day.",
    highlights: ["Yarn-dyed checks", "Chest pocket", "Curved hem"],
  },
  {
    name: "Revenge Print Tee",
    category: "t-shirts",
    price: 799,
    compareAtPrice: 999,
    colors: ["charcoal", "black", "offWhite"],
    fabric: "100% cotton, 200 GSM",
    fit: "Regular fit",
    description:
      "Our signature graphic tee with a high-density back print. Soft-hand screen printing that won't crack after washes.",
    highlights: ["High-density print", "Crew neck", "Side-seamed"],
  },
  {
    name: "Oversized Graphic Tee",
    category: "t-shirts",
    price: 899,
    compareAtPrice: 1199,
    colors: ["offWhite", "black", "rust"],
    fabric: "100% cotton, 240 GSM",
    fit: "Oversized fit",
    description:
      "Roomy, heavyweight and made to be layered. A bold front graphic on an oversized body with extended sleeves.",
    highlights: ["Oversized silhouette", "Puff print graphic", "Thick ribbed collar"],
  },
  {
    name: "Classic Oxford Shirt",
    category: "shirts",
    price: 1199,
    compareAtPrice: 1499,
    colors: ["sky", "offWhite", "navy"],
    fabric: "100% cotton Oxford weave",
    fit: "Tailored regular fit",
    description:
      "The wardrobe staple. A crisp Oxford cotton shirt with a button-down collar that moves easily from office to weekend.",
    highlights: ["Button-down collar", "Box pleat back", "Mother-of-pearl effect buttons"],
  },
  {
    name: "Linen Resort Shirt",
    category: "shirts",
    price: 1299,
    compareAtPrice: 1599,
    colors: ["sand", "offWhite", "olive"],
    fabric: "Linen-cotton blend (55/45)",
    fit: "Relaxed fit",
    description:
      "Light, airy linen blend with a camp collar — made for warm days. Gets softer and better with every wash.",
    highlights: ["Camp collar", "Breathable linen blend", "Straight hem"],
  },
  {
    name: "Cuban Collar Shirt",
    category: "shirts",
    price: 1099,
    compareAtPrice: 1399,
    colors: ["black", "maroon", "mint"],
    fabric: "Viscose rayon",
    fit: "Relaxed fit",
    description:
      "A fluid viscose shirt with an open Cuban collar. Drapes beautifully and keeps you cool when the temperature rises.",
    highlights: ["Open Cuban collar", "Fluid drape", "Short sleeves"],
  },
  {
    name: "Essential Polo",
    category: "t-shirts",
    price: 699,
    compareAtPrice: 899,
    colors: ["navy", "offWhite", "olive"],
    fabric: "Cotton piqué, 220 GSM",
    fit: "Slim fit",
    description:
      "A clean, slim-fit polo in breathable piqué cotton. Smart enough for dinner, easy enough for the weekend.",
    highlights: ["Two-button placket", "Ribbed collar & cuffs", "Side vents"],
  },
  {
    name: "Baggy Fit Jeans",
    category: "jeans",
    price: 1499,
    compareAtPrice: 1899,
    colors: ["lightWash", "indigo", "black"],
    fabric: "100% cotton rigid denim, 13 oz",
    fit: "Baggy fit, high rise",
    description:
      "Loose through the hip and thigh with a full, stacked leg. Rigid denim that breaks in and moulds to you over time.",
    highlights: ["Five-pocket styling", "Button fly", "Stacked hem"],
  },
  {
    name: "Straight Fit Jeans",
    category: "jeans",
    price: 1399,
    compareAtPrice: 1699,
    colors: ["indigo", "lightWash", "charcoal"],
    fabric: "Cotton stretch denim (98/2)",
    fit: "Straight fit, mid rise",
    description:
      "Our most versatile denim. A straight leg from hip to hem with just a touch of stretch for all-day comfort.",
    highlights: ["Comfort stretch", "Zip fly", "Classic five-pocket"],
  },
  {
    name: "Slim Tapered Jeans",
    category: "jeans",
    price: 1299,
    compareAtPrice: 1599,
    colors: ["black", "indigo", "lightWash"],
    fabric: "Cotton stretch denim (97/3)",
    fit: "Slim tapered fit",
    description:
      "Slim through the thigh with a tapered leg for a sharp, modern line. Stretch denim keeps it comfortable.",
    highlights: ["Tapered leg", "Stretch denim", "Whiskered wash"],
  },
  {
    name: "Pleated Korean Trousers",
    category: "trousers",
    price: 1199,
    compareAtPrice: 1499,
    colors: ["stone", "black", "charcoal"],
    fabric: "Poly-viscose suiting",
    fit: "Relaxed pleated fit",
    description:
      "Front-pleated trousers with a relaxed leg and clean drape. Dress them up with a shirt or down with a tee.",
    highlights: ["Double front pleats", "Adjustable waist tabs", "Wrinkle resistant"],
  },
  {
    name: "Cargo Parachute Pants",
    category: "trousers",
    price: 1349,
    compareAtPrice: 1699,
    colors: ["olive", "black", "sand"],
    fabric: "Nylon-cotton ripstop",
    fit: "Loose fit with toggle hem",
    description:
      "Utility-inspired parachute pants with roomy cargo pockets and adjustable toggle hems to switch up the shape.",
    highlights: ["Six pockets", "Toggle hem", "Elastic waist with drawcord"],
  },
  {
    name: "Basic Crew Tee",
    category: "t-shirts",
    price: 449,
    compareAtPrice: 599,
    colors: ["offWhite", "black", "navy"],
    fabric: "100% cotton, 180 GSM",
    fit: "Regular fit",
    description:
      "The everyday essential. A soft, breathable crew-neck tee that you'll want in every colour.",
    highlights: ["Crew neck", "Tag-free comfort", "Soft bio-washed cotton"],
  },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Deterministic generation so server renders are stable across requests */
const PRODUCTS: Product[] = STYLES.flatMap((style, styleIndex) =>
  style.colors.map((colorKey, colorIndex) => {
    const i = styleIndex * 3 + colorIndex;
    const color = COLORS[colorKey];
    const onSale = i % 4 !== 3;
    const sizes = i % 3 === 0 ? SIZE_OPTIONS.filter((_, s) => s !== i % 5) : SIZE_OPTIONS;

    return {
      id: String(i + 1),
      slug: `${slugify(style.name)}-${slugify(color.name)}`,
      styleId: slugify(style.name),
      name: style.name,
      category: style.category,
      price: style.price,
      compareAtPrice: onSale ? style.compareAtPrice : null,
      rating: Math.round((3.6 + ((i * 37) % 14) / 10) * 10) / 10,
      reviewCount: 12 + ((i * 53) % 240),
      inStock: i % 6 !== 5,
      sizes,
      color,
      description: style.description,
      highlights: style.highlights,
      fabric: style.fabric,
      fit: style.fit,
      addedRank: (i * 17) % 48,
      salesCount: (i * 29) % 500,
    } satisfies Product;
  }),
);

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function matchesPrice(price: number, ranges: string[]) {
  return PRICE_OPTIONS.some(
    (range) => ranges.includes(range.value) && price >= range.min && price <= range.max,
  );
}

function applyFilters(products: Product[], query: CollectionQuery) {
  return products.filter((p) => {
    if (query.category.length && !query.category.includes(p.category)) return false;
    if (query.size.length && !query.size.some((s) => (p.sizes as string[]).includes(s))) return false;
    if (query.availability.length) {
      const status = p.inStock ? "in-stock" : "out-of-stock";
      if (!query.availability.includes(status)) return false;
    }
    if (query.price.length && !matchesPrice(p.price, query.price)) return false;
    return true;
  });
}

const SORTERS: Record<CollectionQuery["sort"], (a: Product, b: Product) => number> = {
  newest: (a, b) => b.addedRank - a.addedRank,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "best-selling": (a, b) => b.salesCount - a.salesCount,
  rating: (a, b) => b.rating - a.rating,
};

// ---------------------------------------------------------------------------
// Cached queries
// ---------------------------------------------------------------------------

/**
 * Filtered + sorted + paginated listing.
 * `query` is a normalised plain object, so it serialises into a stable cache key.
 */
export async function getProducts(query: CollectionQuery): Promise<ProductPage> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const filtered = applyFilters(PRODUCTS, query).sort(SORTERS[query.sort]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total,
    page,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}

/** Counts shown next to each filter option (computed over the full catalog). */
export async function getCollectionFacets(): Promise<FacetCounts> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const counts: FacetCounts = {};
  const bump = (key: string) => {
    counts[key] = (counts[key] ?? 0) + 1;
  };

  for (const p of PRODUCTS) {
    bump(`category:${p.category}`);
    bump(`availability:${p.inStock ? "in-stock" : "out-of-stock"}`);
    for (const size of p.sizes) bump(`size:${size}`);
    for (const range of PRICE_OPTIONS) {
      if (p.price >= range.min && p.price <= range.max) bump(`price:${range.value}`);
    }
  }
  return counts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);

  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/** Other colourways of the same garment (including the current one). */
export async function getStyleVariants(styleId: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return PRODUCTS.filter((p) => p.styleId === styleId);
}

export async function getRelatedProducts(
  styleId: string,
  category: CategorySlug,
  limit = 4,
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  // One colourway per style, same category first, then best sellers
  const seen = new Set<string>([styleId]);
  const pool = [...PRODUCTS].sort(
    (a, b) =>
      Number(b.category === category) - Number(a.category === category) ||
      b.salesCount - a.salesCount,
  );

  const related: Product[] = [];
  for (const p of pool) {
    if (seen.has(p.styleId) || !p.inStock) continue;
    seen.add(p.styleId);
    related.push(p);
    if (related.length === limit) break;
  }
  return related;
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return PRODUCTS.map((p) => p.slug);
}
