"use client";
import { motion } from "framer-motion";

const socials = [
  {
    name: "Instagram",
    handle: "@aysemehmet2026",
    href: "https://instagram.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    handle: "+90 532 000 00 00",
    href: "https://wa.me/905320000000",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
          fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Telefon",
    handle: "+90 532 000 00 00",
    href: "tel:+905320000000",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.57 3.18 2 2 0 015.54 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 8.5a16 16 0 006.59 6.59l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function SocialSection() {
  return (
    <section id="social" className="section-gap relative">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #FAF6F0 0%, #F5EDD8 100%)" }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            İletişim
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light" style={{ color: "#3d3530" }}>
            Bize Ulaşın
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {socials.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 sm:p-8 text-center group hover:-translate-y-1 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                {s.icon}
              </div>
              <p className="font-serif text-lg font-light mb-1" style={{ color: "#3d3530" }}>
                {s.name}
              </p>
              <p className="font-sans text-xs font-light" style={{ color: "#8B8178" }}>
                {s.handle}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Hashtag */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#8B8178" }}>
            Anılarınızı paylaşın
          </p>
          <p className="font-serif text-2xl sm:text-3xl" style={{ color: "#C9A84C" }}>
            #AyşeMehmet2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
