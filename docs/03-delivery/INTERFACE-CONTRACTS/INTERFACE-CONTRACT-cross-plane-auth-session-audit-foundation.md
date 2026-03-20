# INTERFACE-CONTRACT – Cross-Plane Auth Session Audit Foundation

ID: IC-cross-plane-auth-session-audit-foundation

Not: Asagidaki basliklar ve siralama **zorunludur**. HTTP API kontratlari
olusturulurken ayrica `STYLE-API-001.md` kurallari da uygulanmalidir. Ozellikle:
- Request/Response DTO'lari **isim ve alan bazinda** tanimlanmalidir.
- Kullanilan status code'lar ve ortak `ErrorResponse` semasi acikca yazilmalidir.
- Ilgili PB / PRD / STORY / ACCEPTANCE / TEST PLAN / API dokuman linkleri
  "7. LINKLER / SONRAKI ADIMLAR" bolumunde yer almalidir.

-------------------------------------------------------------------------------
1. AMAC
-------------------------------------------------------------------------------

- Web shell ve mobil istemcinin mevcut backend auth/yetki/audit omurgasi ile
  ayni endpoint ve veri sozlesmeleri uzerinden konusmasini netlestirmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Konusan taraflar:
  - Istemciler: web shell, mobil uygulama
  - Servisler: api-gateway, auth-service, permission-service, user-service
- Domain:
  - Session bootstrap
  - Authorization snapshot
  - Aksiyon bazli permission check
  - Audit olay gorunurlugu
  - Mobil offline queue replay icin profile preference mutasyonu

-------------------------------------------------------------------------------
3. ENDPOINT / ARAYUZ TANIMI
-------------------------------------------------------------------------------

- `POST /api/v1/auth/sessions`
  - Request DTO: `LoginRequestDto`
    - `email`: `string`, zorunlu, login e-postasi
    - `password`: `string`, zorunlu, kullanici sifresi
    - `companyId`: `number`, opsiyonel, secili sirket baglami
  - Response DTO: `LoginResponseDto`
    - `token`: `string`, zorunlu, Bearer JWT
    - `email`: `string`, zorunlu, oturumdaki kullanici e-postasi
    - `role`: `string`, zorunlu, rol ozeti
    - `permissions`: `string[]`, zorunlu, JWT ile gelen permission listesi
    - `expiresAt`: `number`, zorunlu, epoch millis expiry
    - `sessionTimeoutMinutes`: `number`, zorunlu, istemci tarafinda session gate icin timeout bilgisi

- `GET /api/v1/authz/me`
  - Response DTO: `AuthzMeResponseDto`
    - `userId`: `string`, zorunlu, kullanici kimligi
    - `permissions`: `string[]`, zorunlu, yetki listesi
    - `scopes`: `AuthzScopeSummaryDto[]`, zorunlu, scope tipine gore ozet
    - `superAdmin`: `boolean`, zorunlu, super admin bayragi
    - `allowedScopes`: `ScopeSummaryDto[]`, zorunlu, istemcinin kullanabilecegi scope referanslari

- `POST /api/v1/permissions/check`
  - Request DTO: `PermissionCheckRequestDto`
    - `userId`: `number`, zorunlu, kontrol edilen kullanici
    - `companyId`: `number`, opsiyonel, company scope
    - `projectId`: `number`, opsiyonel, project scope
    - `warehouseId`: `number`, opsiyonel, warehouse scope
    - `action`: `string`, zorunlu, kontrol edilen permission/action anahtari
  - Response DTO: `PermissionCheckResultDto`
    - `allowed`: `boolean`, zorunlu, aksiyon yetkisi

- `GET /api/audit/events`
  - Query:
    - `page`: `number`, opsiyonel
    - `pageSize`: `number`, opsiyonel
    - `user`: `string`, opsiyonel
    - `service`: `string`, opsiyonel
    - `action`: `string`, opsiyonel
    - `id`: `string`, opsiyonel
    - `sort`: `string`, opsiyonel
  - Response DTO: `AuditEventPageResponse`
    - `events`: `AuditEventResponse[]`, zorunlu
    - `page`: `number`, zorunlu
    - `total`: `number`, zorunlu

- `POST /api/v1/internal/audit/events`
  - Amaç: `auth-service` gibi ic servislerin canonical audit feed'e olay mirror etmesi
  - Auth:
    - `X-Internal-Api-Key`: `string`, zorunlu, internal ingest anahtari
  - Request DTO: `AuditEventIngestRequestDto`
    - `eventType`: `string`, zorunlu
    - `performedBy`: `number`, zorunlu
    - `details`: `string`, opsiyonel
    - `userEmail`: `string`, zorunlu
    - `service`: `string`, zorunlu, kaynak servis
    - `level`: `string`, zorunlu
    - `action`: `string`, zorunlu
    - `correlationId`: `string`, opsiyonel
    - `metadata`: `object`, opsiyonel
    - `before`: `object`, opsiyonel
    - `after`: `object`, opsiyonel
    - `occurredAt`: `string`, opsiyonel, ISO timestamp
  - Response DTO: `PermissionMutationAckDto`
    - `status`: `string`, zorunlu, `accepted`
    - `auditId`: `string`, opsiyonel, merkezi audit kaydi kimligi

- `GET /api/v1/users/me/session-timeout`
  - Response DTO: `UserSessionTimeoutSnapshotDto`
    - `resourceKey`: `string`, zorunlu, replay edilen profil kaynagi
    - `sessionTimeoutMinutes`: `number`, zorunlu, backend tarafindaki guncel timeout
    - `version`: `number`, zorunlu, optimistic locking versiyonu

- `PUT /api/v1/users/me/session-timeout`
  - Request DTO: `UpdateUserSessionTimeoutRequestDto`
    - `sessionTimeoutMinutes`: `number`, zorunlu, yeni timeout degeri
    - `expectedVersion`: `number`, zorunlu, istemcinin bildigi son versiyon
    - `source`: `string`, opsiyonel, `mobile-offline-queue` gibi replay kaynagi
    - `attemptCount`: `number`, opsiyonel, istemcinin bu replay icin kacınci denemede oldugu
    - `queueActionId`: `string`, opsiyonel, mobil queue item korelasyon kimligi
  - Response DTO: `UserSessionTimeoutMutationDto`
    - `status`: `string`, zorunlu, `ok` veya `conflict`
    - `auditId`: `string|null`, opsiyonel, local user audit kaydi kimligi
    - `resourceKey`: `string`, zorunlu
    - `sessionTimeoutMinutes`: `number`, zorunlu, server tarafinda kabul edilen guncel deger
    - `version`: `number`, zorunlu, server tarafindaki yeni veya mevcut versiyon
    - `source`: `string`, zorunlu, mutasyon kaynagi
    - `message`: `string`, zorunlu, sonuc ozeti
    - `errorCode`: `string|null`, opsiyonel, canonical makinece islenebilir hata kodu
    - `conflictReason`: `string|null`, opsiyonel, `409` conflict neden kodu

- `GET /api/v1/users/me/profile`
  - Response DTO: `UserDetailDto`
    - `id`: `number`, zorunlu, mevcut kullanici kimligi
    - `name`: `string`, zorunlu, gorunen ad
    - `email`: `string`, zorunlu
    - `role`: `string`, zorunlu
    - `enabled`: `boolean`, zorunlu
    - `createDate`: `string`, zorunlu
    - `lastLogin`: `string|null`, opsiyonel
    - `sessionTimeoutMinutes`: `number`, zorunlu
    - `locale`: `string`, zorunlu

- `PUT /api/v1/users/me/profile`
  - Request DTO: `UpdateUserRequest`
    - `name`: `string`, opsiyonel, self-service gorunen ad guncellemesi
  - Response DTO: `UserDetailDto`
    - `id`, `name`, `email`, `role`, `enabled`, `createDate`, `lastLogin`,
      `sessionTimeoutMinutes`, `locale`
  - Davranis:
    - self-service profile edit yuzeyi sadece `name` alanini uygular
    - e-posta, rol ve organizasyon baglamlari bu endpoint ile degismez

- `GET /api/v1/notification-preferences/{channel}`
  - Response DTO: `NotificationPreferenceSnapshotDto`
    - `resourceKey`: `string`, zorunlu, replay edilen kanal kaynagi
    - `channel`: `string`, zorunlu, `email|sms|push|in_app`
    - `enabled`: `boolean`, zorunlu, server tarafindaki guncel tercih
    - `frequency`: `string|null`, opsiyonel, guncel frekans
    - `version`: `number`, zorunlu, optimistic locking versiyonu

- `PUT /api/v1/notification-preferences/{channel}`
  - Request DTO: `UpdateNotificationPreferenceRequestDto`
    - `enabled`: `boolean`, zorunlu, yeni tercih degeri
    - `frequency`: `string|null`, opsiyonel, yeni frekans
    - `expectedVersion`: `number`, zorunlu, istemcinin bildigi son versiyon
    - `source`: `string`, opsiyonel, `mobile-offline-queue` gibi replay kaynagi
    - `attemptCount`: `number`, opsiyonel, replay deneme sayisi
    - `queueActionId`: `string`, opsiyonel, mobil queue item korelasyon kimligi
  - Response DTO: `NotificationPreferenceMutationDto`
    - `status`: `string`, zorunlu, `ok` veya `conflict`
    - `auditId`: `string|null`, opsiyonel, local user audit kaydi kimligi
    - `resourceKey`: `string`, zorunlu
    - `channel`: `string`, zorunlu
    - `enabled`: `boolean`, zorunlu, server tarafinda kabul edilen guncel deger
    - `frequency`: `string|null`, opsiyonel, server tarafindaki guncel frekans
    - `version`: `number`, zorunlu, server tarafindaki yeni veya mevcut versiyon
    - `source`: `string`, zorunlu, mutasyon kaynagi
    - `message`: `string`, zorunlu, sonuc ozeti
    - `errorCode`: `string|null`, opsiyonel, canonical makinece islenebilir hata kodu
    - `conflictReason`: `string|null`, opsiyonel, `409` conflict neden kodu

- `GET /api/v1/users/me/locale`
  - Response DTO: `UserLocaleSnapshotDto`
    - `resourceKey`: `string`, zorunlu, replay edilen profil kaynagi
    - `locale`: `string`, zorunlu, server tarafindaki guncel locale
    - `version`: `number`, zorunlu, optimistic locking versiyonu

- `PUT /api/v1/users/me/locale`
  - Request DTO: `UpdateUserLocaleRequestDto`
    - `locale`: `string`, zorunlu, yeni locale degeri
    - `expectedVersion`: `number`, zorunlu, istemcinin bildigi son versiyon
    - `source`: `string`, opsiyonel, `mobile-offline-queue` gibi replay kaynagi
    - `attemptCount`: `number`, opsiyonel, replay deneme sayisi
    - `queueActionId`: `string`, opsiyonel, mobil queue item korelasyon kimligi
  - Response DTO: `UserLocaleMutationDto`
    - `status`: `string`, zorunlu, `ok` veya `conflict`
    - `auditId`: `string|null`, opsiyonel, local user audit kaydi kimligi
    - `resourceKey`: `string`, zorunlu
    - `locale`: `string`, zorunlu, server tarafinda kabul edilen guncel deger
    - `version`: `number`, zorunlu, server tarafindaki yeni veya mevcut versiyon
    - `source`: `string`, zorunlu, mutasyon kaynagi
    - `message`: `string`, zorunlu, sonuc ozeti
    - `errorCode`: `string|null`, opsiyonel, canonical makinece islenebilir hata kodu
    - `conflictReason`: `string|null`, opsiyonel, `409` conflict neden kodu

- `GET /api/v1/users/me/timezone`
  - Response DTO: `UserTimezoneSnapshotDto`
    - `resourceKey`: `string`, zorunlu, replay edilen profil kaynagi
    - `timezone`: `string`, zorunlu, server tarafindaki guncel timezone
    - `version`: `number`, zorunlu, optimistic locking versiyonu

- `PUT /api/v1/users/me/timezone`
  - Request DTO: `UpdateUserTimezoneRequestDto`
    - `timezone`: `string`, zorunlu, yeni timezone degeri
    - `expectedVersion`: `number`, zorunlu, istemcinin bildigi son versiyon
    - `source`: `string`, opsiyonel, `mobile-offline-queue` gibi replay kaynagi
    - `attemptCount`: `number`, opsiyonel, replay deneme sayisi
    - `queueActionId`: `string`, opsiyonel, mobil queue item korelasyon kimligi
  - Response DTO: `UserTimezoneMutationDto`
    - `status`: `string`, zorunlu, `ok` veya `conflict`
    - `auditId`: `string|null`, opsiyonel, local user audit kaydi kimligi
    - `resourceKey`: `string`, zorunlu
    - `timezone`: `string`, zorunlu, server tarafinda kabul edilen guncel deger
    - `version`: `number`, zorunlu, server tarafindaki yeni veya mevcut versiyon
    - `source`: `string`, zorunlu, mutasyon kaynagi
    - `message`: `string`, zorunlu, sonuc ozeti
    - `errorCode`: `string|null`, opsiyonel, canonical makinece islenebilir hata kodu
    - `conflictReason`: `string|null`, opsiyonel, `409` conflict neden kodu

- `GET /api/v1/users/me/date-format`
  - Response DTO: `UserDateFormatSnapshotDto`
    - `resourceKey`: `string`, zorunlu, replay edilen profil kaynagi
    - `dateFormat`: `string`, zorunlu, server tarafindaki guncel date format
    - `version`: `number`, zorunlu, optimistic locking versiyonu

- `PUT /api/v1/users/me/date-format`
  - Request DTO: `UpdateUserDateFormatRequestDto`
    - `dateFormat`: `string`, zorunlu, yeni date format degeri
    - `expectedVersion`: `number`, zorunlu, istemcinin bildigi son versiyon
    - `source`: `string`, opsiyonel, `mobile-offline-queue` gibi replay kaynagi
    - `attemptCount`: `number`, opsiyonel, replay deneme sayisi
    - `queueActionId`: `string`, opsiyonel, mobil queue item korelasyon kimligi
  - Response DTO: `UserDateFormatMutationDto`
    - `status`: `string`, zorunlu, `ok` veya `conflict`
    - `auditId`: `string|null`, opsiyonel, local user audit kaydi kimligi
    - `resourceKey`: `string`, zorunlu
    - `dateFormat`: `string`, zorunlu, server tarafinda kabul edilen guncel deger
    - `version`: `number`, zorunlu, server tarafindaki yeni veya mevcut versiyon
    - `source`: `string`, zorunlu, mutasyon kaynagi
    - `message`: `string`, zorunlu, sonuc ozeti
    - `errorCode`: `string|null`, opsiyonel, canonical makinece islenebilir hata kodu
    - `conflictReason`: `string|null`, opsiyonel, `409` conflict neden kodu

- `GET /api/v1/users/me/time-format`
  - Response DTO: `UserTimeFormatSnapshotDto`
    - `resourceKey`: `string`, zorunlu, replay edilen profil kaynagi
    - `timeFormat`: `string`, zorunlu, server tarafindaki guncel time format
    - `version`: `number`, zorunlu, optimistic locking versiyonu

- `PUT /api/v1/users/me/time-format`
  - Request DTO: `UpdateUserTimeFormatRequestDto`
    - `timeFormat`: `string`, zorunlu, yeni time format degeri
    - `expectedVersion`: `number`, zorunlu, istemcinin bildigi son versiyon
    - `source`: `string`, opsiyonel, `mobile-offline-queue` gibi replay kaynagi
    - `attemptCount`: `number`, opsiyonel, replay deneme sayisi
    - `queueActionId`: `string`, opsiyonel, mobil queue item korelasyon kimligi
  - Response DTO: `UserTimeFormatMutationDto`
    - `status`: `string`, zorunlu, `ok` veya `conflict`
    - `auditId`: `string|null`, opsiyonel, local user audit kaydi kimligi
    - `resourceKey`: `string`, zorunlu
    - `timeFormat`: `string`, zorunlu, server tarafinda kabul edilen guncel deger
    - `version`: `number`, zorunlu, server tarafindaki yeni veya mevcut versiyon
    - `source`: `string`, zorunlu, mutasyon kaynagi
    - `message`: `string`, zorunlu, sonuc ozeti
    - `errorCode`: `string|null`, opsiyonel, canonical makinece islenebilir hata kodu
    - `conflictReason`: `string|null`, opsiyonel, `409` conflict neden kodu

-------------------------------------------------------------------------------
4. DAVRANIS VE HATA DURUMLARI
-------------------------------------------------------------------------------

- Basarili akis:
  - Istemci login icin `POST /api/v1/auth/sessions` cagirir.
  - Session olustuktan sonra istemci `GET /api/v1/authz/me` ile izin ve scope
    ozetini ceker.
  - Hassas aksiyonlar backend tarafinda `POST /api/v1/permissions/check`
    veya dogrudan server-side authz kurallari ile korunur.
  - Yonetsel gozlem ve inceleme akislarinda audit kayitlari
    `GET /api/audit/events` ile goruntulenir.
  - `auth-service`, local session audit kaydini urettikten sonra ayni olayi
    `POST /api/v1/internal/audit/events` ile merkezi audit feed'e mirror eder.
  - Mobil offline queue replay'i once `GET /api/v1/users/me/session-timeout`
    ile version snapshot alir, sonra `PUT /api/v1/users/me/session-timeout`
    ile optimistic-lock kontrollu mutasyon gonderir.
  - `user-service`, basarili replay'lerde local audit kaydi olusturur ve ayni
    olayi `POST /api/v1/internal/audit/events` ile merkezi audit feed'e
    mirror etmeyi dener.
  - `user-service`, stale replay conflict durumlarinda da
    `USER_SESSION_TIMEOUT_SYNC_CONFLICT` audit olayini uretir; boylece retry ve
    conflict analizi merkezi feed'de gorulebilir.
  - `user-service`, bildirim tercihi replay'i icin once
    `GET /api/v1/notification-preferences/{channel}` snapshot'i verir, sonra
    `PUT /api/v1/notification-preferences/{channel}` ile optimistic-lock
    kontrollu mutasyonu kabul eder.
  - Basarili bildirim tercihi replay'leri
    `USER_NOTIFICATION_PREFERENCE_SYNCED`, stale conflict durumlari ise
    `USER_NOTIFICATION_PREFERENCE_SYNC_CONFLICT` audit olaylarini uretir ve
    merkezi feed'e mirror etmeyi dener.
  - `user-service`, locale replay'i icin once `GET /api/v1/users/me/locale`
    snapshot'i verir, sonra `PUT /api/v1/users/me/locale` ile optimistic-lock
    kontrollu mutasyonu kabul eder.
  - Basarili locale replay'leri `USER_LOCALE_SYNCED`, stale conflict durumlari
    ise `USER_LOCALE_SYNC_CONFLICT` audit olaylarini uretir ve merkezi feed'e
    mirror etmeyi dener.
  - `user-service`, timezone replay'i icin once `GET /api/v1/users/me/timezone`
    snapshot'i verir, sonra `PUT /api/v1/users/me/timezone` ile optimistic-lock
    kontrollu mutasyonu kabul eder.
  - Basarili timezone replay'leri `USER_TIMEZONE_SYNCED`, stale conflict durumlari
    ise `USER_TIMEZONE_SYNC_CONFLICT` audit olaylarini uretir ve merkezi feed'e
    mirror etmeyi dener.
  - `user-service`, date-format replay'i icin once `GET /api/v1/users/me/date-format`
    snapshot'i verir, sonra `PUT /api/v1/users/me/date-format` ile optimistic-lock
    kontrollu mutasyonu kabul eder.
  - Basarili date-format replay'leri `USER_DATE_FORMAT_SYNCED`, stale conflict
    durumlari ise `USER_DATE_FORMAT_SYNC_CONFLICT` audit olaylarini uretir ve
    merkezi feed'e mirror etmeyi dener.
  - `user-service`, time-format replay'i icin once `GET /api/v1/users/me/time-format`
    snapshot'i verir, sonra `PUT /api/v1/users/me/time-format` ile optimistic-lock
    kontrollu mutasyonu kabul eder.
  - Basarili time-format replay'leri `USER_TIME_FORMAT_SYNCED`, stale conflict
    durumlari ise `USER_TIME_FORMAT_SYNC_CONFLICT` audit olaylarini uretir ve
    merkezi feed'e mirror etmeyi dener.

- Hata durumlari:
  - `400` `BAD_REQUEST` veya `VALIDATION_ERROR`: request DTO dogrulama hatasi.
  - `401` `INVALID_CREDENTIALS` veya `UNAUTHORIZED`: eksik/gecersiz kimlik bilgisi veya JWT.
  - `403` `FORBIDDEN`: kullanicinin islem yetkisi yok.
  - `404` `AUTHZ-404`: kullaniciya ait scope/izin ozetinin bulunamadigi durumlar.
  - `409` `USER_SESSION_TIMEOUT_SYNC_CONFLICT`: kullanicinin replay ettigi
    profile preference versiyonu server tarafindaki mevcut versiyonla
    uyusmuyor; response `conflictReason=STALE_EXPECTED_VERSION` doner.
  - `409` `USER_NOTIFICATION_PREFERENCE_SYNC_CONFLICT`: kullanicinin replay
    ettigi kanal tercih versiyonu server tarafindaki mevcut versiyonla
    uyusmuyor; response `conflictReason=STALE_EXPECTED_VERSION` doner.
  - `409` `USER_LOCALE_SYNC_CONFLICT`: kullanicinin replay ettigi locale
    versiyonu server tarafindaki mevcut versiyonla uyusmuyor; response
    `conflictReason=STALE_EXPECTED_VERSION` doner.
  - `409` `USER_TIMEZONE_SYNC_CONFLICT`: kullanicinin replay ettigi timezone
    versiyonu server tarafindaki mevcut versiyonla uyusmuyor; response
    `conflictReason=STALE_EXPECTED_VERSION` doner.
  - `409` `USER_DATE_FORMAT_SYNC_CONFLICT`: kullanicinin replay ettigi
    date format versiyonu server tarafindaki mevcut versiyonla uyusmuyor;
    response `conflictReason=STALE_EXPECTED_VERSION` doner.
  - `409` `USER_TIME_FORMAT_SYNC_CONFLICT`: kullanicinin replay ettigi
    time format versiyonu server tarafindaki mevcut versiyonla uyusmuyor;
    response `conflictReason=STALE_EXPECTED_VERSION` doner.
  - `409` `USER_ALREADY_EXISTS`: registration akislarinda cakisiyor.
  - `429` `too_many_requests`: login veya audit export tarafinda rate limit tetigi.
  - `503` `vault_unavailable`: auth altyapisina erisim gecici olarak yok.

-------------------------------------------------------------------------------
5. GUVENLIK VE VERSIYONLAMA
-------------------------------------------------------------------------------

- Auth:
  - `Authorization: Bearer <jwt>` zorunludur.
- Authz:
  - Canonical permission kodlari en az su setle hizalanir:
    - `access-read`
    - `role-manage`
    - `permission-manage`
    - `permission-scope-manage`
    - `audit-read`
- Header/baglam:
  - Scope gereken isteklerde `X-Company-Id` zorunlu; `X-Project-Id` ve
    `X-Warehouse-Id` opsiyoneldir.
- Rate limit ve throttling:
  - Login ve audit export akislarinda servis tarafli kisitlar uygulanabilir.
- Versiyonlama:
  - Yeni HTTP endpoint'leri `/api/v1/` prefix'i ile kullanilir; legacy
    path'ler yeni gelistirmelerde canonical kabul edilmez.

-------------------------------------------------------------------------------
6. OZET
-------------------------------------------------------------------------------

- Bu kontrat, web ve mobil istemcinin mevcut backend auth/yetki altyapisiyla
  ayni session ve authorization sozlesmeleri uzerinden konusmasini saglar.
- Amaç istemcilerin kendi local auth protokollerini uretmesini engellemek ve
  audit gorunurlugunu capability seviyesinde sabitlemektir.

-------------------------------------------------------------------------------
7. LINKLER / SONRAKI ADIMLAR
-------------------------------------------------------------------------------

- docs/03-delivery/STORIES/STORY-0316-cross-plane-auth-session-audit-foundation.md  
- docs/03-delivery/ACCEPTANCE/AC-0316-cross-plane-auth-session-audit-foundation.md  
- docs/03-delivery/TEST-PLANS/TP-0316-cross-plane-auth-session-audit-foundation.md  
- docs/03-delivery/api/auth.api.md  
- docs/03-delivery/api/permission.api.md  
- docs/03-delivery/api/audit-events.api.md  
- docs/03-delivery/api/report-preferences.api.md  
- docs/03-delivery/api/users.api.md  
- docs/03-delivery/api/common-headers.md  
- docs/03-delivery/api/notification-preferences.api.md  
