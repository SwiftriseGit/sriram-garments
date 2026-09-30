import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Mehta",
    feedback: "Great quality and perfect fitting. Really happy with the purchase!",
    image: "bg-zinc-300",
  },
  {
    name: "Amit Pattnaik",
    feedback: "Good fabric and stylish designs. Delivery was also very fast.",
    image: "bg-stone-300",
  },
  {
    name: "Suresh Kumar",
    feedback: "Best local brand for daily wear. Affordable and good quality.",
    image: "bg-zinc-300",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-zinc-50 border-y border-zinc-100 py-10 sm:py-12 md:py-16">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              What Our Customers Say
            </h2>
            <div className="w-10 sm:w-12 h-1 bg-orange-500 mt-2" />
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Previous"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:border-orange-500 transition-colors bg-white"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              aria-label="Next"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:border-orange-500 transition-colors bg-white"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl flex gap-3 sm:gap-4 shadow-sm border border-zinc-100/50 ${
                idx === 2 ? "hidden sm:flex" : ""
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${t.image} shrink-0 flex items-center justify-center overflow-hidden`}>
                <div className="w-full h-full bg-zinc-200" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900">{t.name}</h4>
                <div className="flex gap-0.5 mt-1 mb-1.5 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <p className="text-[12px] sm:text-[13px] text-zinc-500 leading-relaxed font-medium">
                  &quot;{t.feedback}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
