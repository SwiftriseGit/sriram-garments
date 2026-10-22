import { requireAdmin } from "@/lib/auth/dal";
import connectDB from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

export const instant = false;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  await connectDB();

  let product = null;
  if (mongoose.isValidObjectId(id)) {
    product = await ProductModel.findById(id).lean();
  } else {
    product = await ProductModel.findOne({ slug: id }).lean();
  }

  if (!product) {
    notFound();
  }

  // Convert Mongo document to plain JSON-serializable object
  const serializableProduct = {
    ...product,
    _id: product._id.toString(),
    createdAt: product.createdAt?.toISOString?.() || null,
    updatedAt: product.updatedAt?.toISOString?.() || null,
  };

  return <ProductForm product={serializableProduct as any} />;
}
