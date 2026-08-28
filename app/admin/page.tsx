"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllInvitations, deleteInvitation, toggleInvitationStatus } from "@/lib/store";
import { WeddingInvitation } from "@/lib/types";
import QRModal from "@/components/admin/QRModal";
import Link from "next/link";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/davet/${slug}`;
  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="admin-btn admin-btn-outline" title="Linki Kopyala">
      {copied ? "✓ Kopyalandı" : "Linki Kopyala"}
    </button>
  );
}

export default function AdminPage() {
  const [invitations, setInvitations] = useState<WeddingInvitation[]>([]);
  const [qrTarget, setQrTarget] = useState<WeddingInvitation | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    const data = await getAllInvitations();
    setInvitations(data.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id: string) => {
    await toggleInvitationStatus(id);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteInvitation(id);
    setConfirmDelete(null);
    load();
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0a06" }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C9A84C,#E8D5A3)" }}>
              <span className="text-xs font-serif" style={{ color: "#1a0f08" }}>✦</span>
            </div>
            <div>
              <h1 className="font-serif text-xl" style={{ color: "#E8D5A3" }}>Düğün Davetiyeleri</h1>
              <p className="text-xs font-sans" style={{ color: "rgba(201,168,76,0.5)" }}>Admin Paneli</p>
            </div>
          </div>
          <Link href="/admin/new" className="admin-btn admin-btn-primary">
            + Yeni Davetiye Oluştur
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {invitations.length === 0 ? (
          <motion.div
            className="text-center py-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-6">💌</div>
            <p className="font-serif text-2xl font-light mb-3" style={{ color: "rgba(232,213,163,0.7)" }}>
              Henüz davetiye yok
            </p>
            <p className="font-sans text-sm mb-8" style={{ color: "rgba(201,168,76,0.4)" }}>
              İlk düğün davetiyenizi oluşturun
            </p>
            <Link href="/admin/new" className="admin-btn admin-btn-primary">
              + Yeni Davetiye Oluştur
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <p className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(201,168,76,0.4)" }}>
              Mevcut Davetiyeler ({invitations.length})
            </p>
            {invitations.map((inv, i) => {
              const displayName = `${inv.groomName} ${inv.conjunction} ${inv.brideName}`;
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-5 sm:p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(201,168,76,0.12)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-serif text-xl font-light" style={{ color: "#E8D5A3" }}>
                          {displayName}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full font-sans" style={{
                          background: inv.isActive ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                          color: inv.isActive ? "#4ade80" : "#f87171",
                          border: `1px solid ${inv.isActive ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
                        }}>
                          {inv.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans" style={{ color: "rgba(201,168,76,0.5)" }}>
                        <span>📅 {formatDate(inv.weddingDate)}</span>
                        <span>📍 {inv.venueName || "—"}</span>
                        <span>🔗 /davet/{inv.slug}</span>
                      </div>
                      <p className="text-xs mt-1 font-sans" style={{ color: "rgba(255,255,255,0.2)" }}>
                        Oluşturulma: {formatDate(inv.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/davet/${inv.slug}`} target="_blank" className="admin-btn admin-btn-outline">
                        Önizle
                      </Link>
                      <Link href={`/admin/${inv.id}`} className="admin-btn admin-btn-outline">
                        Düzenle
                      </Link>
                      <CopyLinkButton slug={inv.slug} />
                      <button onClick={() => setQrTarget(inv)} className="admin-btn admin-btn-outline">
                        QR Kod
                      </button>
                      <button
                        onClick={() => handleToggle(inv.id)}
                        className="admin-btn"
                        style={{
                          background: inv.isActive ? "rgba(239,68,68,0.1)" : "rgba(74,222,128,0.1)",
                          border: `1px solid ${inv.isActive ? "rgba(239,68,68,0.2)" : "rgba(74,222,128,0.2)"}`,
                          color: inv.isActive ? "#f87171" : "#4ade80",
                        }}
                      >
                        {inv.isActive ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(inv.id)}
                        className="admin-btn"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.15)",
                          color: "#f87171",
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrTarget && (
        <QRModal
          invitation={qrTarget}
          onClose={() => setQrTarget(null)}
        />
      )}

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-2xl p-8 max-w-sm w-full text-center"
              style={{ background: "#1a0f08", border: "1px solid rgba(239,68,68,0.3)" }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <p className="text-4xl mb-4">⚠️</p>
              <h3 className="font-serif text-xl mb-2" style={{ color: "#E8D5A3" }}>Davetiyeyi Sil</h3>
              <p className="font-sans text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                Bu işlem geri alınamaz. Davetiye kalıcı olarak silinecektir.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 admin-btn admin-btn-outline"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 admin-btn"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" }}
                >
                  Evet, Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .admin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-family: var(--font-sans, sans-serif);
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .admin-btn:hover { opacity: 0.8; transform: translateY(-1px); }
        .admin-btn-primary {
          background: linear-gradient(135deg, #C9A84C, #E8D5A3);
          color: #1a0f08;
          font-weight: 500;
        }
        .admin-btn-outline {
          background: rgba(255,255,255,0.04);
          border-color: rgba(201,168,76,0.2);
          color: rgba(232,213,163,0.7);
        }
      `}</style>
    </div>
  );
}
