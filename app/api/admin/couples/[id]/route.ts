import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";
import { User } from "@/lib/models/User";
import { RSVP } from "@/lib/models/RSVP";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";
import { hashPassword } from "@/lib/auth/password";
import { SAHRA_VENUE_FIELDS, stripLocationFields } from "@/lib/constants/sahra";
import { serializeInvitation } from "@/lib/invitation-utils";
import { logAudit } from "@/lib/models/AuditLog";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  try {
    await requireSuperAdmin();
    const { id } = await ctx.params;
    await connectDB();

    const inv = await Invitation.findById(id).lean();
    if (!inv) return NextResponse.json({ error: "Çift bulunamadı." }, { status: 404 });

    const user = await User.findOne({ invitationId: id }).lean();
    const rsvpCount = await RSVP.countDocuments({ invitationId: id });

    return NextResponse.json({
      ...serializeInvitation(inv as Record<string, unknown>),
      username: user?.username,
      userId: user?._id?.toString(),
      userStatus: user?.status,
      rsvpCount,
    });
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function PUT(req: Request, ctx: RouteCtx) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    await connectDB();

    const body = await req.json();
    const { username, password, userStatus, ...invData } = body;

    const stripped = stripLocationFields(invData as Record<string, unknown>);
    const update = { ...stripped, ...SAHRA_VENUE_FIELDS };

    const inv = await Invitation.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!inv) return NextResponse.json({ error: "Çift bulunamadı." }, { status: 404 });

    if (username || password || userStatus) {
      const userUpdate: Record<string, unknown> = {};
      if (username) userUpdate.username = username.toLowerCase().trim();
      if (password) userUpdate.passwordHash = await hashPassword(password);
      if (userStatus) userUpdate.status = userStatus;

      await User.findOneAndUpdate({ invitationId: id }, userUpdate);

      if (password) {
        await logAudit({
          userId: session.userId,
          username: session.username,
          invitationId: id,
          action: "password_changed",
          details: "Admin tarafından şifre sıfırlandı",
        });
      }
    }

    await logAudit({
      userId: session.userId,
      username: session.username,
      invitationId: id,
      action: "couple_updated",
    });

    return NextResponse.json(serializeInvitation(inv as Record<string, unknown>));
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function DELETE(_req: Request, ctx: RouteCtx) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    await connectDB();

    const inv = await Invitation.findById(id);
    if (!inv) return NextResponse.json({ error: "Çift bulunamadı." }, { status: 404 });

    await RSVP.deleteMany({ invitationId: id });
    await User.deleteMany({ invitationId: id });
    await Invitation.findByIdAndDelete(id);

    await logAudit({
      userId: session.userId,
      username: session.username,
      invitationId: id,
      action: "couple_deleted",
      details: `${inv.groomName} & ${inv.brideName}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function PATCH(req: Request, ctx: RouteCtx) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const { isActive, userStatus } = await req.json();
    await connectDB();

    if (typeof isActive === "boolean") {
      await Invitation.findByIdAndUpdate(id, { isActive });
    }
    if (userStatus) {
      await User.findOneAndUpdate({ invitationId: id }, { status: userStatus });
    }

    await logAudit({
      userId: session.userId,
      username: session.username,
      invitationId: id,
      action: isActive === false || userStatus === "inactive" ? "couple_deactivated" : "couple_activated",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleAuthError(err);
  }
}
