"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

export default function PanelAccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await apiFetch<{ message: string }>("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      setMessage(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl font-sans text-sm outline-none max-w-md";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="font-serif text-2xl font-light" style={{ color: "#E8D5A3" }}>Şifre Değiştir</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-sans text-xs tracking-widest uppercase mb-2 block" style={{ color: "rgba(201,168,76,0.6)" }}>Mevcut Şifre</label>
          <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="font-sans text-xs tracking-widest uppercase mb-2 block" style={{ color: "rgba(201,168,76,0.6)" }}>Yeni Şifre</label>
          <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="font-sans text-xs tracking-widest uppercase mb-2 block" style={{ color: "rgba(201,168,76,0.6)" }}>Yeni Şifre Tekrar</label>
          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} style={inputStyle} />
        </div>

        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading}
          className="px-6 py-3 rounded-xl font-sans text-sm disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #C9A84C, #E8D5A3)", color: "#1a0f08" }}>
          {loading ? "Kaydediliyor…" : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
}
