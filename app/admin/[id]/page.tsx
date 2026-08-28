"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getInvitationById, updateInvitation } from "@/lib/store";
import { WeddingInvitation, CreateInvitationInput } from "@/lib/types";
import InvitationForm from "@/components/admin/InvitationForm";
import Link from "next/link";

export default function EditInvitationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invitation, setInvitation] = useState<WeddingInvitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getInvitationById(id).then(inv => {
      if (!inv) setNotFound(true);
      else setInvitation(inv);
    });
  }, [id]);

  const handleSubmit = async (data: CreateInvitationInput) => {
    setLoading(true);
    await updateInvitation(id, data);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a06" }}>
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-serif text-xl mb-4" style={{ color: "#E8D5A3" }}>Davetiye bulunamadı</p>
          <Link href="/admin" className="admin-btn admin-btn-outline">← Admin Paneli</Link>
        </div>
        <style jsx global>{`
          .admin-btn { display:inline-flex;align-items:center;justify-content:center;padding:8px 16px;border-radius:10px;font-size:13px;font-family:sans-serif;cursor:pointer;transition:all .2s;white-space:nowrap;border:1px solid transparent;text-decoration:none; }
          .admin-btn-outline { background:rgba(255,255,255,.04);border-color:rgba(201,168,76,.2);color:rgba(232,213,163,.7); }
        `}</style>
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <div className="min-h-screen" style={{ background: "#0f0a06" }}>
      <div className="border-b" style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/admin" className="admin-btn admin-btn-outline text-xs">← Geri</Link>
          <div className="flex-1">
            <h1 className="font-serif text-xl" style={{ color: "#E8D5A3" }}>Davetiye Düzenle</h1>
            <p className="font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>
              {invitation.groomName} {invitation.conjunction} {invitation.brideName}
            </p>
          </div>
          <Link href={`/davet/${invitation.slug}`} target="_blank" className="admin-btn admin-btn-outline text-xs">
            Önizle ↗
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-xl px-5 py-3 text-sm font-sans flex items-center gap-2"
              style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}
            >
              ✓ Değişiklikler kaydedildi
            </motion.div>
          )}
        </AnimatePresence>
        <InvitationForm initial={invitation} onSubmit={handleSubmit} loading={loading} />
      </div>

      <style jsx global>{`
        .admin-btn { display:inline-flex;align-items:center;justify-content:center;padding:8px 16px;border-radius:10px;font-size:13px;font-family:sans-serif;letter-spacing:.04em;cursor:pointer;transition:all .2s;white-space:nowrap;border:1px solid transparent;text-decoration:none; }
        .admin-btn:hover { opacity:.8;transform:translateY(-1px); }
        .admin-btn-primary { background:linear-gradient(135deg,#C9A84C,#E8D5A3);color:#1a0f08;font-weight:500; }
        .admin-btn-outline { background:rgba(255,255,255,.04);border-color:rgba(201,168,76,.2);color:rgba(232,213,163,.7); }
      `}</style>
    </div>
  );
}
