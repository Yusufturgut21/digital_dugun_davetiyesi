"use client";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

interface RSVPData {
  stats: { yes: number; no: number; maybe: number; totalGuests: number; total: number };
  items: { id: string; guestName: string; phone?: string; guestCount: number; attendance: string; note?: string; createdAt: string }[];
}

export default function PanelRSVPPage() {
  const [data, setData] = useState<RSVPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    apiFetch<RSVPData>("/api/couple/rsvp")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} /></div>;
  }

  if (error && !data) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="font-sans text-sm text-red-400">{error}</p>
        <button onClick={load} className="px-4 py-2 rounded-lg font-sans text-xs" style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#E8D5A3" }}>Tekrar Dene</button>
      </div>
    );
  }

  if (!data) return null;

  const { stats, items } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-light" style={{ color: "#E8D5A3" }}>RSVP / Katılım</h2>
        <button onClick={load} disabled={loading} className="px-3 py-1.5 rounded-lg font-sans text-xs" style={{ border: "1px solid rgba(201,168,76,0.3)", color: "rgba(201,168,76,0.7)" }}>
          {loading ? "Yenileniyor…" : "Yenile"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Katılacak", value: stats.yes, color: "#4ade80" },
          { label: "Katılmayacak", value: stats.no, color: "#f87171" },
          { label: "Belirsiz", value: stats.maybe, color: "#fbbf24" },
          { label: "Toplam Kişi", value: stats.totalGuests, color: "#E8D5A3" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
            <p className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(201,168,76,0.5)" }}>{s.label}</p>
            <p className="font-serif text-2xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "rgba(201,168,76,0.08)" }}>
              {["Misafir", "Telefon", "Kişi", "Durum", "Not", "Tarih"].map((h) => (
                <th key={h} className="px-3 py-2 font-sans text-xs uppercase text-left" style={{ color: "rgba(201,168,76,0.6)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Henüz RSVP yok</td></tr>
            ) : items.map((r) => (
              <tr key={r.id} className="border-t" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                <td className="px-3 py-2 font-sans text-sm" style={{ color: "#E8D5A3" }}>{r.guestName}</td>
                <td className="px-3 py-2 font-sans text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{r.phone || "—"}</td>
                <td className="px-3 py-2 font-sans text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{r.guestCount}</td>
                <td className="px-3 py-2 font-sans text-xs" style={{ color: r.attendance === "yes" ? "#4ade80" : "#f87171" }}>
                  {r.attendance === "yes" ? "Katılacak" : r.attendance === "no" ? "Katılmayacak" : "Belirsiz"}
                </td>
                <td className="px-3 py-2 font-sans text-xs max-w-[120px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{r.note || "—"}</td>
                <td className="px-3 py-2 font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
