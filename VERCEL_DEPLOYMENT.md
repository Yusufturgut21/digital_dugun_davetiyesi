# 🚀 Vercel Deployment Rehberi

## ⏳ Deployment Durumu

Kod GitHub'a push edildi. Vercel otomatik olarak yeni deployment başlattı.

**Kontrol için:**
1. https://vercel.com/dashboard adresine git
2. Projenizi seç
3. Son deployment'ı kontrol et

## ✅ Deployment Sonrası Yapılacaklar

### 1. Örnek Salon Verisi Oluştur

Vercel production'da çalıştıktan sonra, örnek salon verisini oluşturmak için:

**Seçenek A: Vercel CLI ile**
```bash
vercel env pull
npm run create-sample-venue
```

**Seçenek B: Admin Panelden Manuel**
1. https://digital-dugun-davetiyesi.vercel.app/admin
2. Giriş yap
3. "Düğün Salonları" menüsüne tıkla
4. "Yeni Salon Ekle" butonuna tıkla
5. Formu doldur ve kaydet

### 2. Test Et

**Ana Sayfa:**
```
https://digital-dugun-davetiyesi.vercel.app
```
→ Landing page görünmeli

**Admin Panel:**
```
https://digital-dugun-davetiyesi.vercel.app/admin
```
→ Menüde "Düğün Salonları" görünmeli

**Salon Sayfası (örnek oluşturduktan sonra):**
```
https://digital-dugun-davetiyesi.vercel.app/salon/sahra-dugun-salonu
```

## 🔍 Sorun Giderme

### "Düğün Salonları" Menüsü Görünmüyor

**Olası Sebepler:**

1. **Cache Problemi**
   - Tarayıcı cache'ini temizle (Ctrl+Shift+R veya Cmd+Shift+R)
   - Gizli modda dene

2. **Deployment Henüz Tamamlanmadı**
   - Vercel dashboard'da deployment durumunu kontrol et
   - Build loglarını incele

3. **Build Hatası**
   - Vercel deployment logs'unu kontrol et
   - Hata varsa burada görünür

### Build Log'ları Kontrol

Vercel dashboard → Deployment → View Function Logs

Aranacak şeyler:
- ✅ "Build Completed"
- ✅ TypeScript compilation successful
- ✅ No errors

### MongoDB Bağlantı Kontrol

Environment variables doğru mu?
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - JWT token için secret key

## 📝 Notlar

### Yeni Özellikler (Bu Deployment'ta)

✅ Düğün Salonu Web Sitesi
- `/salon/:slug` route'ları
- Admin panel "Düğün Salonları" menüsü
- Landing page (ana sayfa)
- Venue API endpoints
- VenueWebsite MongoDB modeli

### Korunan Özellikler

✅ Tüm mevcut özellikler korundu:
- Dijital davetiye sistemi
- Çift paneli
- Admin paneli
- RSVP sistemi
- Audit logs

## 🎯 Başarı Kriterleri

Deployment başarılı sayılır eğer:

- [ ] Ana sayfa (/) landing page gösteriyor
- [ ] Admin panelde "Düğün Salonları" menüsü var
- [ ] `/admin/venues` sayfası açılıyor
- [ ] Yeni salon oluşturulabiliyor
- [ ] Salon önizleme çalışıyor
- [ ] Mevcut davetiye sistemi çalışıyor

## 🔄 Manuel Deployment Tetikleme (Gerekirse)

Eğer otomatik deployment çalışmazsa:

```bash
# Vercel CLI kurulu değilse
npm i -g vercel

# Login
vercel login

# Deploy
cd wedding-invitation
vercel --prod
```

## 📞 Destek

Sorun devam ederse:
1. Deployment logs'unu incele
2. Browser console'u kontrol et (F12)
3. Network tab'inde API çağrılarını kontrol et

---

**Beklenen Süre:** 2-5 dakika
**Son Push:** `git log -1 --oneline`
