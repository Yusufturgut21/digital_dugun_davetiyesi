"use client";
import { useState, useRef } from "react";
import { Upload, X, Video, ExternalLink, AlertCircle } from "lucide-react";

interface VideoUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}

/*
  Video yükleme stratejisi:
  1. Kullanıcı telefon/bilgisayardan video seçer
  2. Cloudinary unsigned upload ile CDN'e yüklenir (ücretsiz, 25GB)
  3. Dönen HTTPS URL veritabanına kaydedilir
  4. Cloudinary cloud_name ve upload_preset .env.local'den okunur
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxxxx
  5. Cloudinary yoksa manuel URL girişi fallback olarak çalışır
*/

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function VideoUpload({ label, value, onChange }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Lütfen bir video dosyası seçin (MP4, MOV, vb.)");
      return;
    }

    const maxSizeMB = 200;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Video boyutu ${maxSizeMB}MB'dan küçük olmalı`);
      return;
    }

    // Cloudinary ayarları yoksa direkt blob URL göster (geçici önizleme)
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary ayarlanmamış. Lütfen URL giriş yöntemini kullanın.");
      setShowManual(true);
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("resource_type", "video");
      formData.append("folder", "lina-venue-videos");

      // XHR ile progress takibi
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            onChange(data.secure_url);
            resolve();
          } else {
            reject(new Error("Yükleme başarısız: " + xhr.statusText));
          }
        };

        xhr.onerror = () => reject(new Error("Ağ hatası"));
        xhr.send(formData);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleManualSave = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setShowManual(false);
      setError("");
    }
  };

  const isCloudinaryReady = !!(CLOUD_NAME && UPLOAD_PRESET);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: "rgba(201,168,76,0.7)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManual(!showManual)}
          className="text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "rgba(201,168,76,0.5)" }}
        >
          {showManual ? "Dosya yükle" : "URL ile ekle"}
        </button>
      </div>

      {/* Mevcut video önizleme */}
      {value && !uploading && (
        <div className="relative rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
          <video
            src={value}
            className="w-full h-40 object-cover"
            muted
            playsInline
            controls={false}
            onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
            onMouseLeave={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(0,0,0,0.4)" }}>
            <span className="text-white text-xs">Önizlemek için üstüne gel</span>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 left-2 right-10 text-xs text-white/60 truncate">
            {value.length > 60 ? value.slice(0, 60) + "…" : value}
          </div>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="rounded-xl p-5 text-center space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}>
          <div className="flex items-center justify-center gap-2" style={{ color: "rgba(201,168,76,0.8)" }}>
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(201,168,76,0.6)" }} />
            <span className="text-sm">Yükleniyor... %{progress}</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#C9A84C,#E8D5A3)" }}
            />
          </div>
        </div>
      )}

      {/* URL girişi */}
      {showManual && !uploading && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/.../video.mp4"
              className="flex-1 px-3 py-2.5 rounded-lg text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "rgba(232,213,163,0.9)" }}
            />
            <button
              type="button"
              onClick={handleManualSave}
              className="px-4 py-2 rounded-lg text-xs font-medium"
              style={{ background: "linear-gradient(135deg,#C9A84C,#E8D5A3)", color: "#1a0f08" }}
            >
              Kaydet
            </button>
          </div>
          <p className="text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
            Google Drive, Dropbox, Cloudinary vb. bir MP4 linki
          </p>
        </div>
      )}

      {/* Dosya yükleme alanı */}
      {!showManual && !uploading && !value && (
        <>
          {!isCloudinaryReady && (
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "rgba(255,200,0,0.06)", border: "1px solid rgba(255,200,0,0.15)" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-400" />
              <div className="text-xs" style={{ color: "rgba(255,220,100,0.7)" }}>
                <p className="font-medium mb-1">Cloudinary ayarlanmamış</p>
                <p>.env.local dosyasına şunları ekleyin:</p>
                <code className="block mt-1 text-yellow-300/60">
                  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx<br />
                  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxxxx
                </code>
                <a href="https://cloudinary.com/users/register/free" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 underline text-yellow-300/60 hover:text-yellow-300/80">
                  Ücretsiz hesap aç <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-opacity-60"
            style={{ borderColor: isCloudinaryReady ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.15)" }}
            onClick={() => isCloudinaryReady && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.08)" }}>
                <Video className="w-6 h-6" style={{ color: "rgba(201,168,76,0.5)" }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "rgba(201,168,76,0.7)" }}>
                  {isCloudinaryReady ? "Telefon veya bilgisayardan video seçin" : "Cloudinary gerekli"}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(201,168,76,0.4)" }}>
                  MP4, MOV, AVI · Maks. 200MB
                </p>
              </div>
              {isCloudinaryReady && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                  style={{ background: "linear-gradient(135deg,#C9A84C,#E8D5A3)", color: "#1a0f08" }}>
                  <Upload className="w-3.5 h-3.5" />
                  Video Seç
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Değiştir butonu — video varken */}
      {!showManual && !uploading && value && isCloudinaryReady && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.2)", color: "rgba(201,168,76,0.7)" }}
        >
          <Upload className="w-3.5 h-3.5" />
          Videoyu Değiştir
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/mov,video/quicktime,video/avi,video/*"
        capture={undefined}
        onChange={handleFile}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
