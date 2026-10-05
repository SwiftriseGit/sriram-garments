import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CategoryCards() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Men's Collection */}
        <a
          href="/collections"
          className="relative group cursor-pointer h-[180px] sm:h-[200px] lg:h-[240px] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900"
        >
          <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-zinc-800 rounded-tl-[80px]" />

          <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                Men&apos;s
              </h3>
              <p className="text-[11px] sm:text-[12px] font-medium text-zinc-400 leading-relaxed">
                T-Shirts, Shirts, Jeans &amp; More
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-[12px] font-semibold text-white group-hover:text-orange-400 transition-colors">
                Shop Now
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </a>

        {/* Offers */}
        <a
          href="/collections"
          className="relative group cursor-pointer h-[180px] sm:h-[200px] lg:h-[240px] rounded-xl sm:rounded-2xl overflow-hidden bg-orange-50"
        >
          <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex flex-col justify-between h-full w-[55%]">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900 mb-1">
                Offers
              </h3>
              <p className="text-[11px] sm:text-[12px] font-medium text-orange-700/70 leading-relaxed">
                Best Deals on Garments
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-[12px] font-semibold text-orange-900 group-hover:text-orange-600 transition-colors">
                Shop Offers
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>

          {/* Bags Image */}
          <div className="absolute right-0 bottom-0 w-[50%] h-[85%] z-0">
            <Image
              src="/images/discount-bags.png"
              alt="Best Deals"
              fill
              className="object-contain object-bottom-right group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </a>
      </div>
    </section>
  );
}
