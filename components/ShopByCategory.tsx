import Image from "next/image";
import Link from "next/link";
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 pt-3 pb-5">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="relative group block cursor-pointer focus:outline-none select-none"
          >
            {/* The Card Box - strictly wraps name, details, and button */}
            <div className="bg-zinc-100 group-hover:bg-zinc-100/90 rounded-2xl h-[135px] sm:h-[150px] lg:h-[165px] w-[60%] sm:w-[62%] p-3.5 sm:p-5 flex flex-col justify-between border border-zinc-200/60 group-hover:border-zinc-300 group-hover:shadow-sm transition-all duration-300">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-zinc-500 mt-1 leading-snug">
                  Starting at{" "}
                  <span className="font-semibold text-zinc-800 block sm:inline">
                    {cat.startingPrice}
                  </span>
                </p>
              </div>

              <div
                aria-label={`Shop ${cat.name}`}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-zinc-300 bg-white text-zinc-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-colors mt-2"
              >
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>

            {/* Product Image - Outside the border on transparent background, bigger & floating */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[54%] sm:w-[56%] lg:w-[58%] h-[120%] sm:h-[130%] lg:h-[135%] z-10 pointer-events-none">
              <Image
                src={cat.image}
                alt={cat.alt}
                fill
                className="object-contain object-right drop-shadow-[0_8px_18px_rgba(0,0,0,0.14)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
