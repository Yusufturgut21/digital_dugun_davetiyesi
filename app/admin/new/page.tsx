"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createInvitation } from "@/lib/store";
import { CreateInvitationInput, WeddingInvitation } from "@/lib/types";
import InvitationForm from "@/components/admin/InvitationForm";
import Link from "next/link";

export default function NewInvitationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<WeddingInvitation | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (data: CreateInvitationInput) => {
    setLoading(true);
    const inv = await createInvitation(data);
    setLoading(false);
    setCreated(inv);
  };

  const url = created ? `${typeof window !== "undefined" ? window.location.origin : ""}/davet/${created.slug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0a06" }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/admin" className="admin-btn admin-btn-outline text-xs">
            ← Geri
          </Link>
          <h1 className="font-serif text-xl" style={{ color: "#E8D5A3" }}>Yeni Davetiye Oluştur</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {created ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-6">🎊</div>
              <h2 className="font-serif text-3xl font-light mb-3" style={{ color: "#E8D5A3" }}>
                Davetiye Oluşturuldu!
              </h2>
              <p className="font-sans text-sm mb-2" style={{ color: "rgba(201,168,76,0.7)" }}>
                {created.groomName} {created.conjunction} {created.brideName}
              </p>
              <p className="font-sans text-xs mb-8 break-all" style={{ color: "rgba(255,255,255,0.3)" }}>
                {url}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/davet/${created.slug}`} target="_blank" className="admin-btn admin-btn-primary">
                  Davetiyeyi Aç
                </Link>
                <button onClick={copyLink} className="admin-btn admin-btn-outline">
                  {copied ? "✓ Kopyalandı" : "Linki Kopyala"}
                </button>
                <Link href="/admin" className="admin-btn admin-btn-outline">
                  Admin Paneline Dön
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <InvitationForm onSubmit={handleSubmit} loading={loading} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .admin-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 8px 16px; border-radius: 10px; font-size: 13px;
          font-family: sans-serif; letter-spacing: 0.04em;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          border: 1px solid transparent; text-decoration: none;
        }
        .admin-btn:hover { opacity: 0.8; transform: translateY(-1px); }
        .admin-btn-primary { background: linear-gradient(135deg,#C9A84C,#E8D5A3); color: #1a0f08; font-weight: 500; }
        .admin-btn-outline { background: rgba(255,255,255,0.04); border-color: rgba(201,168,76,0.2); color: rgba(232,213,163,0.7); }
      `}</style>
    </div>
  );
}
