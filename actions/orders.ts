"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import OrderModel from "@/lib/models/Order";
import ProductModel from "@/lib/models/Product";
import UserModel from "@/lib/models/User";
import { verifySession } from "@/lib/auth/dal";

// ──────────────────────────────────────────────
// Place Order — Server Action (UI mutation)
// Replaces POST /api/orders route handler
// ──────────────────────────────────────────────

interface PlaceOrderInput {
  items: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[];
  shippingAddress: {
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod?: string;
  couponCode?: string;
}

export async function placeOrder(input: PlaceOrderInput) {
  const session = await verifySession();

  const { items, shippingAddress, paymentMethod, couponCode } = input;

  if (!items?.length || !shippingAddress) {
    return { error: "Items and shipping address are required" };
  }

  await connectDB();

  // 1. Fetch user details for customer snapshot
  const user = await UserModel.findById(session.userId)
    .select("firstName lastName email phone")
    .lean();

  if (!user) {
    return { error: "User not found" };
  }

  // 2. Fetch REAL product data from DB → create snapshots
  // This prevents price manipulation from the client
  const productIds = items.map((i) => i.productId);
  const products = await ProductModel.find({
    _id: { $in: productIds },
  }).lean();

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let subtotal = 0;
  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    // Use real price from DB, not client-sent price
    const effectivePrice =
      product.isSale && product.salePrice != null
        ? product.salePrice
        : product.originalPrice;

    subtotal += effectivePrice * item.quantity;

    return {
      productId: product._id.toString(),
      name: product.name,
      slug: product.slug,
      price: effectivePrice,
      originalPrice: product.originalPrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: product.images?.[0] || "",
    };
  });

  // 3. Calculate totals
  const shipping = subtotal >= 999 ? 0 : 79;
  let couponDiscount = 0;

  if (couponCode) {
    for (const product of products) {
      if (
        product.couponCode === couponCode.toUpperCase() &&
        product.couponDiscount
      ) {
        couponDiscount += product.couponDiscount;
      }
    }
  }

  const discount = couponDiscount;
  const total = Math.max(0, subtotal + shipping - discount);

  // 4. Create order with embedded snapshots
  const order: any = await OrderModel.create({
    userId: session.userId,
    customer: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    shippingAddress,
    items: orderItems,
    subtotal,
    shipping,
    discount,
    couponCode: couponCode ? couponCode.toUpperCase() : undefined,
    couponDiscount,
    total,
    paymentMethod: paymentMethod || "COD",
  });

  // 5. Update user stats
  await UserModel.findByIdAndUpdate(session.userId, {
    $inc: { totalOrders: 1, totalSpent: total },
  });

  // 6. Update product sales counts
  for (const item of orderItems) {
    await ProductModel.findByIdAndUpdate(item.productId, {
      $inc: { salesCount: item.quantity, stockQuantity: -item.quantity },
    });
  }

  revalidatePath("/profile/orders");
  redirect(`/profile/orders/${order._id}`);
}

// ──────────────────────────────────────────────
// Update Order Status — Admin Server Action
// ──────────────────────────────────────────────
export async function updateOrderStatus(formData: FormData) {
  const { requireAdmin } = await import("@/lib/auth/dal");
  await requireAdmin();

  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  if (!orderId || !status) {
    throw new Error("Order ID and status are required");
  }

  await connectDB();
  await OrderModel.findByIdAndUpdate(orderId, { status });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
