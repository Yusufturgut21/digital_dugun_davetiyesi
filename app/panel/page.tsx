"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { WeddingInvitation } from "@/lib/types";

export default function PanelDashboard() {
  const [invitation, setInvitation] = useState<WeddingInvitation | null>(null);

  useEffect(() => {
    apiFetch<WeddingInvitation>("/api/couple/invitation").then(setInvitation);
  }, []);

  if (!invitation) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} /></div>;
  }

  const displayName = `${invitation.groomName} ${invitation.conjunction} ${invitation.brideName}`;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-serif text-3xl font-light" style={{ color: "#E8D5A3" }}>Hoş Geldiniz</h2>
        <p className="font-sans text-sm mt-1" style={{ color: "rgba(201,168,76,0.5)" }}>{displayName} — Davetiye Paneli</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Düğün Tarihi", value: invitation.weddingDate ? new Date(invitation.weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "—" },
          { label: "Saat", value: invitation.weddingTime || "—" },
          { label: "Durum", value: invitation.isActive ? "Aktif" : "Pasif" },
          { label: "Davetiye URL", value: `/davet/${invitation.slug}` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
            <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(201,168,76,0.5)" }}>{item.label}</p>
            <p className="font-serif text-lg" style={{ color: "#E8D5A3" }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/panel/edit" className="panel-btn panel-btn-primary">Davetiyeyi Düzenle</Link>
        <Link href={`/davet/${invitation.slug}`} target="_blank" className="panel-btn">Davetiye Önizleme</Link>
        <Link href="/panel/rsvp" className="panel-btn">RSVP Kayıtları</Link>
      </div>

      <style jsx global>{`
        .panel-btn { display: inline-flex; padding: 10px 18px; border-radius: 10px; font-size: 12px; font-family: sans-serif; border: 1px solid rgba(201,168,76,0.2); color: rgba(232,213,163,0.7); }
        .panel-btn-primary { background: linear-gradient(135deg, #C9A84C, #E8D5A3); color: #1a0f08; border: none; }
      `}</style>
    </div>
  );
}
