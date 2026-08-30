import mongoose, { Schema, Document } from "mongoose";

export interface GalleryImageItem {
    id: string; // custom id like a uuid or index
    url: string;
    order: number;
}

export interface WeddingGalleryDocument extends Document {
    images: GalleryImageItem[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GalleryImageItemSchema = new Schema(
    {
        id: { type: String, required: true },
        url: { type: String, required: true },
        order: { type: Number, required: true, default: 0 },
    },
    { _id: false }
);

// We store a single document for the centralized gallery
const WeddingGallerySchema = new Schema<WeddingGalleryDocument>(
    {
        images: {
            type: [GalleryImageItemSchema],
            default: [],
            validate: [
                (val: GalleryImageItem[]) => val.length <= 8,
                "Düğün Galerisi en fazla 8 görsel içerebilir",
            ],
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const WeddingGallery =
    mongoose.models.WeddingGallery ||
    mongoose.model<WeddingGalleryDocument>("WeddingGallery", WeddingGallerySchema);
