"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api-client";

interface DashboardData {
  stats: {
    totalCouples: number;
    totalInvitations: number;
    activeCouples: number;
    inactiveCouples: number;
    activeUsers: number;
    totalRsvp: number;
    upcomingCount: number;
    totalVenues: number;
    activeVenues: number;
  };
  upcomingWeddings: { id: string; groomName: string; brideName: string; weddingDate: string; slug: string }[];
  recentCouples: { id: string; groomName: string; brideName: string; createdAt: string; slug: string }[];
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
      <p className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(201,168,76,0.5)" }}>{label}</p>
      <p className="font-serif text-3xl font-light" style={{ color: color || "#E8D5A3" }}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiFetch<DashboardData>("/api/admin/dashboard").then(setData).catch(console.error);
  }, []);

  if (!data) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} /></div>;
  }

  const { stats, upcomingWeddings, recentCouples } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-light" style={{ color: "#E8D5A3" }}>Dashboard</h2>
          <p className="font-sans text-sm mt-1" style={{ color: "rgba(201,168,76,0.5)" }}>Sahra Düğün Salonu yönetim özeti</p>
        </div>
        <Link href="/admin/couples/new" className="admin-btn admin-btn-primary inline-flex">+ Yeni Çift Oluştur</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Toplam Çift" value={stats.totalCouples} />
        <StatCard label="Toplam Davetiye" value={stats.totalInvitations} />
        <StatCard label="Aktif Çift" value={stats.activeCouples} color="#4ade80" />
        <StatCard label="Pasif Çift" value={stats.inactiveCouples} color="#f87171" />
        <StatCard label="Toplam RSVP" value={stats.totalRsvp} />
        <StatCard label="Aktif Kullanıcı" value={stats.activeUsers} />
        <StatCard label="Yaklaşan Düğün" value={stats.upcomingCount} />
        <StatCard label="Toplam Salon" value={stats.totalVenues} />
        <StatCard label="Aktif Salon" value={stats.activeVenues} color="#4ade80" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <h3 className="font-serif text-xl mb-4" style={{ color: "#E8D5A3" }}>Yaklaşan Düğünler</h3>
          {upcomingWeddings.length === 0 ? (
            <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Yaklaşan düğün yok</p>
          ) : (
            <div className="space-y-3">
              {upcomingWeddings.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                  <span className="font-sans text-sm" style={{ color: "rgba(232,213,163,0.8)" }}>{w.groomName} & {w.brideName}</span>
                  <span className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>{w.weddingDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <h3 className="font-serif text-xl mb-4" style={{ color: "#E8D5A3" }}>Son Eklenen Çiftler</h3>
          <div className="space-y-3">
            {recentCouples.map((c) => (
              <Link key={c.id} href={`/admin/couples/${c.id}`} className="flex items-center justify-between py-2 border-b hover:opacity-80" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                <span className="font-sans text-sm" style={{ color: "rgba(232,213,163,0.8)" }}>{c.groomName} & {c.brideName}</span>
                <span className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>Düzenle →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .admin-btn { display: inline-flex; align-items: center; padding: 10px 18px; border-radius: 10px; font-size: 12px; font-family: sans-serif; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .admin-btn-primary { background: linear-gradient(135deg, #C9A84C, #E8D5A3); color: #1a0f08; font-weight: 500; }
      `}</style>
    </div>
  );
}
