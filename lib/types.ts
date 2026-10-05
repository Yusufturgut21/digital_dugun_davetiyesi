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
