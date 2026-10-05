"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { ArrowLeft, Save } from "lucide-react";

const CATEGORIES = [
  { value: "kadin", label: "Kadın" },
  { value: "erkek", label: "Erkek" },
  { value: "cocuk", label: "Çocuk" },
  { value: "spor", label: "Spor" },
  { value: "klasik", label: "Klasik" },
  { value: "bot", label: "Bot" },
  { value: "sandalet", label: "Sandalet" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    category: "kadin",
    price: "",
    discountPrice: "",
    sizes: "",
    colors: "",
    tags: "",
    status: "active",
    featured: false,
    username: "",
    password: "",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ invitation: { id: string } }>("/api/admin/couples", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push(`/admin/couples/${data.invitation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-md text-sm bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 outline-none focus:border-amber-500 transition-colors";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/couples" className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Ürünlere Dön
        </Link>
        <h2 className="font-serif text-3xl font-bold text-white">Yeni Ürün Ekle</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Temel Bilgiler */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="font-semibold text-white">Temel Bilgiler</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Ürün Adı *</label>
              <input required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Air Comfort Pro" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Marka *</label>
              <input required className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Nike" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Açıklama</label>
            <textarea rows={3} className={inputCls + " resize-none"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Ürün açıklaması..." />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Kategori *</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => set("category", cat.value)}
                  className="px-3 py-2 rounded-md text-xs transition-all"
                  style={{
                    background: form.category === cat.value ? "rgba(232,197,71,0.15)" : "#111",
                    border: `1px solid ${form.category === cat.value ? "rgba(232,197,71,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: form.category === cat.value ? "#E8C547" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fiyat & Stok */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="font-semibold text-white">Fiyat & Stok</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Fiyat (₺) *</label>
              <input required type="number" className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="1299" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">İndirimli Fiyat (₺)</label>
              <input type="number" className={inputCls} value={form.discountPrice} onChange={(e) => set("discountPrice", e.target.value)} placeholder="999" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
              Bedenler & Stok <span className="text-neutral-600 normal-case tracking-normal ml-1">(örn: 36:5, 37:3)</span>
            </label>
            <input className={inputCls} value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="36:5, 37:3, 38:10" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Renkler</label>
            <input className={inputCls} value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Beyaz, Siyah" />
          </div>
        </div>

        {/* Etiketler & Durum */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="font-semibold text-white">Etiketler & Durum</h3>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Etiketler</label>
            <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="yeni sezon, trend, rahat" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Durum</label>
            <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="out_of_stock">Stok Yok</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-amber-500" />
            <label htmlFor="featured" className="text-sm text-neutral-300">Öne Çıkan Ürün</label>
          </div>
        </div>

        {/* Hesap (mağaza erişimi için) */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="font-semibold text-white">Panel Erişimi</h3>
          <p className="text-xs text-neutral-600">Bu ürünü yönetecek mağaza kullanıcısı</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Kullanıcı Adı *</label>
              <input required className={inputCls} value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="magaza1" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Şifre *</label>
              <input required type="password" className={inputCls} value={form.password} onChange={(e) => set("password", e.target.value)} />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md px-4 py-3 bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-semibold text-sm disabled:opacity-60 transition-opacity"
          style={{ background: "#E8C547", color: "#0f0f0f" }}
        >
          <Save className="w-4 h-4" />
          {loading ? "Ekleniyor…" : "Ürünü Ekle"}
        </button>
      </form>
    </div>
  );
}
