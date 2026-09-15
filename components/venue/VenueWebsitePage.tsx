"use client";
import { useEffect, useState } from "react";
import { VenueWebsite } from "@/lib/types";
import VenueHero from "./VenueHero";
import VenueAbout from "./VenueAbout";
import VenueGallery from "./VenueGallery";
import VenueFeatures from "./VenueFeatures";
import VenuePackages from "./VenuePackages";
import VenueRealWeddings from "./VenueRealWeddings";
import VenueMap from "./VenueMap";
import VenueContact from "./VenueContact";
import VenueInvitationPromo from "./VenueInvitationPromo";
import LinaVenuePage from "./LinaVenuePage";
import LaMerliVenuePage from "./LaMerliVenuePage";

interface Props {
  slug: string;
}

export default function VenueWebsitePage({ slug }: Props) {
  const [venue, setVenue] = useState<VenueWebsite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/venues/by-slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setVenue(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">Salon bulunamadı</h1>
          <p className="text-gray-600">Bu salon artık mevcut değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {slug === "lina-davet-florya" ? (
        <LinaVenuePage venue={venue} />
      ) : slug === "la-merli-event-basaksehir" ? (
        <LaMerliVenuePage venue={venue} />
      ) : (
        <>
          <VenueHero venue={venue} />
          <VenueAbout venue={venue} />
          <VenueGallery venue={venue} />
          <VenueFeatures venue={venue} />
          <VenuePackages venue={venue} />
          <VenueRealWeddings venue={venue} />
          <VenueInvitationPromo />
          <VenueMap venue={venue} />
          <VenueContact venue={venue} />
        </>
      )}
    </div>
  );
}
