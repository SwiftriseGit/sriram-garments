import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function StyleMoment() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 pb-0">
      <div className="relative bg-zinc-900 rounded-xl sm:rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[280px] md:min-h-[320px] flex">
        {/* Left Content */}
        <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center z-10 flex-1">
          <p className="text-white/80 text-xs sm:text-sm font-medium">Style for</p>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mt-1 leading-tight">
            Every Moment
          </h3>
          <p className="text-white/60 text-xs sm:text-sm mt-2 sm:mt-3">
            Casual
            <span className="mx-1.5 sm:mx-2 text-white/30">|</span>
            Office
            <span className="mx-1.5 sm:mx-2 text-white/30">|</span>
            Festive
            <span className="mx-1.5 sm:mx-2 text-white/30">|</span>
            Everyday
          </p>
          <Button
            variant="outline"
            className="mt-4 sm:mt-5 w-fit rounded-full px-5 sm:px-6 h-8 sm:h-9 text-[12px] sm:text-[13px] font-semibold gap-1.5 border-white/50 text-white hover:bg-white hover:text-zinc-900 transition-colors bg-transparent"
          >
            Shop Collection
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Right — Image Placeholder */}
        {/* Replace with: /images/style-moment.png */}
        <div className="hidden md:block w-[50%] h-full absolute right-0 top-0 bg-zinc-800" />
      </div>
    </section>
  );
}
