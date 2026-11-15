"use server";

import { revalidatePath, updateTag, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import ReviewModel from "@/lib/models/Review";
import ProductModel from "@/lib/models/Product";
import UserModel from "@/lib/models/User";
import OrderModel from "@/lib/models/Order";
import { getOptionalSession, requireAdmin } from "@/lib/auth/dal";
import { recalculateProductRating } from "@/lib/data/reviews";

export interface ReviewSubmitInput {
  productId: string;
  rating: number;
  review: string;
  name?: string;
  email?: string;
}

export interface ReviewSubmitResult {
  success: boolean;
  message?: string;
  error?: string;
  review?: {
    id: string;
    productId: string;
    name: string;
    email: string;
    rating: number;
    review: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
  };
}

export async function submitReviewAction(
  data: ReviewSubmitInput
): Promise<ReviewSubmitResult> {
  try {
    await connectDB();

    const { productId, rating, review } = data;

    if (!productId) {
      return { success: false, error: "Product ID is missing." };
    }

    // 1. Rating validation (1 to 5)
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return { success: false, error: "Please select a star rating between 1 and 5." };
    }

    // 2. Review text validation
    const trimmedReview = (review || "").trim();
    if (!trimmedReview || trimmedReview.length < 4) {
      return { success: false, error: "Please enter a review comment (minimum 4 characters)." };
    }

    // 3. Find product
    let productDoc: any = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      productDoc = await ProductModel.findById(productId);
    }
    if (!productDoc) {
      productDoc = await ProductModel.findOne({ slug: productId });
    }
    if (!productDoc) {
      return { success: false, error: "Product could not be found." };
    }

    // 4. Determine user identity (Logged in vs Guest)
    const session = await getOptionalSession();
    let authorName = (data.name || "").trim();
    let authorEmail = (data.email || "").trim().toLowerCase();
    let authorUserId: mongoose.Types.ObjectId | null = null;
    let isVerifiedPurchase = false;

    if (session?.userId) {
      authorUserId = new mongoose.Types.ObjectId(session.userId);
      const user = await UserModel.findById(session.userId).lean();
      if (user) {
        authorName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || session.firstName;
        authorEmail = user.email || session.email;
      } else {
        authorName = session.firstName;
        authorEmail = session.email;
      }

      // Check if user has purchased this product
      try {
        const matchingOrder = await OrderModel.findOne({
          userId: authorUserId,
          "items.name": productDoc.name,
          status: { $in: ["delivered", "shipped", "confirmed"] },
        }).lean();
        if (matchingOrder) {
          isVerifiedPurchase = true;
        }
      } catch (e) {
        // Non-critical check
      }
    } else {
      // Guest validation
      if (!authorName || authorName.length < 2) {
        return { success: false, error: "Please provide your full name." };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!authorEmail || !emailRegex.test(authorEmail)) {
        return { success: false, error: "Please provide a valid email address." };
      }
    }

    // 5. Create Review document
    const newReview = await ReviewModel.create({
      productId: productDoc._id,
      userId: authorUserId,
      name: authorName,
      email: authorEmail,
      rating: numRating,
      review: trimmedReview,
      isVerifiedPurchase,
      isPublished: true,
    });

    // 6. Recalculate product's exact average rating and reviewCount
    await recalculateProductRating(productDoc._id);

    // 7. Revalidate Next.js cache
    try {
      updateTag("reviews");
      updateTag("products");
    } catch (e) {
      // Fallback
    }
    revalidatePath(`/products/${productDoc.slug}`);
    revalidatePath("/collections");
    revalidatePath("/");

    return {
      success: true,
      message: "Your review has been submitted successfully!",
      review: {
        id: newReview._id.toString(),
        productId: productDoc._id.toString(),
        name: newReview.name,
        email: newReview.email,
        rating: newReview.rating,
        review: newReview.review,
        isVerifiedPurchase: newReview.isVerifiedPurchase,
        createdAt: newReview.createdAt.toISOString(),
      },
    };
  } catch (err: any) {
    console.error("submitReviewAction error:", err);
    return {
      success: false,
      error: err.message || "Failed to submit your review. Please try again.",
    };
  }
}

/**
 * Delete a customer review. Admin only.
 * Automatically recalculates product rating & review count and updates cache.
 */
export async function deleteReviewAction(
  reviewIdOrFormData: string | FormData
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await requireAdmin();

    const reviewId =
      typeof reviewIdOrFormData === "string"
        ? reviewIdOrFormData
        : String(
            reviewIdOrFormData.get("id") ||
              reviewIdOrFormData.get("reviewId") ||
              ""
          );

    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return { success: false, error: "Invalid review ID." };
    }

    await connectDB();
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return { success: false, error: "Review could not be found." };
    }

    const productId = review.productId;
    await ReviewModel.findByIdAndDelete(reviewId);

    // Recalculate average fraction rating & reviewCount for this product
    await recalculateProductRating(productId);

    try {
      updateTag("reviews");
      updateTag("products");
    } catch (e) {
      // Ignored in non-cache contexts
    }

    const product = await ProductModel.findById(productId).select("slug").lean();
    if (product) {
      revalidatePath(`/products/${product.slug}`);
      revalidatePath(`/admin/products/${product._id}`);
    }
    revalidatePath("/admin/reviews");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      message: "Review deleted successfully.",
    };
  } catch (err: any) {
    console.error("deleteReviewAction error:", err);
    return {
      success: false,
      error: err.message || "Failed to delete review. Please try again.",
    };
  }
}

