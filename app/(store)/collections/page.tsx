import { Suspense } from "react";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";
import CollectionProvider, { CollectionResults } from "@/components/collections/CollectionProvider";
import CollectionToolbar from "@/components/collections/CollectionToolbar";
import FilterSidebar from "@/components/collections/FilterSidebar";
import Pagination from "@/components/collections/Pagination";
import EmptyResults from "@/components/collections/EmptyResults";
import CollectionSkeleton from "@/components/collections/CollectionSkeleton";
import { parseCollectionQuery } from "@/lib/catalog/query";
import { getCollectionFacets, getProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop All — SriRam Garments",
  description:
    "Browse shirts, t-shirts, jeans and trousers at SriRam Garments. Filter by size, price and availability.",
};

/**
 * Server Component page.
 * The static shell (breadcrumbs + heading) renders immediately; the part that
 * depends on `searchParams` (runtime data) is isolated inside <Suspense>.
 */
export default function CollectionsPage({ searchParams }: PageProps<"/collections">) {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop All" }]} />

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-5 sm:mb-6">
        Shop All
      </h1>

      <Suspense fallback={<CollectionSkeleton />}>
        <CollectionView searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function CollectionView({
  searchParams,
}: {
  searchParams: PageProps<"/collections">["searchParams"];
}) {
  const query = parseCollectionQuery(await searchParams);

  // Independent requests → run in parallel, not one after another
  const [result, facets] = await Promise.all([getProducts(query), getCollectionFacets()]);

  return (
    <CollectionProvider query={{ ...query, page: result.page }}>
      <CollectionToolbar total={result.total} />

      <div className="flex items-start">
        <FilterSidebar facets={facets} total={result.total} />

        <div className="flex-1 min-w-0">
          <CollectionResults>
            {result.items.length === 0 ? (
              <EmptyResults />
            ) : (
              <>
                <h2 className="sr-only">Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
                  {result.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              pageSize={result.pageSize}
            />
          </CollectionResults>
        </div>
      </div>
    </CollectionProvider>
  );
}
