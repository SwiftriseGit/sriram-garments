"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Account created!", {
        description: "Welcome to SriRam Garments. Start shopping now!",
      });
      setIsLoading(false);
      router.push("/profile");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Main Content Card Container */}
      <div className="w-full max-w-md mx-auto my-auto py-4 sm:py-6">
        {/* Back Button on upper left side of form */}
        <div className="mb-4 flex items-center justify-start">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200/80 px-3.5 py-1.5 rounded-full shadow-xs hover:bg-zinc-50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-700" />
            <span>Back</span>
          </button>
        </div>
        {/* Brand Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity mb-3">
            <Image
              src="/logo (2).png"
              alt="SriRam Garments"
              width={200}
              height={65}
              className="h-12 sm:h-14 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1">
            Create an account to start shopping
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-zinc-200/70 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 sm:space-y-4.5"
        >
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                required
                placeholder="John"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                required
                placeholder="Doe"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 pr-10 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-zinc-600 pt-1 select-none">
            <input
              type="checkbox"
              required
              className="accent-orange-500 rounded mt-0.5"
            />
            <span>
              I agree to the{" "}
              <Link href="/pages/privacy-policy" className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/pages/return-policy" className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2">
                Terms
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-950 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-600 hover:text-orange-700 font-semibold transition-colors underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* Bottom subtle note */}
      <div className="text-center text-xs text-zinc-400 pb-2">
        © 2026 SriRam Garments. All rights reserved.
      </div>
    </div>
  );
}
