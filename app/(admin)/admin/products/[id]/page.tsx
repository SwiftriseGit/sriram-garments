import { requireAuth } from "@/lib/auth/session";
import { MOCK_PRODUCTS } from "@/lib/data/admin/mock-data";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  // Convert to match the expected format
  const serializableProduct = {
    ...product,
    _id: product.id,
  };

  return <ProductForm product={serializableProduct as any} />;
}
