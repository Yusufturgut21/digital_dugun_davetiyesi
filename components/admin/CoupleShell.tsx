"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

interface UserInfo {
  username: string;
  role: string;
  isImpersonating?: boolean;
  coupleName?: string;
  invitationSlug?: string;
}

export default function CoupleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    apiFetch<{ user: UserInfo | null }>("/api/auth/me").then((d) => {
      if (d.user) setUser(d.user);
    });
  }, []);

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const exitImpersonate = async () => {
    await apiFetch("/api/admin/impersonate/exit", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const previewHref = user?.invitationSlug ? `/davet/${user.invitationSlug}` : "/panel";

  const nav = [
    { href: "/panel", label: "Dashboard", icon: "◇", exact: true },
    { href: "/panel/edit?step=1", label: "Düğün Bilgileri", icon: "◈" },
    { href: "/panel/edit?step=0", label: "Gelin & Damat", icon: "♡" },
    { href: "/panel/edit?step=2", label: "Davetiye", icon: "✦" },
    { href: "/panel/edit?step=6", label: "Fotoğraf Galerisi", icon: "📷" },
    { href: "/panel/edit?step=7", label: "Müzik", icon: "♪" },
    { href: "/panel/rsvp", label: "RSVP / Katılım", icon: "✉" },
    { href: previewHref, label: "Davetiye Önizleme", icon: "👁", external: true },
    { href: "/panel/account", label: "Şifre Değiştir", icon: "🔒" },
  ];

  const isActive = (item: typeof nav[0]) => {
    if (item.external) return false;
    if (item.exact) return pathname === item.href;
    if (item.href.startsWith("/panel/edit")) {
      return pathname === "/panel/edit";
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f0a06" }}>
      {user?.isImpersonating && (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-xs font-sans tracking-wide"
          style={{ background: "rgba(201,168,76,0.2)", color: "#E8D5A3", borderBottom: "1px solid rgba(201,168,76,0.3)" }}>
          Sahra Admin olarak görüntülüyorsunuz — {user.coupleName}
          <button onClick={exitImpersonate} className="ml-4 underline hover:no-underline">
            Çift panelinden çık
          </button>
        </div>
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(201,168,76,0.1)", paddingTop: user?.isImpersonating ? 40 : 0 }}>
        <div className="p-6 border-b" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          <p className="font-serif text-lg" style={{ color: "#E8D5A3" }}>{user?.coupleName || "Davetiyem"}</p>
          <p className="font-sans text-xs mt-1" style={{ color: "rgba(201,168,76,0.5)" }}>@{user?.username}</p>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {nav.map((item) => {
            const active = isActive(item);
            const className = "flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-all";
            const style = {
              background: active ? "rgba(201,168,76,0.15)" : "transparent",
              color: active ? "#E8D5A3" : "rgba(255,255,255,0.5)",
            };

            if (item.external) {
              return (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)} className={className} style={style}>
                  <span>{item.icon}</span>{item.label}
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className={className} style={style}>
                <span>{item.icon}</span>{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          <button onClick={logout} className="w-full px-4 py-2 rounded-xl font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0" style={{ paddingTop: user?.isImpersonating ? 40 : 0 }}>
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl" style={{ color: "#E8D5A3" }}>☰</button>
          <span className="font-serif" style={{ color: "#E8D5A3" }}>Panel</span>
          <div className="w-8" />
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
