import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import ReviewModel, { IReview } from "@/lib/models/Review";
import ProductModel from "@/lib/models/Product";

export interface SerializedReview {
  id: string;
  productId: string;
  userId?: string | null;
  name: string;
  email: string;
  rating: number;
  review: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  productName?: string;
  productSlug?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalCount: number;
  distribution: Record<number, number>;
  percentages: Record<number, number>;
}

/**
 * Fetch all published reviews for a product by its ID or Slug.
 */
export async function getReviewsForProduct(productIdOrSlug: string): Promise<SerializedReview[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("reviews");

  try {
    await connectDB();

    let targetProductId = productIdOrSlug;
    if (!mongoose.Types.ObjectId.isValid(productIdOrSlug)) {
      const product = await ProductModel.findOne({ slug: productIdOrSlug }).select("_id").lean();
      if (!product) return [];
      targetProductId = (product._id as mongoose.Types.ObjectId).toString();
    }

    const reviews = await ReviewModel.find({
      productId: targetProductId,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return reviews.map((r: any) => ({
      id: r._id.toString(),
      productId: r.productId.toString(),
      userId: r.userId ? r.userId.toString() : null,
      name: r.name,
      email: r.email,
      rating: r.rating,
      review: r.review,
      isVerifiedPurchase: Boolean(r.isVerifiedPurchase),
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
    }));
  } catch (error) {
    console.error("Error fetching reviews for product:", error);
    return [];
  }
}

/**
 * Calculate review summary, distribution, and exact fraction rating.
 */
export async function getReviewSummaryForProduct(productIdOrSlug: string): Promise<ReviewSummary> {
  const reviews = await getReviewsForProduct(productIdOrSlug);
  const totalCount = reviews.length;

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  for (const r of reviews) {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    distribution[star] = (distribution[star] || 0) + 1;
    sum += r.rating;
  }

  const averageRating =
    totalCount > 0 ? Math.round((sum / totalCount) * 10) / 10 : 0;

  const percentages: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (let s = 1; s <= 5; s++) {
    percentages[s] = totalCount > 0 ? Math.round(((distribution[s] || 0) / totalCount) * 100) : 0;
  }

  return {
    averageRating,
    totalCount,
    distribution,
    percentages,
  };
}

/**
 * Recalculate average rating and reviewCount for a product and persist to ProductModel.
 */
export async function recalculateProductRating(productId: string | mongoose.Types.ObjectId) {
  try {
    await connectDB();
    const reviews = await ReviewModel.find({
      productId,
      isPublished: true,
    })
      .select("rating")
      .lean();

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? Math.round(
            (reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviewCount) * 10
          ) / 10
        : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviewCount,
    });

    return { rating: averageRating, reviewCount };
  } catch (error) {
    console.error("Error recalculating product rating:", error);
    return { rating: 0, reviewCount: 0 };
  }
}

/**
 * Fetch recent published reviews across products for the Homepage Testimonials carousel.
 */
export async function getHomepageReviews(limit = 10): Promise<SerializedReview[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("reviews");

  try {
    await connectDB();

    const reviews = await ReviewModel.find({ isPublished: true, rating: { $gte: 4 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("productId", "name slug")
      .lean();

    return reviews.map((r: any) => ({
      id: r._id.toString(),
      productId: r.productId?._id ? r.productId._id.toString() : r.productId?.toString(),
      productName: r.productId?.name || "",
      productSlug: r.productId?.slug || "",
      userId: r.userId ? r.userId.toString() : null,
      name: r.name,
      email: r.email,
      rating: r.rating,
      review: r.review,
      isVerifiedPurchase: Boolean(r.isVerifiedPurchase),
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
    }));
  } catch (error) {
    console.error("Error fetching homepage reviews:", error);
    return [];
  }
}

export interface AdminReviewItem {
  id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
  } | null;
}

export interface AdminReviewPagination {
  page: number;
  limit: number;
  totalFiltered: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminReviewQuery {
  search?: string;
  rating?: number;
  productId?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch paginated customer reviews for Admin moderation directly from MongoDB.
 * Filters by search keyword (customer/product/comment) and star rating on the backend.
 */
export async function getAllReviewsForAdmin(query?: AdminReviewQuery): Promise<{
  reviews: AdminReviewItem[];
  pagination: AdminReviewPagination;
  stats: {
    total: number;
    averageRating: number;
    countsByRating: Record<number, number>;
  };
}> {
  try {
    await connectDB();

    const filter: Record<string, any> = {};

    if (query?.productId && mongoose.isValidObjectId(query.productId)) {
      filter.productId = new mongoose.Types.ObjectId(query.productId);
    }

    if (query?.rating && query.rating >= 1 && query.rating <= 5) {
      filter.rating = Number(query.rating);
    }

    if (query?.search && query.search.trim()) {
      const term = query.search.trim();
      const regex = new RegExp(term, "i");

      // Also find products matching this search term to include their reviews
      const matchingProducts = await ProductModel.find({
        $or: [{ name: regex }, { category: regex }],
      })
        .select("_id")
        .lean();
      const matchingProductIds = matchingProducts.map((p) => p._id);

      filter.$or = [
        { name: regex },
        { email: regex },
        { review: regex },
        ...(matchingProductIds.length > 0 ? [{ productId: { $in: matchingProductIds } }] : []),
      ];
    }

    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query?.limit) || 8));
    const skip = (page - 1) * limit;

    const [totalFiltered, docs, allStats, distributionAgg] = await Promise.all([
      ReviewModel.countDocuments(filter),
      ReviewModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productId", "name slug category images originalPrice salePrice isSale rating reviewCount")
        .lean(),
      ReviewModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgRating: { $avg: "$rating" },
          },
        },
      ]),
      ReviewModel.aggregate([
        {
          $group: {
            _id: { $round: ["$rating", 0] },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const countsByRating: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const item of distributionAgg) {
      if (item._id >= 1 && item._id <= 5) {
        countsByRating[item._id] = item.count;
      }
    }

    const totalAll = allStats[0]?.total || 0;
    const overallAvgRating = allStats[0]?.avgRating
      ? Math.round(allStats[0].avgRating * 10) / 10
      : 0;

    const reviews: AdminReviewItem[] = docs.map((r: any) => {
      const p = r.productId;
      const effectivePrice = p
        ? p.isSale && p.salePrice != null
          ? p.salePrice
          : p.originalPrice
        : 0;

      return {
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        rating: r.rating,
        review: r.review,
        isVerifiedPurchase: Boolean(r.isVerifiedPurchase),
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
        product: p
          ? {
              id: p._id.toString(),
              name: p.name,
              slug: p.slug,
              category: p.category,
              price: effectivePrice,
              image: p.images?.[0] || "",
              rating: typeof p.rating === "number" ? p.rating : 0,
              reviewCount: typeof p.reviewCount === "number" ? p.reviewCount : 0,
            }
          : null,
      };
    });

    const totalPages = Math.ceil(totalFiltered / limit) || 1;

    return {
      reviews,
      pagination: {
        page,
        limit,
        totalFiltered,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats: {
        total: totalAll,
        averageRating: overallAvgRating,
        countsByRating,
      },
    };
  } catch (error) {
    console.error("Error in getAllReviewsForAdmin:", error);
    return {
      reviews: [],
      pagination: {
        page: 1,
        limit: 8,
        totalFiltered: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      stats: { total: 0, averageRating: 0, countsByRating: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
    };
  }
}

