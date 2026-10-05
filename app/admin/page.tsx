"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Package, ShoppingCart, TrendingUp, Store, Plus, ArrowRight } from "lucide-react";

interface DashboardData {
  stats: {
    totalProducts?: number;
    activeProducts?: number;
    totalOrders?: number;
    pendingOrders?: number;
    totalRevenue?: number;
    totalStores?: number;
    // legacy
    totalCouples?: number;
    activeCouples?: number;
    totalRsvp?: number;
    totalVenues?: number;
    activeVenues?: number;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  topProducts: {
    id: string;
    name: string;
    brand: string;
    price: number;
    category: string;
  }[];
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  suffix,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}) {
  return (
    <div
      className="rounded-xl p-5 flex items-start justify-between"
      style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div>
        <p className="font-sans text-xs tracking-widest uppercase mb-2 text-neutral-500">{label}</p>
        <p className="font-sans text-3xl font-bold text-white">
          {value}
          {suffix && <span className="text-lg ml-1 text-neutral-400">{suffix}</span>}
        </p>
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: color + "20" }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiFetch<DashboardData>("/api/admin/dashboard").then(setData).catch(console.error);
  }, []);

  // Placeholder data for UI demo
  const stats = {
    totalProducts: data?.stats?.totalProducts ?? data?.stats?.totalCouples ?? 0,
    activeProducts: data?.stats?.activeProducts ?? data?.stats?.activeCouples ?? 0,
    totalOrders: data?.stats?.totalOrders ?? data?.stats?.totalRsvp ?? 0,
    pendingOrders: data?.stats?.pendingOrders ?? 0,
    totalRevenue: data?.stats?.totalRevenue ?? 0,
    totalStores: data?.stats?.totalStores ?? data?.stats?.totalVenues ?? 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">Dashboard</h2>
          <p className="font-sans text-sm mt-1 text-neutral-500">StepStyle yönetim paneli</p>
        </div>
        <Link
          href="/admin/couples/new"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-md"
          style={{ background: "#E8C547", color: "#0f0f0f" }}
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Toplam Ürün" value={stats.totalProducts} icon={Package} color="#E8C547" />
        <StatCard label="Aktif Ürün" value={stats.activeProducts} icon={Package} color="#4ade80" />
        <StatCard label="Toplam Sipariş" value={stats.totalOrders} icon={ShoppingCart} color="#60a5fa" />
        <StatCard label="Bekleyen Sipariş" value={stats.pendingOrders} icon={ShoppingCart} color="#f87171" />
        <StatCard
          label="Toplam Gelir"
          value={stats.totalRevenue.toLocaleString("tr-TR")}
          icon={TrendingUp}
          color="#a78bfa"
          suffix="₺"
        />
        <StatCard label="Mağaza Sayısı" value={stats.totalStores} icon={Store} color="#34d399" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sans font-semibold text-white">Son Siparişler</h3>
            <Link href="/admin/couples" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {!data?.recentOrders?.length ? (
            <p className="text-sm text-neutral-600">Henüz sipariş yok</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div>
                    <p className="text-sm text-white font-medium">{o.customerName}</p>
                    <p className="text-xs text-neutral-500">#{o.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-amber-400 font-semibold">
                      {o.totalAmount.toLocaleString("tr-TR")} ₺
                    </p>
                    <p className="text-xs text-neutral-600">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sans font-semibold text-white">Ürünler</h3>
            <Link href="/admin/couples" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {!data?.topProducts?.length ? (
            <p className="text-sm text-neutral-600">Henüz ürün yok</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div>
                    <p className="text-sm text-white font-medium">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.brand} · {p.category}</p>
                  </div>
                  <p className="text-sm text-amber-400 font-semibold">
                    {p.price.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
