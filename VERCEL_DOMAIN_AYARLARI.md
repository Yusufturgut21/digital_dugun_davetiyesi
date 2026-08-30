# Vercel Domain Ayarları

## Sorun
Preview deployment URL'si şu şekilde görünüyor:
`digital-dugun-davetiyesi-qnotv73gq-yusuf-turgut-s-projects.vercel.app`

## Çözümler

### 1. Production URL Kullanın
Preview URL yerine production URL'nizi kullanın:
- **Preview URL**: `*-yusuf-turgut-s-projects.vercel.app` (her commit için değişir)
- **Production URL**: `digital-dugun-davetiyesi.vercel.app` (sabit kalır)

### 2. Vercel Proje Adını Değiştirin
1. Vercel Dashboard'a gidin: https://vercel.com
2. Projenizi seçin
3. Settings → General
4. "Project Name" kısmını düzenleyin
5. Örnek yeni isim: `sahra-dugun-davetiyesi`
6. Yeni production URL: `sahra-dugun-davetiyesi.vercel.app`

### 3. Custom Domain Ekleyin (Önerilen)
1. Vercel Dashboard → Project → Settings → Domains
2. "Add Domain" butonuna tıklayın
3. Kendi domain'inizi ekleyin (örn: `dugundavetiyesi.com`)
4. DNS ayarlarını domain sağlayıcınızda yapılandırın
5. Artık `dugundavetiyesi.com/panel/alperen-ayse` şeklinde kullanabilirsiniz

## Önemli Notlar

- Preview URL'ler sadece test/development için kullanılır
- Production URL her zaman sabit kalır
- Custom domain en profesyonel çözümdür
- Domain maliyeti: ~10-20$/yıl (opsiyonel)

## Hızlı Çözüm
Şu anda production URL'nizi kullanın:
`https://digital-dugun-davetiyesi.vercel.app/panel/alperen-ayse`

Preview URL'leri paylaşmayın, sadece production URL'yi kullanın.
