import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function SeasonSaleBanner() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6">
      <div className="bg-[#fcf5eb] rounded-xl sm:rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between min-h-[200px] sm:min-h-[220px]">
        {/* Left Side (Image Placeholder) */}
        <div className="w-full md:w-[35%] h-[120px] sm:h-[150px] md:h-full bg-orange-200 relative">
          <div className="absolute inset-0 flex items-center justify-center text-orange-600/40 text-xs sm:text-sm font-semibold">
            T-Shirts Image
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 py-6 sm:py-8 px-5 sm:px-6 text-center md:text-left z-10 flex flex-col items-center md:items-start justify-center">
          <h4 className="text-zinc-500 font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-1">
            Season Sale
          </h4>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-zinc-900 leading-none tracking-tight">
            FLAT <span className="text-orange-500">30% OFF</span>
          </h2>
          <p className="text-zinc-600 text-[13px] sm:text-[15px] font-medium mt-2">
            On Selected Garments
          </p>
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6 sm:px-7 h-9 sm:h-10 text-[12px] sm:text-[13px] font-semibold mt-4 sm:mt-5 gap-1.5 border-none w-fit">
            Shop Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Right Side (Image Placeholder) */}
        <div className="w-full md:w-[30%] h-[150px] sm:h-[200px] md:h-full bg-[#e8d5c4] relative hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500/40 text-sm font-semibold">
            Model Image
          </div>

          {/* Stamp / Badge */}
          <div className="absolute top-1/2 -translate-y-1/2 right-6 lg:right-10 bg-[#f9e9d6] w-20 h-20 lg:w-24 lg:h-24 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-sm border border-orange-200/50">
            <p className="text-[9px] lg:text-[10px] font-bold text-zinc-800 leading-[1.2] tracking-wider uppercase">
              Good
              <br />
              Style
              <br />
              Better
              <br />
              Prices
            </p>
            <div className="w-3 lg:w-4 h-0.5 bg-orange-500 mt-1 lg:mt-1.5 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
