import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { RSVP } from "@/lib/models/RSVP";
import { Invitation } from "@/lib/models/Invitation";
import { getSession } from "@/lib/auth/session";
import { requireCoupleAccess, handleAuthError } from "@/lib/auth/authorization";

function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { invitationId, slug, guestName, phone, guestCount, attendance, note } = await req.json();

    let invId = invitationId;

    if (!invId && slug) {
      const inv = await Invitation.findOne({ slug, isActive: true }).lean();
      if (!inv) return NextResponse.json({ error: "Davetiye bulunamadı." }, { status: 404 });
      invId = inv._id.toString();
    }

    if (!invId || !guestName) {
      return NextResponse.json({ error: "Davetiye ve isim gerekli." }, { status: 400 });
    }

    const inv = await Invitation.findById(invId);
    if (!inv || !inv.isActive) {
      return NextResponse.json({ error: "Davetiye aktif değil." }, { status: 404 });
    }

    const rsvp = await RSVP.create({
      invitationId: toObjectId(invId),
      guestName: guestName.trim(),
      phone: phone?.trim(),
      guestCount: Math.max(1, parseInt(String(guestCount)) || 1),
      attendance: attendance ?? "yes",
      note: note?.trim(),
    });

    return NextResponse.json({
      success: true,
      id: rsvp._id.toString(),
      message: "Katılım bildiriminiz alındı.",
    }, { status: 201 });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("invitationId") || session.invitationId;

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId gerekli." }, { status: 400 });
    }

    await requireCoupleAccess(invitationId);
    await connectDB();

    const rsvps = await RSVP.find({ invitationId: toObjectId(invitationId) }).sort({ createdAt: -1 }).lean();

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
