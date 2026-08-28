export type SealType = "ottoman" | "gold-wax" | "burgundy-wax" | "classic" | "minimal";
export type InvitationDesign = "ottoman" | "classic" | "minimal" | "gold-premium" | "cream-vintage";
export type Theme = "cream-gold" | "ottoman-premium" | "minimal-white" | "beige-gold" | "dark-premium";
export type ConjunctionType = "&" | "ve";

export interface StoryItem {
  year: string;
  title: string;
  desc: string;
  icon: string;
  side: "left" | "right";
  highlight?: boolean;
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
  storyItems: StoryItem[];

  // Tema
  theme: Theme;

  // Durum
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateInvitationInput = Omit<WeddingInvitation, "id" | "slug" | "createdAt" | "updatedAt">;
