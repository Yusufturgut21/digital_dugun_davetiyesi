"use client";
import { VenueWebsite } from "@/lib/types";
import { useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueGallery({ venue }: Props) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!venue.galleryImages || venue.galleryImages.length === 0) return null;

  const openImage = (index: number) => setSelectedImage(index);
  const closeImage = () => setSelectedImage(null);
  
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % venue.galleryImages.length);
    }
  };
  
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + venue.galleryImages.length) % venue.galleryImages.length);
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
            Galeri
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">
            Salon Galerisi
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Salonumuzun farklı açılardan çekilmiş profesyonel fotoğrafları
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full" />
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {venue.galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => openImage(idx)}
            >
              <img
                src={img}
                alt={`${venue.venueName} galeri ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <ZoomIn className="w-6 h-6 mb-2" />
                  <p className="text-sm font-medium">Büyütmek için tıklayın</p>
                </div>
              </div>
              {/* Number badge */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-semibold text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-50 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20"
            onClick={closeImage}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 text-white z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="font-medium">{selectedImage + 1}</span>
            <span className="text-white/60"> / {venue.galleryImages.length}</span>
          </div>

          {/* Image */}
          <img
            src={venue.galleryImages[selectedImage]}
            alt="Büyük görsel"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
