"use server";

import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/User";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  SignupSchema,
  LoginSchema,
  type AuthFormState,
} from "@/lib/validations/auth";

// ──────────────────────────────────────────────
// Signup Action
// ──────────────────────────────────────────────
export async function signup(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  // 1. Validate fields
  const parsed = SignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { firstName, lastName, email, phone, password } = parsed.data;

  // 2. Check for duplicate email
  await connectDB();
  const existingUser = await UserModel.findOne({ email }).lean();
  if (existingUser) {
    return {
      errors: { email: ["An account with this email already exists"] },
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

  // 5. Redirect
  redirect("/");
}

// ──────────────────────────────────────────────
// Login Action
// ──────────────────────────────────────────────
export async function login(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  // 1. Validate fields
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = parsed.data;

  // 2. Find user
  await connectDB();
  const user = await UserModel.findOne({ email, isActive: true });
  if (!user) {
    return {
      message: "Invalid email or password",
    };
  }

  // 3. Compare password
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return {
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

  // 5. Redirect
  redirect("/");
}

// ──────────────────────────────────────────────
// Logout Action
// ──────────────────────────────────────────────
export async function logout() {
  await destroySession();
  redirect("/");
}
