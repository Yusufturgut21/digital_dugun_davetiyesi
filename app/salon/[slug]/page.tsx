import { Metadata } from "next";
import VenueWebsitePage from "@/components/venue/VenueWebsitePage";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/venues/by-slug/${params.slug}`, {
      cache: "no-store",
    });
    
    if (!res.ok) throw new Error("Venue not found");
    
    const venue = await res.json();
    
    return {
      title: venue.metaTitle || `${venue.venueName} - Düğün Salonu`,
      description: venue.metaDescription || venue.tagline || venue.description,
    };
  } catch {
    return {
      title: "Düğün Salonu",
    };
  }
}

export default function VenuePage({ params }: { params: { slug: string } }) {
  return <VenueWebsitePage slug={params.slug} />;
}
