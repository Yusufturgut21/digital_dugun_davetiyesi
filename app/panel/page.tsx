"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { WeddingInvitation } from "@/lib/types";

export default function PanelRedirect() {
  const router = useRouter();

  useEffect(() => {
    apiFetch<WeddingInvitation>("/api/couple/invitation")
      .then((data) => {
        if (data?.slug) {
          router.replace(`/panel/${data.slug}`);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#0f0a06" }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" 
        style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} />
    </div>
  );
}
