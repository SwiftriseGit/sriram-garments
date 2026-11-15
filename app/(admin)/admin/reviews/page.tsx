import { requireAdmin } from "@/lib/auth/dal";
import { getAllReviewsForAdmin } from "@/lib/data/reviews";
import ReviewsTable from "@/components/admin/ReviewsTable";
import { MessageSquare, Star, Sparkles, ShieldCheck } from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";

export const instant = false;

export default async function AdminReviewsPage() {
  await requireAdmin();

  const { reviews, stats } = await getAllReviewsForAdmin();

  const fiveStarCount = stats.countsByRating[5] || 0;
  const fiveStarPercent =
    stats.total > 0 ? Math.round((fiveStarCount / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            Review feedback, inspect linked product details, and remove inappropriate entries.
          </p>
        </div>
      </div>

      {/* ── Top Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Reviews */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Total Reviews
            </span>
            <span className="text-2xl font-black text-zinc-950 mt-0.5 block">
              {stats.total}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              Across all catalog products
            </span>
          </div>
        </div>

        {/* Store Average Rating */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Average Rating
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-zinc-950">
                {stats.averageRating.toFixed(1)}
              </span>
              <RatingStars rating={stats.averageRating} size="xs" />
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">
              Out of 5.0 maximum
            </span>
          </div>
        </div>

        {/* 5-Star Rating Share */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              5-Star Satisfaction
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
              {fiveStarPercent}%
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              {fiveStarCount} perfect reviews
            </span>
          </div>
        </div>
      </div>

      {/* ── Reviews Table & Moderation Actions ── */}
      <ReviewsTable initialReviews={reviews} stats={stats} />
    </div>
  );
}
