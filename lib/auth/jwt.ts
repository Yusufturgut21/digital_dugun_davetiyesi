import { SignJWT, jwtVerify } from "jose";

export type UserRole = "super_admin" | "couple";

export interface SessionPayload {
  userId: string;
  username: string;
  role: UserRole;
  invitationId?: string;
  /** Admin çift paneline girdiğinde orijinal admin userId */
  impersonatorId?: string;
}

const COOKIE_NAME = "sahra_session";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.MONGODB_URI || "dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export { COOKIE_NAME };

export async function signToken(payload: SessionPayload, expiresIn = "7d"): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
