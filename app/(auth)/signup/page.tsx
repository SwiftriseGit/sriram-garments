"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/v4";
import { signup } from "@/actions/auth";
import { SignupSchema } from "@/lib/validations/auth";

const ClientSignupSchema = SignupSchema.extend({
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Privacy Policy",
  }),
});

type SignupFormData = z.infer<typeof ClientSignupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(ClientSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      terms: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      const res = await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (!res.success) {
        if (res.errors) {
          Object.entries(res.errors).forEach(([field, messages]) => {
            if (messages && messages[0]) {
              setError(field as keyof SignupFormData, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
        if (res.message) {
          setServerError(res.message);
        }
        // NOTE: We intentionally DO NOT reset the form here,
        // so the user does NOT have to re-type their data!
        return;
      }

      // Success -> navigate to home page
      window.location.href = "/";
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    }
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

        {/* Global server error message */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white border border-zinc-200/70 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 sm:space-y-4.5"
        >
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label
                htmlFor="firstName-input"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                First Name
              </label>
              <input
                id="firstName-input"
                type="text"
                autoComplete="given-name"
                placeholder="John"
                {...register("firstName")}
                className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                  errors.firstName
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                    : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName-input"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Last Name
              </label>
              <input
                id="lastName-input"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                {...register("lastName")}
                className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                  errors.lastName
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                    : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="signup-email-input"
              className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="signup-email-input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                errors.email
                  ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                  : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="signup-phone-input"
              className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
            >
              Phone Number
            </label>
            <input
              id="signup-phone-input"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              {...register("phone")}
              className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                errors.phone
                  ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                  : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password-input"
              className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password-input"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                {...register("password")}
                className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 pr-10 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                  errors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                    : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                }`}
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
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
            ) : (
              <p className="text-zinc-400 text-[11px] mt-1">
                At least 8 chars, 1 letter, 1 number, and 1 special symbol.
              </p>
            )}
          </div>

          {/* Terms Agreement Checkbox */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-zinc-600 pt-1 select-none">
              <input
                type="checkbox"
                {...register("terms")}
                className="accent-orange-500 rounded mt-0.5 cursor-pointer"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/pages/privacy-policy"
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/pages/return-policy"
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2"
                >
                  Terms
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-950 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
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
