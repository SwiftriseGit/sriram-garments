"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import BannerSettingsModel, {
  DEFAULT_BANNER_SETTINGS,
  IOfferBannerConfig,
  ISeasonSaleBannerConfig,
} from "@/lib/models/BannerSettings";
import { requireAdmin } from "@/lib/auth/dal";

export interface SerializedBannerSettings {
  offerBanner: IOfferBannerConfig;
  seasonSaleBanner: ISeasonSaleBannerConfig;
}

/**
 * Fetch singleton banner settings. If none exist in the database,
 * returns the default configuration.
 */
export async function getBannerSettings(): Promise<SerializedBannerSettings> {
  try {
    await connectDB();
    const doc = await BannerSettingsModel.findOne().lean();

    if (!doc) {
      return JSON.parse(JSON.stringify(DEFAULT_BANNER_SETTINGS));
    }

    return {
      offerBanner: {
        enabled: doc.offerBanner?.enabled ?? DEFAULT_BANNER_SETTINGS.offerBanner.enabled,
        tagline: doc.offerBanner?.tagline || DEFAULT_BANNER_SETTINGS.offerBanner.tagline,
        title: doc.offerBanner?.title || DEFAULT_BANNER_SETTINGS.offerBanner.title,
        titleHighlight:
          doc.offerBanner?.titleHighlight || DEFAULT_BANNER_SETTINGS.offerBanner.titleHighlight,
        description:
          doc.offerBanner?.description || DEFAULT_BANNER_SETTINGS.offerBanner.description,
        buttonText:
          doc.offerBanner?.buttonText || DEFAULT_BANNER_SETTINGS.offerBanner.buttonText,
        buttonLink:
          doc.offerBanner?.buttonLink || DEFAULT_BANNER_SETTINGS.offerBanner.buttonLink,
        coupons: Array.isArray(doc.offerBanner?.coupons) && doc.offerBanner.coupons.length > 0
          ? doc.offerBanner.coupons.slice(0, 3).map((c: any) => ({
              discount: String(c.discount || "10%"),
              minOrder: String(c.minOrder || "₹1499"),
              code: String(c.code || "SR10"),
            }))
          : DEFAULT_BANNER_SETTINGS.offerBanner.coupons,
      },
      seasonSaleBanner: {
        enabled: doc.seasonSaleBanner?.enabled ?? DEFAULT_BANNER_SETTINGS.seasonSaleBanner.enabled,
        imageUrl: doc.seasonSaleBanner?.imageUrl || "",
        bannerType: (doc.seasonSaleBanner?.bannerType as "full" | "split") || "split",
        tagline:
          doc.seasonSaleBanner?.tagline || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.tagline,
        title: doc.seasonSaleBanner?.title || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.title,
        discountText:
          doc.seasonSaleBanner?.discountText || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.discountText,
        description:
          doc.seasonSaleBanner?.description || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.description,
        buttonText:
          doc.seasonSaleBanner?.buttonText || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.buttonText,
        buttonLink:
          doc.seasonSaleBanner?.buttonLink || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.buttonLink,
        badgeText:
          doc.seasonSaleBanner?.badgeText || DEFAULT_BANNER_SETTINGS.seasonSaleBanner.badgeText,
      },
    };
  } catch (error) {
    console.error("Failed to get banner settings:", error);
    return JSON.parse(JSON.stringify(DEFAULT_BANNER_SETTINGS));
  }
}

/**
 * Update banner settings from Admin panel.
 * Requires admin authentication.
 */
export async function updateBannerSettings(data: {
  offerBanner: IOfferBannerConfig;
  seasonSaleBanner: ISeasonSaleBannerConfig;
}) {
  try {
    await requireAdmin();

    // Validate max 3 coupons
    if (data.offerBanner.coupons.length > 3) {
      return { success: false, error: "Maximum of 3 coupon cards allowed." };
    }

    // Clean & sanitize coupon cards
    const cleanedCoupons = data.offerBanner.coupons.map((c) => ({
      discount: c.discount.trim() || "10%",
      minOrder: c.minOrder.trim() || "₹1499",
      code: c.code.trim().toUpperCase() || "OFFER",
    }));

    await connectDB();

    const updated = await BannerSettingsModel.findOneAndUpdate(
      {},
      {
        $set: {
          offerBanner: {
            ...data.offerBanner,
            coupons: cleanedCoupons,
          },
          seasonSaleBanner: {
            ...data.seasonSaleBanner,
            imageUrl: data.seasonSaleBanner.imageUrl?.trim() || "",
          },
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return {
      success: true,
      settings: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("Failed to update banner settings:", error);
    return {
      success: false,
      error: error.message || "Failed to save banner settings",
    };
  }
}
