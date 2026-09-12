"use client";
import { VenueWebsite } from "@/lib/types";
import { MapPin } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueMap({ venue }: Props) {
  if (!venue.mapUrl && !venue.address) return null;

  // compute iframe src safely to avoid inserting "/embed" twice
  let iframeSrc = venue.mapUrl || "";
  if (iframeSrc.includes("/maps/embed") || iframeSrc.includes("embed?pb=")) {
    // use as-is
  } else if (iframeSrc.includes("/maps/")) {
    iframeSrc = iframeSrc.replace("/maps/", "/maps/embed/");
  }

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Konum
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="w-8 h-8 text-rose-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-xl text-gray-900 mb-2">Adres</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {venue.address}
                  {venue.district && `, ${venue.district}`}
                  {venue.city && `, ${venue.city}`}
                </p>
              </div>
            </div>

            {venue.mapUrl && (
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Google Maps'te Aç
              </a>
            )}
          </div>

          {venue.mapUrl && (
            <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
              <iframe
                src={iframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
