import { requireAuth } from "@/lib/auth/session";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireAuth();

  return <ProductForm />;
}
