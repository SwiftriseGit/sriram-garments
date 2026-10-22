"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import ProductModel from "@/lib/models/Product";

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) throw new Error("Product ID is required");

  await connectDB();
  await ProductModel.findByIdAndDelete(id);

  updateTag("products");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;

  // Extract fields
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const originalPrice = parseFloat(formData.get("originalPrice") as string);
  const salePriceStr = formData.get("salePrice") as string;
  const salePrice = salePriceStr ? parseFloat(salePriceStr) : null;
  const isSale = salePrice != null && salePrice < originalPrice;
  const description = formData.get("description") as string;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10) || 0;
  const isPublished = formData.get("isPublished") === "true";

  // Color
  const colorName = formData.get("colorName") as string;
  const colorHex = formData.get("colorHex") as string;
  const colorTone = (formData.get("colorTone") as "dark" | "light") || "light";

  // Sizes — sent as comma-separated or JSON
  const sizesStr = formData.get("sizes") as string;
  const sizes = sizesStr ? sizesStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

  // Images — sent as comma-separated URLs
  const imagesStr = formData.get("images") as string;
  const images = imagesStr ? imagesStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

  // Highlights — sent as newline-separated or JSON
  const highlightsStr = formData.get("highlights") as string;
  const highlights = highlightsStr
    ? highlightsStr.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  // Fabric & Fit
  const fabric = (formData.get("fabric") as string) || "";
  const fit = (formData.get("fit") as string) || "";

  // Coupon
  const couponCode = (formData.get("couponCode") as string) || null;
  const couponDiscountStr = formData.get("couponDiscount") as string;
  const couponDiscount = couponDiscountStr ? parseFloat(couponDiscountStr) : null;

  const styleId = (formData.get("styleId") as string) || `STYLE-${Date.now()}`;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Auto-calculate discount percentage
  let discountPercent = 0;
  if (isSale && salePrice != null && originalPrice > 0) {
    discountPercent = Math.round(
      ((originalPrice - salePrice) / originalPrice) * 100
    );
  }

  const productData = {
    name,
    slug,
    styleId,
    category,
    originalPrice,
    salePrice,
    isSale,
    discountPercent,
    description,
    highlights,
    fabric,
    fit,
    color: {
      name: colorName || "Default",
      hex: colorHex || "#000000",
      tone: colorTone,
    },
    sizes,
    images,
    inStock: stockQuantity > 0,
    stockQuantity,
    isPublished,
    couponCode: couponCode?.toUpperCase() || null,
    couponDiscount,
  };

  await connectDB();

  if (id) {
    await ProductModel.findByIdAndUpdate(id, productData);
  } else {
    await ProductModel.create(productData);
  }

  // Immediate cache invalidation for read-your-own-writes consistency
  updateTag("products");

  return { success: true };
}
