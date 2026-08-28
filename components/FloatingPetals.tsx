"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  xDrift: number;
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const items: Petal[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 12 + Math.random() * 10,
      size: 6 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.4,
      xDrift: (Math.random() - 0.5) * 200,
    }));
    setPetals(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: "-30px" }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.xDrift],
            rotate: [0, 720],
            opacity: [p.opacity, p.opacity * 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.6}
            viewBox="0 0 10 16"
          >
            <path
              d="M5 0 C8 3 9 8 7 13 C5 16 3 16 1 13 C-1 8 2 3 5 0 Z"
              fill={`rgba(201, 168, 76, ${p.opacity})`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
