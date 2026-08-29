"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { WeddingInvitation, SealType } from "@/lib/types";
import { isDataUrl } from "@/lib/imageUtils";

interface Props {
  onComplete: () => void;
  invitation?: WeddingInvitation;
}

const DEFAULT_LANDSCAPE =
  "https://images.unsplash.com/photo-1465495976277-5937a973ff4f?w=1920&q=85";

type Phase = "enter" | "idle" | "hover" | "cracking" | "burst" | "parting" | "revealed" | "transition" | "done";

const SEAL_STYLES: Record<SealType, { grad1: string; grad2: string; grad3: string; glow: string }> = {
  "gold-wax": { grad1: "#F5E6B8", grad2: "#C9A84C", grad3: "#6B4F1A", glow: "rgba(201,168,76,0.7)" },
  "burgundy-wax": { grad1: "#E8A0A0", grad2: "#8B2635", grad3: "#3A0812", glow: "rgba(139,38,53,0.7)" },
  ottoman: { grad1: "#D4AF37", grad2: "#1B4332", grad3: "#0A1F14", glow: "rgba(27,67,50,0.6)" },
  classic: { grad1: "#F5EDE0", grad2: "#B8956A", grad3: "#5C4020", glow: "rgba(184,149,106,0.6)" },
  minimal: { grad1: "#F0EDE8", grad2: "#9A9088", grad3: "#4A4540", glow: "rgba(154,144,136,0.5)" },
};

/* ─── Ambient floating particles ─── */
function AmbientParticles({ count = 40, active }: { count?: number; active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 4,
        opacity: 0.15 + Math.random() * 0.45,
      })),
    [count]
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(232,213,163,${p.opacity}), transparent)`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Rose petals ─── */
function RosePetals({ active }: { active: boolean }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 5 + Math.random() * 4,
        size: 10 + Math.random() * 14,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[15]">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: "-5%" }}
          initial={{ y: "-5vh", rotate: p.rotation, opacity: 0 }}
          animate={{
            y: "110vh",
            rotate: p.rotation + 720,
            x: p.drift,
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg width={p.size} height={p.size * 1.4} viewBox="0 0 20 28">
            <ellipse
              cx="10"
              cy="14"
              rx="8"
              ry="12"
              fill={`rgba(${210 + (p.id % 3) * 15},${140 + (p.id % 4) * 10},${120 + (p.id % 2) * 20},0.75)`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Shockwave ring on seal break ─── */
function Shockwave({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[55]"
          style={{ border: "2px solid rgba(232,213,163,0.6)" }}
          initial={{ width: 60, height: 60, opacity: 0.8 }}
          animate={{ width: 400 + i * 150, height: 400 + i * 150, opacity: 0 }}
          transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

/* ─── Wax seal ─── */
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
  const isCracking = phase === "cracking" || phase === "burst";

  const sealContent = sealImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={sealImage} alt="Mühür" className="w-full h-full object-cover" />
  ) : (
    <svg width="110" height="110" viewBox="0 0 110 110" className="drop-shadow-2xl">
      <defs>
        <radialGradient id="sealGradMain" cx="35%" cy="32%">
          <stop offset="0%" stopColor={colors.grad1} />
          <stop offset="50%" stopColor={colors.grad2} />
          <stop offset="100%" stopColor={colors.grad3} />
        </radialGradient>
        <filter id="sealGlowFilter">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor={colors.grad2} floodOpacity="0.6" />
        </filter>
      </defs>
      {/* Outer pulse ring */}
      <motion.circle
        cx="55" cy="55" r="52"
        fill="none" stroke={colors.glow} strokeWidth="1"
        animate={{ r: [50, 54, 50], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx="55" cy="55" r="44" fill="url(#sealGradMain)" filter="url(#sealGlowFilter)" />
      {/* Decorative rings */}
      <circle cx="55" cy="55" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <circle cx="55" cy="55" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      {/* Scalloped edge */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={55 + 38 * Math.cos(rad)} y1={55 + 38 * Math.sin(rad)}
            x2={55 + 44 * Math.cos(rad)} y2={55 + 44 * Math.sin(rad)}
            stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"
          />
        );
      })}
      {/* Ornamental cross */}
      <path d="M55 28 L55 82 M28 55 L82 55" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <text
        x="55" y="60" textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize="14" fontWeight="500"
        fill="rgba(255,255,255,0.95)" letterSpacing="2"
      >
        {monogram}
      </text>
      {isCracking && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <path d="M55 18 L57 38 L52 48 L58 65 L55 78" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" fill="none" />
          <path d="M38 35 L48 45 L44 52 L36 62" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" fill="none" />
          <path d="M72 33 L64 43 L68 52 L76 60" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" fill="none" />
          <path d="M45 70 L55 62 L65 72" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" fill="none" />
        </motion.g>
      )}
    </svg>
  );

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      animate={
        isCracking
          ? { rotate: [0, -6, 6, -4, 4, 0], scale: [1, 1.08, 0.85, 1.02, 0] }
          : phase === "hover"
            ? { scale: 1.08, y: [0, -4, 0] }
            : { scale: 1, y: 0 }
      }
      transition={isCracking ? { duration: 0.7 } : { duration: 0.5 }}
    >
      {/* Rotating halo */}
      <motion.div
        className="absolute inset-0 -m-6 rounded-full pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${colors.glow}, transparent, ${colors.glow}, transparent)`,
          opacity: 0.4,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Pulsing glow */}
      <motion.div
        className="absolute inset-0 -m-4 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent 70%)` }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <div
        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center"
        style={{ boxShadow: `0 12px 50px ${colors.glow}, 0 4px 20px rgba(0,0,0,0.5)` }}
      >
        {sealContent}
      </div>
    </motion.div>
  );
}

/* ─── Gold dust burst ─── */
function GoldBurst({ active }: { active: boolean }) {
  const dust = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        angle: (i / 36) * 360 + Math.random() * 20,
        distance: 60 + Math.random() * 120,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 0.2,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[56]">
      {dust.map((d) => (
        <motion.div
          key={d.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: d.size,
            height: d.size,
            background: d.id % 3 === 0 ? "#fff" : d.id % 3 === 1 ? "#E8D5A3" : "#C9A84C",
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((d.angle * Math.PI) / 180) * d.distance,
            y: Math.sin((d.angle * Math.PI) / 180) * d.distance,
            scale: [0, 1.5, 0],
            opacity: [1, 0.9, 0],
          }}
          transition={{ duration: 1.2, delay: d.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Cinematic letterbox bars ─── */
function Letterbox({ open }: { open: boolean }) {
  return (
    <>
      <motion.div
        className="absolute top-0 left-0 right-0 z-[45] bg-black pointer-events-none"
        initial={{ height: "10vh" }}
        animate={{ height: open ? 0 : "10vh" }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[45] bg-black pointer-events-none"
        initial={{ height: "10vh" }}
        animate={{ height: open ? 0 : "10vh" }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      />
    </>
  );
}

/* ─── Curtain panel with sway ─── */
function CurtainPanel({
  side,
  open,
  layer,
}: {
  side: "left" | "right";
  open: boolean;
  layer: "outer" | "inner";
}) {
  const isLeft = side === "left";
  const width = layer === "outer" ? "54%" : "48%";
  const zIndex = layer === "outer" ? 30 : 28;
  const openX = isLeft ? "-110%" : "110%";
  const delay = layer === "inner" ? 0.15 : 0;

  return (
    <motion.div
      className={`absolute top-0 h-full curtain-panel ${layer === "outer" ? "curtain-outer" : "curtain-inner"}`}
      style={{
        width,
        [isLeft ? "left" : "right"]: 0,
        zIndex,
        transformOrigin: isLeft ? "left center" : "right center",
      }}
      animate={
        open
          ? { x: openX, rotateY: isLeft ? -8 : 8 }
          : { x: 0, rotateY: 0 }
      }
      transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1], delay }}
    >
      <div className={`absolute inset-0 ${layer === "outer" ? "curtain-fabric-rich" : "curtain-sheer"}`} />
      <div className={`absolute inset-0 ${isLeft ? "curtain-folds-left" : "curtain-folds-right"}`} />
      {/* Gold fringe at bottom */}
      <div className={`absolute bottom-0 ${isLeft ? "right-0" : "left-0"} w-full h-16 curtain-fringe`} />
      {/* Gold trim edge */}
      <div
        className={`absolute top-0 ${isLeft ? "right-0" : "left-0"} w-4 h-full`}
        style={{
          background: isLeft
            ? "linear-gradient(90deg, transparent, rgba(201,168,76,0.5))"
            : "linear-gradient(270deg, transparent, rgba(201,168,76,0.5))",
        }}
      />
      {/* Sway animation when closed */}
      {!open && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ skewX: isLeft ? [0, 0.3, 0, -0.3, 0] : [0, -0.3, 0, 0.3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}

/* ─── Ornate valance ─── */
function Valance({ open }: { open: boolean }) {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-40"
      animate={open ? { y: "-120%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="h-20 sm:h-24 w-full valance-bar relative">
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #0d0604 0%, #1f1008 50%, #3d2010 100%)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          }}
        />
        {/* Swag drapes */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="valance-swag"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        {/* Gold tassel row */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="valance-tassel" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── God rays ─── */
function GodRays({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[12] overflow-hidden">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%] left-1/2 origin-top"
          style={{
            width: i % 2 === 0 ? 3 : 1.5,
            height: "90%",
            marginLeft: -1,
            background: `linear-gradient(180deg, rgba(232,213,163,${0.15 + (i % 3) * 0.08}), transparent 80%)`,
            transform: `rotate(${-40 + i * 10}deg)`,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 0.7, 0.4], scaleY: 1 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 1.8, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.35) 0%, transparent 55%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6] }}
        transition={{ duration: 2 }}
      />
    </div>
  );
}

/* ─── Name reveal with letter stagger ─── */
function NameReveal({
  names,
  date,
  visible,
}: {
  names: string;
  date?: string;
  visible: boolean;
}) {
  const words = names.split(" ");

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Ornamental frame */}
      <motion.div
        className="absolute w-[min(90vw,600px)] h-[min(50vh,400px)] pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
      >
        <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
          <motion.rect
            x="20" y="20" width="560" height="360" rx="4"
            stroke="rgba(201,168,76,0.3)" strokeWidth="1" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 1.5 }}
          />
          {[
            "M20,20 L60,20 L60,60", "M580,20 L540,20 L540,60",
            "M20,380 L60,380 L60,340", "M580,380 L540,380 L540,340",
          ].map((d, i) => (
            <motion.path key={i} d={d} stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
            />
          ))}
        </svg>
      </motion.div>

      <motion.p
        className="font-sans text-[10px] sm:text-xs tracking-[0.6em] uppercase mb-5"
        style={{ color: "rgba(255,255,255,0.65)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Düğün Davetiyesi
      </motion.p>

      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-center leading-tight">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block">
            {word.split("").map((char, ci) => (
              <motion.span
                key={ci}
                className="inline-block shimmer-text-invite"
                style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.7 + wi * 0.3 + ci * 0.04,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
            {wi < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </h1>

      {date && (
        <motion.p
          className="font-sans text-xs sm:text-sm tracking-[0.35em] mt-8 uppercase"
          style={{ color: "rgba(232,213,163,0.9)" }}
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          {date}
        </motion.p>
      )}

      <motion.div
        className="mt-8 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <div className="w-16 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(232,213,163,0.7))" }} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z"
              stroke="rgba(232,213,163,0.7)" strokeWidth="0.8" fill="rgba(201,168,76,0.2)" />
          </svg>
        </motion.div>
        <div className="w-16 h-[1px]" style={{ background: "linear-gradient(270deg, transparent, rgba(232,213,163,0.7))" }} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function EnvelopeOpening({ onComplete, invitation }: Props) {
  const brideInitial = invitation?.brideName?.[0] ?? "A";
  const groomInitial = invitation?.groomName?.[0] ?? "M";
  const conj = invitation?.conjunction ?? "&";
  const coupleNames = invitation
    ? `${invitation.groomName} ${conj} ${invitation.brideName}`
    : "Davetiye";
  const sealType = (invitation?.sealType ?? "gold-wax") as SealType;
  const landscapeSrc = invitation?.coverImage || DEFAULT_LANDSCAPE;

  const formattedDate = invitation?.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : undefined;

  const [phase, setPhase] = useState<Phase>("enter");
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const landscapeX = useTransform(springX, [-300, 300], [-15, 15]);
  const landscapeY = useTransform(springY, [-300, 300], [-10, 10]);
  const landscapeScale = useTransform(springY, [-300, 300], [1.08, 1.12]);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("idle"), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const playSealSound = useCallback(() => {
    if (invitation?.sealSound) {
      const audio = new Audio(invitation.sealSound);
      audio.volume = (invitation.soundVolume ?? 50) / 100;
      audio.play().catch(() => {});
    }
  }, [invitation]);

  const handleSealClick = () => {
    if (phase !== "idle" && phase !== "hover") return;
    playSealSound();
    setPhase("cracking");

    setTimeout(() => setPhase("burst"), 500);
    setTimeout(() => setPhase("parting"), 700);
    setTimeout(() => setPhase("revealed"), 2600);
    setTimeout(() => setPhase("transition"), 5200);
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 6200);
  };

  const skip = () => {
    setPhase("done");
    onComplete();
  };

  const curtainsOpen = ["parting", "revealed", "transition", "done"].includes(phase);
  const showBurst = phase === "burst" || phase === "cracking";
  const showReveal = ["revealed", "transition"].includes(phase);
  const showPetals = ["parting", "revealed", "transition"].includes(phase);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[10000] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* ── Landscape with Ken Burns + parallax ── */}
          <motion.div
            className="absolute inset-0"
            style={{ x: landscapeX, y: landscapeY, scale: landscapeScale }}
            animate={
              curtainsOpen
                ? { scale: 1 }
                : { scale: 1.12 }
            }
            transition={{ duration: 8, ease: "easeOut" }}
          >
            <Image
              src={landscapeSrc}
              alt=""
              fill
              priority
              unoptimized={isDataUrl(landscapeSrc)}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.4) 100%)" }}
            />
          </motion.div>

          <GodRays active={showReveal} />
          <AmbientParticles active={!curtainsOpen} count={35} />
          <RosePetals active={showPetals} />

          {/* Bokeh foreground orbs */}
          {showReveal && (
            <div className="absolute inset-0 pointer-events-none z-[14]">
              {[
                { x: "15%", y: "70%", s: 120 },
                { x: "80%", y: "60%", s: 80 },
                { x: "60%", y: "80%", s: 100 },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: b.x, top: b.y, width: b.s, height: b.s,
                    background: "radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%)",
                    filter: "blur(20px)",
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4 + i, repeat: Infinity }}
                />
              ))}
            </div>
          )}

          <NameReveal names={coupleNames} date={formattedDate} visible={showReveal} />

          {/* ── Double-layer curtains ── */}
          <CurtainPanel side="left" open={curtainsOpen} layer="inner" />
          <CurtainPanel side="right" open={curtainsOpen} layer="inner" />
          <CurtainPanel side="left" open={curtainsOpen} layer="outer" />
          <CurtainPanel side="right" open={curtainsOpen} layer="outer" />

          <Valance open={curtainsOpen} />
          <Letterbox open={curtainsOpen} />

          {/* Golden cord tying curtains */}
          <AnimatePresence>
            {!curtainsOpen && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] pointer-events-none"
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4 }}
              >
                <svg width="200" height="40" viewBox="0 0 200 40" className="opacity-60">
                  <path d="M0 20 Q50 5 100 20 Q150 35 200 20" stroke="rgba(201,168,76,0.5)" strokeWidth="2" fill="none" />
                  <path d="M0 22 Q50 7 100 22 Q150 37 200 22" stroke="rgba(201,168,76,0.3)" strokeWidth="1" fill="none" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Seal + interactions ── */}
          <AnimatePresence>
            {!curtainsOpen && phase !== "burst" && (
              <motion.div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pointer-events-auto relative">
                  <Shockwave active={showBurst} />
                  <GoldBurst active={showBurst} />
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
                    onHoverEnd={() => setPhase((p) => (p === "hover" ? "idle" : p))}
                  />
                </div>

                {(phase === "idle" || phase === "hover" || phase === "enter") && (
                  <motion.div
                    className="text-center mt-12 pointer-events-none"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <motion.p
                      className="font-serif text-sm sm:text-base italic tracking-widest"
                      style={{ color: "rgba(232,213,163,0.75)", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      Mühürü kırarak perdeyi açın
                    </motion.p>
                    <motion.div
                      className="flex justify-center mt-4"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-8 h-12 rounded-full border border-rgba(201,168,76,0.3) flex items-start justify-center pt-2"
                        style={{ border: "1px solid rgba(201,168,76,0.35)" }}>
                        <motion.div
                          className="w-1 h-2 rounded-full"
                          style={{ background: "rgba(201,168,76,0.7)" }}
                          animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Light burst flash */}
          <AnimatePresence>
            {phase === "burst" && (
              <motion.div
                className="absolute inset-0 z-[60] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,240,200,0.9) 0%, rgba(201,168,76,0.4) 40%, transparent 70%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>

          {/* Vignette */}
          {!curtainsOpen && (
            <div
              className="absolute inset-0 z-[25] pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 20%, rgba(0,0,0,0.65) 100%)" }}
            />
          )}

          {/* Transition zoom to main site */}
          <AnimatePresence>
            {phase === "transition" && (
              <motion.div
                className="absolute inset-0 z-[70] pointer-events-none"
                style={{ background: "#FAF6F0" }}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </AnimatePresence>

          {/* Skip */}
          <motion.button
            className="fixed top-6 right-6 text-xs tracking-widest uppercase font-sans z-[10001] px-4 py-2 rounded-full transition-all"
            style={{
              color: "rgba(232,213,163,0.5)",
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(201,168,76,0.15)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={skip}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(232,213,163,1)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(232,213,163,0.5)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
            }}
          >
            Geç →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
