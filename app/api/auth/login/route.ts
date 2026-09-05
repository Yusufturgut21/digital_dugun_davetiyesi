import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { SessionPayload } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, password, slug } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Kullanıcı adı ve şifre gerekli." }, { status: 400 });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() }).select("+passwordHash");
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
    }

    // Slug kontrolü - eğer slug gönderildiyse, kullanıcının o invitation'a erişimi var mı kontrol et
    if (slug && user.role === "couple") {
      const WeddingInvitation = (await import("@/lib/models/WeddingInvitation")).WeddingInvitation;
      const invitation = await WeddingInvitation.findById(user.invitationId);
      if (!invitation || invitation.slug !== slug) {
        return NextResponse.json({ error: "Bu sayfaya erişim yetkiniz yok." }, { status: 403 });
      }
    }

    if (user.status === "inactive") {
      return NextResponse.json({ error: "Hesabınız pasif durumda. Lütfen Sahra Düğün Salonu ile iletişime geçin." }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
    }

    const payload: SessionPayload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      invitationId: user.invitationId?.toString(),
    };

    await setSessionCookie(payload);

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
        invitationId: user.invitationId?.toString(),
      },
      redirect: user.role === "super_admin" ? "/admin" : "/panel",
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Giriş sırasında bir hata oluştu." }, { status: 500 });
  }
}
