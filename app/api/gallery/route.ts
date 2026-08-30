import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WeddingGallery } from "@/lib/models/WeddingGallery";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const gallery = await WeddingGallery.findOne().lean();
        if (!gallery) {
            // Default empty if not found
            return NextResponse.json({ images: [], isActive: true });
        }
        return NextResponse.json(gallery);
    } catch (err) {
        console.error("Gallery GET error:", err);
        return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const body = await req.json();
        const { images, isActive } = body;

        if (images && images.length > 8) {
            return NextResponse.json(
                { error: "Düğün Galerisi en fazla 8 görsel içerebilir." },
                { status: 400 }
            );
        }

        let gallery = await WeddingGallery.findOne();
        if (!gallery) {
            gallery = new WeddingGallery({ images: images || [], isActive: isActive !== undefined ? isActive : true });
        } else {
            if (images) gallery.images = images;
            if (isActive !== undefined) gallery.isActive = isActive;
        }

        await gallery.save();
        return NextResponse.json(gallery);
    } catch (err) {
        return handleAuthError(err);
    }
}
