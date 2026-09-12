"use client";
import { VenueWebsite } from "@/lib/types";
import { Users } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueAbout({ venue }: Props) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Hakkımızda
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {venue.description}
            </p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 text-center">
            <Users className="w-16 h-16 text-rose-600 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-gray-900 mb-2">Kapasite</h3>
            <p className="text-4xl font-bold text-rose-600 mb-2">
              {venue.capacity.min} - {venue.capacity.max}
            </p>
            <p className="text-gray-600">Kişi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
