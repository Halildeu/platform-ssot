## Users API Sözleşmesi (v1)

Amaç: Kullanıcı listeleme/detay uçlarının sözleşmesini, SSRM uyumlu arama/
filtre/sıralama parametrelerini ve hata modelini tanımlamak.

-------------------------------------------------------------------------------
1) Listeleme — v1
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/v1/users`  
- Query:
  - `page` (>=1), `pageSize` (1..1000)  
  - `search` (opsiyonel) — email/name hızlı arama  
  - `advancedFilter` (opsiyonel) — URL‑encoded JSON  
    - whitelist alanlar: `name`, `email`, `role`, `enabled`, `createDate`, `lastLogin`, `sessionTimeoutMinutes`  
  - `sort` (opsiyonel) — `field,dir;field2,dir2`  
    - `dir`: `asc|desc`  
    - desteklenen alanlar whitelist ile sınırlıdır (yukarıdaki alanlar)  
  - `status` (`ACTIVE|INACTIVE|INVITED|SUSPENDED`)  
  - `role` (örn. `ADMIN|USER`)

Response (PagedResult zarfı):
```json
{
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "enabled": true,
      "createDate": "...",
      "lastLogin": "..."
    }
  ],
  "total": 12345,
  "page": 1,
  "pageSize": 50
}
```

-------------------------------------------------------------------------------
2) Detay — v1
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/v1/users/{id}`  
- Response: `UserDetailDto` (summary + `sessionTimeoutMinutes`)

-------------------------------------------------------------------------------
3) Email ile getirme — v1
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/v1/users/by-email`  
- Query: `email=...`

-------------------------------------------------------------------------------
4) Aktivasyon — v1
-------------------------------------------------------------------------------

- Method: `PUT`  
- Path: `/api/v1/users/{id}/activation`  
- Body:
```json
{ "active": true }
```
- Response:
```json
{ "status": "ok", "auditId": "12345" }
```
`auditId` FE’de `/admin/audit?event=<auditId>` deep-link’i için kullanılır.

-------------------------------------------------------------------------------
5) Self Profile — v1
-------------------------------------------------------------------------------

- Method: `GET`
- Path: `/api/v1/users/me/profile`
- Response: `UserDetailDto`
  - `id`, `name`, `email`, `role`, `enabled`, `createDate`, `lastLogin`,
    `sessionTimeoutMinutes`, `locale`

- Method: `PUT`
- Path: `/api/v1/users/me/profile`
- Body:
```json
{ "name": "Admin User" }
```
- Response: `UserDetailDto`

Notlar:
- Bu endpoint, mobil ayarlar ekranindaki kisisel bilgiler bolumu icin canonical
  self-service profili yuzeyidir.
- Kullanici kendi gorunen adini guncelleyebilir; rol ve e-posta bu endpoint ile
  degistirilmez.

-------------------------------------------------------------------------------
6) Oturum Timeout Snapshot / Replay — v1
-------------------------------------------------------------------------------

- Method: `GET`
- Path: `/api/v1/users/me/session-timeout`
- Response:
```json
{
  "resourceKey": "profile:admin@example.com",
  "sessionTimeoutMinutes": 15,
  "version": 0
}
```

- Method: `PUT`
- Path: `/api/v1/users/me/session-timeout`
- Body:
```json
{
  "sessionTimeoutMinutes": 18,
  "expectedVersion": 0,
  "source": "mobile-offline-queue",
  "attemptCount": 1,
  "queueActionId": "qa-k3w71r-z18a8y"
}
```
- Success response:
```json
{
  "status": "ok",
  "auditId": "user-42",
  "resourceKey": "profile:admin@example.com",
  "sessionTimeoutMinutes": 18,
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "Session timeout synced.",
  "errorCode": null,
  "conflictReason": null
}
```
- Conflict response (`409`):
```json
{
  "status": "conflict",
  "auditId": "user-43",
  "resourceKey": "profile:admin@example.com",
  "sessionTimeoutMinutes": 15,
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User profile version changed before replay.",
  "errorCode": "USER_SESSION_TIMEOUT_SYNC_CONFLICT",
  "conflictReason": "STALE_EXPECTED_VERSION"
}
```

Notlar:
- Bu endpoint mobil offline queue replay akisi icin canonical optimistic-lock
  yuzeyidir.
- Basarili mutasyon local `user_audit_events` kaydi uretir ve izin verilirse
  merkezi audit feed'e mirror edilir.
- Conflict durumlari da local ve merkezi audit feed'de
  `USER_SESSION_TIMEOUT_SYNC_CONFLICT` olarak izlenir.
- `attemptCount` ve `queueActionId`, mobil replay akislarini backend audit iziyle
  korele etmek icin tasinir.

-------------------------------------------------------------------------------
7) Hata Modeli (ErrorResponse)
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
8) Locale Snapshot / Replay — v1
-------------------------------------------------------------------------------

- Method: `GET`
- Path: `/api/v1/users/me/locale`
- Response:
```json
{
  "resourceKey": "profile:admin@example.com",
  "locale": "tr",
  "version": 0
}
```

- Method: `PUT`
- Path: `/api/v1/users/me/locale`
- Body:
```json
{
  "locale": "en",
  "expectedVersion": 0,
  "source": "mobile-offline-queue",
  "attemptCount": 1,
  "queueActionId": "qa-k3w71r-locale01"
}
```
- Success response:
```json
{
  "status": "ok",
  "auditId": "user-96",
  "resourceKey": "profile:admin@example.com",
  "locale": "en",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User locale synced.",
  "errorCode": null,
  "conflictReason": null
}
```
- Conflict response (`409`):
```json
{
  "status": "conflict",
  "auditId": "user-97",
  "resourceKey": "profile:admin@example.com",
  "locale": "tr",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User locale version changed before replay.",
  "errorCode": "USER_LOCALE_SYNC_CONFLICT",
  "conflictReason": "STALE_EXPECTED_VERSION"
}
```

Notlar:
- Bu endpoint mobil offline queue replay akisi icin canonical locale preference
  optimistic-lock yuzeyidir.
- Basarili mutasyon local `user_audit_events` kaydi uretir ve izin verilirse
  merkezi audit feed'e `USER_LOCALE_SYNCED` olarak mirror edilir.
- Conflict durumlari da local ve merkezi audit feed'de
  `USER_LOCALE_SYNC_CONFLICT` olarak izlenir.
- Gecerli locale seti su an `tr`, `en`, `de`, `es` ile sinirlidir.

-------------------------------------------------------------------------------
9) Timezone Snapshot / Replay — v1
-------------------------------------------------------------------------------

- Method: `GET`
- Path: `/api/v1/users/me/timezone`
- Response:
```json
{
  "resourceKey": "profile:admin@example.com",
  "timezone": "Europe/Istanbul",
  "version": 0
}
```

- Method: `PUT`
- Path: `/api/v1/users/me/timezone`
- Body:
```json
{
  "timezone": "Europe/Berlin",
  "expectedVersion": 0,
  "source": "mobile-offline-queue",
  "attemptCount": 1,
  "queueActionId": "qa-k3w71r-timezone01"
}
```
- Success response:
```json
{
  "status": "ok",
  "auditId": "user-100",
  "resourceKey": "profile:admin@example.com",
  "timezone": "Europe/Berlin",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User timezone synced.",
  "errorCode": null,
  "conflictReason": null
}
```
- Conflict response (`409`):
```json
{
  "status": "conflict",
  "auditId": "user-101",
  "resourceKey": "profile:admin@example.com",
  "timezone": "Europe/Istanbul",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User timezone version changed before replay.",
  "errorCode": "USER_TIMEZONE_SYNC_CONFLICT",
  "conflictReason": "STALE_EXPECTED_VERSION"
}
```

Notlar:
- Bu endpoint mobil offline queue replay akisi icin canonical timezone preference
  optimistic-lock yuzeyidir.
- Basarili mutasyon local `user_audit_events` kaydi uretir ve izin verilirse
  merkezi audit feed'e `USER_TIMEZONE_SYNCED` olarak mirror edilir.
- Conflict durumlari da local ve merkezi audit feed'de
  `USER_TIMEZONE_SYNC_CONFLICT` olarak izlenir.
- Gecerli timezone degeri server tarafinda Java `ZoneId` ile dogrulanir.

-------------------------------------------------------------------------------
10) Date Format Snapshot / Replay — v1
-------------------------------------------------------------------------------

- Method: `GET`
- Path: `/api/v1/users/me/date-format`
- Response:
```json
{
  "resourceKey": "profile:admin@example.com",
  "dateFormat": "dd.MM.yyyy",
  "version": 0
}
```

- Method: `PUT`
- Path: `/api/v1/users/me/date-format`
- Body:
```json
{
  "dateFormat": "yyyy-MM-dd",
  "expectedVersion": 0,
  "source": "mobile-offline-queue",
  "attemptCount": 1,
  "queueActionId": "qa-k3w71r-dateformat01"
}
```
- Success response:
```json
{
  "status": "ok",
  "auditId": "user-106",
  "resourceKey": "profile:admin@example.com",
  "dateFormat": "yyyy-MM-dd",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User date format synced.",
  "errorCode": null,
  "conflictReason": null
}
```
- Conflict response (`409`):
```json
{
  "status": "conflict",
  "auditId": "user-107",
  "resourceKey": "profile:admin@example.com",
  "dateFormat": "dd.MM.yyyy",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User date format version changed before replay.",
  "errorCode": "USER_DATE_FORMAT_SYNC_CONFLICT",
  "conflictReason": "STALE_EXPECTED_VERSION"
}
```

Notlar:
- Bu endpoint mobil offline queue replay akisi icin canonical date-format
  optimistic-lock yuzeyidir.
- Basarili mutasyon local `user_audit_events` kaydi uretir ve izin verilirse
  merkezi audit feed'e `USER_DATE_FORMAT_SYNCED` olarak mirror edilir.
- Conflict durumlari da local ve merkezi audit feed'de
  `USER_DATE_FORMAT_SYNC_CONFLICT` olarak izlenir.
- Gecerli date format seti su an `dd.MM.yyyy`, `MM/dd/yyyy`, `yyyy-MM-dd`,
  `dd/MM/yyyy` ile sinirlidir.

-------------------------------------------------------------------------------
11) Time Format Snapshot / Replay — v1
-------------------------------------------------------------------------------

- Method: `GET`
- Path: `/api/v1/users/me/time-format`
- Response:
```json
{
  "resourceKey": "profile:admin@example.com",
  "timeFormat": "HH:mm",
  "version": 0
}
```

- Method: `PUT`
- Path: `/api/v1/users/me/time-format`
- Body:
```json
{
  "timeFormat": "hh:mm a",
  "expectedVersion": 0,
  "source": "mobile-offline-queue",
  "attemptCount": 1,
  "queueActionId": "qa-k3w71r-timeformat01"
}
```
- Success response:
```json
{
  "status": "ok",
  "auditId": "user-109",
  "resourceKey": "profile:admin@example.com",
  "timeFormat": "hh:mm a",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User time format synced.",
  "errorCode": null,
  "conflictReason": null
}
```
- Conflict response (`409`):
```json
{
  "status": "conflict",
  "auditId": "user-110",
  "resourceKey": "profile:admin@example.com",
  "timeFormat": "HH:mm",
  "version": 1,
  "source": "mobile-offline-queue",
  "message": "User time format version changed before replay.",
  "errorCode": "USER_TIME_FORMAT_SYNC_CONFLICT",
  "conflictReason": "STALE_EXPECTED_VERSION"
}
```

Notlar:
- Bu endpoint mobil offline queue replay akisi icin canonical time-format
  optimistic-lock yuzeyidir.
- Basarili mutasyon local `user_audit_events` kaydi uretir ve izin verilirse
  merkezi audit feed'e `USER_TIME_FORMAT_SYNCED` olarak mirror edilir.
- Conflict durumlari da local ve merkezi audit feed'de
  `USER_TIME_FORMAT_SYNC_CONFLICT` olarak izlenir.
- Gecerli time format seti su an `HH:mm`, `hh:mm a`, `HH.mm` ile sinirlidir.

-------------------------------------------------------------------------------
10) Hata Modeli (ErrorResponse)
-------------------------------------------------------------------------------

`STYLE-API-001` ile uyumlu örnek:
```json
{
  "error": "invalid_advanced_filter",
  "message": "Advanced filter JSON geçersiz",
  "fieldErrors": [],
  "meta": { "traceId": "abc-123" }
}
```

-------------------------------------------------------------------------------
11) Güvenlik
-------------------------------------------------------------------------------

- Header: `Authorization: Bearer <jwt>`  
- Scope header'ları için: `docs/03-delivery/api/common-headers.md`

-------------------------------------------------------------------------------
11) Legacy / Deprecated Uçlar
-------------------------------------------------------------------------------

Aşağıdaki uçlar legacy olup geriye dönük uyumluluk için çalışmaya devam eder;
yeni geliştirmelerde v1 path'i tercih edilmelidir:

- `/api/users/all`  
- `/api/users/by-email/{email}`  
- `/api/users/register`  
- `/api/users/public/register`  
- `/api/users/internal/*`

-------------------------------------------------------------------------------
12) Kabul Kriterleri (Özet)
-------------------------------------------------------------------------------

- SSRM uyumlu deterministik sayfalama.  
- `advancedFilter` whitelist dışına çıktığında 400 `invalid_advanced_filter`.  
- `items/total/page/pageSize` zarfı FE/BE uyumlu.
- Session-timeout replay endpoint'i `expectedVersion` mismatch durumunda `409`
  conflict dondurur; guncel `version`, `sessionTimeoutMinutes`,
  `errorCode=USER_SESSION_TIMEOUT_SYNC_CONFLICT`, `conflictReason=STALE_EXPECTED_VERSION`
  ve conflict audit `auditId` bilgisini geri verir.
- Locale, timezone ve date-format replay endpoint'leri de ayni
  optimistic-lock modelini izler; conflict durumunda canonical `errorCode`
  ve `conflictReason` alanlarini dondurur.

-------------------------------------------------------------------------------
13) Bağlantılar
-------------------------------------------------------------------------------

- docs/02-architecture/services/user-service/TECH-DESIGN-user-service-overview.md  
