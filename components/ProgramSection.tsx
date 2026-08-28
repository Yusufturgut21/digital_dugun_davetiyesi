"use client";
import { motion } from "framer-motion";

const program = [
  { time: "14:30", title: "Kapı Açılışı", desc: "Konukların karşılanması ve yerleşimi", icon: "◇" },
  { time: "15:00", title: "Nikah Töreni", desc: "Resmi nikah ve yüzük takma", icon: "♡" },
  { time: "16:30", title: "Kokteyl & Fotoğraf", desc: "Karşılıklı kadeh kaldırma ve anı fotoğrafları", icon: "◈" },
  { time: "18:00", title: "Akşam Yemeği", desc: "Özel menü ile birlikte sofra zevki", icon: "✦" },
  { time: "20:00", title: "Düğün Pastası", desc: "İlk dilim kesme ve kutlama", icon: "❋" },
  { time: "20:30", title: "Müzik & Eğlence", desc: "Canlı müzik ve dans keyfi", icon: "◇" },
];

export default function ProgramSection() {
  return (
    <section id="program" className="section-gap relative">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #FAF6F0 0%, #F5EDD8 50%, #FAF6F0 100%)" }}
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            Akış
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light" style={{ color: "#3d3530" }}>
            Program
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-[1px]"
            style={{ background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.4) 10%, rgba(201,168,76,0.4) 90%, transparent)" }}
          />

          <div className="space-y-6 sm:space-y-8 pl-16">
            {program.map((p, i) => (
              <motion.div
                key={p.title}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Node */}
                <div
                  className="absolute -left-[38px] w-8 h-8 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "2px solid rgba(201,168,76,0.5)",
                    color: "#C9A84C",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {p.icon}
                </div>

                {/* Card */}
                <div
                  className="p-5 sm:p-6 rounded-2xl group hover:-translate-y-0.5 transition-transform duration-300"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="font-sans text-xs tracking-[0.2em] font-light whitespace-nowrap mt-0.5"
                      style={{ color: "#C9A84C" }}
                    >
                      {p.time}
                    </span>
                    <div>
                      <h4 className="font-serif text-lg font-light mb-1" style={{ color: "#3d3530" }}>
                        {p.title}
                      </h4>
                      <p className="font-sans text-sm font-light" style={{ color: "#8B8178" }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
