"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/User";
import { requireAdmin } from "@/lib/auth/dal";

export interface UpdateRoleResult {
  success: boolean;
  message?: string;
  error?: string;
  newRole?: "customer" | "admin";
}

/**
 * Promote or demote a user's role.
 * Only authenticated administrators can execute this action.
 */
export async function updateUserRole(
  userId: string,
  newRole: "customer" | "admin"
): Promise<UpdateRoleResult> {
  try {
    const adminSession = await requireAdmin();

    if (!userId || !newRole) {
      return { success: false, error: "User ID and new role are required." };
    }

    if (newRole !== "customer" && newRole !== "admin") {
      return { success: false, error: "Invalid role specified." };
    }

    // Safety: Admin cannot change their own role (prevent lockout)
    if (adminSession.userId === userId) {
      return {
        success: false,
        error: "You cannot change your own role. Ask another administrator if needed.",
      };
    }

    await connectDB();

    // Safety: If demoting an admin, ensure at least one other active admin remains
    if (newRole === "customer") {
      const remainingAdmins = await UserModel.countDocuments({
        _id: { $ne: userId },
        role: "admin",
        isActive: true,
      });

      if (remainingAdmins < 1) {
        return {
          success: false,
          error: "Cannot demote this user. The store must retain at least one active administrator.",
        };
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { role: newRole } },
      { new: true, select: "-password" }
    ).lean();

    if (!updatedUser) {
      return { success: false, error: "Target user not found." };
    }

    // Invalidate affected admin and user routes
    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return {
      success: true,
      message: `${updatedUser.firstName} ${updatedUser.lastName}`.trim() +
        (newRole === "admin"
          ? " has been promoted to Administrator."
          : " role changed to Customer."),
      newRole,
    };
  } catch (error: any) {
    console.error("Failed to update user role:", error);
    return {
      success: false,
      error: error?.message || "Failed to update role. Please try again.",
    };
  }
}
