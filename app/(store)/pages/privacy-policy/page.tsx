import React from "react";
import { ShieldCheck, RefreshCcw, Clock, AlertCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="mb-8 sm:mb-12 text-center max-w-xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
          Privacy{" "}
          <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
            Policy
          </span>
        </h1>
        <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500 leading-relaxed">
          Your privacy matters to us. Here&apos;s how we handle your data.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
        {[
          {
            icon: ShieldCheck,
            title: "1. Information We Collect",
            content:
              "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, payment method, items requested, delivery notes, and other information you choose to provide.",
          },
          {
            icon: RefreshCcw,
            title: "2. How We Use Your Information",
            content:
              "We may use the information we collect about you to provide, maintain, and improve our services — facilitating payments, sending receipts, providing products and services you request, developing new features, providing customer support, developing safety features, authenticating users, and sending product updates and administrative messages.",
          },
          {
            icon: AlertCircle,
            title: "3. Information Sharing And Disclosure",
            content:
              "We may share the information we collect about you with vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf. We do not sell your personal data to third parties.",
          },
          {
            icon: Clock,
            title: "4. Data Retention",
            content:
              "We retain the information we collect for as long as your account is active, or as needed to provide you services. If you wish to cancel your account or request that we no longer use your data, please contact us at support@sriramgarments.in.",
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

        {/* Contact */}
        <div className="text-center pt-4 sm:pt-6">
          <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500">
            Questions about our privacy practices?{" "}
            <a href="/pages/contact" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
              Contact Us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
