import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

const VenueWebsiteSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const VenueWebsite =
  mongoose.models.VenueWebsite ||
  mongoose.model("VenueWebsite", VenueWebsiteSchema);

const linaVenueData = {
  slug: "lina-davet-florya",
  venueName: "Lina Davet Florya",
  tagline: "Denizin Sesiyle, Aşkın Hikayesi Başlıyor",
  description: `İstanbul'un eşsiz Florya kıyısında, denizin büyülü atmosferinde hayallerinizin düğününü yaşayın.

Lina Davet Florya; modern mimarisi, lüks iç tasarımı ve deniz manzarasıyla İstanbul'un en prestijli düğün mekanlarından biridir. Her detayda mükemmeliyeti hedefleyen ekibimiz, özel gününüzü unutulmaz kılmak için yanınızda.

Geniş kapasitesi, profesyonel mutfağı ve 7/24 ulaşılabilir organizasyon ekibiyle hayalinizdeki düğünü gerçeğe dönüştürüyoruz.`,
  phone: "05306504148",
  whatsapp: "905306504148",
  email: "info@linadavet.com",
  address: "Şenlikköy, Çekmece İstanbul Cd No:35, 34153 Bakırköy/İstanbul",
  city: "İstanbul",
  district: "Bakırköy",
  mapUrl: "https://maps.app.goo.gl/LinaDavetFlorya",
  instagramUrl: "https://instagram.com/linadavetflorya",
  heroImage: "",
  galleryImages: [],
  realWeddingImages: [],
  capacity: { min: 150, max: 800 },
  features: [
    { icon: "🌊", title: "Deniz Manzarası", description: "Florya sahilinde eşsiz Marmara denizi manzarası" },
    { icon: "✨", title: "Lüks İç Tasarım", description: "Modern ve zarif dekorasyon ile göz alıcı atmosfer" },
    { icon: "🍽️", title: "Profesyonel Mutfak", description: "Usta şeflerden özel menüler, dünya mutfağından seçkiler" },
    { icon: "🎵", title: "Ses & Işık Sistemi", description: "Son teknoloji ses ve ışık altyapısı" },
    { icon: "🚗", title: "Geniş Otopark", description: "500+ araç kapasiteli ücretsiz kapalı otopark" },
    { icon: "💐", title: "Özel Organizasyon", description: "Deneyimli ekibimizle her detay titizlikle planlanır" },
    { icon: "📸", title: "Fotoğraf Köşeleri", description: "Özel tasarlanmış Instagram'lık fotoğraf noktaları" },
    { icon: "🛎️", title: "VIP Lounge", description: "Gelin-damat ve ailelere özel VIP hazırlık odaları" },
  ],
  packages: [
    {
      name: "Deniz Esintisi",
      description: "150-250 kişilik, sade ve şık organizasyon",
      price: "İletişime geçin",
      features: [
        "Temel dekorasyon paketi",
        "5 saatlik salon kullanımı",
        "Kokteyl ikramı",
        "Ses sistemi",
        "Standart aydınlatma",
        "Organizasyon koordinatörü",
      ],
      highlighted: false,
    },
    {
      name: "Florya Premium",
      description: "250-500 kişilik, premium hizmet paketi",
      price: "İletişime geçin",
      features: [
        "Premium çiçek dekorasyonu",
        "7 saatlik salon kullanımı",
        "Açık büfe yemek",
        "Canlı müzik (2 saat)",
        "Profesyonel ışık show",
        "Gelin arabası",
        "VIP lounge",
        "Fotoğrafçı koordinasyonu",
      ],
      highlighted: true,
    },
    {
      name: "Grand Lina",
      description: "500-800 kişilik, tam kapsamlı lüks paket",
      price: "İletişime geçin",
      features: [
        "Lüks tüm gece dekorasyonu",
        "Sınırsız salon kullanımı",
        "Gala akşam yemeği",
        "Canlı orkestra",
        "LED dans pisti & özel ışık show",
        "Gelin & damat odası",
        "Kokteyl & karşılama alanı",
        "Düğün fotoğrafçısı & video",
        "Gelinlik & smokin alanı",
        "Özel havai fişek",
      ],
      highlighted: false,
    },
  ],
  metaTitle: "Lina Davet Florya | Deniz Kenarında Düğün Organizasyonu İstanbul",
  metaDescription: "İstanbul Florya'nın eşsiz deniz manzarasında hayalinizdeki düğünü yaşayın. Lina Davet Florya ile unutulmaz bir gün için hemen iletişime geçin.",
  isActive: true,
};

async function createLinaVenue() {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log("✓ MongoDB bağlantısı başarılı");

    const existing = await VenueWebsite.findOne({ slug: "lina-davet-florya" });
    if (existing) {
      console.log("⚠️  Lina Davet Florya zaten mevcut, güncelleniyor...");
      await VenueWebsite.findOneAndUpdate({ slug: "lina-davet-florya" }, linaVenueData);
      console.log("✓ Güncellendi!");
    } else {
      await VenueWebsite.create(linaVenueData);
      console.log("✓ Lina Davet Florya başarıyla oluşturuldu!");
    }

    console.log("  URL: /salon/lina-davet-florya");
    process.exit(0);
  } catch (err) {
    console.error("❌ Hata:", err);
    process.exit(1);
  }
}

createLinaVenue();
