import React from "react";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="mb-8 sm:mb-12 text-center max-w-xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
          About{" "}
          <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
            Us
          </span>
        </h1>
        <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500 leading-relaxed">
          Your ultimate destination for high-quality, stylish, and comfortable clothing.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Our Story */}
        <div className="bg-zinc-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-zinc-100">
          <h2 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4">Our Story</h2>
          <p className="text-[12px] sm:text-[13px] font-medium text-zinc-600 leading-relaxed">
            Welcome to <strong className="text-zinc-900">SriRam Garments</strong>, your ultimate destination for high-quality, stylish, and comfortable clothing. We believe that fashion should be accessible, durable, and uniquely you. Founded with a passion for exceptional textiles and modern trends, we carefully curate each piece in our collection.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-zinc-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-zinc-100">
          <h2 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4">Our Mission</h2>
          <p className="text-[12px] sm:text-[13px] font-medium text-zinc-600 leading-relaxed">
            Our mission is simple: to provide our customers with garments that make them look and feel their absolute best. Whether you&apos;re dressing up for a special occasion or keeping it casual for the weekend, SriRam Garments has something perfect for every moment in your life.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: "Quality First", desc: "Every garment meets our strict standards for quality and craftsmanship." },
            { title: "Modern Trends", desc: "From everyday essentials to statement pieces, always on-trend." },
            { title: "Affordable Style", desc: "Premium clothing that doesn't break the bank." },
          ].map((item) => (
            <div key={item.title} className="bg-zinc-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-zinc-100 text-center group hover:border-orange-100 hover:bg-orange-50/30 transition-colors">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-orange-100 transition-colors">
                <span className="text-lg font-bold">✦</span>
              </div>
              <h3 className="font-bold text-[13px] sm:text-[14px] text-zinc-900 mb-1.5">{item.title}</h3>
              <p className="text-[11px] sm:text-[12px] font-medium text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Thank You */}
        <div className="text-center py-4 sm:py-6">
          <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500 leading-relaxed">
            Thank you for choosing us to be a part of your style journey! 🧡
          </p>
        </div>
      </div>
    </section>
  );
}
