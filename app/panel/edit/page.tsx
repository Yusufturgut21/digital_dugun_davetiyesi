"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import InvitationForm from "@/components/admin/InvitationForm";
import { WeddingInvitation, CreateInvitationInput } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

function PanelEditContent() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") ?? "0", 10) || 0;
  const [invitation, setInvitation] = useState<WeddingInvitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch<WeddingInvitation>("/api/couple/invitation").then(setInvitation);
  }, []);

  const handleSubmit = async (data: CreateInvitationInput) => {
    setLoading(true);
    try {
      const updated = await apiFetch<WeddingInvitation>("/api/couple/invitation", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setInvitation(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!invitation) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} /></div>;
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="font-serif text-2xl font-light" style={{ color: "#E8D5A3" }}>Davetiye Düzenle</h2>
      {saved && (
        <div className="rounded-xl px-4 py-3 text-center font-sans text-sm" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
          Bilgiler başarıyla güncellendi.
        </div>
      )}
      <div className="rounded-2xl p-4 sm:p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", minHeight: 500 }}>
        <InvitationForm
          initial={invitation}
          onSubmit={handleSubmit}
          loading={loading}
          hideLocationFields
          initialStep={initialStep}
          onPreview={() => window.open(`/davet/${invitation.slug}`, "_blank")}
        />
      </div>
    </div>
  );
}

export default function PanelEditPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} />
      </div>
    }>
      <PanelEditContent />
    </Suspense>
  );
}
