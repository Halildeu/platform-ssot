# TEST-PLAN – User Profile Photo Upload

ID: TP-0102  
Story: STORY-0102-user-profile-photo-upload
Status: Planned  
Owner: Halil K.

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Profil fotoğrafı upload akışının fonksiyonel ve negatif testlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Upload endpoint’i ve avatar güncelleme.  
- Dosya validasyonları (mime, boyut).  
- Temel güvenlik kontrolleri (authz).

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- API integration test: başarılı upload + avatar okuma.  
- Negatif test: format/boyut limitleri.  
- UI smoke: avatar değiştiğinde görünüm güncelleniyor mu?

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Geçerli görsel upload → avatar güncellenir.  
- [ ] Büyük/yanlış format → reddedilir ve hata zarfı doğru.  
- [ ] Yetkisiz istek → 401/403.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Local/dev ortamı.  
- Test görselleri (küçük/büyük/yanlış format).

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Unsafe file handling güvenlik riski yaratabilir (yüksek).  
- Storage maliyetleri ve lifecycle unutulabilir.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Upload akışı hem fonksiyonel hem negatif senaryolarla doğrulanır.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0102-user-profile-photo-upload.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0102-user-profile-photo-upload.md  

