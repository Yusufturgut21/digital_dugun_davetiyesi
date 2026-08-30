import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WeddingGallery } from "@/lib/models/WeddingGallery";
import { requireSuperAdmin, handleAuthError } from "@/lib/auth/authorization";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const gallery = await WeddingGallery.findOne().lean();
        console.log("[Gallery API GET] Found gallery:", { 
            exists: !!gallery, 
            imageCount: gallery?.images?.length || 0,
            isActive: gallery?.isActive 
        });
        if (!gallery) {
            // Default empty if not found
            return NextResponse.json({ images: [], isActive: true });
        }
        return NextResponse.json(gallery);
    } catch (err) {
        console.error("[Gallery API GET] Error:", err);
        return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const body = await req.json();
        const { images, isActive } = body;

        console.log("[Gallery API PUT] Received data:", { 
            imageCount: images?.length || 0, 
            isActive,
            firstImageSize: images?.[0]?.url?.length || 0
        });

        if (images && images.length > 8) {
            return NextResponse.json(
                { error: "Düğün Galerisi en fazla 8 görsel içerebilir." },
                { status: 400 }
            );
        }

        // Base64 görsellerin toplam boyutunu kontrol et (~12MB MongoDB sınırı)
        if (images) {
            const totalSize = images.reduce((sum: number, img: { url: string }) => sum + img.url.length, 0);
            console.log("[Gallery API PUT] Total data size:", Math.round(totalSize / 1024 / 1024 * 100) / 100, "MB");
            if (totalSize > 12 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "Görsellerin toplam boyutu çok büyük. Lütfen daha küçük görsel yükleyin." },
                    { status: 400 }
                );
            }
        }

        let gallery = await WeddingGallery.findOne();
        if (!gallery) {
            console.log("[Gallery API PUT] Creating new gallery");
            gallery = new WeddingGallery({ images: images || [], isActive: isActive !== undefined ? isActive : true });
        } else {
            console.log("[Gallery API PUT] Updating existing gallery");
            if (images) gallery.images = images;
            if (isActive !== undefined) gallery.isActive = isActive;
        }

        await gallery.save();
        console.log("[Gallery API PUT] Saved successfully:", { 
            imageCount: gallery.images.length,
            isActive: gallery.isActive 
        });
        return NextResponse.json(gallery);
    } catch (err) {
        console.error("[Gallery API PUT] Error:", err);
        return handleAuthError(err);
    }
}
