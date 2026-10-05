import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "staff";
}

// Hardcoded admin credentials for dev (no DB needed)
const ADMIN_CREDENTIALS = {
  email: "admin@sriramgarments.com",
  password: "admin123",
  name: "Admin",
  role: "owner" as const,
};

export async function createSession(admin: AdminSession) {
  // Simple base64 token (sufficient for dev, no jose needed)
  const payload = JSON.stringify(admin);
  const token = Buffer.from(payload).toString("base64");

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<AdminSession | null> {
  // Bypassed login: Always return admin session
  return {
    id: "admin-1",
    name: "Admin",
    email: "admin@sriramgarments.com",
    role: "owner",
  };
}

export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession();
  return session!;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function validateCredentials(
  email: string,
  password: string
): AdminSession | null {
  if (
    email.toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    return {
      id: "admin-1",
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email,
      role: ADMIN_CREDENTIALS.role,
    };
  }
  return null;
}
