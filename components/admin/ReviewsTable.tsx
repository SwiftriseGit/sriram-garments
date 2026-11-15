"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Trash2,
  ExternalLink,
  Edit,
  CheckCircle2,
  Star,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";
import { getCustomerInitials, getAvatarColor } from "@/lib/utils/initials";
import { formatPrice } from "@/lib/format";
import { deleteReviewAction } from "@/actions/reviews";
import type { AdminReviewItem, AdminReviewPagination } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

interface ReviewsTableProps {
  initialReviews: AdminReviewItem[];
  pagination: AdminReviewPagination;
  stats: {
    total: number;
    averageRating: number;
    countsByRating: Record<number, number>;
  };
  currentSearch?: string;
  currentRating?: number;
  productId?: string;
}

export default function ReviewsTable({
  initialReviews,
  pagination,
  stats,
  currentSearch = "",
  currentRating,
  productId,
}: ReviewsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [reviews, setReviews] = useState<AdminReviewItem[]>(initialReviews);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Sync state whenever server re-renders with new props from URL navigation
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Push new query parameters to trigger server component re-fetch
  const updateQuery = (params: { q?: string; rating?: number | null; page?: number }) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (params.q !== undefined) {
      if (params.q.trim()) nextParams.set("q", params.q.trim());
      else nextParams.delete("q");
    }

    if (params.rating !== undefined) {
      if (params.rating !== null && params.rating >= 1 && params.rating <= 5) {
        nextParams.set("rating", String(params.rating));
      } else {
        nextParams.delete("rating");
      }
    }

    if (params.page !== undefined) {
      if (params.page > 1) nextParams.set("page", String(params.page));
      else nextParams.delete("page");
    }

    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ q: searchInput, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateQuery({ q: "", page: 1 });
  };

  const handleRatingSelect = (star: number | null) => {
    const newRating = currentRating === star ? null : star;
    updateQuery({ rating: newRating, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    updateQuery({ page: newPage });
  };

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
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Something went wrong while deleting");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const hasActiveFilters = Boolean(currentSearch || currentRating !== undefined);

  return (
    <div className="space-y-6 relative">
      {/* ── Search & Star Filters (Server Request on Change) ── */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Server Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search customer, product, or comment..."
              className="w-full pl-10 pr-16 py-2.5 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Server Rating Pills Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Rating:
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleRatingSelect(null)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer disabled:opacity-60",
                currentRating === undefined
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-2xs"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              )}
            >
              All ({stats.total})
            </button>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.countsByRating[star] || 0;
              const isSelected = currentRating === star;
              return (
                <button
                  type="button"
                  key={star}
                  disabled={isPending}
                  onClick={() => handleRatingSelect(star)}
                  className={cn(
                    "px-2.5 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all cursor-pointer disabled:opacity-60",
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

        {/* Filter Summary & Server Loading Indicator */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            <span>
              Showing {reviews.length} of {pagination.totalFiltered} filtered reviews
              {hasActiveFilters && " (Filtered on server)"}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => updateQuery({ q: "", rating: null, page: 1 })}
                className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {isPending && (
            <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching from database...</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews Cards List ── */}
      {reviews.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-900 text-base">
            No customer reviews found
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
            {hasActiveFilters
              ? "No reviews match your current server search/filter parameters."
              : "No customer reviews exist in the database yet."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => updateQuery({ q: "", rating: null, page: 1 })}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((item) => {
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

      {/* ── Server-Side Pagination Bar ── */}
      {pagination.totalPages > 1 && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500 font-medium">
            Page <strong className="text-zinc-900">{pagination.page}</strong> of{" "}
            <strong className="text-zinc-900">{pagination.totalPages}</strong> (
            {pagination.totalFiltered} total reviews)
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
            <button
              type="button"
              disabled={!pagination.hasPrevPage || isPending}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === pagination.page;
              return (
                <button
                  type="button"
                  key={pageNum}
                  disabled={isPending}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center",
                    isCurrent
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              disabled={!pagination.hasNextPage || isPending}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
