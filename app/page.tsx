"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a06" }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} />
    </div>
  );
}
