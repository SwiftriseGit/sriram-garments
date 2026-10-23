import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

// GET /api/auth/me — return current user session for client components
// Reading cookies() auto-opts into dynamic execution under Next.js 16 cacheComponents
export async function GET() {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json(
      { user: null },
      { status: 200, headers: noCacheHeaders }
    );
  }

  return NextResponse.json(
    {
      user: {
        userId: session.userId,
        email: session.email,
        role: session.role,
        firstName: session.firstName,
      },
    },
    { status: 200, headers: noCacheHeaders }
  );
}
