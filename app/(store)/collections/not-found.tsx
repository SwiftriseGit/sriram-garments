import Link from "next/link";
import { Search } from "lucide-react";

export default function CollectionsNotFound() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-sm">
        <div className="text-6xl font-black text-zinc-200 select-none">
          404
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 mb-2">
            Collection Not Found
          </h1>
          <p className="text-zinc-500 text-sm">
            We couldn&apos;t find the collection you&apos;re looking for.
          </p>
        </div>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 bg-zinc-950 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          <Search className="w-4 h-4" />
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
