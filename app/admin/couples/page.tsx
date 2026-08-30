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
  const [passwordModal, setPasswordModal] = useState<{ id: string; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const resetPassword = async () => {
    if (!passwordModal || !newPassword) return;
    if (newPassword.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalı.");
      return;
    }
    setPasswordError("");
    await apiFetch(`/api/admin/couples/${passwordModal.id}`, {
      method: "PUT",
      body: JSON.stringify({ password: newPassword }),
    });
    setPasswordModal(null);
    setNewPassword("");
    alert("Şifre başarıyla güncellendi.");
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
                {["Gelin", "Damat", "Kullanıcı Adı", "Düğün Tarihi", "Durum", "İşlemler"].map((h) => (
                  <th key={h} className="px-4 py-3 font-sans text-xs tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Yükleniyor…</td></tr>
              ) : couples.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Çift bulunamadı</td></tr>
              ) : couples.map((c) => (
                <tr key={c.id} className="border-t" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                  <td className="px-4 py-3 font-sans text-sm" style={{ color: "#E8D5A3" }}>{c.brideName}</td>
                  <td className="px-4 py-3 font-sans text-sm" style={{ color: "#E8D5A3" }}>{c.groomName}</td>
                  <td className="px-4 py-3 font-sans text-xs" style={{ color: "rgba(201,168,76,0.6)" }}>@{c.username}</td>
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
                      <button onClick={() => { setPasswordModal({ id: c.id, name: `${c.groomName} & ${c.brideName}` }); setNewPassword(""); setPasswordError(""); }} className="action-btn">Şifre Değiştir</button>
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

      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: "#1a1208", border: "1px solid rgba(201,168,76,0.2)" }}>
            <h3 className="font-serif text-xl" style={{ color: "#E8D5A3" }}>Şifre Değiştir</h3>
            <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{passwordModal.name}</p>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifre (min. 6 karakter)"
              className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }} />
            {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setPasswordModal(null)} className="action-btn">İptal</button>
              <button onClick={resetPassword} className="admin-btn admin-btn-primary">Kaydet</button>
            </div>
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
