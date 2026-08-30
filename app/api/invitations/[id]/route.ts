import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";
import { requireSuperAdmin, requireCoupleAccess, handleAuthError } from "@/lib/auth/authorization";
import { SAHRA_VENUE_FIELDS, stripLocationFields } from "@/lib/constants/sahra";
import { serializeInvitation } from "@/lib/invitation-utils";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireCoupleAccess(params.id);
    await connectDB();
    const inv = await Invitation.findById(params.id).lean();
    if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(serializeInvitation(inv as Record<string, unknown>));
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireCoupleAccess(params.id);
    await connectDB();
    const body = await req.json();
    const stripped = stripLocationFields(body as Record<string, unknown>);
    const inv = await Invitation.findByIdAndUpdate(params.id, { ...stripped, ...SAHRA_VENUE_FIELDS }, { new: true });
    if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(serializeInvitation(inv.toObject() as Record<string, unknown>));
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireSuperAdmin();
    await connectDB();
    await Invitation.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleAuthError(err);
  }
}
