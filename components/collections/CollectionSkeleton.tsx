import { ProductCardSkeleton } from "@/components/product/ProductCard";

/** Suspense fallback for the first load of the collection page. */
export default function CollectionSkeleton() {
  return (
    <div aria-hidden>
      <div className="flex items-center justify-between mb-6 sm:mb-8 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 rounded-full bg-zinc-100" />
          <div className="h-4 w-16 rounded bg-zinc-100" />
        </div>
        <div className="h-9 w-44 rounded-full bg-zinc-100" />
      </div>

      <div className="flex">
        <div className="hidden lg:block w-60 mr-10 shrink-0 space-y-4 animate-pulse">
          <div className="h-5 w-20 rounded bg-zinc-100" />
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="h-4 rounded bg-zinc-100" />
          ))}
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
