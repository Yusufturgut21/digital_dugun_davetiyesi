import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  await connectDB();
  const inv = await Invitation.findOne({ slug: params.slug }).lean() as any;
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...inv,
    id: inv._id.toString(),
    _id: undefined,
    createdAt: inv.createdAt?.toISOString?.() ?? inv.createdAt,
    updatedAt: inv.updatedAt?.toISOString?.() ?? inv.updatedAt,
  });
}
