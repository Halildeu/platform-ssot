## Notification Preferences API Sözleşmesi (v1)

-------------------------------------------------------------------------------
1) Amaç
-------------------------------------------------------------------------------

- Kullanıcının bildirim tercihlerini (e‑posta, SMS, push, in‑app vb.) okuma ve
  güncelleme uçlarının v1 REST path ve DTO özetini tanımlamak.

-------------------------------------------------------------------------------
2) Endpoint / Path Listesi (v1)
-------------------------------------------------------------------------------

### 2.1 Tercihleri Okuma

- Method: `GET`  
- Path: `/api/v1/notification-preferences`  
- Davranış: Geçerli kullanıcının tüm bildirim kanalları için tercihlerini
  döndürür.

### 2.2 Tercihleri Güncelleme

- Method: `PATCH`  
- Path: `/api/v1/notification-preferences`  
- Davranış: Gönderilen gövdeye göre kullanıcının tercihlerini kısmi olarak
  günceller (idempotent davranış hedeflenir).

-------------------------------------------------------------------------------
3) DTO Özetleri
-------------------------------------------------------------------------------

### 3.1 NotificationPreferenceDto (response)

- `channel`: `string`, zorunlu  
  - Bildirim kanalı anahtarı (ör. `email`, `sms`, `push`, `in_app`).
- `enabled`: `boolean`, zorunlu  
  - Kanal için bildirim alınıp alınmayacağını belirtir.
- `frequency`: `string`, opsiyonel  
  - Kanal bazlı frekans tercihi (ör. `immediate`, `daily`, `weekly`).
- `updatedAt`: `string (ISO-8601 datetime)`, opsiyonel  
  - Tercihin son güncellenme zamanı.

Response (örnek yapı):  
- `preferences`: `NotificationPreferenceDto[]`

### 3.2 UpdateNotificationPreferencesRequest (request)

- `preferences`: `NotificationPreferenceUpdateDto[]`, zorunlu  
  - Güncellenecek tercihlerin listesi.

### 3.3 NotificationPreferenceUpdateDto (request öğesi)

- `channel`: `string`, zorunlu  
  - Güncellenecek kanalın anahtarı.
- `enabled`: `boolean`, zorunlu  
  - Yeni tercih değeri.
- `frequency`: `string`, opsiyonel  
  - İlgili kanal için yeni frekans değeri (varsa).

-------------------------------------------------------------------------------
4) Status Code ve Error Zarfı
-------------------------------------------------------------------------------

Kullanılan başlıca status code’lar:

- `200 OK` – İstek başarıyla işlenmiş, tercih(ler) döndürülmüş veya
  güncellenmiştir.
- `400 BAD REQUEST` – Geçersiz gövde, tanınmayan kanal anahtarları veya
  eksik zorunlu alanlar.
- `401 UNAUTHORIZED` – Geçersiz veya eksik JWT.
- `403 FORBIDDEN` – Kullanıcının bu tercihleri görüntüleme/güncelleme yetkisi yok.
- `500 INTERNAL SERVER ERROR` – Beklenmeyen sunucu hatası.

Hatalar için ortak `ErrorResponse` şeması (STYLE-API-001’e uygun):

```json
{
  "code": "ERR_VALIDATION",
  "message": "One or more preferences are invalid.",
  "timestamp": "2025-01-01T10:00:00Z",
  "path": "/api/v1/notification-preferences"
}
```

-------------------------------------------------------------------------------
5) Legacy / Versiyonlama Notu
-------------------------------------------------------------------------------

- Bu doküman sadece `v1` path’lerini tanımlar (`/api/v1/notification-preferences`).  
- İleride breaking change gerektiğinde:
  - Yeni path: `/api/v2/notification-preferences` altında tanımlanmalı,
  - `v1` belirli bir süre “Legacy” olarak belgelenip desteklenmeye devam
    edilmelidir.

-------------------------------------------------------------------------------
6) Güvenlik
-------------------------------------------------------------------------------

- Kimlik doğrulama: `Authorization: Bearer <jwt>` header’ı zorunlu.  
- Rol/scope gibi detaylar ve ortak header kullanımı için:  
  - `docs/03-delivery/api/common-headers.md`

-------------------------------------------------------------------------------
7) Bağlantılar
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0001-user-notification-preferences.md`  
- PRD: `docs/01-product/PRD/PRD-0001-user-notification-preferences-api.md`  
- Story: `docs/03-delivery/STORIES/STORY-0007-user-notification-preferences-api.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0007-user-notification-preferences-api.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0101-user-notification-preferences-api.md`  
