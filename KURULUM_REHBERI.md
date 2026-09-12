# Düğün Salonu Özelliği - Hızlı Başlangıç

## 🚀 Kurulum Adımları

### 1. Bağımlılıkları Yükleyin
```bash
cd wedding-invitation
npm install
```

### 2. Örnek Salon Verisi Oluşturun
```bash
npm run create-sample-venue
```

**Çıktı:**
```
✓ MongoDB bağlantısı başarılı
✓ Örnek salon başarıyla oluşturuldu!
  Salon Adı: Sahra Düğün Salonu
  Slug: sahra-dugun-salonu
  URL: /salon/sahra-dugun-salonu

🎉 Düğün salonu web sitesi hazır!
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

### 4. Tarayıcıda Açın

**Ana Sayfa (Landing):**
```
http://localhost:3000
```

**Örnek Salon Web Sitesi:**
```
http://localhost:3000/salon/sahra-dugun-salonu
```

**Admin Panel:**
```
http://localhost:3000/admin
```
→ Menüden "Düğün Salonları"na tıklayın

---

## 📝 İlk Yapılacaklar

### 1. WhatsApp Numarasını Güncelleyin

**Landing Page:**
`wedding-invitation/components/LandingPage.tsx` dosyasında:
```typescript
// Satır ~111
href="https://wa.me/905321234567?text=..." 
```

**Örnek Salon Verisi:**
`wedding-invitation/lib/defaults-venue.ts` dosyasında:
```typescript
phone: "0532 123 45 67",
whatsapp: "905321234567",
```

### 2. Kendi Salonunuzu Oluşturun

Admin panelden:
1. `/admin` → "Düğün Salonları"
2. "Yeni Salon Ekle" butonuna tıklayın
3. Formu doldurun:
   - Temel bilgiler (ad, slogan, açıklama)
   - İletişim (telefon, WhatsApp, Instagram)
   - Adres ve konum
   - Görseller (URL'ler)
   - Kapasite
   - Özellikler
   - Paketler
4. "Kaydet"e tıklayın
5. Slug otomatik oluşturulur: `/salon/sizin-salon-adiniz`

### 3. Görselleri Güncelleyin

Örnek veride Unsplash görselleri kullanılıyor. Kendi görsellerinizi yükleyin ve URL'leri güncelleyin.

**Görsel URL'leri Nereye Girilir:**
- **Hero Görsel/Video**: Ana sayfa büyük arka plan
- **Galeri Görselleri**: Salon fotoğrafları
- **Gerçek Düğün Görselleri**: Salonunuzda yapılan düğünlerden kareler

---

## 🎯 Hızlı Test

### Test 1: Ana Sayfa
- [ ] `http://localhost:3000` açılıyor
- [ ] İki kart görünüyor: "Dijital Davetiye" ve "Düğün Salonu"
- [ ] WhatsApp butonu çalışıyor

### Test 2: Salon Web Sitesi
- [ ] `http://localhost:3000/salon/sahra-dugun-salonu` açılıyor
- [ ] Hero section görünüyor
- [ ] Hakkımızda bölümü var
- [ ] Galeri fotoğrafları tıklanabiliyor (lightbox)
- [ ] WhatsApp butonu çalışıyor
- [ ] Telefon butonu çalışıyor

### Test 3: Admin Panel
- [ ] Admin panelde "Düğün Salonları" menüsü görünüyor
- [ ] Salon listesi açılıyor
- [ ] "Yeni Salon Ekle" butonu çalışıyor
- [ ] Form açılıyor ve düzenlenebiliyor
- [ ] Kaydet butonu çalışıyor

---

## 🔧 Özelleştirme

### Renk Teması Değiştirme

Salon web sitesi `rose/pink` renk teması kullanıyor. Değiştirmek için:

**Tailwind Sınıfları:**
```
rose-50, rose-100, rose-500, rose-600
pink-50, pink-600
purple-50
```

Değiştirilecek dosyalar:
- `components/venue/*.tsx`

### Paketleri Özelleştirme

Admin panelden kolayca düzenlenebilir:
- Paket adı
- Açıklama
- Fiyat (opsiyonel)
- Özellikler listesi
- Öne çıkan paket (highlighted)

### Özellikler İkon Değiştirme

Lucide React ikonları kullanılıyor. Mevcut ikonlar:
```
Sparkles, Music, Utensils, Camera, Wind, Car, Star, Heart, Users, vb.
```

Tüm ikonlar: https://lucide.dev/icons

---

## 📱 Mobil Görünüm

Tasarım mobil öncelikli (mobile-first):
- ✅ Responsive
- ✅ Touch-friendly butonlar
- ✅ Kolay WhatsApp erişimi
- ✅ Hızlı yükleme
- ✅ Optimize edilmiş görseller

---

## ❓ Sık Sorulan Sorular

**S: Birden fazla salon ekleyebilir miyim?**  
C: Evet! Sistem çoklu salon desteğine sahip. Her salon farklı bir slug ile oluşturulur.

**S: Mevcut davetiye sistemi çalışıyor mu?**  
C: Evet, hiçbir şey bozulmadı. Davetiye sistemi aynen çalışıyor.

**S: Görselleri nereye yüklemeliyim?**  
C: Şu an URL ile ekleniyor. İleride Cloudinary veya S3 entegrasyonu eklenebilir.

**S: Salon sitesini nasıl paylaşırım?**  
C: Salon slug'ını kullanarak: `https://siteniz.com/salon/salon-slug`

**S: SEO ayarları var mı?**  
C: Evet, her salon için özel meta title ve description eklenebilir.

---

## 🎉 Başarılar!

Artık hem dijital davetiye hem de düğün salonu web sitesi özelliklerine sahipsiniz!

**İletişim ve Destek:**
- Geliştirme süreci kayıtlarda
- README_VENUE_FEATURE.md dosyasında detaylı döküman
