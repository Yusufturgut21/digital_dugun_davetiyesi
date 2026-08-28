"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Countdown from "./Countdown";
import { WeddingInvitation } from "@/lib/types";

function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(id);
      }, 80);
      return () => clearInterval(id);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return <span>{displayed}</span>;
}

interface Props { invitation?: WeddingInvitation; }

const DEFAULTS = {
  brideName: "Ayşe", groomName: "Mehmet", conjunction: "&" as const,
  weddingDate: "2026-02-14", weddingTime: "15:00", city: "İstanbul",
};

export default function HeroSection({ invitation }: Props) {
  const data = invitation ?? DEFAULTS;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1a0f08 0%, #2d1f12 30%, #1a110a 60%, #0d0805 100%)",
          }}
        />
        {/* Bokeh light circles */}
        {[
          { top: "15%", left: "10%", size: 300, opacity: 0.08 },
          { top: "60%", right: "5%", size: 400, opacity: 0.06 },
          { top: "30%", left: "60%", size: 200, opacity: 0.05 },
          { top: "80%", left: "30%", size: 250, opacity: 0.07 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, rgba(201,168,76,${orb.opacity}) 0%, transparent 70%)`,
              top: orb.top,
              left: (orb as any).left,
              right: (orb as any).right,
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Ccircle cx='30' cy='30' r='1' fill='%23C9A84C'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ y, opacity }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top ornament */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <div className="h-[1px] w-16 sm:w-24" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6))" }} />
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 1 L11.5 8 L18 10 L11.5 12 L10 19 L8.5 12 L2 10 L8.5 8 Z"
              fill="rgba(201,168,76,0.8)" />
          </svg>
          <div className="h-[1px] w-16 sm:w-24" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.6), transparent)" }} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-sans font-light tracking-[0.4em] text-[10px] sm:text-xs uppercase mb-6"
          style={{ color: "rgba(201,168,76,0.7)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Düğünümüze Davetlisiniz
        </motion.p>

        {/* Names */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="font-serif font-light leading-none"
            style={{
              fontSize: "clamp(3rem, 12vw, 7rem)",
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 2px 40px rgba(201,168,76,0.3)",
            }}
          >
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <TypeWriter text={data.brideName} delay={0.8} />
            </motion.span>
            <motion.span
              className="font-light mx-4 sm:mx-8"
              style={{
                fontSize: "clamp(2rem, 8vw, 5rem)",
                background: "linear-gradient(135deg, #9A7B2F, #E8D5A3, #C9A84C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              {data.conjunction}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <TypeWriter text={data.groomName} delay={1.4} />
            </motion.span>
          </h1>
        </div>

        {/* Date line */}
        <motion.div
          className="flex items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="h-[1px] w-8 sm:w-16" style={{ background: "rgba(201,168,76,0.4)" }} />
          <span className="font-sans font-light tracking-[0.3em] text-xs sm:text-sm text-white/60 uppercase">
            {data.weddingDate ? new Date(data.weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : ""}
          </span>
          <span className="text-gold/40">·</span>
          <span className="font-sans font-light tracking-[0.2em] text-xs sm:text-sm text-white/60">
            {data.weddingTime}
          </span>
          <span className="text-gold/40">·</span>
          <span className="font-sans font-light tracking-[0.2em] text-xs sm:text-sm text-white/60">
            {data.city}
          </span>
          <div className="h-[1px] w-8 sm:w-16" style={{ background: "rgba(201,168,76,0.4)" }} />
        </motion.div>

        {/* Countdown */}
        <div className="mb-10 sm:mb-12">
          <Countdown targetDate={data.weddingDate} />
        </div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
        >
          <a
            href="#rsvp"
            className="group relative px-8 py-4 rounded-full font-sans text-sm font-light tracking-[0.2em] uppercase overflow-hidden transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #E8D5A3, #C9A84C)",
              backgroundSize: "200% auto",
              color: "#1a0f08",
              boxShadow: "0 4px 30px rgba(201,168,76,0.4)",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundPosition = "right center")}
            onMouseLeave={e => (e.currentTarget.style.backgroundPosition = "left center")}
          >
            Katılım Durumunu Belirt
          </a>
          <a
            href="#details"
            className="px-8 py-4 rounded-full font-sans text-sm font-light tracking-[0.2em] uppercase transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "rgba(232,213,163,0.9)",
            }}
          >
            Detayları Gör
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/30">Kaydır</span>
        <div className="w-[1px] h-10" style={{ background: "linear-gradient(180deg, rgba(201,168,76,0.5), transparent)" }} />
      </motion.div>
    </section>
  );
}
