import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Men",
    description: "T-Shirts, Shirts,\nJeans & More",
    bg: "bg-zinc-100",
    imageBg: "bg-zinc-200",
    textColor: "text-zinc-900",
    descColor: "text-zinc-500",
  },
  {
    name: "Women",
    description: "Kurtis, Tops,\nEthnic Wear & More",
    bg: "bg-[#fcf0ec]",
    imageBg: "bg-[#f5d9cf]",
    textColor: "text-zinc-900",
    descColor: "text-zinc-500",
  },
  {
    name: "Kids",
    description: "Trendy Wear\nfor Little Ones",
    bg: "bg-zinc-100",
    imageBg: "bg-zinc-200",
    textColor: "text-zinc-900",
    descColor: "text-zinc-500",
  },
  {
    name: "Offers",
    description: "Best Deals\non Garments",
    bg: "bg-orange-50",
    imageBg: "bg-orange-500",
    textColor: "text-orange-900",
    descColor: "text-orange-700/80",
    isOffer: true,
  },
];

export default function CategoryCards() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Card
            key={cat.name}
            className={`${cat.bg} border-none overflow-hidden relative group cursor-pointer h-[140px] sm:h-[160px] lg:h-[180px] rounded-xl sm:rounded-2xl shadow-none`}
          >
            <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between h-full relative z-10 w-[60%]">
              <div>
                <h3
                  className={`text-base sm:text-xl font-bold mb-1 ${cat.textColor}`}
                >
                  {cat.name}
                </h3>
                <p
                  className={`text-[10px] sm:text-[11px] leading-[1.4] whitespace-pre-line ${cat.descColor}`}
                >
                  {cat.description}
                </p>
              </div>
              <button
                aria-label={`Shop ${cat.name}`}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform mt-2 sm:mt-3"
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </CardContent>

            {/* Image Placeholder */}
            <div className={`absolute right-0 bottom-0 z-0 ${cat.isOffer ? 'w-[65%] h-[85%]' : 'w-[45%] h-full'}`}>
              {cat.isOffer ? (
                <div className="w-full h-full relative right-2">
                  <Image
                    src="/images/discount-bags.png"
                    alt="Best Deals on Garments"
                    fill
                    className="object-contain object-bottom-right"
                    sizes="(max-width: 768px) 65vw, 25vw"
                  />
                </div>
              ) : (
                /* Replace with: /images/category-{name}.png */
                <div
                  className={`w-full h-full ${cat.imageBg} rounded-tl-2xl`}
                />
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
