import { getNewArrivals } from "@/lib/data/products";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

export default async function NewArrivals() {
  const products = await getNewArrivals(6);

  if (products.length === 0) {
    return (
      <section className="max-w-335 mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
        <div className="flex justify-between items-end mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            New{" "}
            <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
              Arrivals
            </span>
          </h2>
          <Link
            href="/collections"
            className="text-xs sm:text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
          >
            Explore Catalog
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-8 sm:p-12 text-center">
          <Sparkles className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-zinc-900">New Collection Coming Soon</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Our latest seasonal arrivals are being prepared. Check back shortly or browse our current catalog.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-335 mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
          New{" "}
          <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
            Arrivals
          </span>
        </h2>
        <Link
          href="/collections"
          className="text-xs sm:text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
