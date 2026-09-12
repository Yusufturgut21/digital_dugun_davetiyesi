import mongoose, { Schema, Document } from "mongoose";
import { VenueWebsite } from "../types";

export interface VenueWebsiteDocument extends Omit<VenueWebsite, "id">, Document {}

const VenueFeatureSchema = new Schema(
  { icon: String, title: String, description: String },
  { _id: false }
);

const VenuePackageSchema = new Schema(
  {
    name: String,
    description: String,
    price: String,
    features: [String],
    highlighted: Boolean,
  },
  { _id: false }
);

const CapacitySchema = new Schema(
  { min: Number, max: Number },
  { _id: false }
);

const VenueWebsiteSchema = new Schema<VenueWebsiteDocument>(
  {
    slug: { type: String, required: true, unique: true },
    venueName: { type: String, required: true },
    tagline: String,
    description: String,
    phone: String,
    whatsapp: String,
    email: String,
    address: String,
    city: String,
    district: String,
    mapUrl: String,
    instagramUrl: String,
    heroImage: String,
    heroVideo: String,
    galleryImages: [String],
    realWeddingImages: [String],
    capacity: CapacitySchema,
    features: [VenueFeatureSchema],
    packages: [VenuePackageSchema],
    metaTitle: String,
    metaDescription: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const VenueWebsite =
  mongoose.models.VenueWebsite ||
  mongoose.model<VenueWebsiteDocument>("VenueWebsite", VenueWebsiteSchema);
