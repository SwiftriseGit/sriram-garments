export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-200 rounded-lg" />
        <div className="h-4 w-80 bg-zinc-100 rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200/60 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-zinc-100 rounded" />
              <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
            </div>
            <div className="h-8 w-32 bg-zinc-100 rounded-lg" />
            <div className="h-3 w-20 bg-zinc-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 space-y-4">
          <div className="h-6 w-36 bg-zinc-100 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <div className="h-4 w-20 bg-zinc-100 rounded" />
              <div className="h-4 w-32 bg-zinc-100 rounded" />
              <div className="h-4 w-16 bg-zinc-100 rounded-full" />
              <div className="ml-auto h-4 w-20 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-2xl p-6 space-y-5">
          <div className="h-6 w-32 bg-zinc-100 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-zinc-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                <div className="h-3 w-1/2 bg-zinc-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
