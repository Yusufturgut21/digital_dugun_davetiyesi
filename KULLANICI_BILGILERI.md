# Kullanıcı Bilgilerini Bulma ve Güncelleme

## Mevcut Kullanıcı Adını Bulma

### Yöntem 1: MongoDB Atlas (Önerilen)
1. https://cloud.mongodb.com adresine gidin
2. Login yapın
3. **Database** → **Browse Collections**
4. **wedding** database → **users** collection
5. Alperen & Ayşe için oluşturulmuş kullanıcıyı bulun
6. `username` alanını not edin

### Yöntem 2: Admin Panelden
1. Super admin olarak login olun
2. Admin Panel → **Çiftler**
3. Alperen & Ayşe'yi listede bulun
4. Detayına girin
5. Kullanıcı adını görün

## Şifre Değiştirme

### Yöntem 1: Admin Panelden (En Kolay)
1. Super admin olarak login olun
2. Admin Panel → **Çiftler**
3. Alperen & Ayşe'nin detayına girin
4. **"Yeni Şifre"** alanına yeni şifreyi girin
5. **Kaydet** butonuna tıklayın

### Yöntem 2: API ile (Terminal)
```bash
curl -X POST https://digital-dugun-davetiyesi.vercel.app/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{"username": "alperen-ayse", "newPassword": "yenisifre123"}'
```

## Yeni Kullanıcı Oluşturma

Eğer Alperen & Ayşe için kullanıcı yoksa:

1. Super admin olarak login olun
2. Admin Panel → **Yeni Çift Ekle**
3. Formu doldurun:
   - Gelin Adı: Ayşe
   - Damat Adı: Alperen
   - Kullanıcı Adı: alperen-ayse
   - Şifre: istediğiniz şifre
4. Kaydedin

## Production URL

Panel giriş:
```
https://digital-dugun-davetiyesi.vercel.app/login
```

Alperen & Ayşe paneli:
```
https://digital-dugun-davetiyesi.vercel.app/panel/alperen-ayse
```

## Not

Şifreler hash'lenmiş durumda saklanır, MongoDB'de görünemez.
Şifreyi unuttuysanız yukarıdaki yöntemlerle yeniden belirleyin.
