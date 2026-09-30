import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "T-Shirts",
    startingPrice: "₹399",
    bg: "bg-zinc-100",
    imageBg: "bg-zinc-200",
  },
  {
    name: "Shirts",
    startingPrice: "₹599",
    bg: "bg-zinc-100",
    imageBg: "bg-stone-200",
  },
  {
    name: "Jeans",
    startingPrice: "₹899",
    bg: "bg-zinc-100",
    imageBg: "bg-blue-100",
  },
  {
    name: "Ethnic Wear",
    startingPrice: "₹699",
    bg: "bg-zinc-100",
    imageBg: "bg-amber-50",
  },
];

export default function ShopByCategory() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
          Shop By{" "}
          <span className="text-orange-500">Category</span>
        </h2>
        <a
          href="#"
          className="text-xs sm:text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Card
            key={cat.name}
            className={`${cat.bg} border-none overflow-hidden relative group cursor-pointer h-[130px] sm:h-[145px] lg:h-[160px] rounded-xl sm:rounded-2xl shadow-none hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between h-full relative z-10 w-[55%]">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-zinc-900">
                  {cat.name}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-zinc-500 mt-0.5">
                  Starting at{" "}
                  <span className="font-semibold text-zinc-700">
                    {cat.startingPrice}
                  </span>
                </p>
              </div>
              <button
                aria-label={`Shop ${cat.name}`}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-zinc-300 text-zinc-500 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors mt-2"
              >
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </CardContent>

            {/* Image Placeholder — replace with: /images/category-{name}.png */}
            <div
              className={`absolute right-0 top-0 w-[48%] h-full ${cat.imageBg} z-0`}
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
