import { cacheLife, cacheTag } from "next/cache";
import connectDB from "@/lib/db";
import BannerSettingsModel, {
  DEFAULT_BANNER_SETTINGS,
  IOfferBannerConfig,
  ISeasonSaleBannerConfig,
} from "@/lib/models/BannerSettings";

export interface SerializedBannerSettings {
  offerBanner: IOfferBannerConfig;
  seasonSaleBanner: ISeasonSaleBannerConfig;
}

/**
 * Fetch singleton banner settings.
 * Uses Next.js 16 `"use cache"` with `"catalog"` cacheLife profile and `"banners"` tag.
 * Automatically invalidated on admin save via `updateTag("banners")`.
 */
export async function getBannerSettings(): Promise<SerializedBannerSettings> {
  "use cache";
  cacheLife("catalog");
  cacheTag("banners");

  try {
    await connectDB();
    const doc = await BannerSettingsModel.findOne().lean();

    if (!doc) {
      return JSON.parse(JSON.stringify(DEFAULT_BANNER_SETTINGS));
    }

    return {
      offerBanner: {
        enabled: Boolean(doc.offerBanner?.enabled ?? DEFAULT_BANNER_SETTINGS.offerBanner.enabled),
        tagline: String(doc.offerBanner?.tagline || DEFAULT_BANNER_SETTINGS.offerBanner.tagline),
        title: String(doc.offerBanner?.title || DEFAULT_BANNER_SETTINGS.offerBanner.title),
        titleHighlight: String(
          doc.offerBanner?.titleHighlight || DEFAULT_BANNER_SETTINGS.offerBanner.titleHighlight
        ),
        description: String(
          doc.offerBanner?.description || DEFAULT_BANNER_SETTINGS.offerBanner.description
        ),
        buttonText: String(
          doc.offerBanner?.buttonText || DEFAULT_BANNER_SETTINGS.offerBanner.buttonText
        ),
        buttonLink: String(
          doc.offerBanner?.buttonLink || DEFAULT_BANNER_SETTINGS.offerBanner.buttonLink
        ),
        coupons: Array.isArray(doc.offerBanner?.coupons) && doc.offerBanner.coupons.length > 0
          ? doc.offerBanner.coupons.slice(0, 3).map((c: any) => ({
              discount: String(c.discount || "10%"),
              minOrder: String(c.minOrder || "₹1499"),
              code: String(c.code || "SR10"),
            }))
          : DEFAULT_BANNER_SETTINGS.offerBanner.coupons,
      },
      seasonSaleBanner: {
        enabled: Boolean(doc.seasonSaleBanner?.enabled ?? DEFAULT_BANNER_SETTINGS.seasonSaleBanner.enabled),
        imageUrl: String(doc.seasonSaleBanner?.imageUrl || ""),
        bannerType: (doc.seasonSaleBanner?.bannerType as "full" | "split") || "split",
        tagline: String(
          doc.seasonSaleBanner?.tagline || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.tagline
        ),
        title: String(doc.seasonSaleBanner?.title || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.title),
        discountText: String(
          doc.seasonSaleBanner?.discountText || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.discountText
        ),
        description: String(
          doc.seasonSaleBanner?.description || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.description
        ),
        buttonText: String(
          doc.seasonSaleBanner?.buttonText || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.buttonText
        ),
        buttonLink: String(
          doc.seasonSaleBanner?.buttonLink || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.buttonLink
        ),
        badgeText: String(
          doc.seasonSaleBanner?.badgeText || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.badgeText
        ),
      },
    };
  } catch (error) {
    console.error("Failed to get banner settings:", error);
    return JSON.parse(JSON.stringify(DEFAULT_BANNER_SETTINGS));
  }
}
