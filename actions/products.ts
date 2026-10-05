"use server";

import { requireAuth } from "@/lib/auth/session";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { MOCK_PRODUCTS } from "@/lib/data/admin/mock-data";

export async function deleteProductAction(formData: FormData) {
  await requireAuth();

  const id = formData.get("id") as string;
  if (!id) throw new Error("Product ID is required");

  const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PRODUCTS.splice(index, 1);
  }
  
  // Bust storefront cache
  updateTag("products");
  revalidatePath("/admin/products");
}

export async function saveProductAction(formData: FormData) {
  await requireAuth();

  const id = formData.get("id") as string;
  
  // Extract fields
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const compareAtPriceStr = formData.get("compareAtPrice") as string;
  const compareAtPrice = compareAtPriceStr ? parseFloat(compareAtPriceStr) : null;
  const description = formData.get("description") as string;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
  const isPublished = formData.get("isPublished") === "true";
  
  // Parse colors, sizes, and images from JSON or strings
  const colorName = formData.get("colorName") as string;
  const colorHex = formData.get("colorHex") as string;
  const colorTone = (formData.get("colorTone") as "dark" | "light") || "light";
  
  const sizesStr = formData.get("sizes") as string;
  const sizes = sizesStr ? sizesStr.split(",").map(s => s.trim()) : [];
  
  const imagesStr = formData.get("images") as string;
  const images = imagesStr ? imagesStr.split(",").map(s => s.trim()).filter(Boolean) : [];

  const styleId = formData.get("styleId") as string || `STYLE-${Date.now()}`;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const productData = {
    name,
    slug,
    category,
    price,
    compareAtPrice,
    description,
    stockQuantity,
    inStock: stockQuantity > 0,
    isPublished,
    color: {
      name: colorName || "Default",
      hex: colorHex || "#000000",
      tone: colorTone,
    },
    sizes,
    images,
    styleId,
    salesCount: 0,
    createdAt: new Date().toISOString(),
  };

  if (id) {
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData, id };
    }
  } else {
    MOCK_PRODUCTS.push({ ...productData, id: `p${Date.now()}` });
  }

  // Bust storefront cache
  updateTag("products");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}
