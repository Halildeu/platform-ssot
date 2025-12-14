# PRD-0002 – User Notification Digest E-mail

ID: PRD-0002

## 1. AMAÇ

User notification digest (günlük/haftalık özet e‑mail) özelliğini tanımlamak;
amaç, tekil bildirim maillerinin sayısını azaltırken önemli olayların görünürlüğünü
arttırmak ve kullanıcı deneyimini iyileştirmektir.

## 2. KAPSAM

- Dahil:
  - Günlük/haftalık digest frekansı için kullanıcı tercihlerinin yönetilmesi.
  - Digest içeriğinde yer alacak bildirim tiplerinin seçimi.
  - Digest e‑mail formatı ve temel içerik yapısı.
  - Backend API’leri ve job/pipeline taslağı.
- Hariç:
  - Mevcut real-time kritik bildirimlerin kaldırılması.
  - Üçüncü parti e‑posta sağlayıcı değişikliği.

## 3. KULLANICI SENARYOLARI

- Senaryo 1 – Günlük digest:
  - Kullanıcı günlük digest seçeneğini açar.
  - Gün içinde oluşan uygun bildirimler toplanır, ertesi gün sabah tek bir
    digest maili gönderilir.
- Senaryo 2 – Haftalık digest:
  - Kullanıcı haftalık digest seçeneğini açar.
  - Hafta boyunca biriken bildirimler belirli bir günde gönderilen digest
    mailiyle özetlenir.

## 4. DAVRANIŞ / GEREKSİNİMLER

- Fonksiyonel gereksinimler:
  - Kullanıcı, profil/notification settings ekranından digest frekansını
    (yok/günlük/haftalık) seçebilmelidir.
  - Digest içeriği; bekleyen onaylar, önemli uyarılar ve öne çıkan raporlar
    gibi kategorilere ayrılmış olmalıdır.
  - Digest’e tıklayan kullanıcı, ilgili uygulama ekranına yönlendirilmelidir.
- Non-functional gereksinimler:
  - Digest generation job’larının makul sürelerde tamamlanması.
  - Email gönderim hatalarının izlenebilir ve retry politikalarının tanımlı
    olması.

## 5. NON-GOALS (KAPSAM DIŞI)

- Tüm notification sisteminin yeniden tasarımı.
- Push veya SMS digest’lerinin ilk fazda devreye alınması.

## 6. ACCEPTANCE KRİTERLERİ ÖZETİ

- Kullanıcı digest tercihlerini yönetebilmeli ve bu tercihler backend’de
  güvenilir şekilde saklanmalıdır.
- Günlük/haftalık job’lar doğru kullanıcılar için doğru içeriği üretip
  mail sağlayıcıya iletebilmelidir.

## 7. RİSKLER / BAĞIMLILIKLAR

- Bağımlılıklar:
  - Mevcut notification preferences API ve data modeli.
  - Email gönderim altyapısı (provider, queue).
- Riskler:
  - Yanlış segment ve içerik, kritik bilgilerin gözden kaçmasına neden olabilir.
  - Yoğun hacimli digest’ler, performans ve gönderim zamanlaması sorunları
    yaratabilir.

## 8. ÖZET

- Bu PRD, günlük/haftalık notification digest e‑mail özelliğini tanımlar;
  kullanıcıya daha az ama daha anlamlı e‑mail göndermeyi hedefler.

## 9. LİNKLER / SONRAKİ ADIMLAR

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0002-user-notification-digest-email.md`  
- Story: `docs/03-delivery/STORIES/STORY-0008-user-notification-digest-email.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0008-user-notification-digest-email.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0101-user-notification-digest-email.md`  
- API Sözleşmesi: `docs/03-delivery/api/notification-digest.api.md`  

