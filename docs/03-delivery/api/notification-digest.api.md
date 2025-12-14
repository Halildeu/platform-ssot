## Notification Digest API Sözleşmesi (v1)

-------------------------------------------------------------------------------
1) Amaç
-------------------------------------------------------------------------------

- Kullanıcının digest frekans tercihlerini yönetmek ve günlük/haftalık digest
  generation sürecini destekleyen temel REST uçlarını tanımlamak.

-------------------------------------------------------------------------------
2) Endpoint / Path Listesi (v1)
-------------------------------------------------------------------------------

### 2.1 Digest Tercihlerinin Yönetimi

- Method: `GET`  
- Path: `/api/v1/notification-digest/preferences`  
- Davranış: Geçerli kullanıcının digest frekansı ve ilgili tercihlerini
  döndürür.

- Method: `PATCH`  
- Path: `/api/v1/notification-digest/preferences`  
- Davranış: Kullanıcının digest frekansını (yok/günlük/haftalık) ve varsa ek
  ayarları günceller.

### 2.2 Digest Generation

- Method: `POST`  
- Path: `/api/v1/notification-digest/run`  
- Davranış: Planlı job/pipeline’den bağımsız olarak digest generation tetikler
  (örn. manuel test veya yeniden deneme senaryoları için).

-------------------------------------------------------------------------------
3) DTO Özetleri
-------------------------------------------------------------------------------

### 3.1 NotificationDigestSettingsDto (response)

- `frequency`: `string`, zorunlu  
  - Digest frekansı (`none`, `daily`, `weekly`).
- `channels`: `string[]`, opsiyonel  
  - Digest’e dahil edilecek bildirim kategorileri (örn. `approvals`, `alerts`).
- `lastSentAt`: `string (ISO-8601 datetime)`, opsiyonel  
  - Kullanıcıya en son digest e‑mail’in gönderildiği zaman.

Response gövdesi (örnek):

```json
{
  "frequency": "daily",
  "channels": ["approvals", "alerts"],
  "lastSentAt": "2025-01-01T08:00:00Z"
}
```

### 3.2 UpdateNotificationDigestSettingsRequest (request)

- `frequency`: `string`, zorunlu  
  - `none`, `daily`, `weekly` değerlerinden biri.
- `channels`: `string[]`, opsiyonel  
  - Digest’e dahil edilecek kategoriler.

### 3.3 NotificationDigestRunResultDto (response)

- `totalUsers`: `number`, zorunlu  
  - Digest için değerlendirilen toplam kullanıcı sayısı.
- `emailsSent`: `number`, zorunlu  
  - Başarıyla gönderilen digest e‑mail sayısı.
- `emailsSkipped`: `number`, zorunlu  
  - Tercihi `none` olan veya başka sebeple atlanan kullanıcı sayısı.
- `errors`: `number`, zorunlu  
  - Gönderim hatası yaşanan kayıt sayısı.

-------------------------------------------------------------------------------
4) Status Code ve Error Zarfı
-------------------------------------------------------------------------------

Başlıca status code’lar:

- `200 OK` – Tercihlerin okunması/güncellenmesi veya run sonucunun
  döndürülmesi başarıyla tamamlanmıştır.
- `202 ACCEPTED` – `POST /run` asenkron bir iş tetikliyor ve sadece kabul
  edildiğini bildiriyorsa (opsiyonel kullanım).
- `400 BAD REQUEST` – Geçersiz frekans değeri, hatalı gövde.
- `401 UNAUTHORIZED` – Geçersiz/eksik JWT.
- `403 FORBIDDEN` – Run tetikleme gibi admin-only işlemlere yetkisiz erişim.
- `500 INTERNAL SERVER ERROR` – Digest generation sırasında beklenmeyen hata.

Hata gövdesi, ortak `ErrorResponse` zarfına uyar:

```json
{
  "code": "ERR_DIGEST_RUN_FAILED",
  "message": "Digest job failed for some users.",
  "timestamp": "2025-01-01T09:00:00Z",
  "path": "/api/v1/notification-digest/run"
}
```

-------------------------------------------------------------------------------
5) Legacy / Versiyonlama Notu
-------------------------------------------------------------------------------

- Şu an yalnızca `v1` path’leri tanımlıdır (`/api/v1/notification-digest/...`).  
- Mevcut real‑time kritik bildirimler bu API tarafından değiştirilmez; onlar
  ayrı uçlar üzerinden çalışmaya devam eder.  
- Breaking change gerektiğinde:
  - Yeni path: `/api/v2/notification-digest/...`,
  - `v1` path’leri “Legacy” olarak işaretlenmeli ve geçiş süreci PRD/Story
    dokümanlarında açıklanmalıdır.

-------------------------------------------------------------------------------
6) Güvenlik
-------------------------------------------------------------------------------

- Kimlik doğrulama: `Authorization: Bearer <jwt>` header’ı zorunlu.  
- Admin‑only endpoint’ler (örn. manuel `POST /run`) için ek rol/scope kontrolü
  yapılmalıdır.  
- Ortak header ve güvenlik sözleşmeleri için:  
  - `docs/03-delivery/api/common-headers.md`

-------------------------------------------------------------------------------
7) Bağlantılar
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0002-user-notification-digest-email.md`  
- PRD: `docs/01-product/PRD/PRD-0002-user-notification-digest-email.md`  
- Story: `docs/03-delivery/STORIES/STORY-0008-user-notification-digest-email.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0008-user-notification-digest-email.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0101-user-notification-digest-email.md`  
