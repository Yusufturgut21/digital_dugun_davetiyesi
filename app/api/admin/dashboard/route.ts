import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/lib/models/Invitation";
import { User } from "@/lib/models/User";
import { RSVP } from "@/lib/models/RSVP";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";

export async function GET() {
  try {
    await requireSuperAdmin();
    await connectDB();

    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      totalCouples,
      activeCouples,
      inactiveCouples,
      totalRsvp,
      upcomingWeddings,
      recentCouples,
    ] = await Promise.all([
      Invitation.countDocuments(),
      Invitation.countDocuments({ isActive: true }),
      Invitation.countDocuments({ isActive: false }),
      RSVP.countDocuments(),
      Invitation.find({
        weddingDate: { $gte: now.toISOString().split("T")[0], $lte: thirtyDays.toISOString().split("T")[0] },
        isActive: true,
      }).sort({ weddingDate: 1 }).limit(5).lean(),
      Invitation.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const activeUsers = await User.countDocuments({ role: "couple", status: "active" });

    return NextResponse.json({
      stats: {
        totalCouples,
        totalInvitations: totalCouples,
        activeCouples,
        inactiveCouples: totalCouples - activeCouples,
        activeUsers,
        totalRsvp,
        upcomingCount: upcomingWeddings.length,
      },
      upcomingWeddings: upcomingWeddings.map((inv) => ({
        id: inv._id.toString(),
        groomName: inv.groomName,
        brideName: inv.brideName,
        weddingDate: inv.weddingDate,
        slug: inv.slug,
      })),
      recentCouples: recentCouples.map((inv) => ({
        id: inv._id.toString(),
        groomName: inv.groomName,
        brideName: inv.brideName,
        createdAt: inv.createdAt,
        slug: inv.slug,
      })),
    });
  } catch (err) {
    return handleAuthError(err);
  }
}
