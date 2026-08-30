"use client";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
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
  const params = useParams();
  const slug = params.slug as string;
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    apiFetch<{ user: UserInfo | null }>("/api/auth/me").then((d) => {
      if (d.user) {
        setUser(d.user);
        // Eğer slug farklıysa doğru panel URL'sine yönlendir
        if (d.user.invitationSlug && slug && d.user.invitationSlug !== slug) {
          router.replace(`/panel/${d.user.invitationSlug}`);
        }
      }
    });
  }, [slug, router]);

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const exitImpersonate = async () => {
    await apiFetch("/api/admin/impersonate/exit", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const panelSlug = user?.invitationSlug || slug;
  const previewHref = panelSlug ? `/davet/${panelSlug}` : "#";

  const nav = [
    { href: `/panel/${panelSlug}`, label: "Dashboard", icon: "◇", exact: true },
    { href: `/panel/${panelSlug}/edit?step=1`, label: "Düğün Bilgileri", icon: "◈" },
    { href: `/panel/${panelSlug}/edit?step=0`, label: "Gelin & Damat", icon: "♡" },
    { href: `/panel/${panelSlug}/edit?step=2`, label: "Davetiye", icon: "✦" },
    { href: `/panel/${panelSlug}/edit?step=6`, label: "Fotoğraf Galerisi", icon: "📷" },
    { href: `/panel/${panelSlug}/edit?step=7`, label: "Müzik", icon: "♪" },
    { href: `/panel/${panelSlug}/rsvp`, label: "RSVP / Katılım", icon: "✉" },
    { href: previewHref, label: "Davetiye Önizleme", icon: "👁", external: true },
    { href: `/panel/${panelSlug}/account`, label: "Şifre Değiştir", icon: "🔒" },
  ];

  const isActive = (item: typeof nav[0]) => {
    if (item.external) return false;
    if (item.exact) return pathname === item.href;
    if (item.href.includes("/edit")) {
      return pathname.includes("/edit");
    }
    return pathname === item.href;
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

      {/* Mobil backdrop */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(201,168,76,0.1)", paddingTop: user?.isImpersonating ? 40 : 0 }}>
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg truncate" style={{ color: "#E8D5A3" }}>{user?.coupleName || "Davetiyem"}</p>
            <p className="font-sans text-xs mt-1 truncate" style={{ color: "rgba(201,168,76,0.5)" }}>@{user?.username}</p>
          </div>
          <button 
            onClick={() => setMenuOpen(false)}
            className="lg:hidden ml-2 text-xl"
            style={{ color: "rgba(201,168,76,0.5)" }}
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {nav.map((item) => {
            const active = isActive(item);
            const className = "flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-all whitespace-nowrap";
            const style = {
              background: active ? "rgba(201,168,76,0.15)" : "transparent",
              color: active ? "#E8D5A3" : "rgba(255,255,255,0.5)",
            };

            if (item.external) {
              return (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)} className={className} style={style}>
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className={className} style={style}>
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          <button onClick={logout} className="w-full px-4 py-2 rounded-xl font-sans text-xs hover:bg-opacity-10 hover:bg-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0" style={{ paddingTop: user?.isImpersonating ? 40 : 0 }}>
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl p-2 -ml-2" style={{ color: "#E8D5A3" }}>☰</button>
          <span className="font-serif text-base" style={{ color: "#E8D5A3" }}>Panel</span>
          <div className="w-10" />
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
