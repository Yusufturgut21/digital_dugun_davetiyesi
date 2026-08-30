import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";
import { User } from "@/lib/models/User";
import { RSVP } from "@/lib/models/RSVP";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";
import { hashPassword } from "@/lib/auth/password";
import { generateUniqueSlug } from "@/lib/slug";
import { SAHRA_VENUE_FIELDS } from "@/lib/constants/sahra";
import { EMPTY_INVITATION } from "@/lib/defaults";
import { serializeInvitation } from "@/lib/invitation-utils";
import { logAudit } from "@/lib/models/AuditLog";

interface CoupleListItem {
  brideName?: string;
  groomName?: string;
  username?: string;
  weddingDate?: string;
  isActive?: boolean;
  userStatus?: string;
  [key: string]: unknown;
}

export async function GET(req: Request) {
  try {
    await requireSuperAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const status = searchParams.get("status");
    const upcoming = searchParams.get("upcoming") === "true";

    const invitations = await Invitation.find().sort({ createdAt: -1 }).lean();
    const users = await User.find({ role: "couple" }).lean();
    const userByInv = new Map(users.map((u) => [u.invitationId?.toString(), u]));

    let result: CoupleListItem[] = invitations.map((inv) => {
      const user = userByInv.get(inv._id.toString());
      return {
        ...serializeInvitation(inv as Record<string, unknown>),
        username: user?.username,
        userId: user?._id?.toString(),
        userStatus: user?.status ?? "inactive",
      };
    });

    if (search) {
      result = result.filter(
        (c) =>
          c.brideName?.toLowerCase().includes(search) ||
          c.groomName?.toLowerCase().includes(search) ||
          c.username?.toLowerCase().includes(search)
      );
    }

    if (status === "active") result = result.filter((c) => c.isActive && c.userStatus === "active");
    if (status === "inactive") result = result.filter((c) => !c.isActive || c.userStatus === "inactive");

    if (upcoming) {
      const now = new Date();
      result = result.filter((c) => c.weddingDate && new Date(c.weddingDate) >= now);
      result.sort((a, b) => new Date(a.weddingDate!).getTime() - new Date(b.weddingDate!).getTime());
    }

    return NextResponse.json(result);
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    await connectDB();

    const body = await req.json();
    const {
      username, password, confirmPassword,
      brideName, brideSurname, groomName, groomSurname,
      weddingDate, weddingTime, conjunction,
      invitationText, ...rest
    } = body;

    if (!username || !password || !brideName || !groomName) {
      return NextResponse.json({ error: "Kullanıcı adı, şifre, gelin ve damat adı zorunlu." }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Şifreler eşleşmiyor." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: "Bu kullanıcı adı zaten kullanılıyor." }, { status: 409 });
    }

    const slug = await generateUniqueSlug(groomName, brideName, async (s) =>
      Boolean(await Invitation.exists({ slug: s }))
    );

    const inv = await Invitation.create({
      ...EMPTY_INVITATION,
      ...rest,
      ...SAHRA_VENUE_FIELDS,
      brideName,
      brideSurname: brideSurname ?? "",
      groomName,
      groomSurname: groomSurname ?? "",
      conjunction: conjunction ?? "&",
      weddingDate: weddingDate ?? "",
      weddingTime: weddingTime ?? "15:00",
      invitationText: invitationText ?? EMPTY_INVITATION.invitationText,
      slug,
      isActive: true,
    });

    const user = await User.create({
      username: username.toLowerCase().trim(),
      passwordHash: await hashPassword(password),
      role: "couple",
      invitationId: inv._id,
      status: "active",
    });

    await logAudit({
      userId: session.userId,
      username: session.username,
      invitationId: inv._id.toString(),
      action: "couple_created",
      details: `${groomName} & ${brideName} (${username})`,
    });

    return NextResponse.json({
      invitation: serializeInvitation(inv.toObject() as Record<string, unknown>),
      user: { id: user._id.toString(), username: user.username },
    }, { status: 201 });
  } catch (err) {
    return handleAuthError(err);
  }
}
