"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WeddingInvitation, SealType } from "@/lib/types";
import { isDataUrl } from "@/lib/imageUtils";

interface Props {
  onComplete: () => void;
  invitation?: WeddingInvitation;
}

const DEFAULT_LANDSCAPE =
  "https://images.unsplash.com/photo-1465495976277-5937a973ff4f?w=1920&q=85";

type Phase = "idle" | "hover" | "cracking" | "parting" | "revealed" | "done";

const SEAL_STYLES: Record<SealType, { grad1: string; grad2: string; grad3: string; glow: string }> = {
  "gold-wax": { grad1: "#E8D5A3", grad2: "#C9A84C", grad3: "#7A5C1E", glow: "rgba(201,168,76,0.6)" },
  "burgundy-wax": { grad1: "#D4847A", grad2: "#8B2635", grad3: "#4A0E1A", glow: "rgba(139,38,53,0.6)" },
  ottoman: { grad1: "#C9A84C", grad2: "#1B4332", grad3: "#0D2818", glow: "rgba(27,67,50,0.5)" },
  classic: { grad1: "#F0E6D3", grad2: "#B8956A", grad3: "#6B4F2A", glow: "rgba(184,149,106,0.5)" },
  minimal: { grad1: "#E8E4DF", grad2: "#9A9088", grad3: "#5C5650", glow: "rgba(154,144,136,0.4)" },
};

function WaxSeal({
  groomInitial,
  brideInitial,
  conj,
  sealType,
  sealImage,
  sealMonogram,
  phase,
  onClick,
  onHoverStart,
  onHoverEnd,
}: {
  groomInitial: string;
  brideInitial: string;
  conj: string;
  sealType: SealType;
  sealImage?: string;
  sealMonogram?: string;
  phase: Phase;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const colors = SEAL_STYLES[sealType] ?? SEAL_STYLES["gold-wax"];
  const monogram = sealMonogram || `${groomInitial}${conj}${brideInitial}`;

  if (sealImage) {
    return (
      <motion.div
        className="relative cursor-pointer"
        onClick={onClick}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={
          phase === "cracking"
            ? { rotate: [0, -4, 4, -2, 2, 0], scale: [1, 1.05, 0.9] }
            : phase === "hover"
              ? { scale: 1.06 }
              : { scale: 1 }
        }
        transition={{ duration: 0.6 }}
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden"
          style={{ boxShadow: `0 8px 40px ${colors.glow}, 0 4px 16px rgba(0,0,0,0.4)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sealImage} alt="Mühür" className="w-full h-full object-cover" />
        </div>
        {phase === "cracking" && (
          <motion.div className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)" }} />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={
        phase === "cracking"
          ? { rotate: [0, -4, 4, -2, 2, 0], scale: [1, 1.05, 0.9] }
          : phase === "hover"
            ? { scale: 1.06 }
            : { scale: 1 }
      }
      transition={{ duration: 0.6 }}
    >
      <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-2xl">
        <defs>
          <radialGradient id="sealGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor={colors.grad1} />
            <stop offset="45%" stopColor={colors.grad2} />
            <stop offset="100%" stopColor={colors.grad3} />
          </radialGradient>
          <filter id="sealShadow">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor={colors.grad2} floodOpacity="0.5" />
          </filter>
        </defs>
        <motion.circle cx="50" cy="50" r="48" fill={colors.glow}
          animate={phase === "hover" ? { opacity: [0.4, 0.8, 0.4] } : { opacity: 0.4 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <circle cx="50" cy="50" r="40" fill="url(#sealGrad)" filter="url(#sealShadow)" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        {[...Array(20)].map((_, i) => {
          const angle = (i * 360) / 20;
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={i}
              x1={50 + 36 * Math.cos(rad)} y1={50 + 36 * Math.sin(rad)}
              x2={50 + 40 * Math.cos(rad)} y2={50 + 40 * Math.sin(rad)}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
            />
          );
        })}
        <text x="50" y="54" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
          fontSize="13" fontWeight="500" fill="rgba(255,255,255,0.95)" letterSpacing="1">
          {monogram}
        </text>
        {phase === "cracking" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path d="M50 18 L52 38 L48 46 L53 62 L50 72" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none" />
            <path d="M34 32 L44 42 L40 48 L32 58" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" />
            <path d="M66 30 L58 40 L62 50 L68 60" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}

export default function EnvelopeOpening({ onComplete, invitation }: Props) {
  const brideInitial = invitation?.brideName?.[0] ?? "A";
  const groomInitial = invitation?.groomName?.[0] ?? "M";
  const conj = invitation?.conjunction ?? "&";
  const coupleNames = invitation
    ? `${invitation.groomName} ${conj} ${invitation.brideName}`
    : "Davetiye";
  const sealType = (invitation?.sealType ?? "gold-wax") as SealType;
  const landscapeSrc = invitation?.coverImage || DEFAULT_LANDSCAPE;

  const [phase, setPhase] = useState<Phase>("idle");
  const [goldDust, setGoldDust] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSealClick = () => {
    if (phase !== "idle" && phase !== "hover") return;
    setPhase("cracking");

    setGoldDust(Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 80,
      y: 50 + (Math.random() - 0.5) * 80,
      angle: Math.random() * 360,
    })));

    setTimeout(() => setPhase("parting"), 700);
    setTimeout(() => setPhase("revealed"), 2200);
    setTimeout(() => {
      setPhase("done");
      setTimeout(onComplete, 1000);
    }, 5000);
  };

  const skip = () => {
    setPhase("done");
    setTimeout(onComplete, 300);
  };

  const curtainsOpen = phase === "parting" || phase === "revealed" || phase === "done";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[10000] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Landscape background — always present, revealed by curtains */}
          <div className="absolute inset-0">
            <Image
              src={landscapeSrc}
              alt=""
              fill
              priority
              unoptimized={isDataUrl(landscapeSrc)}
              className="object-cover"
              sizes="100vw"
            />
            {/* Atmospheric overlay */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.25) 100%)" }} />
            {/* Golden light rays when revealed */}
            <AnimatePresence>
              {(phase === "revealed") && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                >
                  <div className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.25) 0%, transparent 60%)" }} />
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-0 left-1/2 origin-top"
                      style={{
                        width: 2,
                        height: "70%",
                        background: "linear-gradient(180deg, rgba(232,213,163,0.3), transparent)",
                        transform: `rotate(${-30 + i * 12}deg)`,
                        marginLeft: -1,
                      }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: [0, 0.6, 0.3], scaleY: 1 }}
                      transition={{ delay: i * 0.1, duration: 1.2 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Revealed content — couple names */}
          <AnimatePresence>
            {phase === "revealed" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-sans text-xs tracking-[0.5em] uppercase mb-4"
                  style={{ color: "rgba(255,255,255,0.7)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                  Düğün Davetiyesi
                </p>
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-center"
                  style={{
                    color: "#fff",
                    textShadow: "0 4px 40px rgba(0,0,0,0.6), 0 0 80px rgba(201,168,76,0.3)",
                    letterSpacing: "0.05em",
                  }}>
                  {coupleNames}
                </h1>
                {invitation?.weddingDate && (
                  <motion.p
                    className="font-sans text-sm tracking-[0.3em] mt-6 uppercase"
                    style={{ color: "rgba(232,213,163,0.9)", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {new Date(invitation.weddingDate).toLocaleDateString("tr-TR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </motion.p>
                )}
                <motion.div
                  className="mt-8 w-24 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(232,213,163,0.8), transparent)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left curtain */}
          <motion.div
            className="absolute top-0 left-0 h-full z-30 curtain-panel curtain-left"
            style={{ width: "52%", transformOrigin: "left center" }}
            animate={curtainsOpen ? { x: "-105%" } : { x: 0 }}
            transition={{ duration: 2, ease: [0.76, 0, 0.24, 1], delay: phase === "parting" ? 0 : 0 }}
          >
            <div className="absolute inset-0 curtain-fabric" />
            <div className="absolute inset-0 curtain-folds-left" />
            {/* Gold trim */}
            <div className="absolute top-0 right-0 w-3 h-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6))" }} />
            {/* Tassel rope */}
            <div className="absolute top-0 right-0 w-8 h-full flex flex-col items-center">
              <div className="w-[2px] h-full" style={{ background: "linear-gradient(180deg, #C9A84C, #7A5C1E)" }} />
            </div>
          </motion.div>

          {/* Right curtain */}
          <motion.div
            className="absolute top-0 right-0 h-full z-30 curtain-panel curtain-right"
            style={{ width: "52%", transformOrigin: "right center" }}
            animate={curtainsOpen ? { x: "105%" } : { x: 0 }}
            transition={{ duration: 2, ease: [0.76, 0, 0.24, 1], delay: phase === "parting" ? 0.1 : 0 }}
          >
            <div className="absolute inset-0 curtain-fabric" />
            <div className="absolute inset-0 curtain-folds-right" />
            <div className="absolute top-0 left-0 w-3 h-full"
              style={{ background: "linear-gradient(270deg, transparent, rgba(201,168,76,0.6))" }} />
            <div className="absolute top-0 left-0 w-8 h-full flex flex-col items-center">
              <div className="w-[2px] h-full" style={{ background: "linear-gradient(180deg, #C9A84C, #7A5C1E)" }} />
            </div>
          </motion.div>

          {/* Top valance / pelmet */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-40 h-16 sm:h-20"
            animate={curtainsOpen ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="h-full w-full"
              style={{
                background: "linear-gradient(180deg, #1a0f08 0%, #2a1a10 60%, #3d2518 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}>
              <div className="flex justify-center items-end h-full pb-1 gap-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-6 sm:w-8 h-4 sm:h-5 rounded-b-full"
                    style={{ background: "linear-gradient(180deg, #5C3020, #8B4A30)" }} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Seal + hint — centered on curtain gap */}
          <AnimatePresence>
            {!curtainsOpen && (
              <motion.div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pointer-events-auto relative">
                  <WaxSeal
                    groomInitial={groomInitial}
                    brideInitial={brideInitial}
                    conj={conj}
                    sealType={sealType}
                    sealImage={invitation?.sealImage}
                    sealMonogram={invitation?.sealMonogram}
                    phase={phase}
                    onClick={handleSealClick}
                    onHoverStart={() => setPhase("hover")}
                    onHoverEnd={() => setPhase(p => p === "hover" ? "idle" : p)}
                  />

                  {/* Gold dust burst */}
                  <AnimatePresence>
                    {phase === "cracking" && goldDust.map((d) => (
                      <motion.div
                        key={d.id}
                        className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                        style={{ background: "#E8D5A3", left: `${d.x}%`, top: `${d.y}%` }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{
                          x: Math.cos((d.angle * Math.PI) / 180) * 80,
                          y: Math.sin((d.angle * Math.PI) / 180) * 80,
                          scale: [0, 1.5, 0],
                          opacity: [1, 0.8, 0],
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {(phase === "idle" || phase === "hover") && (
                  <motion.div
                    className="text-center mt-10 pointer-events-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <p className="font-serif text-sm sm:text-base italic tracking-wider"
                      style={{ color: "rgba(232,213,163,0.7)", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
                      Mühürü kırarak perdeyi açın
                    </p>
                    <motion.div
                      className="flex justify-center mt-3"
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4 L10 14 M6 10 L10 14 L14 10"
                          stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dark vignette over curtains */}
          {!curtainsOpen && (
            <div className="absolute inset-0 z-25 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
          )}

          {/* Skip */}
          <motion.button
            className="fixed top-6 right-6 text-xs tracking-widest uppercase font-sans transition-colors z-[10001]"
            style={{ color: "rgba(232,213,163,0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={skip}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(232,213,163,0.9)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,213,163,0.4)")}
          >
            Geç →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
