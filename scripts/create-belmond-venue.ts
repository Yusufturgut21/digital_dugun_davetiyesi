// Load environment variables first
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

// Now import other modules
import { connectDB } from "../lib/mongodb";
import { VenueWebsite } from "../lib/models/VenueWebsite";
import { generateSlug } from "../lib/slug";

async function createBelmondVenue() {
  try {
    await connectDB();
    console.log("✓ MongoDB bağlantısı başarılı");

    // Check if venue already exists
    const existingVenue = await VenueWebsite.findOne({ venueName: "BELMOND Kır Düğün Salonu" });
    
    if (existingVenue) {
      console.log("✓ BELMOND salonu zaten mevcut");
      console.log("  Güncelleniyor...");
      await VenueWebsite.findByIdAndUpdate(existingVenue._id, belmondData);
      console.log("✓ Salon güncellendi!");
      console.log("  URL: /salon/" + existingVenue.slug);
      return;
    }

    const slug = generateSlug("BELMOND Kır Düğün Salonu");
    const venue = await VenueWebsite.create({
      ...belmondData,
      slug,
    });

    console.log("✓ BELMOND salonu başarıyla oluşturuldu!");
    console.log("  Salon Adı:", venue.venueName);
    console.log("  Slug:", venue.slug);
    console.log("  URL: /salon/" + venue.slug);
    console.log("\n🎉 BELMOND Kır Düğün Salonu web sitesi hazır!");
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

const belmondData = {
  venueName: "BELMOND Kır Düğün Salonu",
  tagline: "Doğayla İç İçe Unutulmaz Düğün Deneyimi",
  description: `BELMOND Kır Düğün Salonu olarak, Diyarbakır'ın en prestijli ve modern düğün mekanlarından biriyiz. 

Geniş açık alanlarımız, zarif tasarımımız ve doğal güzelliklerle çevrili konumumuzla hayalinizdeki kır düğününü gerçekleştiriyoruz.

Modern mimarimiz ve profesyonel hizmet anlayışımızla düğününüzü unutulmaz kılmak için buradayız. Balo ve konser organizasyonları için de ideal mekanımızda, her detay özenle planlanır.`,
  
  phone: "0533 671 86 97",
  whatsapp: "905336718697",
  email: "info@belmonddugunciftligi.com",
  address: "Ovabağ Diyarbakır Yolu 21010 Yenişehir",
  city: "Diyarbakır",
  district: "Sur",
  mapUrl: "https://maps.app.goo.gl/CGWpWHctqbD1yj7EA",
  instagramUrl: "https://instagram.com/belmonddugunciftligi",
  
  heroImage: "https://lh5.googleusercontent.com/p/AF1QipMqBCL5nQIEZiPPXPy9yx9xZPxjhiQEYdVLwxrT=w408-h306-k-no",
  heroVideo: "",
  
  galleryImages: [
    "https://lh5.googleusercontent.com/p/AF1QipMqBCL5nQIEZiPPXPy9yx9xZPxjhiQEYdVLwxrT=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipOW-lPk_8hs52mqxmZfE8NN0kSC8AyQ5rUfLU7V=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipNxzqX0Y0a7lqMm_1HfxQjLRt1-uXzDq5Wx47Av=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipN0kx2F8Y6_4mDsn0jPqsw8RLkYGQJR3j0BGVY-=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipPwV-YHN9YFhD_O8VbA7BvyQMbzHmAKQvwMiTLT=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipMHx5M0e1z-nKthNzxBYiSfaVUeK8xPHVqvE1TC=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipNj5fT7H_yIzS3bGqShopgxXzVQ7_kJKl8YXxvw=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipP5KqE2M3oFPZBwlYqMEqx7eZfQGhixBY5SEFM_=w408-h306-k-no",
  ],
  
  realWeddingImages: [
    "https://lh5.googleusercontent.com/p/AF1QipOdLpH2XzKCEGQfQF8g7VZXFvCpqV6FJ-0wQMXo=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipMy8xV3t8s_Bx1KJlJLBqvQ0hSDdYwNf8b0LHDA=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipPQH0vJMX7Y9hQ3_Qp1PzwrPd6aLdDsIa7HmVJt=w408-h306-k-no",
    "https://lh5.googleusercontent.com/p/AF1QipM8kJqLxBfRqsQx1fQY3ZjNBhwXzKqH_Q0YB8w_=w408-h306-k-no",
  ],
  
  capacity: {
    min: 200,
    max: 1000,
  },
  
  features: [
    {
      icon: "Trees",
      title: "Doğal Çevre",
      description: "Yeşilliklerle çevrili, doğayla iç içe muhteşem kır düğün atmosferi",
    },
    {
      icon: "Building2",
      title: "Modern Tesis",
      description: "Son teknoloji ile donatılmış modern ve şık düğün salonu",
    },
    {
      icon: "Users",
      title: "Geniş Kapasite",
      description: "200 ila 1000 kişi arası esnek kapasite seçenekleri",
    },
    {
      icon: "Music",
      title: "Profesyonel Ses & Işık",
      description: "Balo ve konser standartlarında ses ve ışık sistemi",
    },
    {
      icon: "Utensils",
      title: "Zengin Menü",
      description: "Profesyonel mutfak ve çeşitli menü seçenekleri",
    },
    {
      icon: "Car",
      title: "Geniş Otopark",
      description: "Misafirleriniz için ferah ve güvenli otopark alanı",
    },
    {
      icon: "Sparkles",
      title: "Açık Hava Alanı",
      description: "Kokteyl ve fotoğraf çekimi için geniş açık alan",
    },
    {
      icon: "Camera",
      title: "Fotoğraf Noktaları",
      description: "Doğal dekorla birleşen özel tasarım fotoğraf köşeleri",
    },
    {
      icon: "Leaf",
      title: "Bahçe Düğünü",
      description: "İsteğe göre bahçede açık hava düğün organizasyonu",
    },
  ],
  
  packages: [
    {
      name: "Ekonomik Paket",
      description: "Bütçe dostu düğün paketi",
      price: "Fiyat için arayın",
      features: [
        "Salon Kirası",
        "Masa & Sandalye Düzeni",
        "Temel Dekorasyon",
        "Açık Alan Kullanımı",
        "Otopark Hizmeti",
      ],
      highlighted: false,
    },
    {
      name: "Standart Paket",
      description: "En çok tercih edilen paketimiz",
      price: "Fiyat için arayın",
      features: [
        "Ekonomik Paket +",
        "Premium Dekorasyon",
        "Gelinin Hazırlanma Odası",
        "Kokteyl İkramı",
        "Profesyonel Garson Hizmeti",
        "Valet Hizmeti",
      ],
      highlighted: true,
    },
    {
      name: "Premium Paket",
      description: "Lüks ve özel hizmet",
      price: "Fiyat için arayın",
      features: [
        "Standart Paket +",
        "Özel Tasarım Dekorasyon",
        "Canlı Müzik Desteği",
        "Profesyonel Fotoğraf & Video",
        "Pasta & Özel Tatlılar",
        "Gelin Arabası",
        "İkinci Gün Kahvaltısı",
      ],
      highlighted: false,
    },
  ],
  
  metaTitle: "BELMOND Kır Düğün Salonu - Diyarbakır'ın En Modern Düğün Mekanı",
  metaDescription: "Doğayla iç içe, modern ve şık kır düğünü için BELMOND. Balo ve konser organizasyonları. 200-1000 kişi kapasite. Diyarbakır Sur.",
  isActive: true,
};

createBelmondVenue();
