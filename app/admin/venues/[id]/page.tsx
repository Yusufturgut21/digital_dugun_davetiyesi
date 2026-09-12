"use client";
import VenueForm from "@/components/admin/VenueForm";

export default function EditVenuePage({ params }: { params: { id: string } }) {
  return <VenueForm venueId={params.id === "new" ? undefined : params.id} />;
}
