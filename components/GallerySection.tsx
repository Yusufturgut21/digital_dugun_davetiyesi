"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WeddingInvitation } from "@/lib/types";

const DEFAULT_PHOTOS = [
  { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", alt: "Düğün", h: 300 },
  { id: 2, src: "https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=600&q=80", alt: "Nişan", h: 400 },
  { id: 3, src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80", alt: "Gelin", h: 350 },
  { id: 4, src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80", alt: "Çiçekler", h: 280 },
  { id: 5, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", alt: "Yüzükler", h: 320 },
  { id: 6, src: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&q=80", alt: "Pasta", h: 380 },
  { id: 7, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80", alt: "Düğün Salonu", h: 310 },
  { id: 8, src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80", alt: "Buket", h: 360 },
  { id: 9, src: "https://images.unsplash.com/photo-1524824267900-2b6d4f0d6293?w=600&q=80", alt: "Sevgililer", h: 290 },
];

interface Props { invitation?: WeddingInvitation; }

function LightboxNav({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3 L5 8 L10 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3 L11 8 L6 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
}

export default function GallerySection({ invitation }: Props) {
  const rawPhotos = invitation?.galleryImages?.length
    ? invitation.galleryImages.map((src, i) => ({ id: i, src, alt: `Fotoğraf ${i + 1}`, h: 280 + (i % 3) * 60 }))
    : DEFAULT_PHOTOS;
  const photos = rawPhotos;

  const [lightbox, setLightbox] = useState<number | null>(null);

  const open = useCallback((id: number) => setLightbox(id), []);
  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => {
    setLightbox(lb => lb !== null ? (lb - 1 + photos.length) % photos.length : null);
  }, []);
  const next = useCallback(() => {
    setLightbox(lb => lb !== null ? (lb + 1) % photos.length : null);
  }, []);

  const currentPhoto = lightbox !== null ? photos[lightbox] : null;

  // Split into 3 columns for masonry
  const col1 = photos.filter((_, i) => i % 3 === 0);
  const col2 = photos.filter((_, i) => i % 3 === 1);
  const col3 = photos.filter((_, i) => i % 3 === 2);

  return (
    <section id="gallery" className="section-gap relative">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #FAF6F0 0%, #fff 50%, #FAF6F0 100%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            Anılar
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light" style={{ color: "#3d3530" }}>
            Fotoğraf Galerisi
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[col1, col2, col3].map((col, ci) => (
            <div key={ci} className="flex flex-col gap-3 sm:gap-4">
              {col.map((photo, pi) => (
                <motion.div
                  key={photo.id}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group"
                  style={{ height: photo.h * 0.7 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (ci * col.length + pi) * 0.05 }}
                  onClick={() => open(photos.indexOf(photo))}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "sepia(10%) saturate(110%) brightness(98%)" }}
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.15)", backdropFilter: "blur(2px)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.9)" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 2 L14 14 M14 2 L8 8 M2 14 L8 8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="8" cy="8" r="6" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && currentPhoto && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{ background: "rgba(10,6,3,0.95)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative max-w-4xl max-h-[85vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "75vh" }}>
                <Image
                  src={currentPhoto.src}
                  alt={currentPhoto.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <LightboxNav onPrev={prev} onNext={next} />
              <button
                onClick={close}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1 L13 13 M13 1 L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
