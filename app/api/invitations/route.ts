import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";
import { CreateInvitationInput } from "@/lib/types";

function generateSlug(brideName: string, groomName: string): string {
  const normalize = (s: string) =>
    s.replace(/İ/g, "i").replace(/Ğ/g, "g").replace(/Ü/g, "u")
      .replace(/Ş/g, "s").replace(/I/g, "i").replace(/Ö/g, "o").replace(/Ç/g, "c")
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${normalize(groomName)}-${normalize(brideName)}` || `davet-${Date.now()}`;
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const inv = await Invitation.findOne({ slug }).lean() as any;
    if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...inv,
      id: inv._id.toString(),
      _id: undefined,
      createdAt: inv.createdAt?.toISOString?.() ?? inv.createdAt,
      updatedAt: inv.updatedAt?.toISOString?.() ?? inv.updatedAt,
    });
  }

  const invitations = await Invitation.find().sort({ createdAt: -1 }).lean();
  const mapped = invitations.map((inv: any) => ({
    ...inv,
    id: inv._id.toString(),
    _id: undefined,
    createdAt: inv.createdAt?.toISOString?.() ?? inv.createdAt,
    updatedAt: inv.updatedAt?.toISOString?.() ?? inv.updatedAt,
  }));
  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  await connectDB();
  const body: CreateInvitationInput = await req.json();

  const baseSlug = generateSlug(body.brideName, body.groomName);
  const year = new Date().getFullYear();
  let slug = baseSlug;
  let counter = 1;

  while (await Invitation.exists({ slug })) {
    slug = counter === 1 ? `${baseSlug}-${year}` : `${baseSlug}-${year}-${counter}`;
    counter++;
  }

  const inv = await Invitation.create({ ...body, slug });
  return NextResponse.json({
    ...inv.toObject(),
    id: inv._id.toString(),
    _id: undefined,
    createdAt: inv.createdAt.toISOString(),
    updatedAt: inv.updatedAt.toISOString(),
  }, { status: 201 });
}
