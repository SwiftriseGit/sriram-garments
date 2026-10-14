"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribed(true);
    toast.success("Thank you for subscribing to exclusive offers!");
    setEmail("");
  };

  return (
    <section className="bg-[#1f1a17] py-6 sm:py-8 w-full">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 text-white">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border border-orange-500/30 rounded-full flex items-center justify-center bg-orange-500/10 shrink-0">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Get Exclusive Offers & Updates</h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
              Subscribe to our newsletter and never miss a deal.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full md:w-[450px] relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full h-11 sm:h-12 bg-white rounded-full pl-4 sm:pl-5 pr-28 sm:pr-32 border-none text-zinc-900 placeholder:text-zinc-400 text-sm focus-visible:ring-2 focus-visible:ring-orange-500"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1 h-9 sm:h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 font-semibold border-none text-[12px] sm:text-[13px] transition-all"
          >
            {isSubscribed ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Done
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Subscribe <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
