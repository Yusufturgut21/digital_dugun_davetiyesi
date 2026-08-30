import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";
import { CreateInvitationInput } from "@/lib/types";
import { generateUniqueSlug } from "@/lib/slug";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";
import { SAHRA_VENUE_FIELDS } from "@/lib/constants/sahra";
import { serializeInvitation } from "@/lib/invitation-utils";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const inv = await Invitation.findOne({ slug, isActive: true }).lean() as Record<string, unknown> | null;
    if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(serializeInvitation(inv));
  }

  try {
    await requireSuperAdmin();
  } catch (err) {
    return handleAuthError(err);
  }

  const invitations = await Invitation.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(invitations.map((inv) => serializeInvitation(inv as Record<string, unknown>)));
}

export async function POST(req: Request) {
  try {
    await requireSuperAdmin();
    await connectDB();
    const body: CreateInvitationInput = await req.json();

    const slug = await generateUniqueSlug(body.groomName, body.brideName, async (s) =>
      Boolean(await Invitation.exists({ slug: s }))
    );

    const inv = await Invitation.create({ ...body, ...SAHRA_VENUE_FIELDS, slug });
    return NextResponse.json(serializeInvitation(inv.toObject() as Record<string, unknown>), { status: 201 });
  } catch (err) {
    return handleAuthError(err);
  }
}
