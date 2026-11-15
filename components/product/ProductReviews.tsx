"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2, MessageSquare, PenLine, Sparkles, UserCheck } from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";
import { getCustomerInitials, getAvatarColor } from "@/lib/utils/initials";
import { submitReviewAction } from "@/actions/reviews";
import type { SerializedReview, ReviewSummary } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

interface ReviewFormData {
  name?: string;
  email?: string;
  rating: number;
  review: string;
}

interface ProductReviewsProps {
  productId: string;
  productSlug: string;
  productName: string;
  initialReviews: SerializedReview[];
  summary: ReviewSummary;
  currentUser?: {
    userId: string;
    email: string;
    firstName: string;
  } | null;
}

export default function ProductReviews({
  productId,
  productSlug,
  productName,
  initialReviews = [],
  summary: initialSummary,
  currentUser = null,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<SerializedReview[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recalculate live summary when reviews change
  const totalCount = reviews.length;
  const avgRating =
    totalCount > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10) / 10
      : 0;

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    distribution[star] = (distribution[star] || 0) + 1;
  }

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      name: currentUser ? currentUser.firstName : "",
      email: currentUser ? currentUser.email : "",
      rating: 5,
      review: "",
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!data.rating || data.rating < 1) {
      toast.error("Please click to choose a star rating (1 to 5 stars).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitReviewAction({
        productId,
        rating: Number(data.rating),
        review: data.review,
        name: currentUser ? currentUser.firstName : data.name,
        email: currentUser ? currentUser.email : data.email,
      });

      if (!res.success || !res.review) {
        toast.error(res.error || "Failed to submit review.");
        return;
      }

      toast.success(res.message || "Thank you! Your review has been added.");

      // Optimistically add to state
      const createdReview: SerializedReview = {
        id: res.review.id,
        productId: res.review.productId,
        name: res.review.name,
        email: res.review.email,
        rating: res.review.rating,
        review: res.review.review,
        isVerifiedPurchase: res.review.isVerifiedPurchase,
        createdAt: res.review.createdAt,
      };

      setReviews((prev) => [createdReview, ...prev]);
      reset({
        name: currentUser ? currentUser.firstName : "",
        email: currentUser ? currentUser.email : "",
        rating: 5,
        review: "",
      });
      setIsFormOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong while posting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="scroll-mt-24 pt-10 sm:pt-14 mt-12 sm:mt-16 border-t border-zinc-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Customer Feedback
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-950 tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real opinions from customers who wear {productName}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-orange-500/20 cursor-pointer self-start sm:self-auto"
        >
          <PenLine className="w-4 h-4" />
          {isFormOpen ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      {/* ── Summary & Breakdown Card ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-zinc-50/80 rounded-2xl p-6 sm:p-8 border border-zinc-200/80 mb-8 sm:mb-10">
        {/* Overall Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-zinc-200/70 shadow-2xs">
          <span className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-none mb-2">
            {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
          </span>
          <RatingStars rating={avgRating} size="md" className="mb-2" />
          <p className="text-xs sm:text-sm font-semibold text-zinc-700">
            {totalCount > 0 ? `Based on ${totalCount} ${totalCount === 1 ? "review" : "reviews"}` : "No reviews yet"}
          </p>
          <span className="text-[11px] text-zinc-400 mt-0.5">
            100% authentic verified experiences
          </span>
        </div>

        {/* Star Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-zinc-700 flex items-center gap-1 justify-end">
                  {star} <span className="text-amber-500">★</span>
                </span>
                <div className="flex-1 h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-14 text-right text-zinc-400 font-mono text-[11px]">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Review Form (Collapsible / Dynamic) ── */}
      {isFormOpen && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 sm:p-8 shadow-md mb-10 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
            <div>
              <h3 className="font-bold text-zinc-900 text-base sm:text-lg">
                Share your honest thoughts
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Tell us about sizing, fabric feel, drape, and overall quality.
              </p>
            </div>
            {currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5" />
                Logged in as {currentUser.firstName}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* If NOT logged in, ask for Full Name and Email */}
            {!currentUser && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Full name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                    placeholder="e.g. Sunil Maharana"
                    className={cn(
                      "w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden transition-all",
                      errors.name ? "border-red-400 bg-red-50/20" : "border-zinc-200"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    placeholder="name@example.com"
                    className={cn(
                      "w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden transition-all",
                      errors.email ? "border-red-400 bg-red-50/20" : "border-zinc-200"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Clickable Star Rating (not in input, user chooses by on click) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Rating <span className="text-red-500">*</span>{" "}
                <span className="text-zinc-400 font-normal">(Click on the stars to rate)</span>
              </label>
              <Controller
                name="rating"
                control={control}
                rules={{ required: "Please select a star rating" }}
                render={({ field }) => (
                  <div className="flex items-center gap-3 py-1">
                    <RatingStars
                      rating={field.value}
                      interactive={true}
                      size="lg"
                      onChange={(newRating) => field.onChange(newRating)}
                    />
                    <span className="text-xs font-bold text-zinc-700">
                      {field.value === 5 && "5 / 5 - Excellent!"}
                      {field.value === 4 && "4 / 5 - Very Good"}
                      {field.value === 3 && "3 / 5 - Average"}
                      {field.value === 2 && "2 / 5 - Below Average"}
                      {field.value === 1 && "1 / 5 - Poor"}
                    </span>
                  </div>
                )}
              />
              {errors.rating && (
                <p className="mt-1 text-xs text-red-600">{errors.rating.message}</p>
              )}
            </div>

            {/* Review Comment Textarea */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                {...register("review", {
                  required: "Please write a review comment",
                  minLength: {
                    value: 4,
                    message: "Review comment must be at least 4 characters long",
                  },
                })}
                placeholder="What did you like or dislike about this product? How did the fabric feel and fit?"
                className={cn(
                  "w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden transition-all",
                  errors.review ? "border-red-400 bg-red-50/20" : "border-zinc-200"
                )}
              />
              {errors.review && (
                <p className="mt-1 text-xs text-red-600">{errors.review.message}</p>
              )}
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-orange-500/20 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Reviews List ── */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 px-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base">
              No reviews yet for {productName}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
              Be the first customer to share your thoughts and help others make a confident decision!
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold shadow-xs hover:bg-orange-600 transition-colors cursor-pointer"
            >
              <PenLine className="w-3.5 h-3.5" />
              Write the First Review
            </button>
          </div>
        ) : (
          reviews.map((r) => {
            const initials = getCustomerInitials(r.name);
            const avatarColor = getAvatarColor(r.name);
            const formattedDate = new Date(r.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={r.id}
                className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Profile avatar: first letter + second word 1st letter (if exits) */}
                    <div
                      className={cn(
                        "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border uppercase tracking-wider",
                        avatarColor.bg
                      )}
                      aria-label={r.name}
                    >
                      {initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-zinc-950">
                          {r.name}
                        </h4>
                        {r.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <RatingStars rating={r.rating} size="sm" />
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal pl-0 sm:pl-14">
                  {r.review}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

