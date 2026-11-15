"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";
import { getCustomerInitials, getAvatarColor } from "@/lib/utils/initials";
import type { SerializedReview } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

interface TestimonialsProps {
  reviews?: SerializedReview[];
}

export default function Testimonials({ reviews = [] }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll support
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // If no reviews exist, do not render this section at all
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    // Scroll by width of one card + gap
    const cardWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).offsetWidth + 24
      : 360;

    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  // Mouse drag handlers for natural sliding on desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const stopDragging = () => {
    setIsMouseDown(false);
  };

  return (
    <section className="bg-zinc-50/70 border-y border-zinc-100 py-12 sm:py-16 overflow-hidden">
      <div className="max-w-335 mx-auto px-3 sm:px-4 md:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Customer Love
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              What Our Customers Say
            </h2>
            <div className="w-10 sm:w-12 h-1 bg-orange-500 mt-2 rounded-full" />
          </div>

          {/* Slider Prev/Next Controls */}
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous reviews"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 flex items-center justify-center transition-all bg-white cursor-pointer shadow-2xs",
                canScrollLeft
                  ? "text-zinc-700 hover:text-orange-600 hover:border-orange-500 hover:shadow-xs active:scale-95"
                  : "text-zinc-300 border-zinc-100 cursor-not-allowed opacity-50"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 flex items-center justify-center transition-all bg-white cursor-pointer shadow-2xs",
                canScrollRight
                  ? "text-zinc-700 hover:text-orange-600 hover:border-orange-500 hover:shadow-xs active:scale-95"
                  : "text-zinc-300 border-zinc-100 cursor-not-allowed opacity-50"
              )}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Testimonials Horizontal Slide (3 per view on laptop, natural touch/mouse slide) ── */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className={cn(
            "flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth select-none",
            isMouseDown ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {reviews.map((t) => {
            const initials = getCustomerInitials(t.name);
            const avatarColor = getAvatarColor(t.name);

            return (
              <div
                key={t.id}
                className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.3333%-16px)] shrink-0 snap-start bg-white p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-xs border border-zinc-200/70 transition-all duration-300"
              >
                <div>
                  {/* Avatar & Customer Name Header */}
                  <div className="flex items-center gap-3.5 mb-4">
                    {/* Profile pic initials: 1st letter + 2nd word 1st letter */}
                    <div
                      className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border uppercase tracking-wider",
                        avatarColor.bg
                      )}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-zinc-950 truncate">
                          {t.name}
                        </h4>
                        {t.isVerifiedPurchase && (
                          <span title="Verified Purchase">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <RatingStars rating={t.rating} size="xs" showNumber />
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-normal line-clamp-4">
                    &quot;{t.review}&quot;
                  </p>
                </div>

                {/* Product link if available */}
                {t.productName && t.productSlug && (
                  <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Reviewed for:</span>
                    <Link
                      href={`/products/${t.productSlug}`}
                      className="font-medium text-orange-600 hover:text-orange-700 hover:underline truncate max-w-[200px]"
                    >
                      {t.productName}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
