import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function ProductNotFound() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-24 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-5">
        <PackageSearch className="w-7 h-7 text-orange-500" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">Product not found</h1>
      <p className="text-[13px] text-zinc-500 max-w-sm mb-7">
        This item may have sold out or moved. Explore the rest of our collection instead.
      </p>
      <Link
        href="/collections"
        className="px-7 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold transition-colors"
      >
        Continue shopping
      </Link>
    </section>
  );
}
