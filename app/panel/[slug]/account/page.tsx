"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { Lock, ShieldCheck, Save } from "lucide-react";

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const inputCls =
    "w-full px-4 py-3 rounded-md text-sm bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 outline-none focus:border-amber-500 transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setMessage({ type: "error", text: "Yeni şifreler eşleşmiyor." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Şifre en az 6 karakter olmalıdır." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setMessage({ type: "success", text: "Şifreniz başarıyla güncellendi." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Güncelleme başarısız." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="font-serif text-2xl font-bold text-white">Hesap Ayarları</h2>

      {/* Change password */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Şifre Değiştir</h3>
            <p className="text-xs text-neutral-500">Hesap güvenliğinizi koruyun</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
              Mevcut Şifre
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputCls}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
              Yeni Şifre
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={inputCls}
              placeholder="En az 6 karakter"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={inputCls}
              placeholder="••••••••"
            />
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

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ background: "#E8C547", color: "#0f0f0f" }}
          >
            <Save className="w-4 h-4" />
            {loading ? "Güncelleniyor…" : "Şifreyi Güncelle"}
          </button>
        </form>
      </div>

      {/* Info */}
      <div
        className="rounded-xl p-5 flex items-start gap-4"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1">Kullanıcı Adı Değişikliği</h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Kullanıcı adı değişiklikleri admin tarafından yapılır. Yöneticinizle iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
