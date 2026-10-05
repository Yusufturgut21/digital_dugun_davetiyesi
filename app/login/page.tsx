"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ redirect: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      router.push(data.redirect || "/panel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-md font-sans text-sm outline-none transition-all bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 focus:border-amber-500";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0f0f0f" }}
    >
      <div
        className="w-full max-w-md rounded-xl p-8"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #E8C547, #f5e070)" }}
          >
            <ShoppingBag className="w-7 h-7 text-neutral-950" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">StepStyle</h1>
          <p className="text-sm text-neutral-500 mt-1">Mağaza Yönetim Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="kullaniciadi"
              className={inputBase}
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputBase + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md px-4 py-3 bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md font-sans font-semibold text-sm transition-all disabled:opacity-60"
            style={{ background: "#E8C547", color: "#0f0f0f" }}
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-600 mt-6">
          StepStyle © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
