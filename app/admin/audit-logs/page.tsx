"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

interface AuditEntry {
  id: string;
  username?: string;
  action: string;
  details?: string;
  invitationId?: string;
  createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
  couple_created: "Çift oluşturuldu",
  couple_updated: "Çift düzenlendi",
  couple_deleted: "Çift silindi",
  couple_activated: "Çift aktif yapıldı",
  couple_deactivated: "Çift pasif yapıldı",
  admin_impersonate: "Admin çift paneline girdi",
  password_changed: "Şifre değiştirildi",
  couple_edited_invitation: "Davetiye düzenlendi",
  admin_edited_invitation: "Admin davetiye düzenledi",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<AuditEntry[]>("/api/admin/audit-logs?limit=100")
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-light" style={{ color: "#E8D5A3" }}>Audit Log</h2>
        <p className="font-sans text-sm mt-1" style={{ color: "rgba(201,168,76,0.5)" }}>
          Kritik admin işlemleri kaydı
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "rgba(201,168,76,0.08)" }}>
                {["Tarih", "Kullanıcı", "İşlem", "Detay"].map((h) => (
                  <th key={h} className="px-4 py-3 font-sans text-xs tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Yükleniyor…</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Kayıt yok</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="border-t" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                  <td className="px-4 py-3 font-sans text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {new Date(log.createdAt).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm" style={{ color: "#E8D5A3" }}>{log.username || "—"}</td>
                  <td className="px-4 py-3 font-sans text-xs" style={{ color: "rgba(201,168,76,0.7)" }}>
                    {ACTION_LABELS[log.action] || log.action}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs max-w-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {log.details || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
