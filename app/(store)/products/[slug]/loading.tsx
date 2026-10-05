/** Instant loading state while a product page renders. */
export default function ProductLoading() {
  return (
    <section
      aria-busy
      className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 animate-pulse"
    >
      <div className="h-3 w-56 rounded bg-zinc-100 mb-8" />
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col gap-2.5 sm:w-20">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-16 sm:w-20 aspect-[4/5] rounded-lg bg-zinc-100" />
            ))}
          </div>
          <div className="flex-1 aspect-[4/5] rounded-2xl bg-zinc-100" />
        </div>
        <div className="space-y-4">
          <div className="h-3 w-20 rounded bg-zinc-100" />
          <div className="h-8 w-3/4 rounded bg-zinc-100" />
          <div className="h-4 w-40 rounded bg-zinc-100" />
          <div className="h-7 w-48 rounded bg-zinc-100 mt-6" />
          <div className="h-px bg-zinc-100 my-6" />
          <div className="flex gap-2.5">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-zinc-100" />
            ))}
          </div>
          <div className="flex gap-2 pt-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="w-12 h-11 rounded-full bg-zinc-100" />
            ))}
          </div>
          <div className="h-12 rounded-full bg-zinc-100 mt-6" />
          <div className="h-12 rounded-full bg-zinc-100" />
        </div>
      </div>
    </section>
  );
}
