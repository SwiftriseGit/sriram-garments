"use server";

import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/User";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  SignupSchema,
  LoginSchema,
  type AuthFormState,
  type SignupInput,
  type LoginInput,
} from "@/lib/validations/auth";

export interface AuthResponse {
  success?: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
}

// ──────────────────────────────────────────────
// Signup Action
// ──────────────────────────────────────────────
export async function signup(
  inputOrState: SignupInput | AuthFormState,
  maybeFormData?: FormData
): Promise<AuthResponse> {
  const isFormData = maybeFormData instanceof FormData;
  const rawData = isFormData
    ? {
        firstName: maybeFormData.get("firstName"),
        lastName: maybeFormData.get("lastName"),
        email: maybeFormData.get("email"),
        phone: maybeFormData.get("phone"),
        password: maybeFormData.get("password"),
      }
    : inputOrState && typeof inputOrState === "object" && "email" in inputOrState
    ? inputOrState
    : {};

  // 1. Validate fields
  const parsed = SignupSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { firstName, lastName, email, phone, password } = parsed.data;

  // 2. Check for duplicate email
  await connectDB();
  const existingUser = await UserModel.findOne({ email }).lean();
  if (existingUser) {
    return {
      success: false,
      errors: { email: ["An account with this email already exists"] },
      message: "An account with this email already exists. Please log in or use a different email.",
    };
  }

  // 3. Create user (password auto-hashed via pre-save hook)
  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    phone,
    password,
  });

  // 4. Create session
  await createSession({
    userId: user._id.toString(),
    email: user.email,
    role: "customer",
    firstName: user.firstName,
  });

  // 5. If called via native HTML form action, redirect
  if (isFormData) {
    redirect("/");
  }

  return { success: true };
}

// ──────────────────────────────────────────────
// Login Action
// ──────────────────────────────────────────────
export async function login(
  inputOrState: LoginInput | AuthFormState,
  maybeFormData?: FormData
): Promise<AuthResponse> {
  const isFormData = maybeFormData instanceof FormData;
  const rawData = isFormData
    ? {
        email: maybeFormData.get("email"),
        password: maybeFormData.get("password"),
      }
    : inputOrState && typeof inputOrState === "object" && "email" in inputOrState
    ? inputOrState
    : {};

  // 1. Validate fields
  const parsed = LoginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = parsed.data;

  // 2. Find user
  await connectDB();
  const user = await UserModel.findOne({ email, isActive: true });
  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // 3. Compare password
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // 4. Create session
  await createSession({
    userId: user._id.toString(),
    email: user.email,
    role: user.role || "customer",
    firstName: user.firstName,
  });

  // 5. If called via native HTML form action, redirect
  if (isFormData) {
    redirect("/");
  }

  return { success: true };
}

// ──────────────────────────────────────────────
// Logout Action
// ──────────────────────────────────────────────
export async function logout() {
  await destroySession();
  redirect("/");
}
