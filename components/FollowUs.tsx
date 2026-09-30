import { ArrowRight } from "lucide-react";

const instagramPosts = [
  "bg-zinc-800",
  "bg-orange-800",
  "bg-stone-700",
  "bg-zinc-700",
  "bg-green-800",
  "bg-blue-800",
];

export default function FollowUs() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10 md:py-14">
      <div className="flex justify-between items-end mb-5 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            Follow Us <span className="font-semibold text-zinc-600 text-base sm:text-2xl md:text-3xl">@sriramgarments</span>
          </h2>
          <div className="w-10 sm:w-12 h-1 bg-orange-500 mt-2" />
        </div>
        <a
          href="#"
          className="text-xs sm:text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        {instagramPosts.map((bg, idx) => (
          <div
            key={idx}
            className={`aspect-square ${bg} rounded-lg sm:rounded-xl overflow-hidden relative group cursor-pointer ${
              idx >= 3 ? "hidden sm:block" : ""
            }`}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] sm:text-xs font-semibold">
              Insta Post
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
