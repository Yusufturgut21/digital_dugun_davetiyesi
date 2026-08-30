import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models/AuditLog";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";

export async function GET(req: Request) {
  try {
    await requireSuperAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(
      logs.map((l) => ({
        id: l._id.toString(),
        userId: l.userId?.toString(),
        username: l.username,
        invitationId: l.invitationId?.toString(),
        action: l.action,
        details: l.details,
        createdAt: l.createdAt?.toISOString?.() ?? l.createdAt,
      }))
    );
  } catch (err) {
    return handleAuthError(err);
  }
}
