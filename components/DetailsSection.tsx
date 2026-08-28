"use client";
import { motion } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";

interface Props { invitation?: WeddingInvitation; }

const DEFAULTS = {
  venueName: "The Grand Bosphorus",
  address: "Beşiktaş, İstanbul",
  city: "İstanbul",
  district: "Beşiktaş",
  weddingDate: "2026-02-14",
  weddingTime: "15:00",
  mapUrl: "",
};

function AddToCalendar({ inv }: { inv: Partial<WeddingInvitation> }) {
  const brideName = inv.brideName ?? "Ayşe";
  const groomName = inv.groomName ?? "Mehmet";
  const conj = inv.conjunction ?? "&";
  const eventTitle = encodeURIComponent(`${groomName} ${conj} ${brideName} Düğünü`);
  const eventDetails = encodeURIComponent(`${inv.venueName}, ${inv.city}`);
  const d = inv.weddingDate ? inv.weddingDate.replace(/-/g, "") : "20260214";
  const startDate = `${d}T120000Z`;
  const endDate = `${d}T200000Z`;

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${eventDetails}`;
  const appleUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:${startDate}%0ADTEND:${endDate}%0ASUMMARY:${eventTitle}%0AEND:VEVENT%0AEND:VCALENDAR`;

  return (
    <div className="flex gap-3 flex-wrap justify-center mt-8">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-sans tracking-wider uppercase transition-all hover:-translate-y-0.5"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(201,168,76,0.3)",
          color: "#3d3530",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="#C9A84C" strokeWidth="1.5" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Google Calendar
      </a>
      <a
        href={appleUrl}
        download="dugun.ics"
        className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-sans tracking-wider uppercase transition-all hover:-translate-y-0.5"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(201,168,76,0.3)",
          color: "#3d3530",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
            fill="#C9A84C" />
        </svg>
        Apple Calendar
      </a>
    </div>
  );
}

export default function DetailsSection({ invitation }: Props) {
  const d: Partial<WeddingInvitation> = invitation ?? DEFAULTS;
  const details = [
    { icon: "📍", label: "Lokasyon", value: d.venueName || "—", sub: `${d.district ? d.district + ", " : ""}${d.city}` },
    { icon: "📅", label: "Tarih", value: d.weddingDate ? new Date(d.weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "—", sub: d.weddingDate ? new Date(d.weddingDate).toLocaleDateString("tr-TR", { weekday: "long" }) : "" },
    { icon: "🕒", label: "Saat", value: d.weddingTime || "—", sub: "Kapı açılışı 30 dk önce" },
    { icon: "📌", label: "Adres", value: d.city || "—", sub: d.address || d.district || "" },
  ];

  return (
    <section id="details" className="section-gap relative">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAF6F0, #F0E8D8, #FAF6F0)" }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            Detaylar
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light" style={{ color: "#3d3530" }}>
            Düğün Bilgileri
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {details.map((item, i) => (
            <motion.div
              key={item.label}
              className="glass-card p-6 sm:p-8 text-center group hover:-translate-y-1 transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "#C9A84C" }}>
                {item.label}
              </p>
              <p className="font-serif text-lg sm:text-xl font-light mb-1" style={{ color: "#3d3530" }}>
                {item.value}
              </p>
              <p className="font-sans text-xs font-light" style={{ color: "#8B8178" }}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {invitation?.mapUrl && (
          <div className="mt-8 text-center">
            <a
              href={invitation.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans tracking-wider uppercase transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(201,168,76,0.3)",
                color: "#3d3530",
              }}
            >
              📍 Haritada Gör
            </a>
          </div>
        )}

        <AddToCalendar inv={d} />
      </div>
    </section>
  );
}
