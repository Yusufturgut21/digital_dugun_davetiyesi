"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CreateInvitationInput, WeddingInvitation, SealType, InvitationDesign, Theme, ConjunctionType, StoryItem, FAQItem, ProgramItem } from "@/lib/types";
import { PRESET_INVITATION_TEXTS, EMPTY_INVITATION, DEFAULT_STORY_ITEMS, DEFAULT_FAQ_ITEMS, DEFAULT_PROGRAM_ITEMS } from "@/lib/defaults";
import { SAHRA_VENUE_NAME } from "@/lib/constants/sahra";

type FormData = Omit<CreateInvitationInput, "galleryImages"> & { galleryImages: string[] };

interface Props {
  initial?: WeddingInvitation;
  onSubmit: (data: CreateInvitationInput) => void;
  onPreview?: (data: CreateInvitationInput) => void;
  loading?: boolean;
  hideLocationFields?: boolean;
  initialStep?: number;
}

const STEPS = [
  "Çift Bilgileri",
  "Düğün Bilgileri",
  "Davet Metni",
  "Manevi İçerik",
  "Mühür & Tuğra",
  "Mektup Tasarımı",
  "Fotoğraflar",
  "Ses Ayarları",
  "Tema",
  "Program",
  "SSS",
  "Hikayemiz",
  "Bölüm Görünürlüğü",
];

const inputCls = `w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all`;
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(201,168,76,0.2)",
  color: "rgba(232,213,163,0.9)",
};
const labelCls = "block font-sans text-xs tracking-widest uppercase mb-2";
const labelStyle = { color: "rgba(201,168,76,0.7)" };
const sectionCls = "space-y-5";

function Label({ children }: { children: React.ReactNode }) {
  return <label className={labelCls} style={labelStyle}>{children}</label>;
}

function Input({ value, onChange, type = "text", placeholder, required, maxLength }: {
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      className={inputCls}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.6)"}
      onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
    />
  );
}

function PhoneInput({ value, onChange, placeholder, required }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  const formatPhone = (val: string) => {
    // Sadece rakamları al
    const digits = val.replace(/\D/g, '');
    // Türk telefon formatı: 0555 123 45 67 (max 11 rakam, 0 ile başlamalı)
    if (digits.length === 0) return '';
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  return (
    <input
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      maxLength={14} // "0555 123 45 67" = 14 karakter
      className={inputCls}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.6)"}
      onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
    />
  );
}

function OptionCard({ selected, onClick, children }: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-3 rounded-xl font-sans text-sm text-left transition-all w-full"
      style={{
        background: selected ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${selected ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.12)"}`,
        color: selected ? "#E8D5A3" : "rgba(255,255,255,0.5)",
      }}
    >
      {children}
    </button>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-sans text-sm" style={{ color: "rgba(232,213,163,0.8)" }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="w-12 h-6 rounded-full transition-all relative"
        style={{ background: value ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)" }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full transition-all"
          style={{
            background: value ? "#C9A84C" : "rgba(255,255,255,0.4)",
            left: value ? "calc(100% - 20px)" : "4px",
          }}
        />
      </button>
    </div>
  );
}

function ImageUpload({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        onChange(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <Label>{label}</Label>
      <div
        className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all hover:border-opacity-60"
        style={{ borderColor: "rgba(201,168,76,0.25)", background: "rgba(255,255,255,0.02)" }}
        onClick={() => ref.current?.click()}
      >
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-32 mx-auto rounded-lg object-cover" />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(""); }}
              className="absolute top-1 right-1 w-6 h-6 rounded-full text-xs flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
            >×</button>
          </div>
        ) : (
          <>
            <p className="text-3xl mb-2">📁</p>
            <p className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>Tıklayın veya sürükleyin</p>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function InvitationForm({ initial, onSubmit, onPreview, loading, hideLocationFields, initialStep = 0 }: Props) {
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 0), STEPS.length - 1));
  const [form, setForm] = useState<FormData>(() => {
    if (initial) {
      const { id, slug, createdAt, updatedAt, ...rest } = initial;
      return rest;
    }
    return { brideName: "", groomName: "", ...EMPTY_INVITATION };
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const galleryRef = useRef<HTMLInputElement>(null);

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
          if (!ctx) return reject(new Error("canvas failed"));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const addGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const url = await compressImage(file);
      setForm(f => ({ ...f, galleryImages: [...f.galleryImages, url] }));
    }
  };
  const removeGallery = (idx: number) =>
    setForm(f => ({ ...f, galleryImages: f.galleryImages.filter((_, i) => i !== idx) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const steps = [
    // Step 0 — Çift bilgileri
    <div key="0" className={sectionCls}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Gelin Adı *</Label>
          <Input value={form.brideName} onChange={v => set("brideName", v)} placeholder="Ayşe" required maxLength={30} />
        </div>
        <div>
          <Label>Damat Adı *</Label>
          <Input value={form.groomName} onChange={v => set("groomName", v)} placeholder="Mehmet" required maxLength={30} />
        </div>
        <div>
          <Label>Gelin Soyadı</Label>
          <Input value={form.brideSurname ?? ""} onChange={v => set("brideSurname", v)} placeholder="Yılmaz" maxLength={30} />
        </div>
        <div>
          <Label>Damat Soyadı</Label>
          <Input value={form.groomSurname ?? ""} onChange={v => set("groomSurname", v)} placeholder="Kaya" maxLength={30} />
        </div>
      </div>
      <div>
        <Label>Başlıkta Nasıl Gösterilsin?</Label>
        <div className="grid grid-cols-2 gap-3">
          {([["&", "Ahmet & Ayşe"], ["ve", "Ahmet ve Ayşe"]] as [ConjunctionType, string][]).map(([val, ex]) => (
            <OptionCard key={val} selected={form.conjunction === val} onClick={() => set("conjunction", val)}>
              <span className="block text-xs mb-0.5" style={{ color: "rgba(201,168,76,0.5)" }}>Örnek</span>
              {ex}
            </OptionCard>
          ))}
        </div>
      </div>
      {form.groomName && form.brideName && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <p className="font-sans text-xs mb-1" style={{ color: "rgba(201,168,76,0.5)" }}>Önizleme</p>
          <p className="font-serif text-2xl font-light" style={{ color: "#E8D5A3" }}>
            {form.groomName} {form.conjunction} {form.brideName}
          </p>
        </div>
      )}
    </div>,

    // Step 1 — Düğün bilgileri
    <div key="1" className={sectionCls}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Düğün Tarihi *</Label>
          <Input type="date" value={form.weddingDate} onChange={v => set("weddingDate", v)} required />
        </div>
        <div>
          <Label>Saat *</Label>
          <Input type="time" value={form.weddingTime} onChange={v => set("weddingTime", v)} required />
        </div>
      </div>
      {hideLocationFields ? (
        <div className="rounded-xl p-4" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <p className="font-sans text-xs mb-1" style={{ color: "rgba(201,168,76,0.6)" }}>📍 Konum (Sabit)</p>
          <p className="font-serif text-lg" style={{ color: "#E8D5A3" }}>{SAHRA_VENUE_NAME}</p>
          <p className="font-sans text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Konum bilgisi sistem genelinde sabittir ve değiştirilemez.
          </p>
        </div>
      ) : (
        <>
          <div>
            <Label>Salon / Mekân Adı *</Label>
            <Input value={form.venueName} onChange={v => set("venueName", v)} placeholder="Sahra Düğün Salonu" required />
          </div>
          <div>
            <Label>Adres</Label>
            <Input value={form.address} onChange={v => set("address", v)} placeholder="Adres" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>İl *</Label>
              <Input value={form.city} onChange={v => set("city", v)} placeholder="İstanbul" required />
            </div>
            <div>
              <Label>İlçe</Label>
              <Input value={form.district} onChange={v => set("district", v)} placeholder="Küçükçekmece" />
            </div>
          </div>
          <div>
            <Label>Google Maps Linki</Label>
            <Input value={form.mapUrl ?? ""} onChange={v => set("mapUrl", v)} placeholder="https://maps.google.com/..." />
          </div>
        </>
      )}
    </div>,

    // Step 2 — Davet metni
    <div key="2" className={sectionCls}>
      <div>
        <Label>Hazır Metinler</Label>
        <div className="space-y-2">
          {PRESET_INVITATION_TEXTS.map(t => (
            <OptionCard key={t} selected={form.invitationText === t} onClick={() => set("invitationText", t)}>
              {t}
            </OptionCard>
          ))}
        </div>
      </div>
      <div>
        <Label>Veya Kendi Metninizi Yazın</Label>
        <textarea
          rows={4}
          value={form.invitationText}
          onChange={e => set("invitationText", e.target.value)}
          className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all resize-none"
          style={inputStyle}
          placeholder="Davet metninizi buraya yazın..."
        />
      </div>
    </div>,

    // Step 3 — Manevi içerik
    <div key="3" className={sectionCls}>
      <div className="rounded-xl p-4 space-y-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)" }}>
        <Toggle value={form.showBesmele} onChange={v => set("showBesmele", v)} label="Besmele Göster" />
        <Toggle value={form.showAyet} onChange={v => set("showAyet", v)} label="Ayet Göster" />
        <Toggle value={form.showHadis} onChange={v => set("showHadis", v)} label="Hadis Göster" />
      </div>
      <div>
        <Label>Dua Metni</Label>
        <textarea
          rows={3}
          value={form.duaText ?? ""}
          onChange={e => set("duaText", e.target.value)}
          className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all resize-none"
          style={inputStyle}
          placeholder="İsteğe bağlı dua metni..."
        />
      </div>
      <div>
        <Label>Kaynak / Sure Bilgisi</Label>
        <Input value={form.religiousSource ?? ""} onChange={v => set("religiousSource", v)} placeholder="Örn: Rum Suresi, 21. Ayet" />
      </div>

      {/* Sade & Zarif Teması İçin Özel Alan */}
      {form.theme === "simple-elegant" && (
        <>
          <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
            <Label>İslami Alıntı / Ayet (Sade & Zarif Tema)</Label>
            <Toggle value={form.showIslamicQuote !== false} onChange={v => set("showIslamicQuote", v)} label="İslami Alıntı Göster" />
          </div>
          <div>
            <Label>Arapça Metin</Label>
            <textarea
              rows={3}
              value={form.islamicQuoteArabic ?? ""}
              onChange={e => set("islamicQuoteArabic", e.target.value)}
              className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all resize-none"
              style={{ ...inputStyle, direction: "rtl", fontFamily: "'Amiri', serif" }}
              placeholder="Arapça ayet veya alıntı..."
            />
          </div>
          <div>
            <Label>Türkçe Meali</Label>
            <textarea
              rows={2}
              value={form.islamicQuoteTurkish ?? ""}
              onChange={e => set("islamicQuoteTurkish", e.target.value)}
              className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all resize-none"
              style={inputStyle}
              placeholder="Türkçe meali..."
            />
          </div>
          <div>
            <Label>Kaynak</Label>
            <Input value={form.islamicQuoteSource ?? ""} onChange={v => set("islamicQuoteSource", v)} placeholder="Örn: Rum Suresi, 21. Ayet" />
          </div>
        </>
      )}
    </div>,

    // Step 4 — Mühür
    <div key="4" className={sectionCls}>
      <div>
        <Label>Mühür Modeli</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {([
            ["ottoman", "Osmanlı Tuğrası"],
            ["gold-wax", "Gold Balmumu"],
            ["burgundy-wax", "Bordo Balmumu"],
            ["classic", "Klasik"],
            ["minimal", "Minimal"],
          ] as [SealType, string][]).map(([val, label]) => (
            <OptionCard key={val} selected={form.sealType === val} onClick={() => set("sealType", val)}>
              {label}
            </OptionCard>
          ))}
        </div>
      </div>
      <div>
        <Label>Monogram / Baş Harfler</Label>
        <Input value={form.sealMonogram ?? ""} onChange={v => set("sealMonogram", v)} placeholder="A & M" />
      </div>
      <ImageUpload
        value={form.sealImage ?? ""}
        onChange={v => set("sealImage", v)}
        label="Tuğra / Özel Mühür Görseli (İsteğe Bağlı)"
      />
    </div>,

    // Step 5 — Davet mektubu
    <div key="5" className={sectionCls}>
      <div>
        <Label>Mektup Tasarımı</Label>
        <div className="grid grid-cols-2 gap-3">
          {([
            ["ottoman", "Osmanlı"],
            ["classic", "Klasik"],
            ["minimal", "Minimal"],
            ["gold-premium", "Gold Premium"],
            ["cream-vintage", "Krem Vintage"],
          ] as [InvitationDesign, string][]).map(([val, label]) => (
            <OptionCard key={val} selected={form.invitationDesign === val} onClick={() => set("invitationDesign", val)}>
              {label}
            </OptionCard>
          ))}
        </div>
      </div>
      <ImageUpload
        value={form.invitationImage ?? ""}
        onChange={v => set("invitationImage", v)}
        label="Özel Mektup Görseli (İsteğe Bağlı)"
      />
    </div>,

    // Step 6 — Fotoğraflar
    <div key="6" className={sectionCls}>
      <ImageUpload value={form.coverImage ?? ""} onChange={v => set("coverImage", v)} label="Kapak Fotoğrafı (Giriş manzarası olarak kullanılır)" />
      <div>
        <Label>Galeri Fotoğrafları {form.galleryImages.length > 0 && `(${form.galleryImages.length})`}</Label>
        <div
          className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer"
          style={{ borderColor: "rgba(201,168,76,0.25)", background: "rgba(255,255,255,0.02)" }}
          onClick={() => galleryRef.current?.click()}
        >
          <p className="text-2xl mb-1">🖼️</p>
          <p className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>
            Birden fazla fotoğraf ekleyin
          </p>
        </div>
        <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={addGalleryImage} />
        {form.galleryImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {form.galleryImages.map((img, idx) => (
              <div key={idx} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-28 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const imgs = [...form.galleryImages];
                        [imgs[idx - 1], imgs[idx]] = [imgs[idx], imgs[idx - 1]];
                        set("galleryImages", imgs);
                      }}
                      className="w-7 h-7 rounded-full text-xs flex items-center justify-center"
                      style={{ background: "rgba(201,168,76,0.8)", color: "white" }}
                    >←</button>
                  )}
                  {idx < form.galleryImages.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const imgs = [...form.galleryImages];
                        [imgs[idx], imgs[idx + 1]] = [imgs[idx + 1], imgs[idx]];
                        set("galleryImages", imgs);
                      }}
                      className="w-7 h-7 rounded-full text-xs flex items-center justify-center"
                      style={{ background: "rgba(201,168,76,0.8)", color: "white" }}
                    >→</button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeGallery(idx)}
                    className="w-7 h-7 rounded-full text-xs flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
                  >×</button>
                </div>
                {idx === 0 && (
                  <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(201,168,76,0.8)", color: "white" }}>
                    Öne çıkan
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Galeri Alt Başlık</Label>
          <Input value={form.gallerySectionSubtitle ?? "Anılar"} onChange={v => set("gallerySectionSubtitle", v)} placeholder="Anılar" />
        </div>
        <div>
          <Label>Galeri Başlık</Label>
          <Input value={form.gallerySectionTitle ?? "Fotoğraf Galerisi"} onChange={v => set("gallerySectionTitle", v)} placeholder="Fotoğraf Galerisi" />
        </div>
      </div>
    </div>,

    // Step 7 — Ses
    <div key="7" className={sectionCls}>
      <Toggle value={form.soundEnabled} onChange={v => set("soundEnabled", v)} label="Ses Aktif" />
      <div>
        <Label>Ses Seviyesi: {form.soundVolume}%</Label>
        <input
          type="range"
          min={0}
          max={100}
          value={form.soundVolume}
          onChange={e => set("soundVolume", Number(e.target.value))}
          className="w-full accent-yellow-500"
        />
      </div>
      {[
        { key: "sealSound" as keyof FormData, label: "Mühür Kırılma Sesi" },
        { key: "envelopeSound" as keyof FormData, label: "Zarf Açılma Sesi" },
        { key: "backgroundSound" as keyof FormData, label: "Arka Plan Müziği" },
      ].map(({ key, label }) => (
        <div key={key}>
          <Label>{label}</Label>
          <Input
            value={(form[key] as string) ?? ""}
            onChange={v => set(key, v)}
            placeholder="Ses dosyası URL'si veya yolunu girin"
          />
        </div>
      ))}
    </div>,

    // Step 8 — Tema
    <div key="8" className={sectionCls}>
      <div>
        <Label>Tema Seçin</Label>
        <div className="grid grid-cols-1 gap-3">
          {([
            ["cream-gold", "Krem & Gold", "#FAF6F0", "#C9A84C"],
            ["ottoman-premium", "Osmanlı Premium", "#1a0f08", "#C9A84C"],
            ["minimal-white", "Minimal Beyaz", "#FFFFFF", "#333"],
            ["beige-gold", "Bej & Gold", "#F5EDD8", "#9A7B2F"],
            ["dark-premium", "Koyu Premium", "#0d0805", "#E8D5A3"],
            ["simple-elegant", "Sade & Zarif", "#F5F3EE", "#4A5D3F"],
          ] as [Theme, string, string, string][]).map(([val, label, bg, accent]) => (
            <button
              key={val}
              type="button"
              onClick={() => set("theme", val)}
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left"
              style={{
                background: form.theme === val ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${form.theme === val ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
              }}
            >
              <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: bg, border: `2px solid ${accent}` }} />
              <div className="flex-1">
                <span className="font-sans text-sm block" style={{ color: form.theme === val ? "#E8D5A3" : "rgba(255,255,255,0.5)" }}>
                  {label}
                </span>
                {val === "simple-elegant" && (
                  <span className="font-sans text-xs block mt-0.5" style={{ color: "rgba(201,168,76,0.5)" }}>
                    Geleneksel dokunuşlar, zarif hat detayları ve huzurlu bir tasarım
                  </span>
                )}
              </div>
              {form.theme === val && <span className="ml-auto text-yellow-400">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 9 — Program
    <div key="9" className={sectionCls}>
      <div className="flex items-center justify-between mb-2">
        <Label>Düğün Programı</Label>
        <button
          type="button"
          onClick={() => set("programItems", [...(form.programItems ?? []), { time: "", title: "", desc: "", icon: "◇" }])}
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          + Ekle
        </button>
      </div>
      <div className="space-y-3">
        {(form.programItems ?? DEFAULT_PROGRAM_ITEMS).map((item: ProgramItem, idx: number) => (
          <div key={idx} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.1)" }}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Saat</label>
                <Input value={item.time} onChange={v => {
                  const items = [...(form.programItems ?? DEFAULT_PROGRAM_ITEMS)];
                  items[idx] = { ...items[idx], time: v };
                  set("programItems", items);
                }} placeholder="15:00" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>İkon</label>
                <Input value={item.icon} onChange={v => {
                  const items = [...(form.programItems ?? DEFAULT_PROGRAM_ITEMS)];
                  items[idx] = { ...items[idx], icon: v };
                  set("programItems", items);
                }} placeholder="◇" />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Başlık</label>
              <Input value={item.title} onChange={v => {
                const items = [...(form.programItems ?? DEFAULT_PROGRAM_ITEMS)];
                items[idx] = { ...items[idx], title: v };
                set("programItems", items);
              }} placeholder="Nikah Töreni" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Açıklama</label>
              <Input value={item.desc} onChange={v => {
                const items = [...(form.programItems ?? DEFAULT_PROGRAM_ITEMS)];
                items[idx] = { ...items[idx], desc: v };
                set("programItems", items);
              }} placeholder="Kısa açıklama" />
            </div>
            <button
              type="button"
              onClick={() => set("programItems", (form.programItems ?? DEFAULT_PROGRAM_ITEMS).filter((_: ProgramItem, i: number) => i !== idx))}
              className="text-xs" style={{ color: "#f87171" }}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>,

    // Step 10 — SSS (FAQ)
    <div key="10" className={sectionCls}>
      <div className="flex items-center justify-between mb-2">
        <Label>Sık Sorulan Sorular</Label>
        <button
          type="button"
          onClick={() => set("faqItems", [...(form.faqItems ?? []), { q: "", a: "" }])}
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          + Ekle
        </button>
      </div>
      <div className="space-y-3">
        {(form.faqItems ?? DEFAULT_FAQ_ITEMS).map((item: FAQItem, idx: number) => (
          <div key={idx} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.1)" }}>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Soru</label>
              <Input value={item.q} onChange={v => {
                const items = [...(form.faqItems ?? DEFAULT_FAQ_ITEMS)];
                items[idx] = { ...items[idx], q: v };
                set("faqItems", items);
              }} placeholder="Çocuklar davetli mi?" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Cevap</label>
              <textarea
                rows={2}
                value={item.a}
                onChange={e => {
                  const items = [...(form.faqItems ?? DEFAULT_FAQ_ITEMS)];
                  items[idx] = { ...items[idx], a: e.target.value };
                  set("faqItems", items);
                }}
                className="w-full px-4 py-2 rounded-xl font-sans text-sm outline-none transition-all resize-none"
                style={inputStyle}
                placeholder="Cevabınızı yazın..."
              />
            </div>
            <button
              type="button"
              onClick={() => set("faqItems", (form.faqItems ?? DEFAULT_FAQ_ITEMS).filter((_: FAQItem, i: number) => i !== idx))}
              className="text-xs" style={{ color: "#f87171" }}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>,

    // Step 11 — Hikayemiz
    <div key="11" className={sectionCls}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label>Bölüm Alt Başlık</Label>
          <Input value={form.storySectionSubtitle ?? "Bizim"} onChange={v => set("storySectionSubtitle", v)} placeholder="Bizim" />
        </div>
        <div>
          <Label>Bölüm Başlık</Label>
          <Input value={form.storySectionTitle ?? "Hikayemiz"} onChange={v => set("storySectionTitle", v)} placeholder="Hikayemiz" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <Label>Hikaye Zaman Tüneli</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => set("storyItems", DEFAULT_STORY_ITEMS)}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(201,168,76,0.6)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            Varsayılana Dön
          </button>
          <button
            type="button"
            onClick={() => set("storyItems", [...(form.storyItems ?? DEFAULT_STORY_ITEMS), { year: new Date().getFullYear().toString(), title: "", desc: "", icon: "✦", side: "left" as const }])}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            + Ekle
          </button>
        </div>
      </div>
      <p className="text-xs mb-4" style={{ color: "rgba(201,168,76,0.45)" }}>
        Her bir kartı düzenleyin. ♡ Düğün olarak işaretlediğiniz öğenin yılı, girdiğiniz düğün tarihinden otomatik alınır.
      </p>
      <div className="space-y-3">
        {(form.storyItems ?? DEFAULT_STORY_ITEMS).map((item: StoryItem, idx: number) => (
          <div key={idx} className="rounded-xl p-4 space-y-3" style={{ background: item.highlight ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${item.highlight ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.1)"}` }}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Yıl</label>
                <Input value={item.year} onChange={v => {
                  const items = [...(form.storyItems ?? DEFAULT_STORY_ITEMS)];
                  items[idx] = { ...items[idx], year: v };
                  set("storyItems", items);
                }} placeholder="2024" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>İkon</label>
                <Input value={item.icon} onChange={v => {
                  const items = [...(form.storyItems ?? DEFAULT_STORY_ITEMS)];
                  items[idx] = { ...items[idx], icon: v };
                  set("storyItems", items);
                }} placeholder="✦" />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Başlık</label>
              <Input value={item.title} onChange={v => {
                const items = [...(form.storyItems ?? DEFAULT_STORY_ITEMS)];
                items[idx] = { ...items[idx], title: v };
                set("storyItems", items);
              }} placeholder="İlk Tanışma" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Açıklama</label>
              <textarea
                rows={2}
                value={item.desc}
                onChange={e => {
                  const items = [...(form.storyItems ?? DEFAULT_STORY_ITEMS)];
                  items[idx] = { ...items[idx], desc: e.target.value };
                  set("storyItems", items);
                }}
                className="w-full px-4 py-2 rounded-xl font-sans text-sm outline-none transition-all resize-none"
                style={inputStyle}
                placeholder="Kısa hikaye açıklaması..."
              />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Konum</label>
                <div className="flex gap-2">
                  {(["left", "right"] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        const items = [...(form.storyItems ?? DEFAULT_STORY_ITEMS)];
                        items[idx] = { ...items[idx], side: s };
                        set("storyItems", items);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg"
                      style={{
                        background: item.side === s ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${item.side === s ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.12)"}`,
                        color: item.side === s ? "#E8D5A3" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {s === "left" ? "← Sol" : "Sağ →"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    const items = [...(form.storyItems ?? DEFAULT_STORY_ITEMS)];
                    items[idx] = { ...items[idx], highlight: !item.highlight };
                    set("storyItems", items);
                  }}
                  className="w-5 h-5 rounded flex items-center justify-center text-xs"
                  style={{
                    background: item.highlight ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${item.highlight ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.15)"}`,
                  }}
                >
                  {item.highlight ? "♡" : ""}
                </button>
                <label className="text-xs" style={{ color: "rgba(201,168,76,0.6)" }}>Düğün (öne çıkan)</label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => set("storyItems", (form.storyItems ?? DEFAULT_STORY_ITEMS).filter((_: StoryItem, i: number) => i !== idx))}
              className="text-xs" style={{ color: "#f87171" }}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>,

    // Step 12 — Bölüm Görünürlüğü
    <div key="12" className={sectionCls}>
      <p className="font-sans text-sm mb-4" style={{ color: "rgba(232,213,163,0.6)" }}>
        Davetiye sayfanızda hangi bölümlerin görüneceğini seçin.
      </p>
      <div className="rounded-xl p-4 space-y-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)" }}>
        <Toggle value={form.showStorySection !== false} onChange={v => set("showStorySection", v)} label="📖 Hikayemiz" />
        <Toggle value={form.showGallerySection !== false} onChange={v => set("showGallerySection", v)} label="📷 Fotoğraf Galerisi (Çift)" />
        <Toggle value={form.showWeddingGallerySection !== false} onChange={v => set("showWeddingGallerySection", v)} label="🏛️ Düğün Galerisi (Salon)" />
        <Toggle value={form.showDetailsSection !== false} onChange={v => set("showDetailsSection", v)} label="📍 Detaylar" />
        <Toggle value={form.showMapSection !== false} onChange={v => set("showMapSection", v)} label="🗺️ Harita" />
        <Toggle value={form.showProgramSection !== false} onChange={v => set("showProgramSection", v)} label="📅 Program" />
        <Toggle value={form.showRSVPSection !== false} onChange={v => set("showRSVPSection", v)} label="✅ Katılım" />
        <Toggle value={form.showFAQSection !== false} onChange={v => set("showFAQSection", v)} label="❓ Sık Sorulan Sorular" />
        <Toggle value={form.showSocialSection !== false} onChange={v => set("showSocialSection", v)} label="💬 İletişim" />
      </div>
    </div>,
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {STEPS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className="text-xs px-3 py-1.5 rounded-full font-sans transition-all"
            style={{
              background: i === step ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${i === step ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.1)"}`,
              color: i === step ? "#E8D5A3" : i < step ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.3)",
            }}
          >
            {i < step ? "✓ " : ""}{s}
          </button>
        ))}
      </div>

      {/* Step title */}
      <h2 className="font-serif text-2xl font-light mb-6" style={{ color: "#E8D5A3" }}>
        {step + 1}. {STEPS[step]}
      </h2>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {steps[step]}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            className="admin-btn admin-btn-outline"
          >
            ← Geri
          </button>
        )}
        <div className="flex-1" />
        {onPreview && (
          <button
            type="button"
            onClick={() => onPreview(form)}
            className="admin-btn admin-btn-outline"
          >
            Önizle
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="admin-btn admin-btn-primary"
        >
          {loading ? "Kaydediliyor…" : "✓ Davetiyeyi Kaydet"}
        </button>
        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={() => setStep(s => s + 1)}
            className="admin-btn admin-btn-primary"
          >
            İleri →
          </button>
        )}
      </div>
    </form>
  );
}
