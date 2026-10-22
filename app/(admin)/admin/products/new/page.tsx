import { requireAdmin } from "@/lib/auth/dal";
import ProductForm from "@/components/admin/ProductForm";

export const instant = false;

export default async function NewProductPage() {
  await requireAdmin();

  return <ProductForm />;
}
