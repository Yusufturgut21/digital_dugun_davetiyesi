import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Invitation } from "@/lib/models/Invitation";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";
import { setSessionCookie } from "@/lib/auth/session";
import { SessionPayload } from "@/lib/auth/jwt";
import { logAudit } from "@/lib/models/AuditLog";

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const { invitationId } = await req.json();

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId gerekli." }, { status: 400 });
    }

    await connectDB();

    const inv = await Invitation.findById(invitationId).lean();
    if (!inv) {
      return NextResponse.json({ error: "Davetiye bulunamadı." }, { status: 404 });
    }

    const coupleUser = await User.findOne({ invitationId, role: "couple" });

    const payload: SessionPayload = {
      userId: coupleUser?._id.toString() ?? session.userId,
      username: coupleUser?.username ?? `${inv.groomName}-${inv.brideName}`,
      role: "couple",
      invitationId,
      impersonatorId: session.userId,
    };

    await setSessionCookie(payload);

    await logAudit({
      userId: session.userId,
      username: session.username,
      invitationId,
      action: "admin_impersonate",
      details: `Admin ${session.username} çift paneline girdi`,
    });

    return NextResponse.json({ success: true, redirect: "/panel" });
  } catch (err) {
    return handleAuthError(err);
  }
}
