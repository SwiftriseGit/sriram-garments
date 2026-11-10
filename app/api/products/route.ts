import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import { toProduct } from "@/lib/data/products";
import { parseCollectionQuery } from "@/lib/catalog/query";
import { PRICE_OPTIONS } from "@/lib/catalog/options";
import { MOCK_PRODUCTS } from "@/lib/data/admin/mock-data";

/**
 * GET /api/products
 *
 * Query Parameters:
 *  - category: e.g. "jeans" or "t-shirts,jeans"
 *  - subType:  e.g. "slim", "ankle", "straight", "baggy" (for Jeans)
 *              or "half", "full" (for T-Shirts)
 *  - size:     e.g. "M", "L", "XL"
 *  - availability: "in-stock" | "out-of-stock"
 *  - price:    "under-500", "500-1000", "1000-1500", "above-1500"
 *  - minPrice, maxPrice: custom numeric ranges
 *  - sort:     "newest" | "price-asc" | "price-desc" | "best-selling" | "rating"
 *  - page:     page number (default 1)
 *  - limit:    items per page (default 12)
 *  - q:        keyword search in name, description, highlights, fit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Convert URL searchParams into a Record for the catalog query parser
    const rawParams: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      rawParams[key] = val;
    });

    const parsedQuery = parseCollectionQuery(rawParams);
    const limit = Math.min(
      Math.max(1, Number.parseInt(searchParams.get("limit") || "12", 10)),
      100
    );
    const page = parsedQuery.page;
    const skip = (page - 1) * limit;
    const keyword = searchParams.get("q") || searchParams.get("search") || "";

    // Custom numeric price range support
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;

    let dbAvailable = false;
    try {
      await connectDB();
      dbAvailable = true;
    } catch (e) {
      dbAvailable = false;
    }

    if (dbAvailable) {
      const filter: Record<string, any> = { isPublished: true };

      // Category filter
      if (parsedQuery.category.length > 0) {
        filter.category = { $in: parsedQuery.category };
      }

      // Sub-type filter (Jeans: slim, ankle, straight, baggy | T-Shirt: half, full)
      if (parsedQuery.subType.length > 0) {
        const subTypeConditions: any[] = [];
        for (const st of parsedQuery.subType) {
          subTypeConditions.push({ subType: st });

          if (st === "slim") {
            subTypeConditions.push({ name: { $regex: /slim/i } });
            subTypeConditions.push({ fit: { $regex: /slim/i } });
          } else if (st === "ankle") {
            subTypeConditions.push({ name: { $regex: /ankle/i } });
            subTypeConditions.push({ fit: { $regex: /ankle/i } });
          } else if (st === "straight") {
            subTypeConditions.push({ name: { $regex: /straight/i } });
            subTypeConditions.push({ fit: { $regex: /straight/i } });
          } else if (st === "baggy") {
            subTypeConditions.push({ name: { $regex: /(baggy|relaxed|cargo)/i } });
            subTypeConditions.push({ fit: { $regex: /(baggy|relaxed)/i } });
          } else if (st === "half") {
            subTypeConditions.push({ name: { $regex: /(half|short sleeve|polo|tee)/i } });
            subTypeConditions.push({ fit: { $regex: /(half|short sleeve)/i } });
          } else if (st === "full") {
            subTypeConditions.push({ name: { $regex: /(full|long sleeve)/i } });
            subTypeConditions.push({ fit: { $regex: /(full|long sleeve)/i } });
          }
        }
        if (subTypeConditions.length > 0) {
          filter.$and = filter.$and
            ? [...filter.$and, { $or: subTypeConditions }]
            : [{ $or: subTypeConditions }];
        }
      }

      // Size filter
      if (parsedQuery.size.length > 0) {
        filter.sizes = { $in: parsedQuery.size };
      }

      // Availability filter
      if (parsedQuery.availability.length > 0) {
        const hasInStock = parsedQuery.availability.includes("in-stock");
        const hasOutOfStock = parsedQuery.availability.includes("out-of-stock");
        if (hasInStock && !hasOutOfStock) {
          filter.stockQuantity = { $gt: 0 };
        } else if (hasOutOfStock && !hasInStock) {
          filter.$or = [{ stockQuantity: { $lte: 0 } }, { inStock: false }];
        }
      }

      // Keyword search
      if (keyword.trim()) {
        const rx = new RegExp(keyword.trim(), "i");
        const searchConditions = [
          { name: rx },
          { description: rx },
          { fit: rx },
          { fabric: rx },
          { highlights: rx },
        ];
        filter.$and = filter.$and
          ? [...filter.$and, { $or: searchConditions }]
          : [{ $or: searchConditions }];
      }

      // Preset Price range filters
      if (parsedQuery.price.length > 0) {
        const priceConditions: any[] = [];
        for (const rangeVal of parsedQuery.price) {
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
          filter.$and = filter.$and
            ? [...filter.$and, { $or: priceConditions }]
            : [{ $or: priceConditions }];
        }
      }

      // Custom numeric price range
      if (minPrice !== null || maxPrice !== null) {
        const rangeCondition: Record<string, any> = {};
        if (minPrice !== null) rangeCondition.$gte = minPrice;
        if (maxPrice !== null) rangeCondition.$lte = maxPrice;

        const customPriceConditions = [
          { isSale: true, salePrice: rangeCondition },
          { isSale: false, originalPrice: rangeCondition },
          { salePrice: null, originalPrice: rangeCondition },
        ];
        filter.$and = filter.$and
          ? [...filter.$and, { $or: customPriceConditions }]
          : [{ $or: customPriceConditions }];
      }

      // Sort mapping
      let sortObj: Record<string, 1 | -1> = { createdAt: -1, _id: -1 };
      if (parsedQuery.sort === "price-asc") sortObj = { salePrice: 1, originalPrice: 1 };
      else if (parsedQuery.sort === "price-desc") sortObj = { originalPrice: -1, salePrice: -1 };
      else if (parsedQuery.sort === "best-selling") sortObj = { salesCount: -1, createdAt: -1 };
      else if (parsedQuery.sort === "rating") sortObj = { rating: -1, reviewCount: -1 };

      const total = await ProductModel.countDocuments(filter);
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const docs = await ProductModel.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        source: "database",
        query: {
          ...parsedQuery,
          limit,
          keyword,
        },
        data: {
          items: docs.map(toProduct),
          total,
          page,
          totalPages,
          pageSize: limit,
        },
      });
    }

    // Fallback in-memory query for mock data if DB is unavailable
    let items = MOCK_PRODUCTS.map(toProduct);

    if (parsedQuery.category.length > 0) {
      items = items.filter((p) => parsedQuery.category.includes(p.category));
    }
    if (parsedQuery.subType.length > 0) {
      items = items.filter((p) => {
        if (p.subType && parsedQuery.subType.includes(p.subType)) return true;
        const text = `${p.name} ${p.fit} ${p.description}`.toLowerCase();
        return parsedQuery.subType.some((st) => text.includes(st));
      });
    }
    if (parsedQuery.size.length > 0) {
      items = items.filter((p) => p.sizes.some((s) => parsedQuery.size.includes(s)));
    }
    if (parsedQuery.availability.length > 0) {
      const wantInStock = parsedQuery.availability.includes("in-stock");
      const wantOutOfStock = parsedQuery.availability.includes("out-of-stock");
      if (wantInStock && !wantOutOfStock) items = items.filter((p) => p.inStock);
      else if (wantOutOfStock && !wantInStock) items = items.filter((p) => !p.inStock);
    }
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      items = items.filter((p) =>
        `${p.name} ${p.description} ${p.fit} ${p.fabric}`.toLowerCase().includes(q)
      );
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const paginatedItems = items.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      source: "mock",
      query: {
        ...parsedQuery,
        limit,
        keyword,
      },
      data: {
        items: paginatedItems,
        total,
        page,
        totalPages,
        pageSize: limit,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to query products",
      },
      { status: 500 }
    );
  }
}

