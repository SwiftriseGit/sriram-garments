import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="mb-8 sm:mb-12 text-center max-w-xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
          Contact{" "}
          <span className="text-orange-500 underline underline-offset-4 decoration-2 decoration-orange-500">
            Us
          </span>
        </h1>
        <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500 leading-relaxed">
          We&apos;d love to hear from you. Reach out with any questions, concerns, or feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left — Contact Info + Form */}
        <div className="space-y-8">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: MapPin, title: "Visit Us", lines: ["123 Fashion Street,", "Bhubaneswar, Odisha 751001"] },
              { icon: Phone, title: "Call Us", lines: ["+91 98765 43210", "Mon-Sat: 10am - 8pm"] },
              { icon: Mail, title: "Email Us", lines: ["support@sriramgarments.in"] },
              { icon: Clock, title: "Working Hours", lines: ["Monday - Saturday", "10:00 AM - 08:00 PM"] },
            ].map((item) => (
              <div key={item.title} className="bg-zinc-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-zinc-100 group hover:border-orange-100 hover:bg-orange-50/30 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-bold text-[13px] sm:text-[14px] text-zinc-900 mb-1">{item.title}</h3>
                {item.lines.map((line) => (
                  <p key={line} className="text-[11px] sm:text-[12px] font-medium text-zinc-500 leading-relaxed">{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-50 p-5 sm:p-7 rounded-xl sm:rounded-2xl border border-zinc-100">
            <h3 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-5">Send a Message</h3>
            <form className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-[11px] sm:text-[12px] font-semibold text-zinc-700">Full Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    className="w-full px-3.5 py-2.5 rounded-lg sm:rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-[12px] sm:text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-[11px] sm:text-[12px] font-semibold text-zinc-700">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    className="w-full px-3.5 py-2.5 rounded-lg sm:rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-[12px] sm:text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 bg-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-[11px] sm:text-[12px] font-semibold text-zinc-700">Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-lg sm:rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors resize-none text-[12px] sm:text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 bg-white"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg sm:rounded-xl transition-colors text-[12px] sm:text-[13px]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Right — Map */}
        <div className="h-full min-h-[350px] lg:min-h-0 w-full bg-zinc-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53374959453!2d85.7380517529881!3d20.300870216790753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33cbb!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1711202888123!5m2!1sen!2sin"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
