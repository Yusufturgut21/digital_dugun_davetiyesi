import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VenueWebsite } from "@/lib/models/VenueWebsite";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const venue = await VenueWebsite.findById(params.id);
    if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    return NextResponse.json({ ...venue.toObject(), id: venue._id.toString() });
  } catch (error) {
    console.error("Venue fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch venue" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const venue = await VenueWebsite.findByIdAndUpdate(params.id, body, { new: true });
    if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    return NextResponse.json({ ...venue.toObject(), id: venue._id.toString() });
  } catch (error) {
    console.error("Venue update error:", error);
    return NextResponse.json({ error: "Failed to update venue" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const venue = await VenueWebsite.findByIdAndDelete(params.id);
    if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    return NextResponse.json({ message: "Venue deleted" });
  } catch (error) {
    console.error("Venue delete error:", error);
    return NextResponse.json({ error: "Failed to delete venue" }, { status: 500 });
  }
}
