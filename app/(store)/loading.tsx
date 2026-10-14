export default function StoreLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-[400px] sm:h-[500px] lg:h-[600px] bg-zinc-100" />

      {/* Category Cards Skeleton */}
      <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-[200px] lg:h-[240px] bg-zinc-100 rounded-2xl" />
          <div className="h-[200px] lg:h-[240px] bg-zinc-100 rounded-2xl" />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-10">
        <div className="h-8 w-48 bg-zinc-100 rounded-lg mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-zinc-100 rounded-xl" />
              <div className="h-4 w-3/4 bg-zinc-100 rounded" />
              <div className="h-4 w-1/2 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
