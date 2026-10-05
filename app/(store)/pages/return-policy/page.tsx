import React from "react";
import { RotateCcw, PackageCheck, CreditCard, XCircle } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="mb-8 sm:mb-12 text-center max-w-xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
          Return{" "}
          <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
            Policy
          </span>
        </h1>
        <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500 leading-relaxed">
          Hassle-free returns — we&apos;ve got you covered.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
        {[
          {
            icon: RotateCcw,
            title: "1. Return Window",
            content:
              "We accept returns within 7 days of delivery for most items in new condition. Please ensure that tags are still attached and the item has not been washed or worn.",
          },
          {
            icon: PackageCheck,
            title: "2. How to Process a Return",
            content:
              'To start a return, please log into your account, go to "My Orders", and select the item you wish to return. You can also contact our support team to initiate the process manually.',
          },
          {
            icon: CreditCard,
            title: "3. Refunds",
            content:
              "Once we receive and inspect the returned item, we will process your refund to the original payment method within 5-7 business days.",
          },
          {
            icon: XCircle,
            title: "4. Exceptions",
            content:
              "Certain items, such as intimate apparel and clearance items, are final sale and cannot be returned unless defective.",
          },
        ].map((section) => (
          <div
            key={section.title}
            className="bg-zinc-50 rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-zinc-100"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <section.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="font-bold text-[13px] sm:text-[14px] text-zinc-900 mb-2">
                  {section.title}
                </h2>
                <p className="text-[11px] sm:text-[12px] font-medium text-zinc-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="text-center pt-4 sm:pt-6">
          <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500">
            Need help with a return?{" "}
            <a href="/pages/contact" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
              Contact Us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
