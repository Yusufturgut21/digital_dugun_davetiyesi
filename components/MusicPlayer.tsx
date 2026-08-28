"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";

interface Props { invitation?: WeddingInvitation; }

const DEFAULT_MUSIC = "https://assets.mixkit.co/music/preview/mixkit-romantic-piano-252.mp3";

export default function MusicPlayer({ invitation }: Props) {
  const enabled = invitation ? invitation.soundEnabled : true;
  const volume = invitation ? (invitation.soundVolume ?? 50) / 100 : 0.25;
  const src = invitation?.backgroundSound || DEFAULT_MUSIC;

  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!enabled) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <>
      {/* Background audio */}
      <audio ref={audioRef} loop preload="none">
        <source src={src} type="audio/mpeg" />
      </audio>

      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-[500] w-12 h-12 rounded-full flex items-center justify-center transition-all"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(201,168,76,0.3)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
        title={playing ? "Müziği Kapat" : "Müziği Aç"}
      >
        {/* Sound bars animation */}
        {playing ? (
          <div className="flex items-end gap-[3px] h-5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{ background: "#C9A84C" }}
                animate={{ height: ["6px", "16px", "8px", "14px", "6px"] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3 L13 8 L3 13 Z" fill="#C9A84C" />
          </svg>
        )}
      </motion.button>
    </>
  );
}
