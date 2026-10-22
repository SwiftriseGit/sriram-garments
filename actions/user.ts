"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/User";
import { verifySession } from "@/lib/auth/dal";
import { ProfileUpdateSchema } from "@/lib/validations/auth";

// ──────────────────────────────────────────────
// User Server Actions — profile & account settings
// ──────────────────────────────────────────────

// Update Profile (First Name, Last Name, Phone)
export async function updateProfile(
  _state: { success?: boolean; errors?: Record<string, string[]>; message?: string } | undefined,
  formData: FormData
) {
  const session = await verifySession();

  const parsed = ProfileUpdateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await connectDB();
  const user = await UserModel.findByIdAndUpdate(
    session.userId,
    parsed.data,
    { new: true, select: "-password" }
  ).lean();

  if (!user) {
    return { message: "User not found" };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/settings");
  return { success: true };
}

// Change Password
export async function changePassword(
  _state: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const session = await verifySession();
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "Please enter all required fields" };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  await connectDB();
  const user = await UserModel.findById(session.userId);
  if (!user) {
    return { error: "User not found" };
  }

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  user.password = newPassword;
  await user.save();

  return { success: true };
}
