"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { ClipboardList } from "lucide-react";

interface AuditEntry {
  id: string;
  username?: string;
  action: string;
  details?: string;
  createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
  product_created: "Ürün oluşturuldu",
  product_updated: "Ürün güncellendi",
  product_deleted: "Ürün silindi",
  product_activated: "Ürün aktif yapıldı",
  product_deactivated: "Ürün pasif yapıldı",
  order_created: "Sipariş oluşturuldu",
  order_updated: "Sipariş güncellendi",
  order_cancelled: "Sipariş iptal edildi",
  admin_impersonate: "Admin mağaza paneline girdi",
  password_changed: "Şifre değiştirildi",
  store_updated: "Mağaza ayarları güncellendi",
  couple_created: "Hesap oluşturuldu",
  couple_updated: "Hesap güncellendi",
  couple_deleted: "Hesap silindi",
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
        <h2 className="font-serif text-3xl font-bold text-white">Log Kayıtları</h2>
        <p className="text-sm text-neutral-500 mt-1">Sistem genelindeki kritik işlemlerin kaydı</p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "rgba(232,197,71,0.06)" }}>
                {["Tarih", "Kullanıcı", "İşlem", "Detay"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs uppercase tracking-widest text-amber-500/60">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-neutral-600">
                    Yükleniyor…
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
                    <p className="text-sm text-neutral-600">Henüz log kaydı yok</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{log.username || "—"}</td>
                    <td className="px-4 py-3 text-xs text-amber-400">
                      {ACTION_LABELS[log.action] || log.action}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600 max-w-xs truncate">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
