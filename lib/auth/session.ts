import { cookies } from "next/headers";
import { COOKIE_NAME, SessionPayload, signToken, verifyToken } from "./jwt";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function sessionCookieHeader(token: string): string {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `Max-Age=${COOKIE_OPTIONS.maxAge}`,
    `SameSite=Lax`,
    "HttpOnly",
  ];
  if (COOKIE_OPTIONS.secure) parts.push("Secure");
  return parts.join("; ");
}
