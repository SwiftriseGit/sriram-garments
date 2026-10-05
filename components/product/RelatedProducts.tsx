import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { getRelatedProducts } from "@/lib/data/products";
import type { CategorySlug } from "@/lib/catalog/types";

/** Async Server Component — streamed in below the fold via <Suspense>. */
export default async function RelatedProducts({
  styleId,
  category,
}: {
  styleId: string;
  category: CategorySlug;
}) {
  const products = await getRelatedProducts(styleId, category);
  if (products.length === 0) return null;

  return (
    <RelatedShell>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </RelatedShell>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <RelatedShell>
      {Array.from({ length: 4 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </RelatedShell>
  );
}

function RelatedShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-5 sm:mb-6">
        You May Also{" "}
        <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
          Like
        </span>
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4">{children}</div>
    </section>
  );
}
