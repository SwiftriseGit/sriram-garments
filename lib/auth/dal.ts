import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/User";

// ──────────────────────────────────────────────
// Data Access Layer — centralized auth checks
// Pure stateless JWT checks for fast routing & navigation
// ──────────────────────────────────────────────

// Verify session from JWT cookie (0 DB queries)
// Memoized per React render pass with cache()
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId,
    email: session.email,
    role: session.role,
    firstName: session.firstName,
  };
});

// Get full user data from DB (no password) — only called when profile data is needed
export const getUser = cache(async () => {
  const session = await verifySession();

  await connectDB();
  const user = await UserModel.findById(session.userId)
    .select("-password")
    .lean();

  if (!user) {
    redirect("/login");
  }

  return user;
});

// Require admin role from session (0 DB queries)
export const requireAdmin = cache(async () => {
  const session = await verifySession();

  if (session.role !== "admin") {
    redirect("/");
  }

  return session;
});

// Optional session check — doesn't redirect, returns null if not logged in (0 DB queries)
export const getOptionalSession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  return {
    userId: session.userId,
    email: session.email,
    role: session.role,
    firstName: session.firstName,
  };
});
