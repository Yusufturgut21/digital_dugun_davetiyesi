"use client";
import { motion } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";
import Countdown from "../Countdown";

interface Props {
  invitation: WeddingInvitation;
}

export default function SimpleElegantHero({ invitation }: Props) {
  const { brideName, groomName, conjunction, weddingDate, weddingTime, venueName, showBesmele } = invitation;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #F5F3EE 0%, #FAF8F5 50%, #F5F3EE 100%)" }} />

      {/* Islamic Geometric Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L45 15 L30 30 L15 15 Z M30 30 L45 45 L30 60 L15 45 Z M0 30 L15 15 L30 30 L15 45 Z M30 30 L45 15 L60 30 L45 45 Z' fill='%234A5D3F' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} 
      />

      {/* Top decorative border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 opacity-20"
        style={{ background: "linear-gradient(90deg, transparent, #4A5D3F, transparent)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Besmele */}
        {showBesmele && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <p 
              className="font-serif text-2xl sm:text-3xl mb-2"
              style={{ 
                color: "#4A5D3F",
                fontWeight: 300,
                letterSpacing: "0.05em",
                direction: "rtl",
                fontFamily: "'Amiri', serif"
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </motion.div>
        )}

        {/* Arch Frame (subtle mihrab shape) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative inline-block"
        >
          {/* Decorative arch */}
          <svg className="absolute -top-8 left-1/2 -translate-x-1/2 w-64 h-16 opacity-15" viewBox="0 0 200 60" fill="none">
            <path d="M10 60 L10 30 Q10 10, 30 5 L100 0 L170 5 Q190 10, 190 30 L190 60" stroke="#4A5D3F" strokeWidth="1.5" fill="none"/>
          </svg>

          {/* Couple Names */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-light mb-6"
            style={{ color: "#2C3E2F", letterSpacing: "0.02em" }}
          >
            {groomName} {conjunction === "&" ? "&" : "ve"} {brideName}
          </motion.h1>

          {/* Decorative divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #4A5D3F, transparent)", maxWidth: "120px" }} />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="2" fill="#9A7B2F" opacity="0.6"/>
              <circle cx="10" cy="10" r="6" stroke="#9A7B2F" strokeWidth="0.5" opacity="0.4"/>
            </svg>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #4A5D3F, transparent)", maxWidth: "120px" }} />
          </motion.div>
        </motion.div>

        {/* Date & Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-sans text-sm tracking-[0.3em] uppercase mb-3" style={{ color: "#9A7B2F" }}>
            {new Date(weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="font-sans text-base" style={{ color: "#5C6F5D" }}>
            {weddingTime} · {venueName}
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Countdown invitation={invitation} />
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
            <path d="M0 20 L10 10 L20 20 L30 10 L40 20 L50 10 L60 20 L70 10 L80 20" stroke="#4A5D3F" strokeWidth="1" opacity="0.2" fill="none"/>
          </svg>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, #FAF8F5)" }} />
    </section>
  );
}
