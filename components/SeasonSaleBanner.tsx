import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ISeasonSaleBannerConfig } from "@/lib/models/BannerSettings";

interface SeasonSaleBannerProps {
  data?: ISeasonSaleBannerConfig;
}

export default function SeasonSaleBanner({ data }: SeasonSaleBannerProps) {
  const imageUrl = data?.imageUrl?.trim() || "";
  const bannerType = data?.bannerType || (imageUrl ? "full" : "split");
  const tagline = data?.tagline || "Season Sale";
  const title = data?.title || "FLAT";
  const discountText = data?.discountText || "30% OFF";
  const description = data?.description || "On Selected Garments";
  const buttonText = data?.buttonText || "Shop Now";
  const buttonLink = data?.buttonLink || "/collections";
  const badgeText = data?.badgeText || "Good Style Better Prices";

  // Mode 1: Full Graphic Banner (Panoramic artwork containing its own text/graphics)
  if (bannerType === "full") {
    if (!imageUrl) return null;

    return (
      <section className="max-w-335 mx-auto px-3 sm:px-4 md:px-8 py-3 sm:py-5">
        <Link
          href={buttonLink}
          className="group block relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xs border border-zinc-200/60 bg-zinc-100 focus:outline-none"
        >
          {/* Responsive aspect ratio: 16/7 on mobile, 21/8 on tablet, 3/1 on desktop */}
          <div className="relative w-full aspect-16/7 sm:aspect-21/8 md:aspect-3/1 min-h-36 sm:min-h-48 lg:min-h-56">
            <Image
              src={imageUrl}
              alt="Season Promotional Banner"
              fill
              className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1340px"
              priority={false}
            />
          </div>
        </Link>
      </section>
    );
  }

  // Mode 2: Split Content Banner (Image Left, Details & Button Right)
  return (
    <section className="max-w-335 mx-auto px-3 sm:px-4 md:px-8 py-3 sm:py-5">
      <div className="bg-[#fcf5eb] rounded-xl sm:rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between min-h-50 sm:min-h-56 border border-orange-100/80 shadow-xs">
        {/* Left Side (Image Asset or Fallback Graphic) */}
        <div className="w-full md:w-[38%] h-48 sm:h-56 md:h-full min-h-44 md:min-h-56 relative overflow-hidden bg-linear-to-tr from-orange-100 via-amber-100 to-orange-50 shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${tagline} ${title}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 38vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-950/60 p-4 text-center">
              <span className="text-3xl sm:text-4xl mb-1">✨</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-800">
                Exclusive Collection
              </span>
              <span className="text-[11px] text-orange-700/70 mt-0.5">
                Limited Time Promo
              </span>
            </div>
          )}
        </div>

        {/* Right Side (Content Details & Action) */}
        <div className="flex-1 py-5 sm:py-7 px-4 sm:px-7 text-center md:text-left z-10 flex flex-col items-center md:items-start justify-center">
          <h4 className="text-zinc-500 font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-1">
            {tagline}
          </h4>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold text-zinc-900 leading-tight tracking-tight">
            {title} <span className="text-orange-500">{discountText}</span>
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm font-medium mt-1.5 max-w-md">
            {description}
          </p>
          <Link href={buttonLink} className="inline-block">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-5 sm:px-6 h-8.5 sm:h-9.5 text-xs sm:text-sm font-semibold mt-3.5 sm:mt-4.5 gap-1.5 border-none w-fit cursor-pointer">
              {buttonText}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Far Right Badge (Desktop Accent) */}
        {badgeText && (
          <div className="w-full md:w-[22%] h-auto md:h-full relative hidden lg:flex items-center justify-center p-5 shrink-0">
            <div className="bg-[#f9e9d6] w-20 h-20 xl:w-24 xl:h-24 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-xs border border-orange-200/60 hover:scale-105 transition-transform">
              <p className="text-[9px] font-bold text-zinc-800 leading-tight tracking-wider uppercase">
                {badgeText.split(" ").slice(0, 2).join(" ")}
                <br />
                {badgeText.split(" ").slice(2, 3).join(" ")}
                <br />
                {badgeText.split(" ").slice(3).join(" ") || "Prices"}
              </p>
              <div className="w-3 h-0.5 bg-orange-500 mt-1 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
