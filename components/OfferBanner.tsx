import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const coupons = [
  { discount: "10%", minOrder: "₹1499", code: "SR10" },
  { discount: "15%", minOrder: "₹2499", code: "SR15" },
  { discount: "20%", minOrder: "₹3999", code: "SR20" },
];

export default function OfferBanner() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6">
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-6 p-5 sm:p-6 md:p-8 lg:p-10">
          {/* Left — Offer Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-white/80 uppercase mb-1">
              Special Offer
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              BUY 2 GET 1{" "}
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">FREE</span>
            </h3>
            <p className="text-white/90 text-xs sm:text-sm mt-2">
              On T-Shirts &amp; Casual Wear
            </p>
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-5 sm:px-6 h-8 sm:h-9 text-[12px] sm:text-[13px] font-semibold mt-3 sm:mt-4 gap-1.5 border-none">
              Shop Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Right — Coupon Cards */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white rounded-lg sm:rounded-xl w-[110px] sm:w-[130px] md:w-[150px] overflow-hidden shadow-sm"
              >
                <div className="p-2.5 sm:p-3 pb-2 sm:pb-2.5 text-center relative">
                  {/* Small orange % badge */}
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-orange-100 rounded-md flex items-center justify-center">
                    <span className="text-[8px] sm:text-[9px] font-semibold text-orange-500">
                      %
                    </span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] text-zinc-500 font-medium uppercase tracking-wide">
                    Extra
                  </p>
                  <p className="text-lg sm:text-xl font-extrabold text-orange-500 leading-tight">
                    {coupon.discount} OFF
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5">
                    on orders above
                  </p>
                  <p className="font-semibold text-xs sm:text-sm text-zinc-900">
                    {coupon.minOrder}
                  </p>
                </div>
                <div className="border-t border-dashed border-zinc-300 px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                  <p className="text-[10px] sm:text-[11px] text-zinc-500">
                    Code:{" "}
                    <span className="font-semibold text-zinc-900">
                      {coupon.code}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
