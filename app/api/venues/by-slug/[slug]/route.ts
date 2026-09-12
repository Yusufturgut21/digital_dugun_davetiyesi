import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VenueWebsite } from "@/lib/models/VenueWebsite";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const venue = await VenueWebsite.findOne({ slug: params.slug, isActive: true });
    if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    return NextResponse.json({ ...venue.toObject(), id: venue._id.toString() });
  } catch (error) {
    console.error("Venue fetch by slug error:", error);
    return NextResponse.json({ error: "Failed to fetch venue" }, { status: 500 });
  }
}
