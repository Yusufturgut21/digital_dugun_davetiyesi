"use client";
import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/imageUtils";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  maxWidth?: number;
  quality?: number;
  aspectRatio?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  onRemove,
  maxWidth = 1920,
  quality = 0.8,
  aspectRatio,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin");
      return;
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Dosya boyutu ${maxSizeMB}MB'dan küçük olmalı`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const base64 = await compressImage(file, maxWidth, quality);
      onChange(base64);
    } catch (err) {
      console.error("Image upload error:", err);
      setError("Görsel yüklenirken hata oluştu");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
    setError("");
  };

  return (
    <div className="space-y-2">
      <label className="text-xs" style={{ color: "rgba(201,168,76,0.7)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt={label}
            className="w-full h-48 object-cover rounded-lg"
            style={{ aspectRatio }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Görseli Kaldır"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-opacity-50 transition-colors"
          style={{ borderColor: "rgba(201,168,76,0.3)" }}
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)" }} />
              <p className="text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>Yükleniyor...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8" style={{ color: "rgba(201,168,76,0.4)" }} />
              <p className="text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>
                Görsel yüklemek için tıklayın
              </p>
              <p className="text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
                JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
