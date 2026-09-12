# 📸 Fotoğraf Yükleme Sistemi

## ✨ Yeni Özellikler

Artık salon fotoğraflarını **URL yerine bilgisayar veya telefondan** yükleyebilirsiniz!

## 🎯 Özellikler

### Tek Görsel Yükleme
- **Hero Görsel**: Ana sayfa büyük görseli
- Tıklayarak dosya seç
- Otomatik sıkıştırma
- Önizleme gösterimi

### Çoklu Görsel Yükleme
- **Salon Galerisi**: Birden fazla salon fotoğrafı
- **Gerçek Düğün Görselleri**: Düğünlerden fotoğraflar
- Birden fazla dosya seçme
- Maksimum 20 görsel
- Sıralama gösterimi

## 💾 Teknik Detaylar

### Otomatik İşlemler
- ✅ **Sıkıştırma**: Görseller otomatik optimize edilir
- ✅ **Boyutlandırma**: Maksimum 1920px genişlik
- ✅ **Format**: JPEG'e dönüştürülür (%80-85 kalite)
- ✅ **Base64**: MongoDB'de saklanır

### Limitler
- **Dosya Boyutu**: Maksimum 10MB
- **Format**: JPG, PNG, WEBP
- **Galeri**: En fazla 20 görsel
- **Çözünürlük**: Otomatik optimize

## 📱 Kullanım

### Admin Panelden Salon Ekleme

1. **Admin Panel'e Git**
   ```
   https://siteniz.com/admin/venues
   ```

2. **"Yeni Salon Ekle" veya Düzenle**

3. **Görseller Bölümü**

#### Ana Görsel (Hero)
- "Ana Görsel (Hero)" bölümüne tıklayın
- Bilgisayarınızdan veya telefonunuzdan görsel seçin
- Görsel otomatik yüklenir ve önizlenir
- Kaldırmak için üzerine gelip X'e tıklayın

#### Hero Video (Opsiyonel)
- Video varsa URL girin
- Video varsa görsel yerine oynatılır

#### Salon Galerisi
- "Salon Galerisi" upload alanına tıklayın
- **Birden fazla görsel** seçebilirsiniz
- Maksimum 20 görsel
- Her görselin sırası gösterilir
- Kaldırmak için görselin üzerine gelip X'e tıklayın

#### Gerçek Düğün Görselleri
- "Gerçek Düğün Görselleri" upload alanına tıklayın
- Yine birden fazla seçebilirsiniz
- Salonunuzda yapılan düğünlerden fotoğraflar

4. **Kaydet**
   - Tüm görseller Base64 olarak kaydedilir
   - Hızlı yükleme için optimize edilir

## 🎨 Görsel Seçimi İpuçları

### Ana Görsel (Hero)
- **Yatay fotoğraf** tercih edin (16:9 oran ideal)
- Salonun en etkileyici açısı
- İyi aydınlatma
- Yüksek çözünürlük

### Salon Galerisi
- Farklı açılardan çekimler
- Boş salon görünümü
- Dekorasyon detayları
- Kapasite gösterimi
- Işıklandırma çeşitliliği

### Gerçek Düğün Görselleri
- Gerçek düğün anları
- Mutlu çiftler
- Salon kullanımı
- Dekorasyon örnekleri
- Atmosfer gösterimi

## 🔧 Teknik Bilgiler

### Sıkıştırma Ayarları
```typescript
- Maksimum genişlik: 1920px
- Kalite: %80-85
- Format: JPEG
- Encoding: Base64
```

### Dosya Validasyonu
```typescript
- Tip kontrolü: image/*
- Boyut kontrolü: Max 10MB
- Format kontrolü: JPG, PNG, WEBP
```

### Performans
- Görseller client-side sıkıştırılır
- MongoDB'de Base64 olarak saklanır
- Browser cache kullanılır
- Lazy loading desteklenir

## 📊 Örnek Kullanım

### Yeni Salon Ekleme Akışı

1. Admin panel → Düğün Salonları → Yeni Salon Ekle
2. Temel bilgileri doldur
3. **Görseller bölümüne gel**
4. Hero görsel seç (ana görsel)
5. Galeri için 5-10 görsel seç
6. Gerçek düğün için 5-10 görsel seç
7. Kaydet!

### Mevcut Salon Güncelleme

1. Admin panel → Düğün Salonları
2. Salon'a tıkla (düzenle)
3. Görseller bölümüne git
4. İstemediğin görseli kaldır (X'e tıkla)
5. Yeni görsel ekle
6. Kaydet!

## 🐛 Sorun Giderme

### "Görsel yüklenmiyor"
- Dosya boyutunu kontrol et (Max 10MB)
- Format'ı kontrol et (JPG, PNG, WEBP)
- İnternet bağlantını kontrol et
- Tarayıcı console'unu kontrol et

### "Çok yavaş yükleniyor"
- Dosya boyutu çok büyük olabilir
- Sistem otomatik sıkıştırıyor, bekleyin
- Daha küçük boyutlu görseller kullanın

### "Kaydettiğimde görsel kayboldu"
- Tüm görseller yüklenene kadar bekleyin
- "Yükleniyor..." yazısı kaybolana kadar kaydetmeyin
- Form submit olmadan önce yükleme tamamlanmalı

## ✅ Avantajlar

### Önceki Sistem (URL)
- ❌ Ayrı hosting gerekir
- ❌ URL bağımlılığı
- ❌ Link bozulabilir
- ❌ Manuel upload

### Yeni Sistem (Direct Upload)
- ✅ Tek adımda yükleme
- ✅ MongoDB'de saklanır
- ✅ Link bağımlılığı yok
- ✅ Otomatik sıkıştırma
- ✅ Mobil uyumlu
- ✅ Hızlı ve kolay

## 📱 Mobil Kullanım

Telefondan da kolayca fotoğraf yükleyebilirsiniz:

1. Admin panel'i telefonda aç
2. Salonu düzenle
3. Görsel yükleme alanına tıkla
4. "Kamera" veya "Galeri" seç
5. Fotoğraf çek veya seç
6. Otomatik yüklenir!

## 🎉 Sonuç

Artık fotoğraf yüklemek çok daha kolay:
- 📸 Bilgisayardan yükle
- 📱 Telefondan yükle
- 🖼️ Çoklu seçim yap
- ✨ Otomatik optimize
- 💾 Güvenle sakla

**Keyifli kullanımlar!**
