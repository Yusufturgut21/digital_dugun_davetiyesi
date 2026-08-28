"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

import { WeddingInvitation } from "@/lib/types";

interface Props {
  onComplete: () => void;
  invitation?: WeddingInvitation;
}

export default function EnvelopeOpening({ onComplete, invitation }: Props) {
  const brideInitial = invitation?.brideName?.[0] ?? "A";
  const groomInitial = invitation?.groomName?.[0] ?? "M";
  const conj = invitation?.conjunction ?? "&";
  const monogramText = `${groomInitial} ${conj} ${brideInitial}`;
  const envelopeMonogram = `${groomInitial} ${conj} ${brideInitial}`;
  const [phase, setPhase] = useState<"idle" | "hover" | "cracking" | "opening" | "done">("idle");
  const [petals, setPetals] = useState<{ id: number; x: number; delay: number; size: number; rotation: number }[]>([]);
  const [goldDust, setGoldDust] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sealRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = useTransform(mouseY, [-200, 200], [8, -8]);
  const rotateY = useTransform(mouseX, [-200, 200], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        mouseX.set(e.clientX - cx);
        mouseY.set(e.clientY - cy);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSealClick = () => {
    if (phase !== "idle" && phase !== "hover") return;
    setPhase("cracking");

    // gold dust particles
    const dust = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 50 + (Math.random() - 0.5) * 60,
      angle: Math.random() * 360,
    }));
    setGoldDust(dust);

    setTimeout(() => {
      setPhase("opening");
      const newPetals = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        size: 8 + Math.random() * 16,
        rotation: Math.random() * 360,
      }));
      setPetals(newPetals);
    }, 800);

    setTimeout(() => {
      setPhase("done");
      setTimeout(onComplete, 1200);
    }, 4000);
  };

  const skip = () => {
    setPhase("done");
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, #2a1f14 0%, #1a110a 50%, #0d0805 100%)",
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Ambient light orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
                top: "10%", left: "20%",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
                bottom: "10%", right: "15%",
              }}
              animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Petals */}
          <AnimatePresence>
            {phase === "opening" && petals.map((p) => (
              <motion.div
                key={p.id}
                className="absolute pointer-events-none"
                style={{ left: `${p.x}%`, top: "-20px" }}
                initial={{ y: -20, opacity: 0.9, rotate: p.rotation }}
                animate={{ y: "110vh", rotate: p.rotation + 720, opacity: 0 }}
                transition={{ duration: 4 + p.delay, ease: "linear", delay: p.delay * 0.3 }}
              >
                <svg width={p.size} height={p.size * 1.5} viewBox="0 0 20 30">
                  <ellipse cx="10" cy="15" rx="8" ry="13"
                    fill={`rgba(${201 + Math.random() * 30 | 0},${168 + Math.random() * 30 | 0},${76 + Math.random() * 20 | 0},0.7)`}
                    transform={`rotate(${Math.random() * 30 - 15}, 10, 15)`}
                  />
                </svg>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Envelope container */}
          <motion.div
            ref={containerRef}
            className="relative flex flex-col items-center"
            style={{ perspective: 1200 }}
            animate={phase === "opening" ? { y: -80, opacity: 0, scale: 0.85 } : {}}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
          >
            {/* Envelope body */}
            <motion.div
              style={{
                rotateX: phase === "idle" || phase === "hover" ? rotateX : 0,
                rotateY: phase === "idle" || phase === "hover" ? rotateY : 0,
                transformStyle: "preserve-3d",
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* Main envelope */}
              <motion.div
                className="relative"
                style={{
                  width: "min(480px, 90vw)",
                  height: "min(340px, 65vw)",
                }}
                animate={phase === "cracking" ? { scale: [1, 1.02, 0.99, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {/* Envelope back */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #f5edd8 0%, #ede3cc 40%, #e8d9bc 100%)",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 10px 30px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  {/* Paper texture lines */}
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute w-full opacity-[0.04]"
                      style={{ height: 1, background: "#8B7355", top: `${12 + i * 12}%` }} />
                  ))}

                  {/* Gold border */}
                  <div className="absolute inset-2 rounded-xl border border-yellow-600/20 pointer-events-none" />
                  <div className="absolute inset-3 rounded-xl border border-yellow-500/10 pointer-events-none" />

                  {/* Diagonal fold lines */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="none">
                      <line x1="0" y1="0" x2="240" y2="170" stroke="rgba(180,150,80,0.15)" strokeWidth="1" />
                      <line x1="480" y1="0" x2="240" y2="170" stroke="rgba(180,150,80,0.15)" strokeWidth="1" />
                      <line x1="0" y1="340" x2="240" y2="170" stroke="rgba(180,150,80,0.1)" strokeWidth="1" />
                      <line x1="480" y1="340" x2="240" y2="170" stroke="rgba(180,150,80,0.1)" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Corner ornaments */}
                  {[
                    "top-3 left-3",
                    "top-3 right-3 rotate-90",
                    "bottom-3 left-3 -rotate-90",
                    "bottom-3 right-3 rotate-180",
                  ].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8 opacity-40`}>
                      <svg viewBox="0 0 32 32" fill="none">
                        <path d="M2 2 L14 2 L2 14 Z" stroke="#C9A84C" strokeWidth="0.8" fill="rgba(201,168,76,0.2)" />
                        <circle cx="4" cy="4" r="1" fill="#C9A84C" opacity="0.6" />
                      </svg>
                    </div>
                  ))}

                  {/* Center monogram text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginBottom: 40 }}>
                    <p className="font-serif text-xs tracking-[0.4em] text-yellow-700/50 uppercase mb-2">— davetiye —</p>
                    <h2 className="font-serif text-5xl font-light" style={{ color: "rgba(154,123,47,0.4)", letterSpacing: "0.1em" }}>
                      {envelopeMonogram}
                    </h2>
                  </div>
                </div>

                {/* Wax seal */}
                <motion.div
                  ref={sealRef}
                  className="absolute"
                  style={{
                    bottom: "-36px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 20,
                  }}
                  onClick={handleSealClick}
                  onHoverStart={() => setPhase("hover")}
                  onHoverEnd={() => setPhase(p => p === "hover" ? "idle" : p)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    phase === "cracking"
                      ? { rotate: [0, -3, 3, -2, 2, 0], scale: [1, 1.05, 0.95, 1.02, 0.98, 0.9] }
                      : phase === "hover"
                        ? { scale: 1.08 }
                        : { scale: 1 }
                  }
                  transition={{ duration: 0.6 }}
                >
                  <svg width="88" height="88" viewBox="0 0 88 88">
                    <defs>
                      <radialGradient id="sealGrad" cx="35%" cy="35%">
                        <stop offset="0%" stopColor="#E8D5A3" />
                        <stop offset="40%" stopColor="#C9A84C" />
                        <stop offset="100%" stopColor="#7A5C1E" />
                      </radialGradient>
                      <radialGradient id="sealGlow" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="rgba(201,168,76,0.6)" />
                        <stop offset="100%" stopColor="rgba(201,168,76,0)" />
                      </radialGradient>
                      <filter id="sealShadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#C9A84C" floodOpacity="0.5" />
                      </filter>
                    </defs>
                    {/* Glow */}
                    <motion.circle cx="44" cy="44" r="44" fill="url(#sealGlow)"
                      animate={phase === "hover" ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {/* Main seal */}
                    <circle cx="44" cy="44" r="36" fill="url(#sealGrad)" filter="url(#sealShadow)" />
                    {/* Outer ring */}
                    <circle cx="44" cy="44" r="33" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <circle cx="44" cy="44" r="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    {/* Decorative notched edge */}
                    {[...Array(16)].map((_, i) => {
                      const angle = (i * 360) / 16;
                      const rad = (angle * Math.PI) / 180;
                      const x1 = 44 + 32 * Math.cos(rad);
                      const y1 = 44 + 32 * Math.sin(rad);
                      const x2 = 44 + 36 * Math.cos(rad);
                      const y2 = 44 + 36 * Math.sin(rad);
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />;
                    })}
                    {/* Monogram */}
                    <text x="44" y="40" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                      fontSize="14" fontWeight="500" fill="rgba(255,255,255,0.95)" letterSpacing="2">{groomInitial}</text>
                    <text x="44" y="52" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                      fontSize="8" fontWeight="300" fill="rgba(255,255,255,0.7)" letterSpacing="1">{conj}</text>
                    <text x="44" y="62" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                      fontSize="14" fontWeight="500" fill="rgba(255,255,255,0.95)" letterSpacing="2">{brideInitial}</text>
                    {/* Crack effect */}
                    {phase === "cracking" && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <path d="M44 20 L46 35 L42 42 L47 58 L44 68"
                          stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" />
                        <path d="M30 30 L40 40 L38 44 L30 55"
                          stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" fill="none" />
                      </motion.g>
                    )}
                  </svg>

                  {/* Gold dust burst */}
                  <AnimatePresence>
                    {phase === "cracking" && goldDust.map((d) => (
                      <motion.div
                        key={d.id}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          background: "#E8D5A3",
                          left: `${d.x}%`,
                          top: `${d.y}%`,
                        }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{
                          x: Math.cos((d.angle * Math.PI) / 180) * 60,
                          y: Math.sin((d.angle * Math.PI) / 180) * 60,
                          scale: [0, 1.5, 0],
                          opacity: [1, 0.8, 0],
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Hint text */}
              <AnimatePresence>
                {(phase === "idle" || phase === "hover") && (
                  <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ delay: 1.5 }}
                  >
                    <p className="font-serif text-yellow-300/60 text-sm italic tracking-wider">
                      Mühürü kırarak zarfı açın
                    </p>
                    <motion.div
                      className="flex justify-center mt-2"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4 L10 14 M6 10 L10 14 L14 10"
                          stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Skip button */}
          <motion.button
            className="fixed top-6 right-6 text-yellow-200/40 hover:text-yellow-200/80 text-xs tracking-widest uppercase font-sans transition-colors z-[10001]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={skip}
          >
            Geç →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
