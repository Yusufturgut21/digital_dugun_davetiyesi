import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";
import { requireOwnInvitation, handleAuthError } from "@/lib/auth/authorization";
import { SAHRA_VENUE_FIELDS, stripLocationFields } from "@/lib/constants/sahra";
import { serializeInvitation } from "@/lib/invitation-utils";
import { logAudit } from "@/lib/models/AuditLog";

export async function GET() {
  try {
    const session = await requireOwnInvitation();
    await connectDB();

    const inv = await Invitation.findById(session.invitationId).lean();
    if (!inv) return NextResponse.json({ error: "Davetiye bulunamadı." }, { status: 404 });

    return NextResponse.json(serializeInvitation(inv as Record<string, unknown>));
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireOwnInvitation();
    await connectDB();

    const body = await req.json();
    const stripped = stripLocationFields(body as Record<string, unknown>);
    const update = { ...stripped, ...SAHRA_VENUE_FIELDS };

    const inv = await Invitation.findByIdAndUpdate(session.invitationId, update, { new: true }).lean();
    if (!inv) return NextResponse.json({ error: "Davetiye bulunamadı." }, { status: 404 });

    await logAudit({
      userId: session.userId,
      username: session.username,
      invitationId: session.invitationId,
      action: session.impersonatorId ? "admin_edited_invitation" : "couple_edited_invitation",
    });

    return NextResponse.json(serializeInvitation(inv as Record<string, unknown>));
  } catch (err) {
    return handleAuthError(err);
  }
}
