"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { Package, Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  status: string;
  slug: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter !== "all") params.set("status", filter);
    apiFetch<ProductRow[]>(`/api/admin/couples?${params}`)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, filter]);

  const toggleStatus = async (id: string, status: string) => {
    const newStatus = status === "active" ? "inactive" : "active";
    await apiFetch(`/api/admin/couples/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: newStatus === "active" }),
    });
    load();
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) return;
    await apiFetch(`/api/admin/couples/${id}`, { method: "DELETE" });
    load();
  };

  const categoryLabel: Record<string, string> = {
    kadin: "Kadın", erkek: "Erkek", cocuk: "Çocuk",
    spor: "Spor", klasik: "Klasik", bot: "Bot", sandalet: "Sandalet",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">Ürünler</h2>
          <p className="text-sm text-neutral-500 mt-1">{products.length} ürün listeleniyor</p>
        </div>
        <Link
          href="/admin/couples/new"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-md"
          style={{ background: "#E8C547", color: "#0f0f0f" }}
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün adı veya marka ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 outline-none focus:border-amber-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-md text-sm bg-neutral-900 border border-neutral-700 text-white outline-none"
        >
          <option value="all">Tüm Ürünler</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="out_of_stock">Stokta Yok</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "rgba(232,197,71,0.06)" }}>
                {["Ürün Adı", "Marka", "Kategori", "Fiyat", "Durum", "İşlemler"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-sans text-xs tracking-widest uppercase text-amber-500/60"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-600">
                    Yükleniyor…
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Package className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
                    <p className="text-sm text-neutral-600">Ürün bulunamadı</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <td className="px-4 py-3 text-sm text-white font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400">{p.brand || "—"}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400">
                      {categoryLabel[p.category] || p.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-amber-400 font-semibold">
                        {p.price?.toLocaleString("tr-TR")} ₺
                      </span>
                      {p.discountPrice && (
                        <span className="ml-2 text-xs text-neutral-600 line-through">
                          {p.discountPrice.toLocaleString("tr-TR")} ₺
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            p.status === "active"
                              ? "rgba(74,222,128,0.1)"
                              : "rgba(239,68,68,0.1)",
                          color: p.status === "active" ? "#4ade80" : "#f87171",
                        }}
                      >
                        {p.status === "active" ? "Aktif" : p.status === "out_of_stock" ? "Tükendi" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/couples/${p.id}`}
                          className="p-1.5 rounded text-neutral-500 hover:text-amber-400 transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => toggleStatus(p.id, p.status)}
                          className="p-1.5 rounded text-neutral-500 hover:text-amber-400 transition-colors"
                          title="Durum Değiştir"
                        >
                          {p.status === "active"
                            ? <ToggleRight className="w-4 h-4 text-green-400" />
                            : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id, p.name)}
                          className="p-1.5 rounded text-neutral-500 hover:text-red-400 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
