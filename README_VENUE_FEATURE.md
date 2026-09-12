# Düğün Salonu Web Sitesi Özelliği

## 📋 Özet

Mevcut dijital düğün davetiyesi sistemine **ek modül** olarak "Düğün Salonu Web Sitesi" özelliği başarıyla eklenmiştir. İki sistem birbirinden bağımsız çalışmakta ancak aynı altyapı ve yönetim panelini kullanmaktadır.

## ✨ Özellikler

### Düğün Salonu Web Sitesi

#### Ziyaretçi Tarafı (Public)
- **Ana Sayfa (Hero)**: Video veya görsel arka plan, salon adı, slogan, WhatsApp ve telefon CTA butonları
- **Hakkımızda**: Salon açıklaması ve kapasite bilgisi
- **Salon Galerisi**: Lightbox özelliği ile fotoğraf galerisi
- **Özellikler**: İkon ile öne çıkan salon özellikleri (klima, otopark, ses sistemi vb.)
- **Düğün Paketleri**: Standart, Premium, VIP paket seçenekleri ve fiyatlandırma
- **Gerçek Düğünlerden Kareler**: Salonunuzda yapılan düğünlerden fotoğraflar
- **Dijital Davetiye Tanıtımı**: Ana hizmetimiz olan dijital davetiye özelliğine yönlendirme
- **Konum**: Google Maps entegrasyonu ve adres bilgisi
- **İletişim**: Telefon, WhatsApp, e-posta, Instagram bağlantıları

#### Yönetim Paneli
Admin paneline "Düğün Salonları" menüsü eklenmiştir.

**Yönetim İşlevleri:**
- Salon listesi görüntüleme
- Yeni salon ekleme
- Salon düzenleme
- Salon silme
- Salon önizleme
- Aktif/Pasif durumu

**Düzenlenebilir Alanlar:**
- Temel bilgiler (ad, slogan, açıklama)
- İletişim bilgileri (telefon, WhatsApp, e-posta, Instagram)
- Adres ve konum (Google Maps)
- Görseller (hero görsel/video, galeri, gerçek düğün fotoğrafları)
- Kapasite (min-max kişi)
- Özellikler (ikon, başlık, açıklama)
- Paketler (ad, açıklama, fiyat, özellikler)
- SEO ayarları
- Durum (aktif/pasif)

### Landing Page (Ana Sayfa)
Daha önce direkt login'e yönlendirilen ana sayfa (/) artık bir tanıtım sayfası:
- İki ana hizmet tanıtımı: Dijital Davetiye ve Düğün Salonu
- Modern ve profesyonel tasarım
- WhatsApp iletişim butonu
- Özellikler bölümü

## 🗂️ Dosya Yapısı

### Yeni Eklenen Dosyalar

```
wedding-invitation/
├── app/
│   ├── salon/[slug]/page.tsx          # Salon web sitesi sayfası
│   ├── admin/venues/
│   │   ├── page.tsx                   # Salon listesi
│   │   └── [id]/page.tsx             # Salon düzenleme
│   └── api/venues/
│       ├── route.ts                   # Salon CRUD endpoints
│       ├── [id]/route.ts             # Tekil salon işlemleri
│       └── by-slug/[slug]/route.ts   # Slug ile salon getirme
├── components/
│   ├── LandingPage.tsx               # Ana tanıtım sayfası
│   ├── admin/VenueForm.tsx           # Salon düzenleme formu
│   └── venue/
│       ├── VenueWebsitePage.tsx     # Ana venue page container
│       ├── VenueHero.tsx            # Hero section
│       ├── VenueAbout.tsx           # Hakkımızda
│       ├── VenueGallery.tsx         # Galeri
│       ├── VenueFeatures.tsx        # Özellikler
│       ├── VenuePackages.tsx        # Paketler
│       ├── VenueRealWeddings.tsx    # Gerçek düğünler
│       ├── VenueInvitationPromo.tsx # Davetiye tanıtımı
│       ├── VenueMap.tsx             # Konum
│       └── VenueContact.tsx         # İletişim
├── lib/
│   ├── models/VenueWebsite.ts        # MongoDB model
│   ├── defaults-venue.ts             # Örnek salon verisi
│   └── types.ts                      # VenueWebsite type'ları eklendi
└── scripts/
    └── create-sample-venue.ts        # Örnek salon oluşturma script'i
```

### Güncellenen Dosyalar
- `app/page.tsx`: Landing page'e yönlendirme
- `app/admin/page.tsx`: Venue istatistikleri eklendi
- `components/admin/AdminShell.tsx`: Menüye "Düğün Salonları" eklendi
- `lib/types.ts`: VenueWebsite type'ları eklendi
- `middleware.ts`: `/salon/*` ve `/api/venues` public yapıldı
- `package.json`: `create-sample-venue` script'i ve `tsx` dependency eklendi
- `app/api/admin/dashboard/route.ts`: Venue istatistikleri eklendi

## 🚀 Kurulum ve Kullanım

### 1. Bağımlılıkları Yükleme
```bash
cd wedding-invitation
npm install
```

### 2. Örnek Salon Verisi Oluşturma
```bash
npm run create-sample-venue
```

Bu komut `Sahra Düğün Salonu` adında örnek bir salon oluşturur:
- Slug: `sahra-dugun-salonu`
- URL: `http://localhost:3000/salon/sahra-dugun-salonu`

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```

### 4. Erişim

**Landing Page:**
```
http://localhost:3000
```

**Örnek Salon:**
```
http://localhost:3000/salon/sahra-dugun-salonu
```

**Admin Panel:**
```
http://localhost:3000/admin
→ Düğün Salonları menüsü
```

## 🎨 Tasarım Özellikleri

### Mobil Öncelikli
- Responsive tasarım
- Touch-friendly butonlar
- Mobil optimized galeri
- Kolay erişilebilir WhatsApp butonu

### Modern & Premium
- Gradient arka planlar
- Hover efektleri
- Smooth transitions
- Profesyonel tipografi
- Clean layout

### Satış Odaklı
- Öne çıkan CTA butonları (WhatsApp, Telefon)
- Güven veren tasarım
- Net fiyatlandırma (opsiyonel)
- Sosyal kanıt (gerçek düğün fotoğrafları)

## 📊 Veri Modeli

```typescript
interface VenueWebsite {
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
```

## 🔧 API Endpoints

### Public (Herkes Erişebilir)
- `GET /api/venues` - Tüm salonları listele
- `GET /api/venues/by-slug/:slug` - Slug ile salon getir

### Protected (Admin Yetkisi Gerekli)
- `POST /api/venues` - Yeni salon oluştur
- `GET /api/venues/:id` - ID ile salon detayı
- `PUT /api/venues/:id` - Salon güncelle
- `DELETE /api/venues/:id` - Salon sil

## ✅ Kontrol Listesi

- [x] VenueWebsite veri modeli oluşturuldu
- [x] MongoDB schema tanımlandı
- [x] API endpoints oluşturuldu
- [x] Salon web sitesi frontend bileşenleri
- [x] Admin panel entegrasyonu
- [x] Salon yönetim formu
- [x] Landing page tasarımı
- [x] Mobil responsive tasarım
- [x] WhatsApp entegrasyonu
- [x] Google Maps entegrasyonu
- [x] Lightbox galeri özelliği
- [x] SEO metadata desteği
- [x] Middleware güncellemesi
- [x] Dashboard istatistikleri
- [x] Örnek veri oluşturma script'i

## 🎯 Gelecek Geliştirmeler (İsteğe Bağlı)

- [ ] Görsel yükleme entegrasyonu (Cloudinary/S3)
- [ ] Rezervasyon formu
- [ ] Yorum/değerlendirme sistemi
- [ ] Çoklu dil desteği
- [ ] Analytics entegrasyonu
- [ ] Blog/haberler bölümü
- [ ] Video galeri
- [ ] 360° tur özelliği
- [ ] Fiyat hesaplama modülü
- [ ] E-posta bildirimleri

## 🔒 Güvenlik

- Venue API'leri slug bazlı public erişim (sadece isActive: true)
- Admin işlemleri JWT token ve role kontrolü ile korumalı
- Input validasyonu
- XSS koruması (React otomatik escape)
- SQL Injection koruması (Mongoose ORM)

## 📱 Ekran Görünümleri

### Mobil
- Hero: Full screen, büyük CTA butonları
- Galeri: 2 sütun grid
- Paketler: Tek sütun, scrollable
- İletişim: Sticky WhatsApp butonu

### Desktop
- Hero: Centered content, geniş layout
- Galeri: 4 sütun grid
- Paketler: 3 sütun grid
- Tüm bölümler optimize edilmiş spacing

## 🤝 Mevcut Sistem ile Uyumluluk

**Hiçbir Mevcut Özellik Bozulmadı:**
- ✅ Dijital davetiye sistemi aynen çalışıyor
- ✅ Mevcut davetiye verileri korundu
- ✅ Panel erişimleri değişmedi
- ✅ API route'ları conflict yaratmıyor
- ✅ Middleware uyumlu
- ✅ MongoDB koleksiyonları ayrı

**Paylaşılan Kaynaklar:**
- MongoDB bağlantısı
- Admin layout ve shell
- API client utilities
- Slug generation fonksiyonu
- Auth middleware

## 📝 Notlar

1. **WhatsApp Numarası**: Landing page ve örnek veride bulunan WhatsApp numarasını kendi numaranızla değiştirin.

2. **Görseller**: Örnek veride Unsplash görselleri kullanılmıştır. Kendi görsellerinizi yükleyip URL'leri güncelleyin.

3. **Google Maps**: `mapUrl` alanına Google Maps embed URL'i ekleyin.

4. **Çoklu Salon**: Sistem çoklu salon desteğine sahiptir. Her salonu farklı bir slug ile oluşturabilirsiniz.

5. **SEO**: Her salon için özel meta title ve description ayarlayabilirsiniz.

## 🎉 Sonuç

Düğün salonu web sitesi özelliği başarıyla entegre edilmiştir. Sistem modüler yapısı sayesinde kolayca genişletilebilir ve bakım yapılabilir durumdadır.
