"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Store, Eye, Pencil, Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";

interface StoreRow {
  id: string;
  slug: string;
  storeName: string;
  tagline: string;
  city: string;
  isActive: boolean;
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStores(); }, []);

  const loadStores = async () => {
    try {
      const data = await apiFetch<StoreRow[]>("/api/venues");
      setStores(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mağazayı silmek istediğinizden emin misiniz?")) return;
    try {
      await apiFetch(`/api/venues/${id}`, { method: "DELETE" });
      loadStores();
    } catch {
      alert("Silme işlemi başarısız");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-amber-500/40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">Mağazalar</h2>
          <p className="text-sm text-neutral-500 mt-1">Mağaza web sitelerini yönetin</p>
        </div>
        <Link
          href="/admin/venues/new"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-md"
          style={{ background: "#E8C547", color: "#0f0f0f" }}
        >
          <Plus className="w-4 h-4" />
          Yeni Mağaza Ekle
        </Link>
      </div>

      {stores.length === 0 ? (
        <div
          className="text-center py-20 rounded-xl"
          style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Store className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
          <p className="text-sm text-neutral-500">Henüz mağaza eklenmemiş</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(232,197,71,0.1)" }}
                >
                  <Store className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-white">{store.storeName}</h3>
                  <p className="text-sm text-neutral-500">{store.tagline}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-600">{store.city}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: store.isActive ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                        color: store.isActive ? "#4ade80" : "#f87171",
                      }}
                    >
                      {store.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/salon/${store.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
                  title="Önizle"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/venues/${store.id}`}
                  className="p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
                  title="Düzenle"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
