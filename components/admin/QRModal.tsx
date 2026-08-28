"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";

interface Props {
  invitation: WeddingInvitation;
  onClose: () => void;
}

// Minimal QR code generator using a public API
export default function QRModal({ invitation, onClose }: Props) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/davet/${invitation.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}&bgcolor=FAF6F0&color=3d3530&margin=2`;
  const displayName = `${invitation.groomName} ${invitation.conjunction} ${invitation.brideName}`;

  const download = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `qr-${invitation.slug}.png`;
      a.click();
    } catch {
      window.open(qrUrl, "_blank");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.75)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="rounded-3xl p-8 max-w-xs w-full text-center"
          style={{ background: "#1a0f08", border: "1px solid rgba(201,168,76,0.25)" }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <h3 className="font-serif text-lg mb-1" style={{ color: "#E8D5A3" }}>QR Kod</h3>
          <p className="font-sans text-xs mb-5" style={{ color: "rgba(201,168,76,0.6)" }}>{displayName}</p>

          {/* QR Image */}
          <div className="mx-auto w-48 h-48 rounded-2xl overflow-hidden mb-4 flex items-center justify-center"
            style={{ background: "#FAF6F0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR Kod" width={192} height={192} />
          </div>

          <p className="font-sans text-[10px] mb-5 break-all px-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            {url}
          </p>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 admin-btn admin-btn-outline">Kapat</button>
            <button onClick={download} className="flex-1 admin-btn admin-btn-primary">İndir</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
