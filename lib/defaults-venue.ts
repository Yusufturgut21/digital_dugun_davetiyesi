import { CreateVenueWebsiteInput } from "./types";

export const defaultVenueData: CreateVenueWebsiteInput = {
  venueName: "Sahra Düğün Salonu",
  tagline: "Hayalinizdeki düğün burada gerçek oluyor",
  description: `Sahra Düğün Salonu olarak, en özel gününüzü unutulmaz kılmak için buradayız. 

Modern mimarisi, zarif tasarımı ve profesyonel hizmet anlayışı ile düğününüzü hayallerinizden de güzel hale getiriyoruz.

Geniş açık alanlarımız, şık dekorasyonumuz ve deneyimli ekibimizle her detayı sizin için özenle planlıyor ve kusursuz bir organizasyon sunuyoruz.`,
  
  phone: "0532 123 45 67",
  whatsapp: "905321234567",
  email: "info@sahradugunsalonu.com",
  address: "Örnek Mahallesi, Düğün Caddesi No:123",
  city: "İstanbul",
  district: "Kadıköy",
  mapUrl: "https://maps.google.com",
  instagramUrl: "https://instagram.com/sahradugunsalonu",
  
  heroImage: "https://images.unsplash.com/photo-1519167758481-83f29da8c3f8?w=1920",
  heroVideo: "",
  galleryImages: [
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800",
  ],
  realWeddingImages: [
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
    "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
  ],
  
  capacity: {
    min: 200,
    max: 800,
  },
  
  features: [
    {
      icon: "Sparkles",
      title: "Modern Tasarım",
      description: "Son trendleri takip eden modern ve şık iç mekan tasarımı",
    },
    {
      icon: "Music",
      title: "Profesyonel Ses Sistemi",
      description: "Yüksek kaliteli ses ve ışık sistemi ile kusursuz atmosfer",
    },
    {
      icon: "Utensils",
      title: "Gourmet Menü",
      description: "Deneyimli şeflerimizin hazırladığı özel menü seçenekleri",
    },
    {
      icon: "Camera",
      title: "Fotoğraf Alanları",
      description: "Profesyonel çekim için özel tasarlanmış fotoğraf köşeleri",
    },
    {
      icon: "Wind",
      title: "Klima Sistemi",
      description: "Her mevsim konforlu bir ortam için merkezi klima",
    },
    {
      icon: "Car",
      title: "Otopark",
      description: "Misafirleriniz için geniş ve güvenli kapalı otopark alanı",
    },
  ],
  
  packages: [
    {
      name: "Standart Paket",
      description: "Temel ihtiyaçlarınız için ideal başlangıç paketi",
      price: "₺45.000",
      features: [
        "Salon Kirası",
        "Masa & Sandalye Düzeni",
        "Temel Dekorasyon",
        "Ses Sistemi",
        "Valet Hizmeti",
      ],
      highlighted: false,
    },
    {
      name: "Premium Paket",
      description: "En çok tercih edilen paketimiz",
      price: "₺75.000",
      features: [
        "Standart Paket +",
        "Premium Dekorasyon",
        "Işık Gösterisi",
        "Kokteyl İkramı",
        "Profesyonel Fotoğrafçı",
        "Gelin Arabası",
      ],
      highlighted: true,
    },
    {
      name: "VIP Paket",
      description: "Sınırsız lüks ve konfor",
      price: "₺120.000",
      features: [
        "Premium Paket +",
        "Özel Tasarım Dekorasyon",
        "Canlı Müzik",
        "Videograf",
        "Gelin Damat Suit",
        "Limuzin Hizmeti",
        "Pasta & Tatlı",
      ],
      highlighted: false,
    },
  ],
  
  isActive: true,
};
