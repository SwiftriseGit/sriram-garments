"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  TicketPercent,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Upload,
  Info,
  Layers,
  Scissors,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { updateBannerSettings } from "@/actions/banners";
import {
  IOfferBannerConfig,
  ISeasonSaleBannerConfig,
  ICouponCard,
} from "@/lib/models/BannerSettings";
import { getUploadUrl, deleteR2Object } from "@/actions/r2";
import ImageCropModal from "./ImageCropModal";

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

  // Cropping State
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");
  const [cropFileName, setCropFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  // Step 1: User selects file -> Open Crop Modal first
  // ──────────────────────────────────────────────
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file is too large. Max allowed size is 10MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropImageSrc(objectUrl);
    setCropFileName(file.name);
    setIsCropModalOpen(true);

    // Reset input so re-selecting same file triggers onChange
    e.target.value = "";
  };

  // ──────────────────────────────────────────────
  // Step 2: User applies crop -> Upload Cropped Blob to R2
  // ──────────────────────────────────────────────
  const handleCroppedUpload = async (croppedBlob: Blob) => {
    setIsUploading(true);
    try {
      const baseName = cropFileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const generatedName = `banner-${baseName || "promo"}-${Date.now()}.webp`;

      // 1. Request presigned upload URL from R2 server action
      const presigned = await getUploadUrl(generatedName, "image/webp");

      if (presigned.success && presigned.uploadUrl && presigned.fileUrl) {
        const uploadRes = await fetch(presigned.uploadUrl, {
          method: "PUT",
          body: croppedBlob,
          headers: { "Content-Type": "image/webp" },
        });

        if (uploadRes.ok) {
          // If replacing an existing R2 image, clean up the previous file
          if (seasonSaleBanner.imageUrl && seasonSaleBanner.imageUrl !== presigned.fileUrl) {
            deleteR2Object(seasonSaleBanner.imageUrl).catch(() => {});
          }

          setSeasonSaleBanner((prev) => ({
            ...prev,
            imageUrl: presigned.fileUrl,
          }));
          toast.success("Banner image cropped & uploaded to R2 successfully!");
          setIsCropModalOpen(false);
          setIsUploading(false);
          return;
        }
      }

      // 2. Fallback to /api/upload
      const croppedFile = new File([croppedBlob], generatedName, {
        type: "image/webp",
      });
      const formData = new FormData();
      formData.append("files", croppedFile);

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
        if (seasonSaleBanner.imageUrl && seasonSaleBanner.imageUrl !== data.urls[0]) {
          deleteR2Object(seasonSaleBanner.imageUrl).catch(() => {});
        }

        setSeasonSaleBanner((prev) => ({ ...prev, imageUrl: data.urls[0] }));
        toast.success("Banner image cropped & uploaded successfully!");
        setIsCropModalOpen(false);
      }
    } catch (err: any) {
      console.error("Cropped upload error:", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Step 3: Remove Image -> Delete from Cloudflare R2
  // ──────────────────────────────────────────────
  const handleRemoveImage = async () => {
    if (!seasonSaleBanner.imageUrl) return;

    setIsDeletingImage(true);
    try {
      const targetUrl = seasonSaleBanner.imageUrl;
      // Call existing deleteR2Object server action
      const result = await deleteR2Object(targetUrl);

      if (result.success) {
        toast.success("Image removed and deleted from Cloudflare R2.");
      } else {
        toast.warning("Image removed locally. Server note: " + (result.error || "R2 cleanup skipped."));
      }

      setSeasonSaleBanner((prev) => ({ ...prev, imageUrl: "" }));
    } catch (err: any) {
      console.error("Failed to delete image from R2:", err);
      // Still remove locally so admin can re-upload
      setSeasonSaleBanner((prev) => ({ ...prev, imageUrl: "" }));
      toast.error("Removed image from banner.");
    } finally {
      setIsDeletingImage(false);
    }
  };

  // ──────────────────────────────────────────────
  // Save Settings to Database
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

  const isFullBanner = seasonSaleBanner.bannerType === "full";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Banners &amp; Offers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Manage promotional strips, dynamic coupon codes, and seasonal sales visuals.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || isUploading || isDeletingImage}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish</span>
            </>
          )}
        </button>
      </div>

      {/* Responsive Tabs Switcher */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-px overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("offer")}
          className={`flex items-center gap-2 px-3.5 py-2 font-medium text-xs sm:text-sm rounded-t-lg border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === "offer"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          <TicketPercent className="w-4 h-4" />
          <span>Special Offer &amp; Coupons</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              offerBanner.enabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-zinc-200 text-zinc-600"
            }`}
          >
            {offerBanner.enabled ? "Active" : "Off"}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("season")}
          className={`flex items-center gap-2 px-3.5 py-2 font-medium text-xs sm:text-sm rounded-t-lg border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === "season"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Season Sale Banner</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              seasonSaleBanner.enabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-zinc-200 text-zinc-600"
            }`}
          >
            {seasonSaleBanner.enabled ? "Active" : "Off"}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SPECIAL OFFER BANNER & DYNAMIC COUPON CARDS        */}
      {/* ========================================================= */}
      {activeTab === "offer" && (
        <div className="space-y-5">
          {/* Master Toggle Card */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                  Special Offer Strip Visibility
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    offerBanner.enabled
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {offerBanner.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Toggle to show or completely hide the Special Offer banner on the store homepage.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={offerBanner.enabled}
                onChange={(e) =>
                  setOfferBanner((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
            </label>
          </div>

          {/* Banner Copy & Action */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Offer Banner Copy &amp; Action</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
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
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Highlight Text
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
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 font-bold text-orange-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={offerBanner.description}
                  onChange={(e) =>
                    setOfferBanner((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Limited time offer on all premium apparel..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={offerBanner.buttonText}
                  onChange={(e) =>
                    setOfferBanner((prev) => ({ ...prev, buttonText: e.target.value }))
                  }
                  placeholder="Shop Now"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  value={offerBanner.buttonLink}
                  onChange={(e) =>
                    setOfferBanner((prev) => ({ ...prev, buttonLink: e.target.value }))
                  }
                  placeholder="/collections"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Coupon Cards Builder (Max 3) */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">
                    Dynamic Coupon Cards
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    {offerBanner.coupons.length} of 3 Cards
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Customize discount %, minimum order amount, and promo code. Max 3 cards.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCoupon}
                disabled={offerBanner.coupons.length >= 3}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Card ({3 - offerBanner.coupons.length} left)</span>
              </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {offerBanner.coupons.map((coupon, idx) => (
                <div
                  key={idx}
                  className="relative p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:border-orange-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
                    <span className="text-xs font-bold text-zinc-700">
                      Card #{idx + 1}
                    </span>
                    {offerBanner.coupons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCoupon(idx)}
                        className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                        title="Remove coupon card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Discount % or OFF
                      </label>
                      <input
                        type="text"
                        value={coupon.discount}
                        onChange={(e) =>
                          handleCouponChange(idx, "discount", e.target.value)
                        }
                        placeholder="10%"
                        className="w-full px-2.5 py-1.5 text-xs font-bold text-orange-600 border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Min Order Price
                      </label>
                      <input
                        type="text"
                        value={coupon.minOrder}
                        onChange={(e) =>
                          handleCouponChange(idx, "minOrder", e.target.value)
                        }
                        placeholder="₹1499"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold text-zinc-800 border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        value={coupon.code}
                        onChange={(e) =>
                          handleCouponChange(idx, "code", e.target.value)
                        }
                        placeholder="SR10"
                        className="w-full px-2.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase text-zinc-900 border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Micro Visual Card Preview */}
                  <div className="pt-2 border-t border-dashed border-zinc-200 text-center bg-white rounded-lg p-2 shadow-2xs">
                    <p className="text-[10px] text-zinc-400 font-medium">Extra</p>
                    <p className="text-sm font-extrabold text-orange-500 leading-tight">
                      {coupon.discount.toUpperCase().includes("OFF")
                        ? coupon.discount
                        : `${coupon.discount} OFF`}
                    </p>
                    <p className="text-[9px] text-zinc-500">on orders above</p>
                    <p className="text-xs font-bold text-zinc-800">{coupon.minOrder}</p>
                    <div className="mt-1 pt-1 border-t border-dashed border-zinc-200">
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
      {/* TAB 2: SEASON SALE BANNER (FULL OR SPLIT WITH CROPPING)   */}
      {/* ========================================================= */}
      {activeTab === "season" && (
        <div className="space-y-5">
          {/* Master Toggle Card */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                  Season Sale Banner Visibility
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    seasonSaleBanner.enabled
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {seasonSaleBanner.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Toggle to show or completely hide the Season Sale section from the homepage.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
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
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
            </label>
          </div>

          {/* Banner Layout Mode */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-900">
              Banner Layout Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mode A: Full Graphic Banner */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  isFullBanner
                    ? "border-orange-500 bg-orange-50/30"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="bannerType"
                  value="full"
                  checked={isFullBanner}
                  onChange={() =>
                    setSeasonSaleBanner((prev) => ({ ...prev, bannerType: "full" }))
                  }
                  className="mt-0.5 text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">
                    Full Graphic Banner (Panoramic)
                  </p>
                  <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Uses your uploaded artwork across the entire banner width. Headings are hidden because your image already contains text.
                  </p>
                </div>
              </label>

              {/* Mode B: Split Content Banner */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  !isFullBanner
                    ? "border-orange-500 bg-orange-50/30"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="bannerType"
                  value="split"
                  checked={!isFullBanner}
                  onChange={() =>
                    setSeasonSaleBanner((prev) => ({ ...prev, bannerType: "split" }))
                  }
                  className="mt-0.5 text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">
                    Split Content Banner (Editorial)
                  </p>
                  <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Shows cropped visual on the left, with dynamic Title, Discount text, and Shop button on the right.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Image Upload Area with Cropping & R2 Delete */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                {isFullBanner ? "Full Graphic Banner Image" : "Split Banner Visual Asset"}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Choose an image from your computer to crop and upload directly to Cloudflare R2.
              </p>
            </div>

            {/* Sizing Recommendations Alert */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 sm:p-4 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold text-amber-950">
                  {isFullBanner
                    ? "Full Panoramic Crop Recommendation:"
                    : "Split Left-Side Crop Recommendation:"}
                </p>
                {isFullBanner ? (
                  <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
                    Target Aspect: <span className="font-bold">3:1 Landscape</span> (1920×640 px or 1200×400 px). When you select an image, you can freely zoom and pan within the 3:1 crop frame before uploading.
                  </p>
                ) : (
                  <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
                    Target Aspect: <span className="font-bold">1:1 Square</span> (800×800 px) or product cutout. Fits cleanly on the left side of the split banner.
                  </p>
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
              className="hidden"
            />

            {/* Upload Area / Current Image Card */}
            {seasonSaleBanner.imageUrl ? (
              <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-100">
                <div
                  className={`relative w-full ${
                    isFullBanner
                      ? "aspect-3/1 max-h-55"
                      : "aspect-video sm:aspect-21/9 max-h-55"
                  }`}
                >
                  <Image
                    src={seasonSaleBanner.imageUrl}
                    alt="Active Banner Image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 bg-white border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-800">
                      Active Image on Storefront
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">
                      {seasonSaleBanner.imageUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Crop New Image</span>
                    </button>

                    <button
                      type="button"
                      disabled={isDeletingImage}
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isDeletingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Deleting from R2...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Picture</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 hover:border-orange-500 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-orange-50/20 group"
              >
                <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-zinc-900">
                  Choose Image to Crop &amp; Upload
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {isFullBanner
                    ? "Panoramic 3:1 crop tool will open before uploading to Cloudflare R2"
                    : "Square 1:1 crop tool will open before uploading to Cloudflare R2"}
                </p>
              </div>
            )}
          </div>

          {/* Conditional Banner Link & Headings */}
          {isFullBanner ? (
            /* Mode 1: Full Graphic Banner ONLY needs click link URL (Headings hidden as requested) */
            <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-zinc-900">
                  Banner Destination Link
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                Where should customers be redirected when they click this graphic banner?
              </p>
              <div>
                <input
                  type="text"
                  value={seasonSaleBanner.buttonLink || "/collections"}
                  onChange={(e) =>
                    setSeasonSaleBanner((prev) => ({
                      ...prev,
                      buttonLink: e.target.value,
                    }))
                  }
                  placeholder="/collections"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>
          ) : (
            /* Mode 2: Split Content Banner SHOWS Banner Headings & Link */
            <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-zinc-900">
                  Banner Headings &amp; Link Details
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                These text details display cleanly on the right side of the split banner.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
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
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
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
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 font-bold text-orange-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Description Text
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
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={seasonSaleBanner.buttonText}
                    onChange={(e) =>
                      setSeasonSaleBanner((prev) => ({
                        ...prev,
                        buttonText: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
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
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Stamp Badge Text
                  </label>
                  <input
                    type="text"
                    value={seasonSaleBanner.badgeText}
                    onChange={(e) =>
                      setSeasonSaleBanner((prev) => ({
                        ...prev,
                        badgeText: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Crop Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        aspectRatio={isFullBanner ? 3 / 1 : 1 / 1}
        aspectRatioLabel={
          isFullBanner
            ? "Full Panoramic Graphic Banner (3:1 Landscape ~ 1920×640 px)"
            : "Split Content Left-Side Visual (1:1 Square ~ 800×800 px)"
        }
        targetWidth={isFullBanner ? 1920 : 800}
        targetHeight={isFullBanner ? 640 : 800}
        isUploading={isUploading}
        onCropComplete={handleCroppedUpload}
        onCancel={() => {
          setIsCropModalOpen(false);
          setIsUploading(false);
        }}
      />
    </div>
  );
}
