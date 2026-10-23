"use server";

import { revalidatePath, updateTag, revalidateTag } from "next/cache";
import connectDB from "@/lib/db";
import BannerSettingsModel, {
  IOfferBannerConfig,
  ISeasonSaleBannerConfig,
} from "@/lib/models/BannerSettings";
import { requireAdmin } from "@/lib/auth/dal";


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

    // Invalidate Next.js 16 cache tag & revalidate paths
    try {
      updateTag("banners");
    } catch {}
    try {
      revalidateTag("banners", "max");
    } catch {}
    revalidatePath("/", "layout");
    revalidatePath("/admin/banners", "page");

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
