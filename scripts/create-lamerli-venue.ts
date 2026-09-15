import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const VenueWebsite = mongoose.models.VenueWebsite ||
  mongoose.model("VenueWebsite", new mongoose.Schema({}, { strict: false, timestamps: true }));

const data = {
  slug: "la-merli-event-basaksehir",
  venueName: "La Merli Event",
  tagline: "Lüksün Sınırlarını Yeniden Tanımlıyoruz",
  description: `Başakşehir'in kalbinde, Park Mavera'nın prestijli atmosferinde La Merli Event sizi bekliyor.

Modern mimarisi, koyu ve sofistike iç tasarımı ile La Merli Event; İstanbul'un en etkileyici düğün mekanlarından biri olarak öne çıkıyor. Her detayda mükemmeliyeti hedefleyen profesyonel ekibimiz, özel gününüzü kalıcı bir anıya dönüştürüyor.

Geniş kapasitesi, özel VIP salonları ve kusursuz organizasyon hizmetiyle La Merli Event, hayallerinizi gerçeğe taşıyor.`,
  phone: "05439184761",
  whatsapp: "905439184761",
  email: "info@lamerli.com",
  address: "Park Mavera 1, Kayabaşı, Evliya Çelebi Cd Sitesi, T8 Blok, 1.Kat, No:22, 34494 Başakşehir/İstanbul",
  city: "İstanbul",
  district: "Başakşehir",
  mapUrl: "https://maps.app.goo.gl/LaMerliBasaksehir",
  instagramUrl: "https://instagram.com/lamerlivent",
  heroImage: "",
  galleryImages: [],
  realWeddingImages: [],
  capacity: { min: 100, max: 600 },
  features: [
    { icon: "🖤", title: "Premium Atmosfer", description: "Koyu ve sofistike iç tasarım, eşsiz lüks deneyimi" },
    { icon: "✨", title: "Özel Dekorasyon", description: "Her düğün için kişiye özel konsept ve dekorasyon" },
    { icon: "🍽️", title: "Gala Mutfağı", description: "Usta şeflerden özel menüler ve dünya mutfağı" },
    { icon: "🎵", title: "Pro Ses & Işık", description: "Profesyonel DJ, ses ve ışık show sistemi" },
    { icon: "🚗", title: "Vale Hizmeti", description: "Konuklarınız için ücretsiz vale park hizmeti" },
    { icon: "💎", title: "VIP Lounge", description: "Gelin ve damat için özel hazırlık ve VIP alanları" },
    { icon: "📸", title: "Sinematik Köşeler", description: "Profesyonel fotoğraf ve video için özel tasarım noktalar" },
    { icon: "🛎️", title: "7/24 Destek", description: "Organizasyon sürecinde baştan sona profesyonel destek" },
  ],
  packages: [
    {
      name: "Prestige",
      description: "100-200 kişilik şık ve özel organizasyon",
      price: "İletişime geçin",
      features: ["Temel dekorasyon", "5 saat salon", "Kokteyl ikramı", "Ses sistemi", "Koordinatör"],
      highlighted: false,
    },
    {
      name: "Noir Elite",
      description: "200-400 kişilik premium paket",
      price: "İletişime geçin",
      features: ["Premium dekorasyon", "7 saat salon", "Açık büfe", "DJ & ışık show", "Vale hizmeti", "VIP lounge", "Fotoğrafçı koordinasyonu"],
      highlighted: true,
    },
    {
      name: "Grand Merli",
      description: "400-600 kişilik tam kapsamlı lüks",
      price: "İletişime geçin",
      features: ["Lüks tüm gece dekorasyonu", "Sınırsız salon", "Gala yemeği", "Canlı müzik", "LED dans pisti", "Özel hazırlık odası", "Video & fotoğraf", "Havai fişek"],
      highlighted: false,
    },
  ],
  metaTitle: "La Merli Event Başakşehir | Premium Düğün Organizasyonu İstanbul",
  metaDescription: "Başakşehir Park Mavera'da lüks düğün deneyimi. La Merli Event ile sofistike ve unutulmaz bir gün için hemen iletişime geçin.",
  isActive: true,
};

async function run() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("✓ MongoDB OK");
  const existing = await VenueWebsite.findOne({ slug: data.slug });
  if (existing) {
    await VenueWebsite.findOneAndUpdate({ slug: data.slug }, data);
    console.log("✓ Güncellendi");
  } else {
    await VenueWebsite.create(data);
    console.log("✓ La Merli Event oluşturuldu!");
  }
  console.log("  URL: /salon/la-merli-event-basaksehir");
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
