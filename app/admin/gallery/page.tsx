"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api-client";
import { ImageIcon, Save, Plus, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";

interface GalleryData {
  images: { id: string; url: string; order: number }[];
  isActive: boolean;
}

export default function ProductGalleryPage() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiFetch<GalleryData>("/api/gallery")
      .then(setData)
      .catch((err) => setMessage({ type: "error", text: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (newData: GalleryData) => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await apiFetch<GalleryData>("/api/gallery", {
        method: "PUT",
        body: JSON.stringify({ images: newData.images, isActive: newData.isActive }),
      });
      setData(updated);
      setMessage({ type: "success", text: "Galeri başarıyla güncellendi." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Kaydetme başarısız." });
    } finally {
      setSaving(false);
    }
  };

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.onload = () => {
          const MAX = 1200;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
            else { width = Math.round((width * MAX) / height); height = MAX; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas failed"));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !data) return;
    if (data.images.length + files.length > 20) {
      setMessage({ type: "error", text: "Galeri en fazla 20 görsel içerebilir." });
      return;
    }
    for (const file of Array.from(files)) {
      try {
        const url = await compressImage(file);
        setData((prev) => {
          if (!prev || prev.images.length >= 20) return prev;
          return {
            ...prev,
            images: [...prev.images, { id: Math.random().toString(36).slice(2), url, order: prev.images.length }],
          };
        });
      } catch {
        setMessage({ type: "error", text: "Görsel işlenirken hata oluştu." });
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    if (!data) return;
    setData({ ...data, images: data.images.filter((img) => img.id !== id).map((img, i) => ({ ...img, order: i })) });
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    if (!data) return;
    const imgs = [...data.images];
    if (index + dir < 0 || index + dir >= imgs.length) return;
    [imgs[index], imgs[index + dir]] = [imgs[index + dir], imgs[index]];
    setData({ ...data, images: imgs.map((img, i) => ({ ...img, order: i })) });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-amber-500/40" />
      </div>
    );
  }

  const images = data?.images ?? [];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">Ürün Galerisi</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Mağazanın ana sayfasında görünecek vitrin görselleri
          </p>
        </div>
        <button
          onClick={() => data && handleSave(data)}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold disabled:opacity-60"
          style={{ background: "#E8C547", color: "#0f0f0f" }}
        >
          <Save className="w-4 h-4" />
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      {message && (
        <div
          className="rounded-md px-4 py-3 text-sm"
          style={{
            background: message.type === "success" ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${message.type === "success" ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
            color: message.type === "success" ? "#4ade80" : "#f87171",
          }}
        >
          {message.text}
        </div>
      )}

      <div
        className="rounded-xl p-6"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">
            Görseller ({images.length} / 20)
          </h3>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 20}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-neutral-700 text-neutral-400 hover:text-white transition-colors disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            Görsel Ekle
          </button>
        </div>

        {images.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl py-20 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-amber-500/40"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <ImageIcon className="w-12 h-12 mb-3 text-neutral-700" />
            <p className="text-sm text-neutral-500">Görsel yüklemek için tıklayın</p>
            <p className="text-xs text-neutral-600 mt-1">PNG, JPG — Maks 20 görsel</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative group rounded-lg overflow-hidden aspect-square bg-neutral-900"
              >
                <Image src={img.url} alt={`Ürün ${index + 1}`} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <span className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">{index + 1}</span>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center disabled:opacity-30 hover:bg-black transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center disabled:opacity-30 hover:bg-black transition-colors"
                    >
                      <ArrowRight className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
