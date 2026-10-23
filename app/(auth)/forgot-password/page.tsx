"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  KeyRound,
  RotateCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import {
  requestPasswordResetOtp,
  verifyOtpAndResetPassword,
} from "@/actions/password-reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [targetEmail, setTargetEmail] = useState("");
  const [serverMessage, setServerMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const router = useRouter();

  // Cooldown countdown effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Form 1: Request OTP
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors, isSubmitting: isSubmittingRequest },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  // Form 2: Verify OTP & Reset Password
  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    setValue: setVerifyValue,
    setError: setVerifyError,
    formState: { errors: verifyErrors, isSubmitting: isSubmittingVerify },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Handle Step 1 submit
  const onRequestOtp = async (data: ForgotPasswordInput) => {
    setServerMessage(null);
    try {
      const res = await requestPasswordResetOtp(data.email);
      if (!res.success) {
        setServerMessage({ type: "error", text: res.message });
        return;
      }

      setTargetEmail(data.email);
      setVerifyValue("email", data.email);
      setResendCooldown(60);
      setStep("verify");
      setServerMessage({
        type: "success",
        text: `A 6-digit code has been sent to ${data.email}. Please check your inbox.`,
      });
    } catch {
      setServerMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending || !targetEmail) return;
    setIsResending(true);
    setServerMessage(null);

    try {
      const res = await requestPasswordResetOtp(targetEmail);
      if (!res.success) {
        setServerMessage({ type: "error", text: res.message });
      } else {
        setResendCooldown(60);
        setServerMessage({
          type: "success",
          text: `A new 6-digit code has been sent to ${targetEmail}.`,
        });
      }
    } catch {
      setServerMessage({
        type: "error",
        text: "Failed to resend code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Handle Step 2 submit
  const onResetPassword = async (data: ResetPasswordInput) => {
    setServerMessage(null);
    try {
      const res = await verifyOtpAndResetPassword(data);
      if (!res.success) {
        if (res.errors) {
          Object.entries(res.errors).forEach(([field, messages]) => {
            if (messages && messages[0]) {
              setVerifyError(field as keyof ResetPasswordInput, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
        setServerMessage({ type: "error", text: res.message });
        return;
      }

      setResetSuccess(true);
      setServerMessage({
        type: "success",
        text: "Password reset successful! Redirecting to login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch {
      setServerMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Main Content Card Container */}
      <div className="w-full max-w-md mx-auto my-auto py-4 sm:py-6">
        {/* Back to Login Button */}
        <div className="mb-4 flex items-center justify-start">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200/80 px-3.5 py-1.5 rounded-full shadow-xs hover:bg-zinc-50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-700" />
            <span>Back to Login</span>
          </Link>
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
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            {step === "request" ? "Forgot Password" : "Reset Password"}
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1">
            {step === "request"
              ? "Enter your email to receive a 6-digit verification code"
              : `Enter the code sent to ${targetEmail}`}
          </p>
        </div>

        {/* Server message banner */}
        {serverMessage && (
          <div
            className={`border text-sm px-4 py-3 rounded-xl mb-4 flex items-start gap-2.5 animate-in fade-in duration-200 ${
              serverMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {serverMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <span className="text-xs sm:text-sm font-medium">{serverMessage.text}</span>
          </div>
        )}

        {/* STEP 1: REQUEST OTP */}
        {step === "request" && (
          <form
            onSubmit={handleSubmitRequest(onRequestOtp)}
            noValidate
            className="bg-white border border-zinc-200/70 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 sm:space-y-5"
          >
            <div>
              <label
                htmlFor="request-email-input"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  id="request-email-input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...registerRequest("email")}
                  className={`w-full px-4 py-2.5 sm:py-3 pl-10 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                    requestErrors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                      : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  }`}
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {requestErrors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {requestErrors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingRequest}
              className="w-full bg-zinc-950 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmittingRequest ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Sending code...</span>
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP & SET NEW PASSWORD */}
        {step === "verify" && (
          <form
            onSubmit={handleSubmitVerify(onResetPassword)}
            noValidate
            className="bg-white border border-zinc-200/70 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 sm:space-y-4.5"
          >
            {/* Target email badge with change button */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-zinc-800 truncate">
                  {targetEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setServerMessage(null);
                }}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 shrink-0 ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* 6-Digit OTP */}
            <div>
              <label
                htmlFor="otp-input"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                6-Digit Verification Code
              </label>
              <div className="relative">
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="123456"
                  {...registerVerify("otp")}
                  className={`w-full px-4 py-2.5 sm:py-3 border rounded-xl text-center text-lg font-mono tracking-[0.35em] font-bold outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-zinc-400 ${
                    verifyErrors.otp
                      ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                      : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  }`}
                />
              </div>
              {verifyErrors.otp && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {verifyErrors.otp.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password-input"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  {...registerVerify("password")}
                  className={`w-full px-4 py-2.5 sm:py-3 pr-10 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                    verifyErrors.password
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
              {verifyErrors.password ? (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {verifyErrors.password.message}
                </p>
              ) : (
                <p className="text-zinc-400 text-[11px] mt-1">
                  At least 8 chars, 1 letter, 1 number, and 1 special symbol.
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirm-password-input"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password-input"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  {...registerVerify("confirmPassword")}
                  className={`w-full px-4 py-2.5 sm:py-3 pr-10 border rounded-xl text-sm outline-none transition-all placeholder:text-zinc-400 ${
                    verifyErrors.confirmPassword
                      ? "border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
                      : "border-zinc-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {verifyErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {verifyErrors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Resend Code Button with countdown */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <span className="text-zinc-500">Didn&apos;t receive code?</span>
              <button
                type="button"
                disabled={resendCooldown > 0 || isResending}
                onClick={handleResendOtp}
                className="text-orange-600 hover:text-orange-700 font-semibold disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isResending ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend code in ${resendCooldown}s`
                ) : (
                  "Resend Code"
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingVerify || resetSuccess}
              className="w-full bg-zinc-950 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmittingVerify ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying & resetting...</span>
                </>
              ) : resetSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Password Reset! Redirecting...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-xs sm:text-sm text-zinc-500 mt-6">
          Remember your password?{" "}
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
