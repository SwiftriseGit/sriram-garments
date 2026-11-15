import { requireAdmin } from "@/lib/auth/dal";
import connectDB from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import ProductForm from "@/components/admin/ProductForm";
import ReviewsTable from "@/components/admin/ReviewsTable";
import { getAllReviewsForAdmin } from "@/lib/data/reviews";
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

  // Fetch reviews specific to this product
  const { reviews, pagination, stats } = await getAllReviewsForAdmin({
    productId: product._id.toString(),
  });

  // Convert Mongo document to plain JSON-serializable object
  const serializableProduct = {
    ...product,
    _id: product._id.toString(),
    createdAt: product.createdAt?.toISOString?.() || null,
    updatedAt: product.updatedAt?.toISOString?.() || null,
  };

  return (
    <div className="space-y-12">
      <ProductForm product={serializableProduct as any} />

      {/* Customer Reviews for this specific product */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
            Customer Reviews ({reviews.length})
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Product Rating: <strong className="text-zinc-800">{product.rating ? product.rating.toFixed(1) : "0.0"}</strong> / 5.0 ({product.reviewCount || 0} reviews)
          </p>
        </div>

        <ReviewsTable
          initialReviews={reviews}
          pagination={pagination}
          stats={stats}
          productId={product._id.toString()}
        />
      </div>
    </div>
  );
}
