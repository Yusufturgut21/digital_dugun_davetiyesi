"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface Props { targetDate?: string; }

export default function Countdown({ targetDate }: Props) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const target = targetDate ? new Date(targetDate).getTime() : new Date("2026-02-14T15:00:00").getTime();
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate, mounted]);

  const units = [
    { label: "Gün", value: time.days },
    { label: "Saat", value: time.hours },
    { label: "Dakika", value: time.minutes },
    { label: "Saniye", value: time.seconds },
  ];

  return (
    <motion.div
      className="flex items-center justify-center gap-3 sm:gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8 }}
    >
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="relative overflow-hidden rounded-2xl px-3 sm:px-5 py-3 sm:py-4 min-w-[60px] sm:min-w-[76px] text-center"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(201,168,76,0.3)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <motion.span
                key={u.value}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="block font-serif text-2xl sm:text-4xl font-light"
                style={{ color: "#C9A84C" }}
              >
                {pad(u.value)}
              </motion.span>
            </div>
            <span className="mt-1 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-sans font-light text-white/50">
              {u.label}
            </span>
          </div>
          {i < 3 && (
            <span className="font-serif text-xl sm:text-2xl mx-1 sm:mx-2 mb-4 text-gold/60">:</span>
          )}
        </div>
      ))}
    </motion.div>
  );
}
