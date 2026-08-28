"use client";
import { motion } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";

interface Props { invitation?: WeddingInvitation; }

export default function MapSection({ invitation }: Props) {
  const venueName = invitation?.venueName || "The Grand Bosphorus";
  const city = invitation?.city || "İstanbul";
  const district = invitation?.district || "Beşiktaş";
  const address = `${venueName} ${district} ${city}`;
  const customMapUrl = invitation?.mapUrl;
  const mapsUrl = customMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.9698254893!2d29.00484!3d41.04267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a30a08c9af%3A0x3e5e6f8d7d4c5b2a!2sBe%C5%9Fikta%C5%9F%2C%20Istanbul!5e0!3m2!1str!2str!4v1234567890"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Düğün Lokasyonu"
          />
        </motion.div>

        {/* Navigation buttons */}
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
            Google Maps
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="8" stroke="#C9A84C" strokeWidth="1.5" />
              <path d="M12 18 L12 22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Waze ile Git
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`📍 Düğün Lokasyonu: ${venueName}, ${district} ${city}\n` + mapsUrl)}`}
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                fill="#25D366" />
            </svg>
            WhatsApp ile Paylaş
          </a>
        </motion.div>
      </div>
    </section>
  );
}
