import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { hashPassword } from "@/lib/auth/password";

/**
 * İlk kurulum: Sahra super admin hesabı oluşturur.
 * Sadece hiç super_admin yoksa çalışır.
 * Body: { username, password, secret }
 * secret = SEED_SECRET env veya "sahra-setup-2026"
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const existing = await User.findOne({ role: "super_admin" });
    if (existing) {
      return NextResponse.json({ error: "Super admin zaten mevcut." }, { status: 409 });
    }

    const { username, password, secret } = await req.json();
    const expectedSecret = process.env.SEED_SECRET || "sahra-setup-2026";

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Geçersiz seed secret." }, { status: 403 });
    }
    if (!username || !password || password.length < 6) {
      return NextResponse.json({ error: "Geçerli kullanıcı adı ve şifre (min 6) gerekli." }, { status: 400 });
    }

    const user = await User.create({
      username: username.toLowerCase().trim(),
      passwordHash: await hashPassword(password),
      role: "super_admin",
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Sahra admin hesabı oluşturuldu.",
      username: user.username,
    }, { status: 201 });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed işlemi başarısız." }, { status: 500 });
  }
}
