import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ──────────────────────────────────────────────
// Session Management — JWT with jose
// ──────────────────────────────────────────────

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

const COOKIE_NAME = "session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
  firstName: string;
  expiresAt: Date;
}

// ── Encrypt payload into a JWT ──
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// ── Decrypt and verify a JWT ──
export async function decrypt(
  token: string | undefined = ""
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Create session cookie after login/signup ──
export async function createSession(user: {
  userId: string;
  email: string;
  role: "customer" | "admin";
  firstName: string;
}) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ ...user, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// ── Read session from cookie ──
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(token);
}

// ── Destroy session (logout) ──
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: COOKIE_NAME,
    path: "/",
  });
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
    path: "/",
  });
}
