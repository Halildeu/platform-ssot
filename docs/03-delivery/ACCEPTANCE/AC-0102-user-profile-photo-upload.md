# AC-0102 – User Profile Photo Upload Acceptance

ID: AC-0102  
Story: STORY-0102-user-profile-photo-upload  
Status: Planned  
Owner: Halil K.

## 1. AMAÇ

- Profil fotoğrafı upload akışının beklenen davranışını doğrulamak.

## 2. KAPSAM

- Upload, validasyon, avatar güncelleme.
- Negatif senaryolar (format/boyut).

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Başarılı upload  
      Given: Kullanıcı giriş yapmıştır  
      When: Geçerli bir görsel yükler  
      Then: Avatar URL/alanı güncellenir ve UI’da yeni avatar görünür

- [ ] Senaryo 2 – Boyut/format hatası  
      Given: Upload limiti tanımlıdır  
      When: Geçersiz format veya aşırı büyük dosya gönderilir  
      Then: 4xx döner ve standart hata zarfı ile açıklama sağlanır

- [ ] Senaryo 3 – Değiştirme/silme  
      Given: Kullanıcının mevcut avatarı vardır  
      When: Yeni görsel yükler veya avatarı kaldırır  
      Then: Eski avatar yönetimi (silme/overwrite) belirlenen kurala göre işler

## 4. NOTLAR / KISITLAR

- Storage sağlayıcısı değişebilir; acceptance API davranışına odaklanır.

## 5. ÖZET

- Upload akışı, validasyon ve güncelleme davranışları netleşir.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0102-user-profile-photo-upload.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0102-user-profile-photo-upload.md  

