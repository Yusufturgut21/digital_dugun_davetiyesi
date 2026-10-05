"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, LayoutDashboard, Package, ShoppingCart, Store, ClipboardList, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/products/new", label: "+ Yeni Ürün", icon: Package },
  { href: "/admin/orders", label: "Siparişler", icon: ShoppingCart },
  { href: "/admin/stores", label: "Mağazalar", icon: Store },
  { href: "/admin/audit-logs", label: "Log Kayıtları", icon: ClipboardList },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0f0f" }}>
      <header
        className="border-b sticky top-0 z-30"
        style={{
          borderColor: "rgba(232,197,71,0.15)",
          background: "rgba(15,15,15,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #E8C547, #f5e070)" }}
            >
              <ShoppingBag className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h1 className="font-serif text-lg text-white">StepStyle</h1>
              <p className="font-sans text-[10px] tracking-widest uppercase text-amber-500/60">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg font-sans text-xs tracking-wide transition-all flex items-center gap-2"
                  style={{
                    background: active ? "rgba(232,197,71,0.15)" : "transparent",
                    color: active ? "#E8C547" : "rgba(255,255,255,0.45)",
                  }}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 font-sans text-xs px-3 py-2 rounded-lg hover:text-white transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <LogOut className="w-4 h-4" />
            Çıkış
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
