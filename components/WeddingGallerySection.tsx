"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WeddingInvitation } from "@/lib/types";
import { isDataUrl } from "@/lib/imageUtils";

// Removed DEFAULT_PHOTOS to avoid showing random pictures, it will only load real ones
type Photo = {
  id: number;
  src: string;
  alt: string;
  span: string;
  rotate: number;
};

const SPAN_PATTERN = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
] as const;

const ROTATE_PATTERN = [-1, 2, -2, 1.5, -1.5, 0.5, 2, -2, 1];

function buildPhotos(images: string[]): Photo[] {
  return images.map((src, i) => ({
    id: i,
    src,
    alt: `Anı ${i + 1}`,
    span: SPAN_PATTERN[i % SPAN_PATTERN.length],
    rotate: ROTATE_PATTERN[i % ROTATE_PATTERN.length],
  }));
}

interface Props { invitation?: WeddingInvitation; }

function GalleryImage({ src, alt, className, priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      unoptimized={isDataUrl(src)}
      className={className}
      sizes="(max-width: 640px) 50vw, 33vw"
    />
  );
}

function LightboxNav({ onPrev, onNext, current, total }: { onPrev: () => void; onNext: () => void; current: number; total: number }) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Önceki fotoğraf"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M10 3 L5 8 L10 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <button
        onClick={onNext}
        aria-label="Sonraki fotoğraf"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M6 3 L11 8 L6 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full font-sans text-xs tracking-widest"
        style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
      >
        {current + 1} / {total}
      </div>
    </>
  );
}

export default function WeddingGallerySection() {
  const [globalGallery, setGlobalGallery] = useState<{ id: string, url: string, order: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        if (data && data.images && data.images.length > 0 && data.isActive !== false) {
          setGlobalGallery(data.images.sort((a: any, b: any) => a.order - b.order));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Sadece eklenen resimler varsa göster
  if (loading || globalGallery.length === 0) return null;

  const photos: Photo[] = buildPhotos(globalGallery.map(img => img.url));

  const subtitle = "DÜĞÜN GALERİSİ";
  const title = "Hayalinizdeki Güne Ev Sahipliği Yapıyoruz";

  const [lightbox, setLightbox] = useState<number | null>(null);

  const open = useCallback((id: number) => setLightbox(id), []);
  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => {
    setLightbox(lb => lb !== null ? (lb - 1 + photos.length) % photos.length : null);
  }, [photos.length]);
  const next = useCallback(() => {
    setLightbox(lb => lb !== null ? (lb + 1) % photos.length : null);
  }, [photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, close, prev, next]);

  const currentPhoto = lightbox !== null ? photos[lightbox] : null;

  return (
    <section id="gallery" className="section-gap relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #FAF6F0 0%, #fff 50%, #FAF6F0 100%)" }}
      />

      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.2), transparent 70%)" }} />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%)" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            {subtitle}
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light" style={{ color: "#3d3530" }}>
            {title}
          </h2>
          <div className="gold-divider mt-6" />
          <p className="font-sans text-sm mt-4" style={{ color: "rgba(107,95,88,0.7)" }}>
            Özel gününüz için hazırladığımız salonumuzdan seçilmiş kareleri keşfedin.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3 sm:gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className={`${photo.span} relative group cursor-pointer`}
              initial={{ opacity: 0, y: 24, rotate: photo.rotate }}
              whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
              onClick={() => open(i)}
            >
              {/* Polaroid frame */}
              <div
                className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl"
                style={{
                  background: "#fff",
                  padding: "6px 6px 20px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(201,168,76,0.1)",
                }}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <GalleryImage
                    src={photo.src}
                    alt={photo.alt}
                    priority={i < 2}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.08) 100%)" }} />
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                style={{ background: "rgba(201,168,76,0.08)" }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300"
                  style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 20px rgba(201,168,76,0.3)" }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="4.5" stroke="#C9A84C" strokeWidth="1.2" fill="none" />
                    <path d="M10.5 10.5 L14 14" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Gold corner accent */}
              <div className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M16 0 L16 16 L0 16" stroke="#C9A84C" strokeWidth="0.8" fill="rgba(201,168,76,0.1)" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && currentPhoto && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8"
            style={{ background: "rgba(8,5,3,0.96)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="relative w-full rounded-2xl overflow-hidden"
                style={{ height: "min(80vh, 700px)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhoto.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GalleryImage
                      src={currentPhoto.src}
                      alt={currentPhoto.alt}
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <LightboxNav onPrev={prev} onNext={next} current={lightbox} total={photos.length} />
              <button
                onClick={close}
                aria-label="Kapat"
                className="absolute -top-12 right-0 sm:top-4 sm:right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
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
