"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import InvitationForm from "@/components/admin/InvitationForm";
import { WeddingInvitation, CreateInvitationInput } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

export default function EditCouplePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invitation, setInvitation] = useState<WeddingInvitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    apiFetch<WeddingInvitation & { username?: string }>(`/api/admin/couples/${id}`)
      .then((data) => {
        setInvitation(data);
        setUsername(data.username || "");
      });
  }, [id]);

  const handleSubmit = async (data: CreateInvitationInput) => {
    setLoading(true);
    try {
      await apiFetch(`/api/admin/couples/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...data,
          username,
          ...(newPassword ? { password: newPassword } : {}),
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const impersonate = async () => {
    try {
      await apiFetch("/api/admin/impersonate", { method: "POST", body: JSON.stringify({ invitationId: id }) });
      router.push("/panel");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Panele giriş başarısız.");
    }
  };

  if (!invitation) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <Link href="/admin/couples" className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>← Çiftlere Dön</Link>
          <h2 className="font-serif text-3xl font-light mt-1" style={{ color: "#E8D5A3" }}>
            {invitation.groomName} & {invitation.brideName}
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={impersonate} className="admin-btn admin-btn-outline">Panele Gir</button>
          <Link href={`/davet/${invitation.slug}`} target="_blank" className="admin-btn admin-btn-outline">Davetiyeyi Gör</Link>
        </div>
      </div>

      <div className="rounded-2xl p-4 grid sm:grid-cols-2 gap-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
        <div>
          <label className="font-sans text-xs tracking-widest uppercase mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Kullanıcı Adı</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-lg font-sans text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }} />
        </div>
        <div>
          <label className="font-sans text-xs tracking-widest uppercase mb-1 block" style={{ color: "rgba(201,168,76,0.5)" }}>Yeni Şifre (opsiyonel)</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Değiştirmek için girin"
            className="w-full px-3 py-2 rounded-lg font-sans text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }} />
        </div>
      </div>

      {saved && (
        <div className="rounded-xl px-4 py-3 text-center font-sans text-sm" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
          Bilgiler başarıyla güncellendi.
        </div>
      )}

      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", minHeight: 600 }}>
        <InvitationForm initial={invitation} onSubmit={handleSubmit} loading={loading} hideLocationFields />
      </div>

      <style jsx global>{`
        .admin-btn { display: inline-flex; padding: 8px 14px; border-radius: 10px; font-size: 12px; font-family: sans-serif; border: 1px solid rgba(201,168,76,0.2); color: rgba(232,213,163,0.7); }
        .admin-btn-outline { background: rgba(255,255,255,0.04); }
      `}</style>
    </div>
  );
}
