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

  // Mode 1: Full Graphic Banner (when admin uploaded a full landscape banner image)
  if (bannerType === "full" && imageUrl) {
    return (
      <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6">
        <Link
          href={buttonLink}
          className="group block relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-sm border border-zinc-200/50 bg-zinc-100 focus:outline-none"
        >
          {/* Responsive aspect ratio: 16/9 on mobile, 21/8 on tablet, 3/1 on desktop */}
          <div className="relative w-full aspect-[16/7] sm:aspect-[21/8] md:aspect-[3/1] min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
            <Image
              src={imageUrl}
              alt={`${tagline} - ${title} ${discountText}`}
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

  // Mode 2: Split Content Banner (with uploaded image or styled graphic backdrop)
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6">
      <div className="bg-[#fcf5eb] rounded-xl sm:rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between min-h-[200px] sm:min-h-[230px] border border-orange-100/80 shadow-sm">
        {/* Left Side (Image or Visual Frame) */}
        <div className="w-full md:w-[36%] h-[160px] sm:h-[190px] md:h-full min-h-[180px] md:min-h-[230px] relative overflow-hidden bg-gradient-to-tr from-orange-100 via-amber-100 to-orange-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Season Sale Visual"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 36vw"
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

        {/* Center Content */}
        <div className="flex-1 py-6 sm:py-8 px-5 sm:px-7 text-center md:text-left z-10 flex flex-col items-center md:items-start justify-center">
          <h4 className="text-zinc-500 font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-1">
            {tagline}
          </h4>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-zinc-900 leading-none tracking-tight">
            {title} <span className="text-orange-500">{discountText}</span>
          </h2>
          <p className="text-zinc-600 text-[13px] sm:text-[15px] font-medium mt-2">
            {description}
          </p>
          <Link href={buttonLink} className="inline-block">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6 sm:px-7 h-9 sm:h-10 text-[12px] sm:text-[13px] font-semibold mt-4 sm:mt-5 gap-1.5 border-none w-fit cursor-pointer">
              {buttonText}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Right Side (Stamp / Badge on Desktop) */}
        <div className="w-full md:w-[26%] h-auto md:h-full relative hidden md:flex items-center justify-center p-6">
          <div className="bg-[#f9e9d6] w-24 h-24 lg:w-28 lg:h-28 rounded-full flex flex-col items-center justify-center text-center p-2.5 shadow-sm border border-orange-200/60 hover:scale-105 transition-transform">
            <p className="text-[9px] lg:text-[10px] font-bold text-zinc-800 leading-[1.25] tracking-wider uppercase">
              {badgeText.split(" ").slice(0, 2).join(" ")}
              <br />
              {badgeText.split(" ").slice(2, 3).join(" ")}
              <br />
              {badgeText.split(" ").slice(3).join(" ") || "Prices"}
            </p>
            <div className="w-3 lg:w-4 h-0.5 bg-orange-500 mt-1.5 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
