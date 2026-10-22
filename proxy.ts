import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/session";

// ──────────────────────────────────────────────
// Route Protection — proxy.ts (Next.js 16)
// ──────────────────────────────────────────────

// Routes that require login
const protectedRoutes = ["/profile", "/checkout"];

// Routes only for non-logged-in users
const authRoutes = ["/login", "/signup"];

// Admin routes
const adminRoutes = ["/admin"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check route types
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => path.startsWith(r));

  // Decrypt session from cookie (optimistic — no DB hit)
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 1. Protected routes → redirect to /login if not authenticated
  if (isProtected && !session?.userId) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Admin routes → redirect to / if not admin
  if (isAdminRoute) {
    if (!session?.userId) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  // 3. Auth routes → redirect to / if already logged in
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Run proxy on all routes except static files and API
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)"],
};
