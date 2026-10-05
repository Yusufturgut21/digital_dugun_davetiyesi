"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { Save, Package, Tag, Image, Layers } from "lucide-react";

const CATEGORIES = [
  { value: "kadin", label: "Kadın" },
  { value: "erkek", label: "Erkek" },
  { value: "cocuk", label: "Çocuk" },
  { value: "spor", label: "Spor" },
  { value: "klasik", label: "Klasik" },
  { value: "bot", label: "Bot" },
  { value: "sandalet", label: "Sandalet" },
];

const STEPS = ["Temel Bilgiler", "Fiyat & Stok", "Görseller", "Kategoriler & Etiketler"];

function ProductEditContent() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") ?? "0", 10) || 0;
  const [step, setStep] = useState(Math.min(initialStep, STEPS.length - 1));
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
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
  });

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/api/couple/invitation", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-md text-sm bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 outline-none focus:border-amber-500 transition-colors";

  const stepContent = [
    // Step 0 — Temel Bilgiler
    <div key="0" className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Ürün Adı *</label>
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Air Comfort Pro" required />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Marka *</label>
          <input className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Nike" required />
        </div>
      </div>
      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Açıklama</label>
        <textarea
          rows={4}
          className={inputCls + " resize-none"}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Ürün açıklaması..."
        />
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
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="w-4 h-4 accent-amber-500"
        />
        <label htmlFor="featured" className="text-sm text-neutral-300">Öne Çıkan Ürün</label>
      </div>
    </div>,

    // Step 1 — Fiyat & Stok
    <div key="1" className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Fiyat (₺) *</label>
          <input type="number" className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="1299" required />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">İndirimli Fiyat (₺)</label>
          <input type="number" className={inputCls} value={form.discountPrice} onChange={(e) => set("discountPrice", e.target.value)} placeholder="999" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
          Bedenler & Stok
          <span className="text-neutral-600 ml-2 normal-case tracking-normal">(örn: 36:5, 37:3, 38:0)</span>
        </label>
        <input className={inputCls} value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="36:5, 37:3, 38:10, 39:7, 40:4" />
      </div>
      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Renkler</label>
        <input className={inputCls} value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Beyaz, Siyah, Kırmızı" />
      </div>
    </div>,

    // Step 2 — Görseller
    <div key="2" className="space-y-5">
      <div
        className="rounded-xl border-2 border-dashed p-12 text-center cursor-pointer hover:border-amber-500/40 transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <Image className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
        <p className="text-sm text-neutral-500">Ürün görsellerini buraya sürükleyin</p>
        <p className="text-xs text-neutral-600 mt-1">PNG, JPG, WEBP — Max 5MB</p>
        <button
          type="button"
          className="mt-4 px-4 py-2 rounded-md text-xs font-semibold"
          style={{ background: "#E8C547", color: "#0f0f0f" }}
        >
          Dosya Seç
        </button>
      </div>
    </div>,

    // Step 3 — Kategoriler
    <div key="3" className="space-y-5">
      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Kategori *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => set("category", cat.value)}
              className="px-4 py-3 rounded-md text-sm text-left transition-all"
              style={{
                background: form.category === cat.value ? "rgba(232,197,71,0.15)" : "#1a1a1a",
                border: `1px solid ${form.category === cat.value ? "rgba(232,197,71,0.5)" : "rgba(255,255,255,0.06)"}`,
                color: form.category === cat.value ? "#E8C547" : "rgba(255,255,255,0.5)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">Etiketler</label>
        <input
          className={inputCls}
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="yeni sezon, trend, rahat, su geçirmez"
        />
        <p className="text-xs text-neutral-600 mt-1">Virgülle ayırın</p>
      </div>
    </div>,
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-white">Ürün Düzenle</h2>

      {saved && (
        <div className="rounded-md px-4 py-3 text-sm bg-green-500/10 border border-green-500/20 text-green-400">
          Ürün başarıyla güncellendi.
        </div>
      )}

      {/* Step tabs */}
      <div className="flex gap-1 flex-wrap">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className="px-4 py-2 rounded-md text-xs font-medium transition-all"
            style={{
              background: step === i ? "rgba(232,197,71,0.15)" : "#1a1a1a",
              color: step === i ? "#E8C547" : "rgba(255,255,255,0.4)",
              border: `1px solid ${step === i ? "rgba(232,197,71,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-6"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {stepContent[step]}

        <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-md text-sm border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                ← Geri
              </button>
            )}
            {step < STEPS.length - 1 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-md text-sm border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                İleri →
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ background: "#E8C547", color: "#0f0f0f" }}
          >
            <Save className="w-4 h-4" />
            {loading ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProductEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-amber-500/40" />
        </div>
      }
    >
      <ProductEditContent />
    </Suspense>
  );
}
