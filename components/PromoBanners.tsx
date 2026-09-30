import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Premium Shirts Banner */}
        <div className="relative bg-zinc-900 rounded-xl sm:rounded-2xl overflow-hidden h-[180px] sm:h-[220px] md:h-[240px] flex">
          <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center z-10 flex-1">
            <h3 className="text-white text-xs sm:text-sm font-medium tracking-wide uppercase">
              Premium
            </h3>
            <p className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold mt-0.5">
              SHIRTS
            </p>
            <p className="text-zinc-400 text-[12px] sm:text-[13px] mt-1">
              For Every Occasion
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 sm:px-6 h-8 sm:h-9 text-[12px] sm:text-[13px] font-semibold mt-3 sm:mt-4 w-fit gap-1.5 border-none">
              Shop Shirts
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
          {/* Image Placeholder — replace with: /images/promo-shirts.png */}
          <div className="w-[40%] sm:w-[45%] h-full bg-zinc-800 shrink-0" />
        </div>

        {/* Trendy T-Shirts Banner */}
        <div className="relative bg-[#f0ece5] rounded-xl sm:rounded-2xl overflow-hidden h-[180px] sm:h-[220px] md:h-[240px] flex">
          <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center z-10 flex-1">
            <h3 className="text-zinc-900 text-xs sm:text-sm font-medium tracking-wide uppercase">
              Trendy
            </h3>
            <p className="text-zinc-900 text-2xl sm:text-3xl md:text-4xl font-extrabold mt-0.5">
              T-SHIRTS
            </p>
            <p className="text-zinc-500 text-[12px] sm:text-[13px] mt-1">
              Comfort Meets Style
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 sm:px-6 h-8 sm:h-9 text-[12px] sm:text-[13px] font-semibold mt-3 sm:mt-4 w-fit gap-1.5 border-none">
              Shop T-Shirts
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
          {/* Image Placeholder — replace with: /images/promo-tshirts.png */}
          <div className="w-[40%] sm:w-[45%] h-full bg-[#d9d2c4] shrink-0" />
        </div>
      </div>
    </section>
  );
}
