"use server";

import crypto from "crypto";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/User";
import PasswordResetModel from "@/lib/models/PasswordReset";
import { sendPasswordResetOtpEmail } from "@/lib/email/mailer";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";

// Constant-time, salted OTP hash
function hashOtp(email: string, otp: string): string {
  const secret = process.env.SESSION_SECRET || "sriram-garments-otp-secret";
  return crypto
    .createHash("sha256")
    .update(`${email.toLowerCase()}:${otp}:${secret}`)
    .digest("hex");
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Step 1: Request 6-digit OTP for password reset
 */
export async function requestPasswordResetOtp(
  rawEmail: string
): Promise<PasswordResetResponse> {
  const parsed = ForgotPasswordSchema.safeParse({ email: rawEmail });
  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email } = parsed.data;

  await connectDB();

  // 1. Check if user exists in database before proceeding
  const normalizedEmail = email.toLowerCase().trim();
  const user = await UserModel.findOne({ email: normalizedEmail });
  if (!user) {
    return {
      success: false,
      message: "No user found with this email address. Please check your email or sign up.",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      message: "This account has been deactivated. Please contact support.",
    };
  }

  // Rate limit check: has an OTP been created within the last 60 seconds?
  const existingReset = await PasswordResetModel.findOne({ email }).lean();
  if (existingReset) {
    const timeSinceLastOtp = Date.now() - new Date(existingReset.createdAt).getTime();
    if (timeSinceLastOtp < 60 * 1000) {
      const waitSeconds = Math.ceil((60 * 1000 - timeSinceLastOtp) / 1000);
      return {
        success: false,
        message: `Please wait ${waitSeconds} seconds before requesting another code.`,
      };
    }
  }

  // Generate cryptographically secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = hashOtp(email, otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Remove any previous active reset tokens for this email and save new one
  await PasswordResetModel.deleteMany({ email });
  await PasswordResetModel.create({
    email,
    otpHash,
    expiresAt,
    attempts: 0,
  });

  // Send email via nodemailer
  const emailResult = await sendPasswordResetOtpEmail({
    toEmail: email,
    otp,
    firstName: user.firstName,
  });

  if (!emailResult.success) {
    return {
      success: false,
      message: emailResult.message || "Could not send verification email. Please try again later.",
    };
  }

  return {
    success: true,
    message: "A 6-digit verification code has been sent to your email address.",
  };
}

/**
 * Step 2: Verify OTP and update password
 */
export async function verifyOtpAndResetPassword(
  input: ResetPasswordInput
): Promise<PasswordResetResponse> {
  const parsed = ResetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, otp, password } = parsed.data;

  await connectDB();

  // Find reset record
  const resetRecord = await PasswordResetModel.findOne({ email });
  if (!resetRecord) {
    return {
      success: false,
      message: "No active password reset request found. Please request a new code.",
    };
  }

  // Check expiration
  if (new Date() > resetRecord.expiresAt) {
    await PasswordResetModel.deleteMany({ email });
    return {
      success: false,
      message: "Verification code has expired. Please request a new code.",
    };
  }

  // Check attempt limit
  if (resetRecord.attempts >= 5) {
    await PasswordResetModel.deleteMany({ email });
    return {
      success: false,
      message: "Too many incorrect attempts. Please request a new verification code.",
    };
  }

  // Verify OTP
  const inputHash = hashOtp(email, otp);
  if (inputHash !== resetRecord.otpHash) {
    resetRecord.attempts += 1;
    await resetRecord.save();
    const remaining = 5 - resetRecord.attempts;
    return {
      success: false,
      message: `Invalid verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : "Please request a new code."}`,
      errors: { otp: ["Incorrect verification code"] },
    };
  }

  // OTP is valid! Find user and update password
  const user = await UserModel.findOne({ email, isActive: true });
  if (!user) {
    return {
      success: false,
      message: "User account not found.",
    };
  }

  // Set new password (pre-save hook will hash it with PBKDF2)
  user.password = password;
  await user.save();

  // Invalidate OTP completely from DB so it can NEVER be reused
  await PasswordResetModel.deleteMany({ email });

  return {
    success: true,
    message: "Your password has been successfully reset. You can now sign in.",
  };
}
