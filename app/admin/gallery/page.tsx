"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api-client";

interface GalleryData {
    images: { id: string; url: string; order: number }[];
    isActive: boolean;
}

export default function AdminGalleryPage() {
    const [data, setData] = useState<GalleryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        apiFetch<GalleryData>("/api/gallery")
            .then((res) => {
                setData(res);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (newData: GalleryData) => {
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const updated = await apiFetch<GalleryData>("/api/gallery", {
                method: "PUT",
                body: JSON.stringify({ images: newData.images, isActive: newData.isActive }),
            });
            setData(updated);
            setSuccess("Galeri başarıyla güncellendi.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message || "Kaydetme başarısız.");
        } finally {
            setSaving(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new window.Image();
                img.onload = () => {
                    const MAX = 1200;
                    let { width, height } = img;
                    if (width > MAX || height > MAX) {
                        if (width > height) {
                            height = Math.round((height * MAX) / width);
                            width = MAX;
                        } else {
                            width = Math.round((width * MAX) / height);
                            height = MAX;
                        }
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas context failed"));
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.75));
                };
                img.onerror = reject;
                img.src = ev.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !data) return;

        if (data.images.length + files.length > 8) {
            setError("Düğün Galerisi en fazla 8 görsel içerebilir.");
            return;
        }

        for (const file of Array.from(files)) {
            try {
                const url = await compressImage(file);
                setData((prev) => {
                    if (!prev || prev.images.length >= 8) return prev;
                    const newImage = {
                        id: Math.random().toString(36).substring(7),
                        url,
                        order: prev.images.length,
                    };
                    return { ...prev, images: [...prev.images, newImage] };
                });
            } catch {
                setError("Görsel işlenirken hata oluştu, lütfen tekrar deneyin.");
            }
        }

        // reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = (id: string) => {
        if (!data) return;
        const newImages = data.images.filter(img => img.id !== id).map((img, i) => ({ ...img, order: i }));
        setData({ ...data, images: newImages });
    };

    const moveImage = (index: number, direction: -1 | 1) => {
        if (!data) return;
        const newImages = [...data.images];
        if (index + direction < 0 || index + direction >= newImages.length) return;

        const temp = newImages[index];
        newImages[index] = newImages[index + direction];
        newImages[index + direction] = temp;

        // update orders
        const updatedWithOrder = newImages.map((img, i) => ({ ...img, order: i }));
        setData({ ...data, images: updatedWithOrder });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)" }} />
            </div>
        );
    }

    const currentImages = data?.images || [];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-3xl font-light text-[#E8D5A3]">Düğün Galerisi</h2>
                    <p className="font-sans text-sm mt-1 text-[#E8D5A3]/50">
                        Tüm davetiyelerde görünecek ortak 8 salon fotoğrafını buradan yönetebilirsiniz.
                    </p>
                </div>
                <button
                    onClick={() => data && handleSave(data)}
                    disabled={saving}
                    className="px-6 py-2 rounded-lg font-sans text-sm font-medium transition-all"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #E8D5A3)", color: "#1a0f08" }}
                >
                    {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
            </div>

            {error && <div className="p-4 rounded-lg bg-red-900/40 text-red-300 border border-red-800/50 text-sm">{error}</div>}
            {success && <div className="p-4 rounded-lg bg-green-900/40 text-green-300 border border-green-800/50 text-sm">{success}</div>}

            <div className="bg-[#1a120b] border border-[#c9a84c]/20 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans text-lg text-[#E8D5A3]">Görseller ({currentImages.length} / 8)</h3>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <button
                        onClick={handleUploadClick}
                        disabled={currentImages.length >= 8}
                        className={`px-4 py-2 font-sans text-sm rounded-lg border transition-all ${currentImages.length >= 8
                                ? "border-gray-700 text-gray-500 cursor-not-allowed"
                                : "border-[#c9a84c]/30 text-[#e8d5a3] hover:bg-[#c9a84c]/10"
                            }`}
                    >
                        + Yeni Görsel Ekle
                    </button>
                </div>

                {currentImages.length === 0 ? (
                    <div
                        onClick={handleUploadClick}
                        className="border-2 border-dashed border-[#c9a84c]/30 rounded-xl py-20 flex flex-col items-center justify-center cursor-pointer hover:bg-[#c9a84c]/5 transition-colors"
                    >
                        <div className="text-4xl text-[#c9a84c]/40 mb-3">📸</div>
                        <p className="text-[#E8D5A3]/60 font-sans text-sm mb-1">Görsel yüklemek için tıklayın veya sürükleyin (Maks 8)</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {currentImages.map((img, index) => (
                            <div key={img.id} className="relative group bg-black/50 border border-[#c9a84c]/20 rounded-xl overflow-hidden aspect-[3/4]">
                                <Image src={img.url} alt={`Gallery ${index}`} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="bg-black/60 text-[#e8d5a3] text-xs px-2 py-1 rounded backdrop-blur">{index + 1}</span>
                                        <button
                                            onClick={() => handleRemove(img.id)}
                                            className="bg-red-500/80 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                            title="Sil"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => moveImage(index, -1)}
                                            disabled={index === 0}
                                            className="bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black disabled:opacity-30 disabled:hover:bg-black/60"
                                            title="Sola Kaydır"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={() => moveImage(index, 1)}
                                            disabled={index === currentImages.length - 1}
                                            className="bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black disabled:opacity-30 disabled:hover:bg-black/60"
                                            title="Sağa Kaydır"
                                        >
                                            →
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
