"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[500px] bg-[#f0ece5]">
      {/* Full-width Hero Images — Background Slider */}
      <div className="absolute inset-0 z-0 overflow-hidden" ref={emblaRef}>
        <div className="flex w-full h-full">
          {/* Slide 0 */}
          <div className="relative flex-[0_0_100%] h-full">
            <Image
              src="/images/hero-banner.png"
              alt="Fashion collection - Everyday Style for Every You"
              fill
              priority
              className="object-cover object-[40%_top] sm:object-[50%_top] md:object-[65%_top] lg:object-top"
              sizes="100vw"
            />
          </div>

          {/* Slide 1 Placeholder */}
          <div className="relative flex-[0_0_100%] h-full bg-[#e5f0ea]">
            <div className="w-full h-full flex items-center justify-end pr-10 lg:pr-32">
              <span className="text-4xl lg:text-6xl font-bold text-green-900/10">
                Placeholder 2
              </span>
            </div>
          </div>

          {/* Slide 2 Placeholder */}
          <div className="relative flex-[0_0_100%] h-full bg-[#e5e7f0]">
            <div className="w-full h-full flex items-center justify-end pr-10 lg:pr-32">
              <span className="text-4xl lg:text-6xl font-bold text-blue-900/10">
                Placeholder 3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background watermark text — right side (hidden on mobile) */}
      <div className="absolute inset-0 flex-col items-end justify-center pr-6 lg:pr-12 overflow-hidden pointer-events-none z-15 hidden md:flex">
        <p
          className="text-[72px] lg:text-[96px] font-extrabold text-white/30 leading-none tracking-tight text-right select-none"
          style={{ WebkitTextStroke: "1px rgba(0,0,0,0.04)" }}
        >
          STYLE
          <br />
          COMFORT
          <br />
          CONFIDENCE
        </p>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col md:flex-row min-h-[460px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[500px] max-w-[1536px] mx-auto w-full">
        {/* Left Content */}
        <div className="flex-1 px-5 sm:px-6 md:px-12 lg:px-16 py-10 sm:py-10 md:py-16 flex flex-col justify-start sm:justify-center">
          <div className="space-y-4 sm:space-y-5 max-w-[240px] sm:max-w-lg mt-6 sm:mt-0">
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              New Collection
            </p>
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[64px] font-extrabold leading-[1.05] text-zinc-900 tracking-tight">
              Everyday Style
              <br />
              for <span className="text-orange-500">Every You</span>
            </h1>
            <p className="text-[12px] sm:text-[15px] text-zinc-500 leading-relaxed max-w-[200px] sm:max-w-none">
              Comfortable. Stylish. Affordable.
              <br className="hidden sm:block" />
              Quality garments for your daily life.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 sm:px-7 h-10 sm:h-11 text-[14px] sm:text-[15px] font-semibold shadow-lg shadow-orange-500/20 gap-2 border-none">
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Trust Badges - Hidden on mobile to save space and match design */}
            <div className="hidden md:flex flex-wrap items-center gap-4 sm:gap-5 pt-5 sm:pt-6 mt-2 border-t border-zinc-300/60">
              <div>
                <p className="font-semibold text-base sm:text-lg text-zinc-900">1000+</p>
                <p className="text-[9px] sm:text-[10px] text-zinc-500">Happy Customers</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-zinc-300/60" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-700 shrink-0" />
                <div>
                  <p className="font-semibold text-[12px] sm:text-[13px] text-zinc-900">
                    Premium
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500">Quality Fabric</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-700 shrink-0" />
                <div>
                  <p className="font-semibold text-[12px] sm:text-[13px] text-zinc-900">
                    Fast
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500">Delivery</p>
                </div>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="flex gap-2 pt-1 sm:pt-4">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => scrollTo(idx)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                    currentSlide === idx ? "bg-orange-500" : "bg-zinc-300 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right — spacer + overlays (hidden on mobile, shown on md+) */}
        <div className="hidden md:block flex-1 relative">
          {/* Slider Arrows */}
          <div className="absolute bottom-6 right-6 z-30 flex gap-2">
            <button
              aria-label="Previous"
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-zinc-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-700" />
            </button>
            <button
              aria-label="Next"
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Slider Arrows (shown only on small screens) */}
        <div className="md:hidden absolute bottom-4 right-4 z-30 flex gap-2">
          <button
            aria-label="Previous"
            onClick={scrollPrev}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-700" />
          </button>
          <button
            aria-label="Next"
            onClick={scrollNext}
            className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-md"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
