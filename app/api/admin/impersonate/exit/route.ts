import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getSession } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/session";
import { SessionPayload } from "@/lib/auth/jwt";
import { handleAuthError } from "@/lib/auth/authorization";
import { logAudit } from "@/lib/models/AuditLog";

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.impersonatorId) {
      return NextResponse.json({ error: "Impersonation aktif değil." }, { status: 400 });
    }

    await connectDB();
    const admin = await User.findById(session.impersonatorId);
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ error: "Admin hesabı bulunamadı." }, { status: 404 });
    }

    const payload: SessionPayload = {
      userId: admin._id.toString(),
      username: admin.username,
      role: "super_admin",
    };

    await setSessionCookie(payload);

    await logAudit({
      userId: admin._id.toString(),
      username: admin.username,
      action: "admin_impersonate_exit",
    });

    return NextResponse.json({ success: true, redirect: "/admin" });
  } catch (err) {
    return handleAuthError(err);
  }
}
