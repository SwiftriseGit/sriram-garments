import { cacheLife, cacheTag } from "next/cache";
import connectDB from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import { PAGE_SIZE, PRICE_OPTIONS } from "@/lib/catalog/options";
import type { CollectionQuery } from "@/lib/catalog/query";
import type {
  CategorySlug,
  FacetCounts,
  Product,
  ProductPage,
  Size,
} from "@/lib/catalog/types";

/**
 * Product data layer powered by real MongoDB database.
 * Uses Next.js 16 `'use cache'` with `'catalog'` profile and tag `'products'`.
 * Invalidated immediately when admin saves or deletes products via `updateTag("products")`.
 */

export function toProduct(doc: any): Product {
  const isSale = Boolean(
    doc.isSale && doc.salePrice != null && doc.salePrice < doc.originalPrice
  );
  const effectivePrice = isSale && doc.salePrice != null ? doc.salePrice : doc.originalPrice;
  const compareAtPrice = isSale ? doc.originalPrice : null;

  return {
    id: doc._id?.toString() || doc.id,
    slug: doc.slug,
    styleId: doc.styleId || doc.slug,
    name: doc.name,
    category: doc.category as CategorySlug,
    price: effectivePrice,
    compareAtPrice: compareAtPrice,
    rating: doc.rating ?? 4.5,
    reviewCount: doc.reviewCount ?? 12,
    inStock: Boolean(doc.inStock !== false && (doc.stockQuantity ?? 1) > 0),
    sizes: (doc.sizes || ["S", "M", "L", "XL"]) as Size[],
    color: {
      name: doc.color?.name || "Standard",
      hex: doc.color?.hex || "#1c1c1f",
      tone: (doc.color?.tone as "dark" | "light") || "dark",
    },
    images: doc.images || [],
    description: doc.description || "",
    highlights: doc.highlights || [],
    fabric: doc.fabric || "",
    fit: doc.fit || "",
    addedRank: doc.addedRank || 0,
    salesCount: doc.salesCount || 0,
  };
}

/** Build MongoDB query filter from query options */
function buildMongoFilter(query: CollectionQuery) {
  const filter: Record<string, any> = { isPublished: true };

  // Category filter
  if (query.category && query.category.length > 0) {
    filter.category = { $in: query.category };
  }

  // Size filter
  if (query.size && query.size.length > 0) {
    filter.sizes = { $in: query.size };
  }

  // Availability filter
  if (query.availability && query.availability.length > 0) {
    const hasInStock = query.availability.includes("in-stock");
    const hasOutOfStock = query.availability.includes("out-of-stock");

    if (hasInStock && !hasOutOfStock) {
      filter.stockQuantity = { $gt: 0 };
    } else if (hasOutOfStock && !hasInStock) {
      filter.$or = [{ stockQuantity: { $lte: 0 } }, { inStock: false }];
    }
  }

  // Price range filters
  if (query.price && query.price.length > 0) {
    const priceConditions: any[] = [];
    for (const rangeVal of query.price) {
      const opt = PRICE_OPTIONS.find((p) => p.value === rangeVal);
      if (opt) {
        priceConditions.push({
          $or: [
            { isSale: true, salePrice: { $gte: opt.min, $lte: opt.max } },
            { isSale: false, originalPrice: { $gte: opt.min, $lte: opt.max } },
            { salePrice: null, originalPrice: { $gte: opt.min, $lte: opt.max } },
          ],
        });
      }
    }
    if (priceConditions.length > 0) {
      filter.$and = filter.$and ? [...filter.$and, { $or: priceConditions }] : [{ $or: priceConditions }];
    }
  }

  return filter;
}

/** Sort mapping for Mongo */
function getMongoSort(sort: CollectionQuery["sort"]): Record<string, 1 | -1> {
  switch (sort) {
    case "price-asc":
      return { salePrice: 1, originalPrice: 1 };
    case "price-desc":
      return { originalPrice: -1, salePrice: -1 };
    case "best-selling":
      return { salesCount: -1, createdAt: -1 };
    case "rating":
      return { rating: -1, reviewCount: -1 };
    case "newest":
    default:
      return { createdAt: -1, _id: -1 };
  }
}

// ──────────────────────────────────────────────
// Cached Queries — Next.js 16 Caching Architecture
// ──────────────────────────────────────────────

/**
 * Filtered, sorted, and paginated product catalog from MongoDB.
 */
export async function getProducts(query: CollectionQuery): Promise<ProductPage> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  await connectDB();

  const filter = buildMongoFilter(query);
  const sort = getMongoSort(query.sort);

  const total = await ProductModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, query.page), totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const docs = await ProductModel.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(PAGE_SIZE)
    .lean();

  return {
    items: docs.map(toProduct),
    total,
    page,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}

/** Counts shown next to each filter option (computed over the full active catalog). */
export async function getCollectionFacets(): Promise<FacetCounts> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  await connectDB();

  const products = await ProductModel.find({ isPublished: true })
    .select("category inStock stockQuantity sizes originalPrice salePrice isSale")
    .lean();

  const counts: FacetCounts = {};
  const bump = (key: string) => {
    counts[key] = (counts[key] ?? 0) + 1;
  };

  for (const doc of products) {
    const p = toProduct(doc);
    bump(`category:${p.category}`);
    bump(`availability:${p.inStock ? "in-stock" : "out-of-stock"}`);
    for (const size of p.sizes) {
      bump(`size:${size}`);
    }
    for (const range of PRICE_OPTIONS) {
      if (p.price >= range.min && p.price <= range.max) {
        bump(`price:${range.value}`);
      }
    }
  }

  return counts;
}

/** Single product lookup by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", `product:${slug}`);

  await connectDB();

  const doc = await ProductModel.findOne({ slug, isPublished: true }).lean();
  if (!doc) return null;

  return toProduct(doc);
}

/** Other colourways of the same garment style */
export async function getStyleVariants(styleId: string): Promise<Product[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  if (!styleId) return [];

  await connectDB();

  const docs = await ProductModel.find({ styleId, isPublished: true }).lean();
  return docs.map(toProduct);
}

/** Related products by category */
export async function getRelatedProducts(
  styleId: string,
  category: CategorySlug,
  limit = 4
): Promise<Product[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  await connectDB();

  const docs = await ProductModel.find({
    category,
    styleId: { $ne: styleId },
    isPublished: true,
  })
    .sort({ salesCount: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return docs.map(toProduct);
}

/** Slugs for static pre-rendering */
export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  await connectDB();

  const docs = await ProductModel.find({ isPublished: true })
    .select("slug")
    .lean();

  return docs.map((d: any) => d.slug);
}

/** Latest arrivals for home page and new drop feeds */
export async function getNewArrivals(limit = 6): Promise<Product[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  await connectDB();

  const docs = await ProductModel.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return docs.map(toProduct);
}

/** Top selling products for home page */
export async function getBestSellers(limit = 6): Promise<Product[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");

  await connectDB();

  const docs = await ProductModel.find({ isPublished: true })
    .sort({ salesCount: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return docs.map(toProduct);
}

