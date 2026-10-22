import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

// GET /api/auth/me — return current user session for client components
// Pure stateless JWT decryption — no DB query overhead on navigation
export async function GET() {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: session.userId,
      email: session.email,
      role: session.role,
      firstName: session.firstName,
    },
  });
}
