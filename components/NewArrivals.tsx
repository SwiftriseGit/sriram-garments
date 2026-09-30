import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

interface Product {
  name: string;
  price: number;
}

const products: Product[] = [
  { name: "Oversized T-Shirt", price: 499 },
  { name: "Casual Shirt", price: 699 },
  { name: "Printed T-Shirt", price: 499 },
  { name: "Polo T-Shirt", price: 599 },
  { name: "Linen Shirt", price: 799 },
  { name: "Formal Shirt", price: 799 },
];

/* Placeholder background colors to visually distinguish product images */
const placeholderColors = [
  "bg-zinc-200",
  "bg-stone-200",
  "bg-zinc-200",
  "bg-amber-50",
  "bg-zinc-200",
  "bg-stone-200",
];

export default function NewArrivals() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
          New{" "}
          <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
            Arrivals
          </span>
        </h2>
        <a
          href="#"
          className="text-xs sm:text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product, index) => (
          <div key={product.name} className="group cursor-pointer">
            {/* Image Container */}
            <div
              className={`relative aspect-[3/3.5] ${placeholderColors[index]} rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-2.5`}
            >
              {/* Wishlist Heart */}
              <button
                aria-label="Add to wishlist"
                className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow"
              >
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 hover:text-orange-500 transition-colors" />
              </button>

              {/* Replace with: /images/product-{index+1}.png */}
              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] sm:text-xs">
                Product Image
              </div>
            </div>

            {/* Product Info */}
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <h3 className="font-semibold text-[11px] sm:text-[13px] text-zinc-900 truncate">
                  {product.name}
                </h3>
                <p className="font-semibold text-[11px] sm:text-[13px] text-zinc-900 mt-0.5">
                  ₹{product.price}
                </p>
              </div>
              <button
                aria-label="Add to cart"
                className="shrink-0 mt-1 text-zinc-400 hover:text-orange-500 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
