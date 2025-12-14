# STORY-0102 – User Profile Photo Upload

ID: STORY-0102-user-profile-photo-upload  
Epic: EPIC-01  
Status: Planned  
Owner: Halil K.  
Upstream: (PB/PRD TBD)  
Downstream: AC-0102, TP-0102

## 1. AMAÇ

- Kullanıcıların profil fotoğrafı yükleyebilmesini sağlamak ve medya yönetimini standardize etmek.

## 2. TANIM

- Kullanıcı olarak, profil fotoğrafı yüklemek istiyorum; böylece hesabım kişiselleşir.
- Platform ekibi olarak, güvenli görsel işleme istiyoruz; böylece abuse’u önler ve depolama maliyetlerini kontrol altında tutarız.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Fotoğraf upload endpoint’i ve temel validasyonlar (format, boyut, mime).
- Basit storage stratejisi (placeholder; proje kararına göre object storage).
- UI entegrasyonu (avatar güncelleme akışı).

Hariç:
- Gelişmiş görsel düzenleme (crop/rotate) ve CDN optimizasyonları.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Geçerli format ve boyutta görsel yüklenebilir; avatar güncellenir.  
- [ ] Geçersiz format/boyutta istekler reddedilir (standart hata zarfı).  
- [ ] Silme/değiştirme akışı belirlenir.

## 5. BAĞIMLILIKLAR

- User servisinin kullanıcı profili modeli.
- AC-0102 ve TP-0102.

## 6. ÖZET

- Profil fotoğrafı upload akışı tanımlanır ve güvenli şekilde uygulanır.  
- UI + backend entegrasyonu için temel sözleşme netleşir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0102-user-profile-photo-upload.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0102-user-profile-photo-upload.md`  
