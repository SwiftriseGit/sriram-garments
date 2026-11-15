"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Search,
  Trash2,
  ExternalLink,
  Edit,
  CheckCircle2,
  Star,
  MessageSquare,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";
import { getCustomerInitials, getAvatarColor } from "@/lib/utils/initials";
import { formatPrice } from "@/lib/format";
import { deleteReviewAction } from "@/actions/reviews";
import type { AdminReviewItem } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

interface ReviewsTableProps {
  initialReviews: AdminReviewItem[];
  stats: {
    total: number;
    averageRating: number;
    countsByRating: Record<number, number>;
  };
}

export default function ReviewsTable({
  initialReviews,
  stats,
}: ReviewsTableProps) {
  const [reviews, setReviews] = useState<AdminReviewItem[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter reviews locally for immediate responsiveness
  const filteredReviews = reviews.filter((r) => {
    // Rating filter
    if (selectedRating !== null && Math.round(r.rating) !== selectedRating) {
      return false;
    }
    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchCustomer =
        r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
      const matchReview = r.review.toLowerCase().includes(q);
      const matchProduct = r.product
        ? r.product.name.toLowerCase().includes(q) ||
          r.product.category.toLowerCase().includes(q)
        : false;
      return matchCustomer || matchReview || matchProduct;
    }
    return true;
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      try {
        const res = await deleteReviewAction(id);
        if (!res.success) {
          toast.error(res.error || "Failed to delete review");
          return;
        }

        toast.success("Review deleted successfully");
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setConfirmDeleteId(null);
      } catch (err: any) {
        toast.error(err.message || "Something went wrong while deleting");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Search & Star Filters ── */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, product, or review text..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
            />
          </div>

          {/* Rating Pills Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-zinc-500 mr-1">
              Filter by rating:
            </span>
            <button
              type="button"
              onClick={() => setSelectedRating(null)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer",
                selectedRating === null
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-2xs"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              )}
            >
              All ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.countsByRating[star] || 0;
              const isSelected = selectedRating === star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSelectedRating(isSelected ? null : star)}
                  className={cn(
                    "px-2.5 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all cursor-pointer",
                    isSelected
                      ? "bg-amber-500 border-amber-500 text-white shadow-2xs"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  )}
                >
                  <span>{star}</span>
                  <Star
                    className={cn(
                      "w-3 h-3",
                      isSelected
                        ? "fill-white text-white"
                        : "fill-amber-400 text-amber-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] ml-0.5",
                      isSelected ? "text-amber-100" : "text-zinc-400"
                    )}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Reviews Cards List ── */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-900 text-base">
            No customer reviews found
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            {searchTerm || selectedRating !== null
              ? "Try adjusting your search query or rating filter."
              : "No reviews have been posted by customers yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((item) => {
            const initials = getCustomerInitials(item.name);
            const avatarColor = getAvatarColor(item.name);
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recent";

            const isDeleting = deletingId === item.id;
            const isConfirming = confirmDeleteId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
              >
                {/* Top Row: Product Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                  {/* Product Details */}
                  {item.product ? (
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl border border-zinc-200 overflow-hidden shrink-0 bg-zinc-50 relative">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                            {item.product.category.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-950 hover:text-indigo-600 truncate transition-colors">
                            {item.product.name}
                          </span>
                          <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md capitalize">
                            {item.product.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                          <span className="font-semibold text-zinc-700">
                            {formatPrice(item.product.price)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <strong className="text-zinc-700">
                              {item.product.rating.toFixed(1)}
                            </strong>{" "}
                            ({item.product.reviewCount} total reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-400 italic">
                      Product no longer in database
                    </div>
                  )}

                  {/* Product Links & Delete Action (Admin can delete review ONLY) */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {item.product && (
                      <>
                        <Link
                          href={`/products/${item.product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on Storefront"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View in Store</span>
                        </Link>
                        <Link
                          href={`/admin/products/${item.product.id}`}
                          title="Edit Product"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Product</span>
                        </Link>
                      </>
                    )}

                    {/* Delete Review Button Only */}
                    {isConfirming ? (
                      <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-xl">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          <span>Confirm</span>
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                        title="Delete Review (Admin Only)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Middle Row: Customer Info & Rating */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Initials Avatar */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border uppercase tracking-wider",
                        avatarColor.bg
                      )}
                    >
                      {initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-zinc-900">
                          {item.name}
                        </span>
                        <span className="text-xs text-zinc-400">
                          ({item.email})
                        </span>
                        {item.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        Reviewed on {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                    <RatingStars rating={item.rating} size="sm" />
                    <span className="text-xs font-bold text-zinc-900">
                      {item.rating} / 5
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Customer Feedback Comment */}
                <div className="bg-zinc-50/70 border border-zinc-100 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
                  &quot;{item.review}&quot;
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
