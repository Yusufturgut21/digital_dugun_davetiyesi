"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CreateInvitationInput, WeddingInvitation, SealType, InvitationDesign, Theme, ConjunctionType, StoryItem } from "@/lib/types";
import { PRESET_INVITATION_TEXTS, EMPTY_INVITATION, DEFAULT_STORY_ITEMS } from "@/lib/defaults";

type FormData = Omit<CreateInvitationInput, "galleryImages"> & { galleryImages: string[] };

interface Props {
  initial?: WeddingInvitation;
  onSubmit: (data: CreateInvitationInput) => void;
  onPreview?: (data: CreateInvitationInput) => void;
  loading?: boolean;
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

function Input({ value, onChange, type = "text", placeholder, required }: {
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
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
    reader.onload = ev => onChange(ev.target?.result as string);
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

export default function InvitationForm({ initial, onSubmit, onPreview, loading }: Props) {
  const [step, setStep] = useState(0);
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
  const addGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(f => ({ ...f, galleryImages: [...f.galleryImages, ev.target?.result as string] }));
      };
      reader.readAsDataURL(file);
    });
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
          <Input value={form.brideName} onChange={v => set("brideName", v)} placeholder="Ayşe" required />
        </div>
        <div>
          <Label>Damat Adı *</Label>
          <Input value={form.groomName} onChange={v => set("groomName", v)} placeholder="Mehmet" required />
        </div>
        <div>
          <Label>Gelin Soyadı</Label>
          <Input value={form.brideSurname ?? ""} onChange={v => set("brideSurname", v)} placeholder="Yılmaz" />
        </div>
        <div>
          <Label>Damat Soyadı</Label>
          <Input value={form.groomSurname ?? ""} onChange={v => set("groomSurname", v)} placeholder="Kaya" />
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
      <div>
        <Label>Salon / Mekân Adı *</Label>
        <Input value={form.venueName} onChange={v => set("venueName", v)} placeholder="The Grand Ballroom" required />
      </div>
      <div>
        <Label>Adres</Label>
        <Input value={form.address} onChange={v => set("address", v)} placeholder="Atatürk Cad. No:1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>İl *</Label>
          <Input value={form.city} onChange={v => set("city", v)} placeholder="İstanbul" required />
        </div>
        <div>
          <Label>İlçe</Label>
          <Input value={form.district} onChange={v => set("district", v)} placeholder="Beşiktaş" />
        </div>
      </div>
      <div>
        <Label>Google Maps Linki</Label>
        <Input value={form.mapUrl ?? ""} onChange={v => set("mapUrl", v)} placeholder="https://maps.google.com/..." />
      </div>
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
      <ImageUpload value={form.coverImage ?? ""} onChange={v => set("coverImage", v)} label="Kapak Fotoğrafı" />
      <div>
        <Label>Galeri Fotoğrafları</Label>
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
          <div className="grid grid-cols-3 gap-2 mt-3">
            {form.galleryImages.map((img, idx) => (
              <div key={idx} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeGallery(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
                >×</button>
              </div>
            ))}
          </div>
        )}
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
              <span className="font-sans text-sm" style={{ color: form.theme === val ? "#E8D5A3" : "rgba(255,255,255,0.5)" }}>
                {label}
              </span>
              {form.theme === val && <span className="ml-auto text-yellow-400">✓</span>}
            </button>
          ))}
        </div>
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
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(s => s + 1)}
            className="admin-btn admin-btn-primary"
          >
            İleri →
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
          >
            {loading ? "Kaydediliyor…" : "✓ Davetiyeyi Kaydet"}
          </button>
        )}
      </div>
    </form>
  );
}
