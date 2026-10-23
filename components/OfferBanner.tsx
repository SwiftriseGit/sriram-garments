import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { IOfferBannerConfig } from "@/lib/models/BannerSettings";

interface OfferBannerProps {
  data?: IOfferBannerConfig;
}

const DEFAULT_COUPONS = [
  { discount: "10%", minOrder: "₹1499", code: "SR10" },
  { discount: "15%", minOrder: "₹2499", code: "SR15" },
  { discount: "20%", minOrder: "₹3999", code: "SR20" },
];

export default function OfferBanner({ data }: OfferBannerProps) {
  const tagline = data?.tagline || "Special Offer";
  const title = data?.title || "BUY 2 GET 1";
  const titleHighlight = data?.titleHighlight || "FREE";
  const description = data?.description || "On T-Shirts & Casual Wear";
  const buttonText = data?.buttonText || "Shop Now";
  const buttonLink = data?.buttonLink || "/collections";
  const coupons =
    data?.coupons && data.coupons.length > 0 ? data.coupons : DEFAULT_COUPONS;

  return (
    <section className="max-w-335 mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6">
      <div className="bg-linear-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-6 p-5 sm:p-6 md:p-8 lg:p-10">
          {/* Left — Offer Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-white/80 uppercase mb-1">
              {tagline}
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {title}{" "}
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {titleHighlight}
              </span>
            </h3>
            <p className="text-white/90 text-xs sm:text-sm mt-2">
              {description}
            </p>
            <Link href={buttonLink} className="inline-block">
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-5 sm:px-6 h-8 sm:h-9 text-[12px] sm:text-[13px] font-semibold mt-3 sm:mt-4 gap-1.5 border-none cursor-pointer">
                {buttonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Right — Coupon Cards (Dynamic 1, 2, or max 3 cards) */}
          <div className="flex flex-wrap justify-center items-stretch gap-2.5 sm:gap-3.5">
            {coupons.map((coupon, idx) => {
              const displayDiscount = coupon.discount.toUpperCase().includes("OFF")
                ? coupon.discount
                : `${coupon.discount} OFF`;

              return (
                <div
                  key={`${coupon.code}-${idx}`}
                  className="bg-white rounded-lg sm:rounded-xl w-28.75 sm:w-33.75 md:w-37.5 overflow-hidden shadow-sm flex flex-col justify-between transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div className="p-2.5 sm:p-3 pb-2 sm:pb-2.5 text-center relative">
                    {/* Small orange % badge */}
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-orange-100 rounded-md flex items-center justify-center">
                      <span className="text-[8px] sm:text-[9px] font-semibold text-orange-500">
                        %
                      </span>
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-zinc-500 font-medium uppercase tracking-wide">
                      Extra
                    </p>
                    <p className="text-base sm:text-lg md:text-xl font-extrabold text-orange-500 leading-tight">
                      {displayDiscount}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5">
                      on orders above
                    </p>
                    <p className="font-semibold text-xs sm:text-sm text-zinc-900">
                      {coupon.minOrder}
                    </p>
                  </div>
                  <div className="border-t border-dashed border-zinc-200 bg-zinc-50/50 px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                    <p className="text-[10px] sm:text-[11px] text-zinc-600">
                      Code:{" "}
                      <span className="font-bold text-zinc-900 tracking-wider">
                        {coupon.code}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
