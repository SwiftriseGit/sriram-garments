"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import AddressModel from "@/lib/models/Address";
import { verifySession } from "@/lib/auth/dal";
import { AddressSchema } from "@/lib/validations/auth";

// ──────────────────────────────────────────────
// Address Server Actions — centralized address management
// ──────────────────────────────────────────────

// Save Address (Create or Update)
export async function saveAddress(formData: FormData) {
  const session = await verifySession();

  const addressId = formData.get("addressId") as string | null;
  const isDefault = formData.get("isDefault") === "true" || formData.get("isDefault") === "on";

  const parsed = AddressSchema.safeParse({
    label: formData.get("label") || "Home",
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
    isDefault,
  });

  if (!parsed.success) {
    return {
      error: Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || "Invalid address details",
    };
  }

  await connectDB();

  if (parsed.data.isDefault) {
    await AddressModel.updateMany(
      { userId: session.userId },
      { isDefault: false }
    );
  }

  if (addressId) {
    await AddressModel.findOneAndUpdate(
      { _id: addressId, userId: session.userId },
      { ...parsed.data, isDefault }
    );
  } else {
    // If it's the first address, make it default automatically
    const count = await AddressModel.countDocuments({ userId: session.userId });
    await AddressModel.create({
      userId: session.userId,
      ...parsed.data,
      isDefault: isDefault || count === 0,
    });
  }

  revalidatePath("/profile/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

// Delete Address
export async function deleteAddress(formData: FormData) {
  const session = await verifySession();
  const addressId = (formData.get("addressId") || formData.get("id")) as string;

  if (!addressId) {
    return { error: "Address ID is required" };
  }

  await connectDB();
  await AddressModel.findOneAndDelete({ _id: addressId, userId: session.userId });

  revalidatePath("/profile/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

// Set Default Address
export async function setDefaultAddress(formData: FormData) {
  const session = await verifySession();
  const addressId = (formData.get("addressId") || formData.get("id")) as string;

  if (!addressId) return;

  await connectDB();
  await AddressModel.updateMany({ userId: session.userId }, { isDefault: false });
  await AddressModel.findOneAndUpdate({ _id: addressId, userId: session.userId }, { isDefault: true });

  revalidatePath("/profile/addresses");
  revalidatePath("/checkout");
}
