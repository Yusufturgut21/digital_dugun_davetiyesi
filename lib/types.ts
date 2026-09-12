export type SealType = "ottoman" | "gold-wax" | "burgundy-wax" | "classic" | "minimal";
export type InvitationDesign = "ottoman" | "classic" | "minimal" | "gold-premium" | "cream-vintage";
export type Theme = "cream-gold" | "ottoman-premium" | "minimal-white" | "beige-gold" | "dark-premium" | "simple-elegant";
export type ConjunctionType = "&" | "ve";

export interface StoryItem {
  year: string;
  title: string;
  desc: string;
  icon: string;
  side: "left" | "right";
  highlight?: boolean;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ProgramItem {
  time: string;
  title: string;
  desc: string;
  icon: string;
}

export interface WeddingInvitation {
  id: string;
  slug: string;

  // Çift bilgileri
  brideName: string;
  groomName: string;
  brideSurname?: string;
  groomSurname?: string;
  conjunction: ConjunctionType;

  // Düğün bilgileri
  weddingDate: string; // ISO date string
  weddingTime: string;
  venueName: string;
  address: string;
  city: string;
  district: string;
  mapUrl?: string;

  // Davet metni
  invitationText: string;

  // Manevi içerik
  showBesmele: boolean;
  showAyet: boolean;
  showHadis: boolean;
  duaText?: string;
  religiousSource?: string;
  
  // Sade & Zarif tema için özel alanlar
  islamicQuoteArabic?: string;
  islamicQuoteTurkish?: string;
  islamicQuoteSource?: string;
  showIslamicQuote?: boolean;

  // Mühür
  sealType: SealType;
  sealImage?: string; // base64 or url
  sealMonogram?: string;

  // Davet mektubu
  invitationDesign: InvitationDesign;
  invitationImage?: string;

  // Fotoğraflar
  coverImage?: string;
  galleryImages: string[];

  // Ses
  sealSound?: string;
  envelopeSound?: string;
  backgroundSound?: string;
  soundEnabled: boolean;
  soundVolume: number; // 0-100

  // Hikaye
  storySectionSubtitle?: string;
  storySectionTitle?: string;
  storyItems: StoryItem[];

  // Galeri başlıkları
  gallerySectionSubtitle?: string;
  gallerySectionTitle?: string;

  // FAQ
  faqItems: FAQItem[];

  // Program
  programItems: ProgramItem[];

  // Müşteri hashtag
  socialHashtag?: string;

  // Tema
  theme: Theme;

  // Section Görünürlüğü
  showStorySection?: boolean;
  showGallerySection?: boolean;
  showWeddingGallerySection?: boolean;
  showDetailsSection?: boolean;
  showMapSection?: boolean;
  showProgramSection?: boolean;
  showRSVPSection?: boolean;
  showFAQSection?: boolean;
  showSocialSection?: boolean;

  // Durum
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateInvitationInput = Omit<WeddingInvitation, "id" | "slug" | "createdAt" | "updatedAt">;

// ========== DÜĞÜN SALONU WEB SİTESİ TYPES ==========

export interface VenuePackage {
  name: string;
  description: string;
  price?: string;
  features: string[];
  highlighted?: boolean;
}

export interface VenueFeature {
  icon: string;
  title: string;
  description: string;
}

export interface VenueWebsite {
  id: string;
  slug: string;

  // Temel Bilgiler
  venueName: string;
  tagline: string; // Kısa tanıtım cümlesi
  description: string; // Detaylı açıklama
  
  // İletişim
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  mapUrl?: string;
  instagramUrl?: string;
  
  // Görseller
  heroImage?: string; // Ana görsel
  heroVideo?: string; // Ana video URL
  galleryImages: string[]; // Salon galerisi
  realWeddingImages: string[]; // Gerçek düğünlerden fotoğraflar
  
  // Özellikler
  capacity: {
    min: number;
    max: number;
  };
  features: VenueFeature[];
  packages: VenuePackage[];
  
  // SEO & Sosyal
  metaTitle?: string;
  metaDescription?: string;
  
  // Durum
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateVenueWebsiteInput = Omit<VenueWebsite, "id" | "slug" | "createdAt" | "updatedAt">;
