"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { saveProductAction } from "@/actions/products";
import { CATEGORY_OPTIONS } from "@/lib/catalog/options";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Tag,
  DollarSign,
  Palette,
  Layers,
  Sparkles,
  Percent,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

interface ProductFormValues {
  name: string;
  category: string;
  originalPrice: number;
  salePrice: number | null;
  isSale: boolean;
  couponCode: string;
  couponDiscount: number | null;
  stockQuantity: number;
  description: string;
  highlights: string;
  fabric: string;
  fit: string;
  colorName: string;
  colorHex: string;
  colorTone: "light" | "dark";
  sizes: string[];
  images: string[];
  isPublished: boolean;
}

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  // Initialize react-hook-form with existing product data or defaults
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "t-shirts",
      originalPrice: product?.originalPrice ?? product?.price ?? 999,
      salePrice: product?.salePrice ?? null,
      isSale: product?.isSale ?? false,
      couponCode: product?.couponCode || "",
      couponDiscount: product?.couponDiscount ?? null,
      stockQuantity: product?.stockQuantity ?? 50,
      description: product?.description || "",
      highlights: Array.isArray(product?.highlights)
        ? product.highlights.join("\n")
        : product?.highlights || "",
      fabric: product?.fabric || "",
      fit: product?.fit || "",
      colorName: product?.color?.name || "Jet Black",
      colorHex: product?.color?.hex || "#1c1c1f",
      colorTone: product?.color?.tone || "dark",
      sizes: product?.sizes || ["S", "M", "L", "XL"],
      images: product?.images || [],
      isPublished: product?.isPublished !== false,
    },
  });

  const watchOriginalPrice = watch("originalPrice");
  const watchSalePrice = watch("salePrice");
  const watchIsSale = watch("isSale");
  const watchColorHex = watch("colorHex");
  const watchSizes = watch("sizes") || [];
  const watchImages = watch("images") || [];

  // Calculate live discount percentage
  const discountPercent =
    watchIsSale && watchSalePrice && watchOriginalPrice > watchSalePrice
      ? Math.round(((watchOriginalPrice - watchSalePrice) / watchOriginalPrice) * 100)
      : 0;

  const toggleSize = (size: string) => {
    const current = watchSizes;
    if (current.includes(size)) {
      setValue(
        "sizes",
        current.filter((s) => s !== size),
        { shouldValidate: true }
      );
    } else {
      setValue("sizes", [...current, size], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (product?._id) {
        formData.append("id", product._id);
      }

      formData.append("name", data.name.trim());
      formData.append("category", data.category);
      formData.append("originalPrice", String(data.originalPrice));
      if (data.isSale && data.salePrice != null) {
        formData.append("salePrice", String(data.salePrice));
      }
      formData.append("isSale", data.isSale ? "true" : "false");
      formData.append("stockQuantity", String(data.stockQuantity));
      formData.append("isPublished", data.isPublished ? "true" : "false");
      formData.append("description", data.description.trim());
      formData.append("fabric", data.fabric.trim());
      formData.append("fit", data.fit.trim());
      formData.append("colorName", data.colorName.trim());
      formData.append("colorHex", data.colorHex);
      formData.append("colorTone", data.colorTone);

      if (data.couponCode?.trim()) {
        formData.append("couponCode", data.couponCode.trim().toUpperCase());
      }
      if (data.couponDiscount != null && data.couponDiscount > 0) {
        formData.append("couponDiscount", String(data.couponDiscount));
      }

      // Sizes comma-separated
      formData.append("sizes", (data.sizes || []).join(","));

      // Images comma-separated
      formData.append("images", (data.images || []).join(","));

      // Removed images to delete from storage on save
      formData.append("removedImages", removedImages.join(","));

      // Highlights newline-separated
      formData.append("highlights", data.highlights || "");

      await saveProductAction(formData);
      toast.success(product ? "Product updated successfully!" : "Product created successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      // If it's a redirect, let Next.js handle it
      if (err?.message?.includes("NEXT_REDIRECT")) {
        return;
      }
      console.error(err);
      toast.error(err?.message || "Failed to save product. Check inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 -ml-2 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
              {product ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Powered by MongoDB & Cloudflare R2 Storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{product ? "Update Product" : "Publish Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Basic Information */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <h2 className="font-bold text-zinc-950 text-base">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Product name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                  })}
                  className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden transition-all ${
                    errors.name ? "border-red-400 bg-red-50/20" : "border-zinc-200"
                  }`}
                  placeholder="e.g. Oversized Heavyweight Cotton T-Shirt"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden transition-all"
                  placeholder="Describe the fabric feel, drape, styling notes, and occasions..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    {...register("fabric")}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden"
                    placeholder="e.g. 100% Combed Cotton, 240 GSM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Fit & Silhouette
                  </label>
                  <input
                    type="text"
                    {...register("fit")}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden"
                    placeholder="e.g. Boxy Oversized with Dropped Shoulders"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Key Highlights <span className="text-zinc-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  rows={3}
                  {...register("highlights")}
                  className="w-full px-3.5 py-2 font-mono text-xs border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden"
                  placeholder="Pre-shrunk fabric&#10;Ribbed collar that keeps shape&#10;Side-split hem for easy movement"
                />
              </div>
            </div>
          </div>

          {/* 2. Pricing, Sale & Coupons */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-zinc-950 text-base">Pricing & Sale</h2>
              </div>
              {discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Percent className="w-3 h-3" />
                  {discountPercent}% OFF Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Original Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  {...register("originalPrice", {
                    required: "Original price is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden"
                  placeholder="1499"
                />
                {errors.originalPrice && (
                  <p className="mt-1 text-xs text-red-600">{errors.originalPrice.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Sale Price (₹)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isSale")}
                      className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-900"
                    />
                    <span>Put on Sale</span>
                  </label>
                </div>
                <input
                  type="number"
                  step="1"
                  min="0"
                  disabled={!watchIsSale}
                  {...register("salePrice", {
                    valueAsNumber: true,
                  })}
                  className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden transition-all ${
                    !watchIsSale
                      ? "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "border-zinc-200 text-zinc-900"
                  }`}
                  placeholder={watchIsSale ? "e.g. 999" : "Enable 'Put on Sale' above"}
                />
              </div>
            </div>

            {/* Promotional Coupon */}
            <div className="p-4 bg-zinc-50/70 border border-zinc-200/70 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
                  Optional Discount Coupon
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    {...register("couponCode")}
                    className="w-full px-3 py-1.5 text-xs uppercase font-mono tracking-wider border border-zinc-200 rounded-lg bg-white"
                    placeholder="e.g. SUMMER20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Coupon Flat Discount (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    {...register("couponDiscount", { valueAsNumber: true })}
                    className="w-full px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                    placeholder="e.g. 200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Product Images (Cloudflare R2) */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h2 className="font-bold text-zinc-950 text-base">Product Gallery</h2>
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                Cloudflare R2 Direct Upload ({watchImages.length}/6)
              </span>
            </div>

            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  images={field.value || []}
                  onChange={(urls) => field.onChange(urls)}
                  onRemove={(url) => setRemovedImages((prev) => [...prev, url])}
                  maxFiles={6}
                />
              )}
            />
          </div>
        </div>

        {/* Right 1 Column: Inventory, Taxonomy, Color & Publishing */}
        <div className="space-y-8">
          {/* Visibility / Publishing */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-zinc-950 text-base pb-2 border-b border-zinc-100">
              Status & Visibility
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Catalog Status
              </label>
              <select
                {...register("isPublished", {
                  setValueAs: (v) => v === "true" || v === true,
                })}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:ring-2 focus:ring-zinc-950 focus:outline-hidden font-medium"
              >
                <option value="true">Active (Visible in Storefront)</option>
                <option value="false">Draft (Hidden from Storefront)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                {...register("stockQuantity", {
                  required: "Stock is required",
                  valueAsNumber: true,
                })}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-zinc-950 text-base pb-2 border-b border-zinc-100">
              Category
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Product Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:ring-2 focus:ring-zinc-950 focus:outline-hidden capitalize font-medium"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sizes Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = watchSizes.includes(size);
                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-zinc-900 border-zinc-900 text-white shadow-xs"
                          : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {size}
                      {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Variant */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
              <Palette className="w-4 h-4 text-pink-600" />
              <h2 className="font-bold text-zinc-950 text-base">Color Variant</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Color Name
              </label>
              <input
                type="text"
                {...register("colorName", { required: "Color name is required" })}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-950 focus:outline-hidden"
                placeholder="e.g. Jet Black, Olive Green"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Color Swatch
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={watchColorHex}
                    onChange={(e) => setValue("colorHex", e.target.value)}
                    className="w-9 h-9 rounded-lg border border-zinc-200 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    {...register("colorHex")}
                    className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase border border-zinc-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Tone
                </label>
                <select
                  {...register("colorTone")}
                  className="w-full px-2.5 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white"
                >
                  <option value="dark">Dark Tone</option>
                  <option value="light">Light Tone</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
