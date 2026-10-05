"use client";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { ShoppingCart, RefreshCw, Package } from "lucide-react";

interface OrderData {
  stats: { pending: number; confirmed: number; shipped: number; delivered: number; total: number; revenue: number };
  items: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone?: string;
    totalAmount: number;
    status: string;
    note?: string;
    createdAt: string;
  }[];
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Bekliyor", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  confirmed: { label: "Onaylandı", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  shipped: { label: "Kargoda", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  delivered: { label: "Teslim Edildi", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  cancelled: { label: "İptal", color: "#f87171", bg: "rgba(239,68,68,0.1)" },
};

export default function OrdersPage() {
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    apiFetch<OrderData>("/api/couple/rsvp")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-amber-500/40" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg text-xs border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const stats = data?.stats ?? { pending: 0, confirmed: 0, shipped: 0, delivered: 0, total: 0, revenue: 0 };
  const items = data?.items ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">Siparişler</h2>
          <p className="text-sm text-neutral-500 mt-1">{stats.total} sipariş</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Bekleyen", value: stats.pending, color: "#fbbf24" },
          { label: "Onaylanan", value: stats.confirmed, color: "#60a5fa" },
          { label: "Kargoda", value: stats.shipped, color: "#a78bfa" },
          { label: "Teslim Edildi", value: stats.delivered, color: "#4ade80" },
          { label: "Toplam Sipariş", value: stats.total, color: "#E8C547" },
          { label: "Toplam Gelir", value: `${stats.revenue.toLocaleString("tr-TR")} ₺`, color: "#34d399" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "rgba(232,197,71,0.06)" }}>
              {["Sipariş No", "Müşteri", "Telefon", "Tutar", "Durum", "Not", "Tarih"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 font-sans text-xs uppercase text-left text-amber-500/60"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
                  <p className="text-sm text-neutral-600">Henüz sipariş yok</p>
                </td>
              </tr>
            ) : (
              items.map((o) => {
                const s = STATUS_MAP[o.status] ?? STATUS_MAP.pending;
                return (
                  <tr key={o.id} className="border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <td className="px-3 py-2 text-sm text-amber-400 font-mono">#{o.orderNumber}</td>
                    <td className="px-3 py-2 text-sm text-white font-medium">{o.customerName}</td>
                    <td className="px-3 py-2 text-xs text-neutral-500">{o.customerPhone || "—"}</td>
                    <td className="px-3 py-2 text-sm text-amber-400 font-semibold">
                      {o.totalAmount.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-500 max-w-[100px] truncate">
                      {o.note || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-600">
                      {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
