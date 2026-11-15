"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const SIZE_CONFIGS = {
  xs: { star: "w-3 h-3", text: "text-[10px]" },
  sm: { star: "w-3.5 h-3.5", text: "text-xs" },
  md: { star: "w-4 h-4", text: "text-sm" },
  lg: { star: "w-6 h-6", text: "text-base" },
};

export default function RatingStars({
  rating = 0,
  maxStars = 5,
  size = "sm",
  showNumber = false,
  reviewCount,
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;
  const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.sm;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined}>
        {Array.from({ length: maxStars }, (_, i) => {
          const starNumber = i + 1;

          // For interactive mode: whole stars on hover / click
          if (interactive) {
            const isFilled = activeRating >= starNumber;
            return (
              <button
                type="button"
                key={i}
                role="radio"
                aria-checked={rating === starNumber}
                aria-label={`${starNumber} out of ${maxStars} stars`}
                onClick={() => onChange?.(starNumber)}
                onMouseEnter={() => setHoverRating(starNumber)}
                onMouseLeave={() => setHoverRating(null)}
                className="cursor-pointer transition-transform hover:scale-115 p-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
              >
                <Star
                  className={cn(
                    config.star,
                    "transition-colors",
                    isFilled
                      ? "fill-amber-400 text-amber-400 drop-shadow-2xs"
                      : "fill-transparent text-zinc-300 hover:text-amber-300"
                  )}
                />
              </button>
            );
          }

          // Non-interactive display mode: exact fractional rendering
          const fillFraction = Math.max(0, Math.min(1, activeRating - i));

          return (
            <span key={i} className={cn("relative inline-block", config.star)}>
              {/* Base empty / background star */}
              <Star
                className={cn(config.star, "fill-zinc-200 text-zinc-200 stroke-none absolute inset-0")}
              />
              {/* Exact fractional overlay star */}
              {fillFraction > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${Math.round(fillFraction * 100)}%` }}
                >
                  <Star
                    className={cn(
                      config.star,
                      "fill-amber-400 text-amber-400 stroke-none shrink-0"
                    )}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Optional exact numeric rating display */}
      {showNumber && (
        <span className={cn("font-semibold text-zinc-900 leading-none", config.text)}>
          {rating > 0 ? rating.toFixed(1) : "0.0"}
        </span>
      )}

      {/* Optional review count display */}
      {reviewCount !== undefined && (
        <span className={cn("text-zinc-500 font-medium leading-none", config.text)}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

