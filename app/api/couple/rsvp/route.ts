import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { RSVP } from "@/lib/models/RSVP";
import { requireOwnInvitation, handleAuthError } from "@/lib/auth/authorization";

export async function GET() {
  try {
    const session = await requireOwnInvitation();
    await connectDB();

    const invitationId = new mongoose.Types.ObjectId(session.invitationId);
    const rsvps = await RSVP.find({ invitationId }).sort({ createdAt: -1 }).lean();

    const stats = {
      yes: rsvps.filter((r) => r.attendance === "yes").length,
      no: rsvps.filter((r) => r.attendance === "no").length,
      maybe: rsvps.filter((r) => r.attendance === "maybe").length,
      totalGuests: rsvps.reduce((sum, r) => sum + (r.attendance === "yes" ? r.guestCount : 0), 0),
      total: rsvps.length,
    };

    return NextResponse.json({
      stats,
      items: rsvps.map((r) => ({
        id: r._id.toString(),
        guestName: r.guestName,
        phone: r.phone,
        guestCount: r.guestCount,
        attendance: r.attendance,
        note: r.note,
        createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
      })),
    });
  } catch (err) {
    return handleAuthError(err);
  }
}
