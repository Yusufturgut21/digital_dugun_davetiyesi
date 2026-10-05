"use client";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import {
  ShoppingBag, LayoutDashboard, Package, ShoppingCart,
  Settings, Eye, LogOut, Menu, X,
} from "lucide-react";

interface UserInfo {
  username: string;
  role: string;
  isImpersonating?: boolean;
  coupleName?: string;
  invitationSlug?: string;
}

export default function StoreShell({ children }: { children: React.ReactNode }) {
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

  const nav = [
    { href: `/panel/${panelSlug}`, label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: `/panel/${panelSlug}/products`, label: "Ürünlerim", icon: Package },
    { href: `/panel/${panelSlug}/orders`, label: "Siparişler", icon: ShoppingCart },
    { href: `/panel/${panelSlug}/store`, label: "Mağaza Ayarları", icon: Settings },
    { href: `/`, label: "Mağazayı Görüntüle", icon: Eye, external: true },
    { href: `/panel/${panelSlug}/account`, label: "Hesap Ayarları", icon: Settings },
  ];

  const isActive = (item: typeof nav[0]) => {
    if (item.external) return false;
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f0f0f" }}>
      {/* Impersonation bar */}
      {user?.isImpersonating && (
        <div
          className="fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-xs font-sans"
          style={{
            background: "rgba(232,197,71,0.15)",
            color: "#E8C547",
            borderBottom: "1px solid rgba(232,197,71,0.2)",
          }}
        >
          Admin olarak görüntülüyorsunuz — {user.coupleName}
          <button onClick={exitImpersonate} className="ml-4 underline hover:no-underline">
            Çıkış
          </button>
        </div>
      )}

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "#111111",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          paddingTop: user?.isImpersonating ? 40 : 0,
        }}
      >
        {/* Logo */}
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #E8C547, #f5e070)" }}
            >
              <ShoppingBag className="w-5 h-5 text-neutral-950" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-base text-white truncate">StepStyle</p>
              <p className="text-xs text-neutral-500 truncate">@{user?.username}</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = isActive(item);
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-neutral-500 hover:text-white"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: active ? "rgba(232,197,71,0.12)" : "transparent",
                  color: active ? "#E8C547" : "rgba(255,255,255,0.5)",
                }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? "#E8C547" : undefined }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ paddingTop: user?.isImpersonating ? 40 : 0 }}
      >
        {/* Mobile header */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-neutral-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-base text-white">Mağaza Paneli</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
