import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VenueWebsite } from "@/lib/models/VenueWebsite";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  try {
    await connectDB();
    const venues = await VenueWebsite.find({}).sort({ createdAt: -1 });
    return NextResponse.json(venues.map((v) => ({ ...v.toObject(), id: v._id.toString() })));
  } catch (error) {
    console.error("Venues fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    const slug = generateSlug(body.venueName);
    const venue = await VenueWebsite.create({ ...body, slug });
    
    return NextResponse.json({ ...venue.toObject(), id: venue._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Venue create error:", error);
    return NextResponse.json({ error: "Failed to create venue" }, { status: 500 });
  }
}
