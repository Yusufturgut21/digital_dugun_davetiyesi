"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { EMPTY_INVITATION } from "@/lib/defaults";

export default function NewCouplePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    brideName: "", brideSurname: "",
    groomName: "", groomSurname: "",
    username: "", password: "", confirmPassword: "",
    weddingDate: "", weddingTime: "15:00",
    invitationText: EMPTY_INVITATION.invitationText,
    conjunction: "&" as const,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

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

  const inputCls = "w-full px-4 py-3 rounded-xl font-sans text-sm outline-none";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" };
  const labelCls = "block font-sans text-xs tracking-widest uppercase mb-2";
  const labelStyle = { color: "rgba(201,168,76,0.6)" };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/couples" className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>← Çiftlere Dön</Link>
        <h2 className="font-serif text-3xl font-light mt-2" style={{ color: "#E8D5A3" }}>Yeni Çift Oluştur</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <h3 className="font-serif text-lg" style={{ color: "#E8D5A3" }}>Gelin Bilgileri</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls} style={labelStyle}>Ad *</label>
              <input required value={form.brideName} onChange={(e) => set("brideName", e.target.value)} className={inputCls} style={inputStyle} /></div>
            <div><label className={labelCls} style={labelStyle}>Soyad</label>
              <input value={form.brideSurname} onChange={(e) => set("brideSurname", e.target.value)} className={inputCls} style={inputStyle} /></div>
          </div>
        </section>

        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <h3 className="font-serif text-lg" style={{ color: "#E8D5A3" }}>Damat Bilgileri</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls} style={labelStyle}>Ad *</label>
              <input required value={form.groomName} onChange={(e) => set("groomName", e.target.value)} className={inputCls} style={inputStyle} /></div>
            <div><label className={labelCls} style={labelStyle}>Soyad</label>
              <input value={form.groomSurname} onChange={(e) => set("groomSurname", e.target.value)} className={inputCls} style={inputStyle} /></div>
          </div>
        </section>

        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <h3 className="font-serif text-lg" style={{ color: "#E8D5A3" }}>Hesap</h3>
          <div><label className={labelCls} style={labelStyle}>Kullanıcı Adı *</label>
            <input required value={form.username} onChange={(e) => set("username", e.target.value)} className={inputCls} style={inputStyle} placeholder="ahmetayse" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls} style={labelStyle}>Şifre *</label>
              <input required type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputCls} style={inputStyle} /></div>
            <div><label className={labelCls} style={labelStyle}>Şifre Tekrar *</label>
              <input required type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} className={inputCls} style={inputStyle} /></div>
          </div>
        </section>

        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <h3 className="font-serif text-lg" style={{ color: "#E8D5A3" }}>Düğün</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls} style={labelStyle}>Tarih</label>
              <input type="date" value={form.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} className={inputCls} style={inputStyle} /></div>
            <div><label className={labelCls} style={labelStyle}>Saat</label>
              <input type="time" value={form.weddingTime} onChange={(e) => set("weddingTime", e.target.value)} className={inputCls} style={inputStyle} /></div>
          </div>
          <p className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
            📍 Konum: Sahra Düğün Salonu (sabit — değiştirilemez)
          </p>
        </section>

        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <h3 className="font-serif text-lg" style={{ color: "#E8D5A3" }}>Davet Mesajı</h3>
          <textarea rows={3} value={form.invitationText} onChange={(e) => set("invitationText", e.target.value)}
            className={`${inputCls} resize-none`} style={inputStyle} />
        </section>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-sans text-sm tracking-wider uppercase disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #C9A84C, #E8D5A3)", color: "#1a0f08" }}>
          {loading ? "Oluşturuluyor…" : "Çifti Oluştur"}
        </button>
      </form>
    </div>
  );
}
