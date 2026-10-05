"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

export default function PanelRedirect() {
  const router = useRouter();

  useEffect(() => {
    apiFetch<{ slug: string }>("/api/couple/invitation")
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
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#0f0f0f" }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-amber-500/40" />
    </div>
  );
}
