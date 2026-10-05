// ========== AYAKKABI MAĞAZASI TYPES ==========

export type ProductCategory = "kadin" | "erkek" | "cocuk" | "spor" | "klasik" | "bot" | "sandalet";
export type ProductStatus = "active" | "inactive" | "out_of_stock";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type UserRole = "admin" | "store_manager";

export interface ProductSize {
  size: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: ProductSize[];
  colors: string[];
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductInput = Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">;

export interface OrderItem {
  productId: string;
  productName: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInfo {
  id: string;
  slug: string;
  storeName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  instagramUrl?: string;
  facebookUrl?: string;
  heroImage?: string;
  logoImage?: string;
  galleryImages: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateStoreInput = Omit<StoreInfo, "id" | "slug" | "createdAt" | "updatedAt">;


// ========== LEGACY WEDDING TYPES (kept for build compatibility) ==========

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
  brideName: string;
  groomName: string;
  brideSurname?: string;
  groomSurname?: string;
  conjunction: ConjunctionType;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  address: string;
  city: string;
  district: string;
  mapUrl?: string;
  invitationText: string;
  showBesmele: boolean;
  showAyet: boolean;
  showHadis: boolean;
  duaText?: string;
  religiousSource?: string;
  islamicQuoteArabic?: string;
  islamicQuoteTurkish?: string;
  islamicQuoteSource?: string;
  showIslamicQuote?: boolean;
  sealType: SealType;
  sealImage?: string;
  sealMonogram?: string;
  invitationDesign: InvitationDesign;
  invitationImage?: string;
  coverImage?: string;
  galleryImages: string[];
  sealSound?: string;
  envelopeSound?: string;
  backgroundSound?: string;
  soundEnabled: boolean;
  soundVolume: number;
  storySectionSubtitle?: string;
  storySectionTitle?: string;
  storyItems: StoryItem[];
  gallerySectionSubtitle?: string;
  gallerySectionTitle?: string;
  faqItems: FAQItem[];
  programItems: ProgramItem[];
  socialHashtag?: string;
  theme: Theme;
  showStorySection?: boolean;
  showGallerySection?: boolean;
  showWeddingGallerySection?: boolean;
  showDetailsSection?: boolean;
  showMapSection?: boolean;
  showProgramSection?: boolean;
  showRSVPSection?: boolean;
  showFAQSection?: boolean;
  showSocialSection?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateInvitationInput = Omit<WeddingInvitation, "id" | "slug" | "createdAt" | "updatedAt">;

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
  venueName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  mapUrl?: string;
  instagramUrl?: string;
  heroImage?: string;
  heroVideo?: string;
  galleryImages: string[];
  realWeddingImages: string[];
  capacity: { min: number; max: number };
  features: VenueFeature[];
  packages: VenuePackage[];
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateVenueWebsiteInput = Omit<VenueWebsite, "id" | "slug" | "createdAt" | "updatedAt">;
