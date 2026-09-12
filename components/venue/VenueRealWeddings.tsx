"use client";
import { VenueWebsite } from "@/lib/types";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueRealWeddings({ venue }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!venue.realWeddingImages || venue.realWeddingImages.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Gerçek Düğünlerden Kareler
          </h2>
          <p className="text-gray-600 text-lg">
            Salonumuzda düzenlenen unutulmaz anlardan fotoğraflar
          </p>
          <div className="w-24 h-1 bg-rose-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {venue.realWeddingImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`Gerçek düğün ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Büyük görsel"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </section>
  );
}
