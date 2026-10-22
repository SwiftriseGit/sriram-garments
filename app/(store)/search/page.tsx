import { getProducts } from "@/lib/data/products";
import { parseCollectionQuery } from "@/lib/catalog/query";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : params.q?.[0]) || "";

  // Query catalog from MongoDB
  const query = parseCollectionQuery({});
  const { items: allProducts } = await getProducts(query);

  const results = q.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <section className="max-w-335 mx-auto px-4 md:px-8 py-8 sm:py-12">
      {/* Search input */}
      <div className="max-w-2xl mx-auto mb-10">
        <form action="/search" method="GET">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              name="q"
              type="search"
              defaultValue={q}
              autoFocus
              placeholder="Search for shirts, jeans, t-shirts..."
              className="w-full pl-12 pr-4 py-4 border border-zinc-200 rounded-2xl text-base focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-shadow bg-white shadow-sm"
            />
          </div>
        </form>
      </div>

      {/* Results */}
      {q.trim() ? (
        <>
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
              {results.length > 0
                ? `${results.length} results for "${q}"`
                : `No results for "${q}"`}
            </h1>
            {results.length === 0 && (
              <p className="text-zinc-500 text-sm mt-2">
                Try searching with different keywords or{" "}
                <Link href="/collections" className="text-orange-600 hover:text-orange-700 font-medium">
                  browse all products
                </Link>
              </p>
            )}
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-zinc-300" />
          </div>
          <p className="text-zinc-500 text-sm">
            Start typing to search for products
          </p>
        </div>
      )}
    </section>
  );
}
