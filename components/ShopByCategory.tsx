import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "T-Shirts",
    startingPrice: "₹399",
    bg: "bg-zinc-100",
    image: "/images/category-tshirts.png",
    alt: "T-Shirts Collection",
    href: "/collections?category=t-shirts",
  },
  {
    name: "Shirts",
    startingPrice: "₹599",
    bg: "bg-zinc-100",
    image: "/images/category-shirts.png",
    alt: "Shirts Collection",
    href: "/collections?category=shirts",
  },
  {
    name: "Jeans",
    startingPrice: "₹899",
    bg: "bg-zinc-100",
    image: "/images/category-jeans.png",
    alt: "Jeans Collection",
    href: "/collections?category=jeans",
  },
  {
    name: "Ethnic Wear",
    startingPrice: "₹699",
    bg: "bg-zinc-100",
    image: "/images/category-ethnic.png",
    alt: "Ethnic Wear Collection",
    href: "/collections",
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
        <Link
          href="/collections"
          className="text-xs sm:text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link key={cat.name} href={cat.href} className="group block focus:outline-none">
            <Card
              className={`${cat.bg} border-none overflow-hidden relative h-[130px] sm:h-[145px] lg:h-[160px] rounded-xl sm:rounded-2xl shadow-none hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between h-full relative z-10 w-[55%]">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-zinc-500 mt-0.5">
                    Starting at{" "}
                    <span className="font-semibold text-zinc-700">
                      {cat.startingPrice}
                    </span>
                  </p>
                </div>
                <div
                  aria-label={`Shop ${cat.name}`}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-zinc-300 text-zinc-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-colors mt-2"
                >
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </CardContent>

              {/* Product Cutout Image */}
              <div className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-[46%] sm:w-[48%] h-[82%] sm:h-[86%] z-0 pointer-events-none">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  className="object-contain object-bottom-right drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 45vw, 25vw"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
