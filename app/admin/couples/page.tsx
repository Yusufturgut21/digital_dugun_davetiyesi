"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

interface CoupleRow {
  id: string;
  groomName: string;
  brideName: string;
  username?: string;
  weddingDate: string;
  isActive: boolean;
  userStatus?: string;
  slug: string;
}

export default function CouplesPage() {
  const router = useRouter();
  const [couples, setCouples] = useState<CoupleRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [credModal, setCredModal] = useState<{ id: string; name: string; username: string } | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credError, setCredError] = useState("");
  const [credSaving, setCredSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter === "active") params.set("status", "active");
    if (filter === "inactive") params.set("status", "inactive");
    if (filter === "upcoming") params.set("upcoming", "true");
    apiFetch<CoupleRow[]>(`/api/admin/couples?${params}`)
      .then(setCouples)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, filter]);

  const toggleStatus = async (id: string, isActive: boolean) => {
    await apiFetch(`/api/admin/couples/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !isActive, userStatus: !isActive ? "active" : "inactive" }),
    });
    load();
  };

  const impersonate = async (id: string) => {
    try {
      await apiFetch("/api/admin/impersonate", { method: "POST", body: JSON.stringify({ invitationId: id }) });
      router.push("/panel");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Panele giriş başarısız.");
    }
  };

  const deleteCouple = async (id: string, name: string) => {
    if (!confirm(`${name} çiftini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    await apiFetch(`/api/admin/couples/${id}`, { method: "DELETE" });
    load();
  };

  const openCredModal = (c: CoupleRow) => {
    setCredModal({ id: c.id, name: `${c.groomName} & ${c.brideName}`, username: c.username || "" });
    setNewUsername(c.username || "");
    setNewPassword("");
    setCredError("");
  };

  const saveCredentials = async () => {
    if (!credModal) return;
    if (!newUsername.trim()) {
      setCredError("Kullanıcı adı boş olamaz.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setCredError("Şifre en az 6 karakter olmalı.");
      return;
    }
    setCredError("");
    setCredSaving(true);
    try {
      await apiFetch(`/api/admin/couples/${credModal.id}`, {
        method: "PUT",
        body: JSON.stringify({
          username: newUsername.trim(),
          ...(newPassword ? { password: newPassword } : {}),
        }),
      });
      setCredModal(null);
      load();
      alert("Kullanıcı bilgileri başarıyla güncellendi.");
    } catch (err) {
      setCredError(err instanceof Error ? err.message : "Güncelleme başarısız.");
    } finally {
      setCredSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="font-serif text-3xl font-light" style={{ color: "#E8D5A3" }}>Çiftler</h2>
        <Link href="/admin/couples/new" className="admin-btn admin-btn-primary">+ Yeni Çift</Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Gelin, damat veya kullanıcı adı ara..."
          autoComplete="off"
          className="flex-1 px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}>
          <option value="all">Tümü</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="upcoming">Yaklaşan Düğünler</option>
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "rgba(201,168,76,0.08)" }}>
                {["Gelin", "Damat", "Kullanıcı Adı", "Login Linki", "Düğün Tarihi", "Durum", "İşlemler"].map((h) => (
                  <th key={h} className="px-4 py-3 font-sans text-xs tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Yükleniyor…</td></tr>
              ) : couples.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Çift bulunamadı</td></tr>
              ) : couples.map((c) => (
                <tr key={c.id} className="border-t" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                  <td className="px-4 py-3 font-sans text-sm" style={{ color: "#E8D5A3" }}>{c.brideName}</td>
                  <td className="px-4 py-3 font-sans text-sm" style={{ color: "#E8D5A3" }}>{c.groomName}</td>
                  <td className="px-4 py-3 font-sans text-xs" style={{ color: "rgba(201,168,76,0.6)" }}>@{c.username}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const link = `${window.location.origin}/login/${c.slug}`;
                          navigator.clipboard.writeText(link);
                          alert('Login linki kopyalandı!');
                        }
                      }}
                      className="action-btn"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #E8D5A3)", color: "#1a0f08", border: "none", fontWeight: 500 }}
                    >
                      Linki Kopyala
                    </button>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{c.weddingDate || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: c.isActive && c.userStatus === "active" ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                      color: c.isActive && c.userStatus === "active" ? "#4ade80" : "#f87171",
                    }}>
                      {c.isActive && c.userStatus === "active" ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Link href={`/admin/couples/${c.id}`} className="action-btn">Görüntüle</Link>
                      <Link href={`/admin/couples/${c.id}`} className="action-btn">Düzenle</Link>
                      <button onClick={() => impersonate(c.id)} className="action-btn">Panele Gir</button>
                      <Link href={`/davet/${c.slug}`} target="_blank" className="action-btn">Davetiye</Link>
                      <button onClick={() => openCredModal(c)} className="action-btn">Şifre Değiştir</button>
                      <button onClick={() => toggleStatus(c.id, c.isActive)} className="action-btn">
                        {c.isActive ? "Pasif" : "Aktif"}
                      </button>
                      <button onClick={() => deleteCouple(c.id, `${c.groomName} & ${c.brideName}`)} className="action-btn danger">Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kullanıcı Adı & Şifre Değiştir Modal */}
      {credModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: "#1a1208", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div>
              <h3 className="font-serif text-xl" style={{ color: "#E8D5A3" }}>Kullanıcı Bilgilerini Değiştir</h3>
              <p className="font-sans text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{credModal.name}</p>
            </div>

            {/* autocomplete="off" + gizli dummy alanlar → tarayıcı autocomplete'ini engeller */}
            <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); saveCredentials(); }} className="space-y-4">
              <input type="text" style={{ display: "none" }} autoComplete="username" readOnly />
              <input type="password" style={{ display: "none" }} autoComplete="current-password" readOnly />

              <div>
                <label className="font-sans text-xs tracking-widest uppercase mb-1.5 block" style={{ color: "rgba(201,168,76,0.6)" }}>
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  autoComplete="off"
                  name="couple-username"
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                />
              </div>

              <div>
                <label className="font-sans text-xs tracking-widest uppercase mb-1.5 block" style={{ color: "rgba(201,168,76,0.6)" }}>
                  Yeni Şifre{" "}
                  <span style={{ color: "rgba(255,255,255,0.3)", textTransform: "none", letterSpacing: 0 }}>
                    (boş bırakılırsa değişmez)
                  </span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  name="couple-new-password"
                  placeholder="Min. 6 karakter"
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                />
              </div>

              {credError && <p className="text-red-400 text-sm">{credError}</p>}

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setCredModal(null)} className="action-btn">İptal</button>
                <button
                  type="submit"
                  disabled={credSaving}
                  className="admin-btn admin-btn-primary"
                  style={{ opacity: credSaving ? 0.6 : 1 }}
                >
                  {credSaving ? "Kaydediliyor…" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-btn { display: inline-flex; padding: 10px 18px; border-radius: 10px; font-size: 12px; font-family: sans-serif; }
        .admin-btn-primary { background: linear-gradient(135deg, #C9A84C, #E8D5A3); color: #1a0f08; }
        .action-btn { font-size: 10px; padding: 4px 8px; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,168,76,0.15); color: rgba(232,213,163,0.7); cursor: pointer; white-space: nowrap; }
        .action-btn.danger { color: #f87171; border-color: rgba(239,68,68,0.2); }
        .action-btn:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
}
