"use client";
import { useState, useRef } from "react";
import { Upload, X, GripVertical } from "lucide-react";
import { compressImage } from "@/lib/imageUtils";

interface MultiImageUploadProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxWidth?: number;
  quality?: number;
}

export default function MultiImageUpload({
  label,
  images,
  onChange,
  maxImages = 20,
  maxWidth = 1920,
  quality = 0.8,
}: MultiImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      setError(`En fazla ${maxImages} görsel yükleyebilirsiniz (${remainingSlots} slot kaldı)`);
      return;
    }

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Lütfen sadece görsel dosyaları seçin");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} çok büyük (Max 10MB)`);
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      const base64Images = await Promise.all(
        files.map(file => compressImage(file, maxWidth, quality))
      );
      onChange([...images, ...base64Images]);
    } catch (err) {
      console.error("Multi image upload error:", err);
      setError("Görseller yüklenirken hata oluştu");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: "rgba(201,168,76,0.7)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {label}
        </label>
        <span className="text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={img}
                alt={`Görsel ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Kaldır"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Order Badge */}
              <div
                className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded"
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-opacity-50 transition-colors"
          style={{ borderColor: "rgba(201,168,76,0.3)" }}
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)" }} />
              <p className="text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>Yükleniyor...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6" style={{ color: "rgba(201,168,76,0.4)" }} />
              <p className="text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>
                Görsel eklemek için tıklayın
              </p>
              <p className="text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
                Birden fazla seçebilirsiniz (Max {maxImages - images.length} görsel)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
