"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Package, ShoppingCart, TrendingUp, ArrowRight, Plus } from "lucide-react";

interface StoreData {
  slug: string;
  storeName?: string;
  isActive?: boolean;
  totalProducts?: number;
  totalOrders?: number;
  pendingOrders?: number;
  revenue?: number;
}

export default function StoreDashboard() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<StoreData>("/api/couple/invitation")
      .then((data) => {
        if (data.slug !== slug) {
          router.replace(`/panel/${data.slug}`);
        } else {
          setStore(data);
        }
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading || !store) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-amber-500/40" />
      </div>
    );
  }

  const stats = [
    { label: "Toplam Ürün", value: store.totalProducts ?? 0, icon: Package, color: "#E8C547" },
    { label: "Toplam Sipariş", value: store.totalOrders ?? 0, icon: ShoppingCart, color: "#60a5fa" },
    { label: "Bekleyen Sipariş", value: store.pendingOrders ?? 0, icon: ShoppingCart, color: "#f87171" },
    { label: "Toplam Gelir", value: `${(store.revenue ?? 0).toLocaleString("tr-TR")} ₺`, icon: TrendingUp, color: "#4ade80" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-serif text-3xl font-bold text-white">
          Hoş Geldiniz 👋
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          {store.storeName || "Mağazanız"} — Yönetim Paneli
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-5 flex items-start justify-between"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: color + "20" }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">
          Hızlı Erişim
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href={`/panel/${slug}/products/new`}
            className="flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-amber-400" />
              <span className="text-white">Yeni Ürün Ekle</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600" />
          </Link>

          <Link
            href={`/panel/${slug}/orders`}
            className="flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              <span className="text-white">Siparişler</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-green-400" />
              <span className="text-white">Mağazayı Gör</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600" />
          </Link>
        </div>
      </div>

      {/* Store status */}
      <div
        className="rounded-xl p-5 flex items-center justify-between"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Mağaza Durumu</p>
          <p className="text-white font-medium">{store.storeName || "Mağazanız"}</p>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{
            background: store.isActive ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
            color: store.isActive ? "#4ade80" : "#f87171",
          }}
        >
          {store.isActive ? "Aktif" : "Pasif"}
        </span>
      </div>
    </div>
  );
}
