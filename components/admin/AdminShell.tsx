"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/couples", label: "Çiftler" },
  { href: "/admin/couples/new", label: "+ Yeni Çift" },
  { href: "/admin/venues", label: "Düğün Salonları" },
  { href: "/admin/gallery", label: "Düğün Galerisi" },
  { href: "/admin/audit-logs", label: "Audit Log" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0a06" }}>
      <header className="border-b sticky top-0 z-30" style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(15,10,6,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C9A84C,#E8D5A3)" }}>
              <span className="text-sm">✦</span>
            </div>
            <div>
              <h1 className="font-serif text-lg" style={{ color: "#E8D5A3" }}>Sahra Düğün Salonu</h1>
              <p className="font-sans text-[10px] tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.5)" }}>Ana Admin</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className="px-4 py-2 rounded-lg font-sans text-xs tracking-wide transition-all"
                  style={{
                    background: active ? "rgba(201,168,76,0.15)" : "transparent",
                    color: active ? "#E8D5A3" : "rgba(255,255,255,0.45)",
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="font-sans text-xs px-3 py-2 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
            Çıkış
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
