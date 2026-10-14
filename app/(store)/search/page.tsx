import { getProducts } from "@/lib/data/products";
import { parseCollectionQuery } from "@/lib/catalog/query";
import { formatPrice, discountPercent } from "@/lib/format";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : params.q?.[0]) || "";

  // For now, use the existing product query with default filters
  // When DB is connected, this will use text search
  const query = parseCollectionQuery({});
  const { items: allProducts } = await getProducts(query);

  // Simple client-side text search on dummy data
  const results = q.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <section className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 sm:py-12">
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
              {results.map((product) => {
                const discount = discountPercent(product.price, product.compareAtPrice);
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    <div
                      className="aspect-[3/4] rounded-xl overflow-hidden flex items-center justify-center relative"
                      style={{ backgroundColor: product.color.hex }}
                    >
                      <span
                        className={`text-sm font-bold ${
                          product.color.tone === "dark"
                            ? "text-white/40"
                            : "text-zinc-900/20"
                        }`}
                      >
                        {product.color.name}
                      </span>
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-zinc-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
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
