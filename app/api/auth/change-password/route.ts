import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { requireAuth, handleAuthError } from "@/lib/auth/authorization";
import { logAudit } from "@/lib/models/AuditLog";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    // Sadece super_admin şifre değiştirebilir; çiftler bu endpoint'i kullanamaz
    if (session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Şifre değişikliği yalnızca Sahra Admin tarafından yapılabilir." },
        { status: 403 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Mevcut ve yeni şifre gerekli." }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Yeni şifreler eşleşmiyor." }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.userId).select("+passwordHash");
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 401 });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    await logAudit({
      userId: session.userId,
      username: session.username,
      invitationId: session.invitationId,
      action: "password_changed",
      details: "Kullanıcı şifresini değiştirdi",
    });

    return NextResponse.json({ success: true, message: "Şifreniz başarıyla güncellendi." });
  } catch (err) {
    return handleAuthError(err);
  }
}
