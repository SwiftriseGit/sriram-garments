export default function CollectionsLoading() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="h-4 w-48 bg-zinc-100 rounded mb-6" />

      {/* Title */}
      <div className="h-8 w-56 bg-zinc-100 rounded-lg mb-8" />

      <div className="flex gap-8">
        {/* Filter sidebar skeleton */}
        <div className="hidden lg:block w-64 shrink-0 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-24 bg-zinc-100 rounded" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-36 bg-zinc-100 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="h-4 w-32 bg-zinc-100 rounded" />
            <div className="h-9 w-44 bg-zinc-100 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-zinc-100 rounded-xl" />
                <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                <div className="h-4 w-1/2 bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
