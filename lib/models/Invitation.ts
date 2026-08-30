import mongoose, { Schema, Document } from "mongoose";
import { WeddingInvitation } from "../types";

export interface InvitationDocument extends Omit<WeddingInvitation, "id">, Document {}

const StoryItemSchema = new Schema({ year: String, title: String, desc: String, icon: String, side: String, highlight: Boolean }, { _id: false });
const FAQItemSchema = new Schema({ q: String, a: String }, { _id: false });
const ProgramItemSchema = new Schema({ time: String, title: String, desc: String, icon: String }, { _id: false });

const InvitationSchema = new Schema<InvitationDocument>(
  {
    slug: { type: String, required: true, unique: true },
    brideName: { type: String, required: true },
    groomName: { type: String, required: true },
    brideSurname: String,
    groomSurname: String,
    conjunction: { type: String, default: "&" },
    weddingDate: String,
    weddingTime: String,
    venueName: String,
    address: String,
    city: String,
    district: String,
    mapUrl: String,
    invitationText: String,
    showBesmele: { type: Boolean, default: true },
    showAyet: { type: Boolean, default: true },
    showHadis: { type: Boolean, default: false },
    duaText: String,
    religiousSource: String,
    islamicQuoteArabic: String,
    islamicQuoteTurkish: String,
    islamicQuoteSource: String,
    showIslamicQuote: { type: Boolean, default: true },
    sealType: { type: String, default: "gold-wax" },
    sealImage: String,
    sealMonogram: String,
    invitationDesign: { type: String, default: "classic" },
    invitationImage: String,
    coverImage: String,
    galleryImages: [String],
    sealSound: String,
    envelopeSound: String,
    backgroundSound: String,
    soundEnabled: { type: Boolean, default: true },
    soundVolume: { type: Number, default: 50 },
    storySectionSubtitle: String,
    storySectionTitle: String,
    gallerySectionSubtitle: String,
    gallerySectionTitle: String,
    storyItems: [StoryItemSchema],
    faqItems: [FAQItemSchema],
    programItems: [ProgramItemSchema],
    theme: { type: String, default: "cream-gold" },
    showStorySection: { type: Boolean, default: true },
    showGallerySection: { type: Boolean, default: true },
    showWeddingGallerySection: { type: Boolean, default: true },
    showDetailsSection: { type: Boolean, default: true },
    showMapSection: { type: Boolean, default: true },
    showProgramSection: { type: Boolean, default: true },
    showRSVPSection: { type: Boolean, default: true },
    showFAQSection: { type: Boolean, default: true },
    showSocialSection: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Invitation =
  mongoose.models.Invitation ||
  mongoose.model<InvitationDocument>("Invitation", InvitationSchema);
