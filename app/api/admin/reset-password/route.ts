import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { hashPassword } from "@/lib/auth/password";

/**
 * Admin: Herhangi bir kullanıcının şifresini sıfırla
 * POST /api/admin/reset-password
 * Body: { username, newPassword }
 */
export async function POST(req: Request) {
  try {
    const token = cookies().get("sahra_session")?.value;
    const session = token ? await verifyToken(token) : null;

    // Sadece super admin erişebilir
    if (!session || session.role !== "super_admin" || session.impersonatorId) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { username, newPassword } = await req.json();

    if (!username || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Kullanıcı adı ve yeni şifre (min 6 karakter) gerekli." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // Şifreyi güncelle
    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json({
      success: true,
      message: `${username} kullanıcısının şifresi güncellendi.`,
      username: user.username,
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Şifre sıfırlama başarısız." }, { status: 500 });
  }
}
