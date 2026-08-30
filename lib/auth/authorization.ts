import { NextResponse } from "next/server";
import { getSession } from "./session";
import { SessionPayload } from "./jwt";

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new AuthError(401, "Oturum açmanız gerekiyor.");
  return session;
}

export async function requireSuperAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== "super_admin" && !session.impersonatorId) {
    throw new AuthError(403, "Bu işlem için yetkiniz yok.");
  }
  // impersonator viewing as couple - check impersonator was admin
  if (session.impersonatorId) {
    // When impersonating, role is couple but impersonatorId proves admin access
    // For admin-only endpoints, require NOT impersonating
    throw new AuthError(403, "Çift panelindeyken bu işlem yapılamaz.");
  }
  if (session.role !== "super_admin") {
    throw new AuthError(403, "Bu işlem için Sahra admin yetkisi gerekiyor.");
  }
  return session;
}

export async function requireSuperAdminAllowImpersonator(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role === "super_admin") return session;
  if (session.impersonatorId) return session;
  throw new AuthError(403, "Bu işlem için yetkiniz yok.");
}

export async function requireCoupleAccess(invitationId: string): Promise<SessionPayload> {
  const session = await requireAuth();

  if (session.role === "super_admin" || session.impersonatorId) {
    return session;
  }

  if (session.role === "couple" && session.invitationId === invitationId) {
    return session;
  }

  throw new AuthError(403, "Bu davetiyeye erişim yetkiniz yok.");
}

export async function requireOwnInvitation(): Promise<SessionPayload & { invitationId: string }> {
  const session = await requireAuth();
  const invId = session.invitationId;
  if (!invId) throw new AuthError(403, "Çift hesabına bağlı davetiye bulunamadı.");
  return { ...session, invitationId: invId };
}

export function handleAuthError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
}
