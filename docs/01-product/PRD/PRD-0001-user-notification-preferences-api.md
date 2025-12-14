# PRD-0001 – User Notification Preferences API

ID: PRD-0001

## 1. AMAÇ

User notification preferences (e‑posta, SMS, push, uygulama içi bildirimler)
için tek, tutarlı ve performanslı bir API seti tanımlamak; hem son kullanıcı
profil ekranı hem de admin paneli için tercihleri okunabilir/güncellenebilir
hale getirmek.

## 2. KAPSAM

- Dahil:
  - Kullanıcının mevcut bildirim tercihlerini okuma.
  - Belirli kanallar için tercihleri güncelleme (opt‑in/opt‑out).
  - Admin panelinden belirli kullanıcı veya segmentler için tercih görünümü.
- Hariç:
  - Bildirim içeriği ve şablon yönetimi.
  - Üçüncü parti provider entegrasyonlarının detaylı tasarımı.

## 3. KULLANICI SENARYOLARI

- Son kullanıcı:
  - Profil → Notification Settings → Mevcut tercihleri görür.
  - Belirli bildirim türlerini açar/kapatır → Kaydet → Başarılı/başarısız
    geri bildirim alır.
- Admin:
  - Belirli kullanıcıyı arar → Notification preferences tabını açar →
    gerekli olduğunda destek amaçlı tercih durumunu görür (salt okunur veya
    yetkiye göre düzenleyebilir).

## 4. DAVRANIŞ / GEREKSİNİMLER

- Fonksiyonel gereksinimler:

- API, kullanıcı kimliği bağlamında:
  - `GET /api/v1/notification-preferences` → mevcut tercihleri döndürmeli.
  - `PATCH /api/v1/notification-preferences` → istek gövdesine göre
    belirli kanalların tercihlerini güncelleyebilmeli.
- İleride admin paneli için:
  - `GET /api/v1/admin/users/{id}/notification-preferences` benzeri uçlarla
    farklı kullanıcıların tercihleri okunabilir olmalı (rol bazlı yetki).

- Non-functional gereksinimler (Performans ve UX):

- P95 yanıt süresi ≤ 500ms (GET/PATCH).
- Time‑out oranı %1’in altında.
- Hatalı isteklerde net hata mesajları (STYLE-API-001’e uygun ErrorResponse).

## 5. NON-GOALS (KAPSAM DIŞI)

- Bu PRD’de özellikle yapılmayacaklar:
  - Bildirim içerik/şablon yönetimi.
  - Üçüncü parti provider (e‑posta/SMS gateway vb.) entegrasyonlarının kapsamlı revizyonu.

## 6. ACCEPTANCE KRİTERLERİ ÖZETİ

- Son kullanıcı, notification preferences ekranında tüm ilgili kanalları
  görebilir ve ayarlarını güvenle değiştirebilir.
- Admin, destek amaçlı bir kullanıcının hangi bildirimleri alıp almadığını
  görebilir.
- Monitoring, bu uçlar için temel metrikleri (latency, error rate) takip eder.

## 7. RİSKLER / BAĞIMLILIKLAR

- Bağımlılıklar:
  - Kullanıcı kimlik/doğrulama sistemi (ör. Keycloak, user-service).
  - Bildirim altyapısı ve üçüncü parti e‑posta/SMS/push provider’ları.
- Riskler:
  - Yanlış veya tutarsız tercih yönetimi, kullanıcıların önemli bildirimleri
    kaçırmasına veya spam hissine yol açabilir.
  - Provider tarafındaki gecikmeler, API’nin performans hedeflerini yakalamasını zorlaştırabilir.

## 8. ÖZET

- Bu PRD, user notification preferences için tek ve tutarlı bir API seti
  tanımlar; temel amaç, kullanıcı ve admin tarafında güvenilir tercih yönetimi
  sağlamaktır.
- Performans ve UX gereksinimleri, P95 yanıt süresi ve timeout sınırları ile
  ölçülebilir hale getirilmiştir.

## 9. LİNKLER / SONRAKİ ADIMLAR

- İlgili PB: `docs/01-product/PROBLEM-BRIEFS/PB-0001-user-notification-preferences.md`  
- Story: `docs/03-delivery/STORIES/STORY-0007-user-notification-preferences-api.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0007-user-notification-preferences-api.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0101-user-notification-preferences-api.md`  
- API Sözleşmesi: `docs/03-delivery/api/notification-preferences.api.md`  
