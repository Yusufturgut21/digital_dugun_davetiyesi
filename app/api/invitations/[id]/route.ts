import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";

function mapDoc(inv: any) {
  return {
    ...inv,
    id: inv._id?.toString() ?? inv.id,
    _id: undefined,
    createdAt: inv.createdAt?.toISOString?.() ?? inv.createdAt,
    updatedAt: inv.updatedAt?.toISOString?.() ?? inv.updatedAt,
  };
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const inv = await Invitation.findById(params.id).lean();
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapDoc(inv));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const inv = await Invitation.findByIdAndUpdate(params.id, body, { new: true });
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapDoc(inv.toObject()));
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Invitation.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
