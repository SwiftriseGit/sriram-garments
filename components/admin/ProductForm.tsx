"use client";

import { useState } from "react";
import { saveProductAction } from "@/actions/products";
import { CATEGORY_OPTIONS } from "@/lib/catalog/options";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={async (formData) => {
        setIsSubmitting(true);
        await saveProductAction(formData);
        setIsSubmitting(false);
      }}
      className="space-y-8 pb-12"
    >
      {product && <input type="hidden" name="id" value={product._id} />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            {product ? "Edit Product" : "Add Product"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-zinc-950 text-lg">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={product?.name}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
                  placeholder="e.g. Premium Cotton Shirt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product?.description}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
                  placeholder="Describe the product..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-zinc-950 text-lg">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={product?.price}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Compare at Price (₹)
                </label>
                <input
                  type="number"
                  name="compareAtPrice"
                  min="0"
                  step="0.01"
                  defaultValue={product?.compareAtPrice || ""}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                required
                min="0"
                defaultValue={product?.stockQuantity ?? 0}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm max-w-xs"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-zinc-950 text-lg">Images</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Image URLs (comma separated)
              </label>
              <textarea
                name="images"
                rows={3}
                defaultValue={product?.images?.join(", ")}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
                placeholder="https://..., https://..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-8">
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-zinc-950 text-lg">Organization</h2>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Status
              </label>
              <select
                name="isPublished"
                defaultValue={product?.isPublished !== false ? "true" : "false"}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
              >
                <option value="true">Active (Published)</option>
                <option value="false">Draft (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Category
              </label>
              <select
                name="category"
                required
                defaultValue={product?.category}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm capitalize"
              >
                <option value="">Select category...</option>
                {CATEGORY_OPTIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Sizes (comma separated)
              </label>
              <input
                type="text"
                name="sizes"
                defaultValue={product?.sizes?.join(", ")}
                placeholder="S, M, L, XL"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-zinc-950 text-lg">Color Variant</h2>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Color Name
              </label>
              <input
                type="text"
                name="colorName"
                defaultValue={product?.color?.name}
                placeholder="e.g. Navy Blue"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Hex Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue={product?.color?.hex || "#000000"}
                    className="h-9 w-9 rounded border border-zinc-300 p-0"
                    onChange={(e) => {
                      const el = document.getElementById('colorHex') as HTMLInputElement;
                      if(el) el.value = e.target.value;
                    }}
                  />
                  <input
                    id="colorHex"
                    type="text"
                    name="colorHex"
                    defaultValue={product?.color?.hex || "#000000"}
                    className="flex-1 px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Tone
                </label>
                <select
                  name="colorTone"
                  defaultValue={product?.color?.tone || "light"}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-zinc-950 focus:border-zinc-950 sm:text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
