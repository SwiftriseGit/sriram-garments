import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { getBannerSettings } from "@/actions/banners";
import BannerManagementForm from "@/components/admin/BannerManagementForm";

export const metadata: Metadata = {
  title: "Banners & Offers Management — SriRam Garments Admin",
  description: "Configure dynamic homepage promotional banners, discount coupons, and seasonal sales.",
};

export const instant = false;

export default async function AdminBannersPage() {
  await requireAdmin();
  const bannerSettings = await getBannerSettings();

  return <BannerManagementForm initialSettings={bannerSettings} />;
}
