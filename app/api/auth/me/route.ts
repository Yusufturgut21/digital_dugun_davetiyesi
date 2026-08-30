import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Invitation } from "@/lib/models/Invitation";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  await connectDB();
  const user = await User.findById(session.userId).lean();
  let coupleName: string | undefined;
  let invitationSlug: string | undefined;

  if (session.invitationId) {
    const inv = await Invitation.findById(session.invitationId).lean();
    if (inv) {
      coupleName = `${inv.groomName} ${inv.conjunction} ${inv.brideName}`;
      invitationSlug = inv.slug;
    }
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      username: session.username,
      role: session.role,
      invitationId: session.invitationId,
      impersonatorId: session.impersonatorId,
      isImpersonating: Boolean(session.impersonatorId),
      coupleName,
      invitationSlug,
      status: user?.status,
    },
  });
}
