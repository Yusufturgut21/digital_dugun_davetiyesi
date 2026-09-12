import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth/jwt";

const PUBLIC_PATHS = [
  "/login",
  "/davet",
  "/salon",
  "/api/auth/login",
  "/api/auth/seed",
  "/api/invitations",
  "/api/rsvp",
  "/api/venues",
];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public guest invitation slug lookup
  if (pathname.startsWith("/davet/")) return NextResponse.next();
  if (pathname.startsWith("/salon/")) return NextResponse.next();
  if (pathname === "/api/invitations" && req.method === "GET") {
    const slug = req.nextUrl.searchParams.get("slug");
    if (slug) return NextResponse.next();
  }
  if (pathname.startsWith("/api/venues")) return NextResponse.next();
  if (pathname === "/api/rsvp" && req.method === "POST") return NextResponse.next();
  if (pathname === "/api/auth/login" && req.method === "POST") return NextResponse.next();
  if (pathname === "/api/auth/seed" && req.method === "POST") return NextResponse.next();
  if (pathname === "/api/auth/logout" && req.method === "POST") return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // Login page — redirect if already logged in
  if (pathname === "/login") {
    if (session) {
      if (session.role === "super_admin" && !session.impersonatorId) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/panel", req.url));
    }
    return NextResponse.next();
  }

  // Root redirect
  if (pathname === "/") {
    // Session varsa ve admin ise admin'e yönlendir
    if (session?.role === "super_admin" && !session.impersonatorId) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Session varsa ve çift ise panel'e yönlendir
    if (session?.role === "couple" && session.invitationId) {
      return NextResponse.redirect(new URL("/panel", req.url));
    }
    // Session yoksa veya public landing page için next()
    return NextResponse.next();
  }

  // Protected routes
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin routes — only super_admin (not impersonating)
  if (pathname.startsWith("/admin")) {
    if (session.role !== "super_admin" || session.impersonatorId) {
      return NextResponse.redirect(new URL("/panel", req.url));
    }
  }

  // Couple panel — couples and impersonating admins
  if (pathname.startsWith("/panel")) {
    if (session.role === "super_admin" && !session.impersonatorId) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (!session.invitationId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // API admin routes
  if (pathname.startsWith("/api/admin")) {
    // Impersonation çıkışına izin ver
    if (session.impersonatorId && pathname.includes("/impersonate/exit")) {
      return NextResponse.next();
    }
    if (session.role !== "super_admin" || session.impersonatorId) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }
  }

  // API couple routes
  if (pathname.startsWith("/api/couple")) {
    if (session.role === "super_admin" && !session.impersonatorId) {
      return NextResponse.json({ error: "Çift API'si için çift hesabı gerekli." }, { status: 403 });
    }
    if (!session.invitationId) {
      return NextResponse.json({ error: "Davetiye bulunamadı." }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
