"use client";
import { motion } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";
import {
  SAHRA_VENUE_NAME,
  SAHRA_ADDRESS,
  SAHRA_CITY,
  SAHRA_DISTRICT,
  SAHRA_MAPS_URL,
  SAHRA_MAPS_EMBED,
} from "@/lib/constants/sahra";

interface Props { invitation?: WeddingInvitation; }

export default function MapSection({ invitation }: Props) {
  const venueName = SAHRA_VENUE_NAME;
  const city = SAHRA_CITY;
  const district = SAHRA_DISTRICT;
  const address = SAHRA_ADDRESS;
  const mapsUrl = SAHRA_MAPS_URL;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(address)}`;

  return (
    <section id="map" className="section-gap relative">
      <div className="absolute inset-0" style={{ background: "#FAF6F0" }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            Konum
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light" style={{ color: "#3d3530" }}>
            Nasıl Gelirsiniz?
          </h2>
          <div className="gold-divider mt-6" />
          <p className="mt-4 font-sans text-sm" style={{ color: "#6b5f58" }}>
            {venueName} — {district}, {city}
          </p>
        </motion.div>

        <motion.div
          className="rounded-3xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <iframe
            src={SAHRA_MAPS_EMBED}
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Sahra Düğün Salonu Konumu"
          />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-sans text-sm tracking-wider uppercase transition-all hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #E8D5A3)",
              color: "#1a0f08",
              boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="currentColor" />
            </svg>
            Yol Tarifi Al
          </a>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-sans text-sm tracking-wider uppercase transition-all hover:-translate-y-1"
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#3d3530",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            Waze ile Git
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`📍 Düğün Lokasyonu: ${venueName}, ${address}\n${mapsUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-sans text-sm tracking-wider uppercase transition-all hover:-translate-y-1"
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#3d3530",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            WhatsApp ile Paylaş
          </a>
        </motion.div>
      </div>
    </section>
  );
}
