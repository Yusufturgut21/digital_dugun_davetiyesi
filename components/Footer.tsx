"use client";
import { motion } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";

interface Props { invitation?: WeddingInvitation; }

export default function Footer({ invitation }: Props) {
  const brideName = invitation?.brideName ?? "Ayşe";
  const groomName = invitation?.groomName ?? "Mehmet";
  const conj = invitation?.conjunction ?? "&";
  const displayName = `${groomName} ${conj} ${brideName}`;
  const monogram = invitation?.sealMonogram || `${groomName[0]}&${brideName[0]}`;
  const dateStr = invitation?.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : "14 Şubat 2026";
  const city = invitation?.city ?? "İstanbul";
  const invText = invitation?.invitationText ?? `${displayName} sizi aramızda görmekten mutluluk duyacaktır.`;
  return (
    <footer className="relative py-16 sm:py-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #F5EDD8 0%, #EDE3CC 100%)" }}
      />

      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.5) 70%, transparent)" }}
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(232,213,163,0.1))",
              border: "1px solid rgba(201,168,76,0.4)",
            }}
          >
            <span className="font-serif text-xl" style={{ color: "#C9A84C" }}>{monogram}</span>
          </div>
        </motion.div>

        {/* Decorative top line */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-[1px] w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6))" }} />
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill="rgba(201,168,76,0.7)" />
          </svg>
          <div className="h-[1px] w-20" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.6), transparent)" }} />
        </motion.div>

        <motion.p
          className="font-serif text-lg sm:text-2xl font-light italic leading-relaxed mb-4"
          style={{ color: "#5a4e47" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          "{invText}"
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4 my-8"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-[1px] w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4))" }} />
          <span className="text-gold/50 text-sm">♡</span>
          <div className="h-[1px] w-20" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.4), transparent)" }} />
        </motion.div>

        <motion.p
          className="font-sans text-xs tracking-[0.3em] uppercase mb-2"
          style={{ color: "rgba(201,168,76,0.7)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {dateStr} · {city}
        </motion.p>

        <motion.p
          className="font-sans text-xs font-light mt-6"
          style={{ color: "rgba(139,129,120,0.5)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Made with ♡
        </motion.p>
      </div>

      {/* Bottom gold line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.3) 70%, transparent)" }}
      />
    </footer>
  );
}
