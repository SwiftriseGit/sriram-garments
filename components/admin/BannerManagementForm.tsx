"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Sparkles,
  TicketPercent,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  Upload,
  Info,
  Layers,
  Smartphone,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { updateBannerSettings } from "@/actions/banners";
import {
  IOfferBannerConfig,
  ISeasonSaleBannerConfig,
  ICouponCard,
} from "@/lib/models/BannerSettings";
import { getUploadUrl } from "@/actions/r2";

interface BannerManagementFormProps {
  initialSettings: {
    offerBanner: IOfferBannerConfig;
    seasonSaleBanner: ISeasonSaleBannerConfig;
  };
}

export default function BannerManagementForm({
  initialSettings,
}: BannerManagementFormProps) {
  const [isPending, startTransition] = useTransition();
  const [offerBanner, setOfferBanner] = useState<IOfferBannerConfig>(
    initialSettings.offerBanner
  );
  const [seasonSaleBanner, setSeasonSaleBanner] = useState<ISeasonSaleBannerConfig>(
    initialSettings.seasonSaleBanner
  );
  const [activeTab, setActiveTab] = useState<"offer" | "season">("offer");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isUploading, setIsUploading] = useState(false);

  // ──────────────────────────────────────────────
  // Offer Banner Coupon Handlers (Max 3)
  // ──────────────────────────────────────────────
  const handleAddCoupon = () => {
    if (offerBanner.coupons.length >= 3) {
      toast.warning("Maximum of 3 coupon cards allowed.");
      return;
    }
    const newCoupon: ICouponCard = {
      discount: "10%",
      minOrder: "₹1499",
      code: `OFFER${offerBanner.coupons.length + 1}`,
    };
    setOfferBanner((prev) => ({
      ...prev,
      coupons: [...prev.coupons, newCoupon],
    }));
  };

  const handleRemoveCoupon = (index: number) => {
    if (offerBanner.coupons.length <= 1) {
      toast.error("At least 1 coupon card is required if the banner is active.");
      return;
    }
    setOfferBanner((prev) => ({
      ...prev,
      coupons: prev.coupons.filter((_, i) => i !== index),
    }));
  };

  const handleCouponChange = (
    index: number,
    field: keyof ICouponCard,
    value: string
  ) => {
    setOfferBanner((prev) => {
      const updated = [...prev.coupons];
      updated[index] = {
        ...updated[index],
        [field]: field === "code" ? value.toUpperCase() : value,
      };
      return { ...prev, coupons: updated };
    });
  };

  // ──────────────────────────────────────────────
  // Image Upload for Season Sale Banner
  // ──────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max allowed size is 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Try presigned R2 upload
      const presigned = await getUploadUrl(file.name, file.type);
      if (presigned.success && presigned.uploadUrl && presigned.fileUrl) {
        const uploadRes = await fetch(presigned.uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (uploadRes.ok) {
          setSeasonSaleBanner((prev) => ({ ...prev, imageUrl: presigned.fileUrl }));
          toast.success("Banner image uploaded successfully!");
          setIsUploading(false);
          return;
        }
      }

      // 2. Fallback to /api/upload
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      if (data.urls && data.urls[0]) {
        setSeasonSaleBanner((prev) => ({ ...prev, imageUrl: data.urls[0] }));
        toast.success("Banner image uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input value
      e.target.value = "";
    }
  };

  // ──────────────────────────────────────────────
  // Save Settings Action
  // ──────────────────────────────────────────────
  const handleSave = () => {
    startTransition(async () => {
      const result = await updateBannerSettings({
        offerBanner,
        seasonSaleBanner,
      });

      if (result.success) {
        toast.success("Banners & Offers saved successfully! Storefront updated.");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Banners &amp; Offers Management
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Configure homepage promotional banners, coupon codes, and seasonal sale visuals.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-px">
        <button
          onClick={() => setActiveTab("offer")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-lg border-b-2 transition-colors cursor-pointer ${
            activeTab === "offer"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          <TicketPercent className="w-4 h-4" />
          <span>Special Offer &amp; Coupons</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              offerBanner.enabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-zinc-200 text-zinc-600"
            }`}
          >
            {offerBanner.enabled ? "Active" : "Disabled"}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("season")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-lg border-b-2 transition-colors cursor-pointer ${
            activeTab === "season"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Season Sale Banner</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              seasonSaleBanner.enabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-zinc-200 text-zinc-600"
            }`}
          >
            {seasonSaleBanner.enabled ? "Active" : "Disabled"}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SPECIAL OFFER BANNER & DYNAMIC COUPON CARDS        */}
      {/* ========================================================= */}
      {activeTab === "offer" && (
        <div className="space-y-6">
          {/* Master Toggle Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                  Special Offer Banner Visibility
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    offerBanner.enabled
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {offerBanner.enabled ? "Shown on Home" : "Hidden from Home"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Toggle to show or completely hide the Special Offer strip on the store homepage.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={offerBanner.enabled}
                onChange={(e) =>
                  setOfferBanner((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6.5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-orange-500" />
            </label>
          </div>

          {/* Banner Content Details */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Offer Banner Copy &amp; Action</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Tagline / Pre-heading
                </label>
                <input
                  type="text"
                  value={offerBanner.tagline}
                  onChange={(e) =>
                    setOfferBanner((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                  placeholder="Special Offer"
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={offerBanner.title}
                  onChange={(e) =>
                    setOfferBanner((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="BUY 2 GET 1"
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Highlight Text (Large Font)
                </label>
                <input
                  type="text"
                  value={offerBanner.titleHighlight}
                  onChange={(e) =>
                    setOfferBanner((prev) => ({
                      ...prev,
                      titleHighlight: e.target.value,
                    }))
                  }
                  placeholder="FREE"
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 font-bold text-orange-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Description / Eligibility Subtext
                </label>
                <input
                  type="text"
                  value={offerBanner.description}
                  onChange={(e) =>
                    setOfferBanner((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="On T-Shirts & Casual Wear"
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Button Text &amp; Destination Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={offerBanner.buttonText}
                    onChange={(e) =>
                      setOfferBanner((prev) => ({
                        ...prev,
                        buttonText: e.target.value,
                      }))
                    }
                    placeholder="Shop Now"
                    className="w-1/2 px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    value={offerBanner.buttonLink}
                    onChange={(e) =>
                      setOfferBanner((prev) => ({
                        ...prev,
                        buttonLink: e.target.value,
                      }))
                    }
                    placeholder="/collections"
                    className="w-1/2 px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Coupon Cards Manager (Max 3) */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-900">
                    Coupon Cards Display
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">
                    {offerBanner.coupons.length} / 3 Cards Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Customize the coupon boards shown on the right side. You can add 1, 2, or up to 3 cards.
                </p>
              </div>

              {offerBanner.coupons.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddCoupon}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Coupon Card</span>
                </button>
              )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {offerBanner.coupons.map((coupon, idx) => (
                <div
                  key={idx}
                  className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50 hover:bg-white transition-all shadow-xs relative group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Card #{idx + 1}
                    </span>
                    {offerBanner.coupons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCoupon(idx)}
                        className="text-zinc-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Discount Percentage / Amount
                      </label>
                      <input
                        type="text"
                        value={coupon.discount}
                        onChange={(e) =>
                          handleCouponChange(idx, "discount", e.target.value)
                        }
                        placeholder="10% or 10% OFF"
                        className="w-full px-3 py-1.5 text-sm font-bold text-orange-600 border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Minimum Order Price
                      </label>
                      <input
                        type="text"
                        value={coupon.minOrder}
                        onChange={(e) =>
                          handleCouponChange(idx, "minOrder", e.target.value)
                        }
                        placeholder="₹1499"
                        className="w-full px-3 py-1.5 text-sm font-semibold text-zinc-900 border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Coupon Promo Code
                      </label>
                      <input
                        type="text"
                        value={coupon.code}
                        onChange={(e) =>
                          handleCouponChange(idx, "code", e.target.value)
                        }
                        placeholder="SR10"
                        className="w-full px-3 py-1.5 text-sm font-mono font-bold tracking-wider uppercase text-zinc-900 border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Micro Visual Card Preview */}
                  <div className="mt-4 pt-3 border-t border-dashed border-zinc-200 text-center bg-white rounded-lg p-2.5 shadow-2xs">
                    <p className="text-[10px] text-zinc-400 font-medium">Extra</p>
                    <p className="text-base font-extrabold text-orange-500 leading-tight">
                      {coupon.discount.toUpperCase().includes("OFF")
                        ? coupon.discount
                        : `${coupon.discount} OFF`}
                    </p>
                    <p className="text-[9px] text-zinc-500">on orders above</p>
                    <p className="text-xs font-bold text-zinc-800">{coupon.minOrder}</p>
                    <div className="mt-1.5 pt-1 border-t border-dashed border-zinc-200">
                      <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                        {coupon.code}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SEASON SALE BANNER & DYNAMIC IMAGE UPLOAD          */}
      {/* ========================================================= */}
      {activeTab === "season" && (
        <div className="space-y-6">
          {/* Master Toggle Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                  Season Sale Banner Visibility
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    seasonSaleBanner.enabled
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {seasonSaleBanner.enabled ? "Shown on Home" : "Hidden from Home"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Toggle to show or completely hide the Season Sale section from the homepage.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={seasonSaleBanner.enabled}
                onChange={(e) =>
                  setSeasonSaleBanner((prev) => ({
                    ...prev,
                    enabled: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6.5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-orange-500" />
            </label>
          </div>

          {/* Banner Layout Mode */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900">
              Banner Layout Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  seasonSaleBanner.bannerType === "full"
                    ? "border-orange-500 bg-orange-50/30"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="bannerType"
                  value="full"
                  checked={seasonSaleBanner.bannerType === "full"}
                  onChange={() =>
                    setSeasonSaleBanner((prev) => ({ ...prev, bannerType: "full" }))
                  }
                  className="mt-1 text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    Full Graphic Banner (Recommended)
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Renders your uploaded banner as a full-width panoramic banner across the entire section.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  seasonSaleBanner.bannerType === "split"
                    ? "border-orange-500 bg-orange-50/30"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="bannerType"
                  value="split"
                  checked={seasonSaleBanner.bannerType === "split"}
                  onChange={() =>
                    setSeasonSaleBanner((prev) => ({ ...prev, bannerType: "split" }))
                  }
                  className="mt-1 text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    Split Content Banner (Editorial)
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Shows your image on the left/right with live title text, discount callout, and Shop button in the center.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Image Upload & Detailed Specifications Alert */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Season Sale Image Asset
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                Upload your promotional creative. Follow the size specifications below for crisp display across mobile, tablet, and desktop.
              </p>
            </div>

            {/* Prominent Guidelines Alert */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 space-y-1.5">
                <p className="font-bold text-amber-950">
                  Recommended Image Specifications for All Devices:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-amber-800 text-[12px] sm:text-[13px]">
                  <li>
                    <span className="font-semibold">Full Graphic Banner:</span>{" "}
                    <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">
                      1920 × 600 px
                    </code>{" "}
                    or{" "}
                    <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">
                      1200 × 400 px
                    </code>{" "}
                    (Landscape ~3:1 aspect ratio). Keep key text centered to avoid edge cutoff on mobile.
                  </li>
                  <li>
                    <span className="font-semibold">Split Editorial Banner:</span>{" "}
                    <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">
                      800 × 800 px
                    </code>{" "}
                    or{" "}
                    <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">
                      800 × 1000 px
                    </code>{" "}
                    high-resolution apparel or model cutout.
                  </li>
                  <li>
                    <span className="font-semibold">Format &amp; File Size:</span> WebP, PNG, or high-quality JPG (Max 5MB).
                  </li>
                </ul>
              </div>
            </div>

            {/* Upload Area / Preview */}
            <div className="space-y-4">
              {seasonSaleBanner.imageUrl ? (
                <div className="relative group border border-zinc-200 rounded-2xl overflow-hidden bg-zinc-100">
                  <div className="relative w-full aspect-[21/8] max-h-[280px]">
                    <Image
                      src={seasonSaleBanner.imageUrl}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 bg-white border-t border-zinc-200 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 truncate max-w-md font-mono">
                      {seasonSaleBanner.imageUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSeasonSaleBanner((prev) => ({ ...prev, imageUrl: "" }))
                      }
                      className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-zinc-300 hover:border-orange-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-orange-50/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-600 rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-zinc-900">
                    {isUploading
                      ? "Uploading image to Cloudflare R2..."
                      : "Click to upload banner image or drag & drop"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Recommended: 1920 × 600 px (PNG, JPG, WebP up to 5MB)
                  </p>
                </label>
              )}

              {/* Or manual URL input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Or Paste External Image URL
                </label>
                <input
                  type="url"
                  value={seasonSaleBanner.imageUrl || ""}
                  onChange={(e) =>
                    setSeasonSaleBanner((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Text & Button Fields (for split mode or banner link) */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900">
              Banner Headings &amp; Link
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Tagline (e.g. Season Sale)
                </label>
                <input
                  type="text"
                  value={seasonSaleBanner.tagline}
                  onChange={(e) =>
                    setSeasonSaleBanner((prev) => ({
                      ...prev,
                      tagline: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Title (e.g. FLAT)
                </label>
                <input
                  type="text"
                  value={seasonSaleBanner.title}
                  onChange={(e) =>
                    setSeasonSaleBanner((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Discount Callout (e.g. 30% OFF)
                </label>
                <input
                  type="text"
                  value={seasonSaleBanner.discountText}
                  onChange={(e) =>
                    setSeasonSaleBanner((prev) => ({
                      ...prev,
                      discountText: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 font-bold text-orange-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={seasonSaleBanner.description}
                  onChange={(e) =>
                    setSeasonSaleBanner((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Destination Link URL
                </label>
                <input
                  type="text"
                  value={seasonSaleBanner.buttonLink}
                  onChange={(e) =>
                    setSeasonSaleBanner((prev) => ({
                      ...prev,
                      buttonLink: e.target.value,
                    }))
                  }
                  placeholder="/collections"
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
