## Access Permission Bulk-Assign API v2 Sözleşmesi

-------------------------------------------------------------------------------
1) Amaç
-------------------------------------------------------------------------------

- Access/permission yönetiminde, aynı permission set’ini çok sayıda kullanıcı
  veya role’e hızlı, güvenli ve izlenebilir şekilde atamak/kaldırmak için
  kullanılacak bulk-assign API v2 uçlarını ve DTO’larını tanımlar.
- Permission registry v1, User REST/DTO v1 ve Auth REST/DTO v1 ile uyumlu
  olacak şekilde v1 REST path’leri altında çalışır.

-------------------------------------------------------------------------------
2) Endpoint / Path Listesi (v1)
-------------------------------------------------------------------------------

### 2.1 Bulk Assign

- Method: `POST`  
- Path: `/api/v1/permissions/bulk-assign`  
- Davranış:
  - Target listesi (user/role/group) ve permission set’i alır.  
  - Geçerli kayıtlar için atamaları gerçekleştirir, geçersiz kayıtları hata
    listesine ekler.  
  - Her işlem için tekil bir `bulk_operation_id` üretir.

### 2.2 Bulk Revoke

- Method: `POST`  
- Path: `/api/v1/permissions/bulk-revoke`  
- Davranış:
  - Daha önce atanmış permission set’lerini toplu olarak geri alır.  
  - Atanan kayıtları ve hata durumlarını özetler.  
  - Aynı `bulk_operation_id` üzerinden audit korelasyonunu sağlar.

-------------------------------------------------------------------------------
3) DTO Özetleri
-------------------------------------------------------------------------------

### 3.1 BulkPermissionTargetDto

- `targetType`: `string`, zorunlu (`user` | `role` | `group`)  
- `targetId`: `string`, opsiyonel  
- `externalKey`: `string`, opsiyonel (targetId yerine kullanılabilir)  

Not: `targetId` veya `externalKey` alanlarından en az biri dolu olmalıdır.

### 3.2 BulkPermissionOperationRequestDto

- `operationType`: `string`, zorunlu (`assign` | `revoke`)  
- `targets`: `BulkPermissionTargetDto[]`, zorunlu  
- `permissionIds`: `string[]`, zorunlu  
- `reason`: `string`, opsiyonel  
- `requestedBy`: `string`, zorunlu (userId veya e‑mail)  
- `correlationId`: `string`, opsiyonel  

### 3.3 BulkPermissionOperationResultItemDto

- `target`: `BulkPermissionTargetDto`  
- `status`: `string` (`success` | `failed`)  
- `errorCode`: `string`, opsiyonel  
- `errorMessage`: `string`, opsiyonel  

### 3.4 BulkPermissionOperationResultDto

- `bulkOperationId`: `string`  
- `total`: `number`  
- `succeeded`: `number`  
- `failed`: `number`  
- `items`: `BulkPermissionOperationResultItemDto[]`  

-------------------------------------------------------------------------------
4) Status Code ve Error Zarfı
-------------------------------------------------------------------------------

Başlıca status code’lar:

- `202 ACCEPTED` – İşlem kuyruğa alınmış ve asenkron olarak işleniyor.  
- `200 OK` – Küçük batch’ler için senkron işlenmiş ve sonuç derhal döndürülmüş.  
- `400 BAD REQUEST` – Geçersiz payload, boş target listesi veya permissionIds.  
- `401 UNAUTHORIZED` – Geçersiz veya eksik JWT.  
- `403 FORBIDDEN` – Çağıranın gerekli ops/security rolüne sahip olmaması.  
- `500 INTERNAL SERVER ERROR` – Beklenmeyen sunucu hatası.

Hata zarfı (STYLE-API-001 ile uyumlu `ErrorResponse` örneği):

```json
{
  "code": "ERR_BULK_PERMISSION_VALIDATION",
  "message": "One or more bulk permission items are invalid.",
  "timestamp": "2025-01-01T10:00:00Z",
  "path": "/api/v1/permissions/bulk-assign",
  "details": {
    "invalidTargets": 3,
    "invalidPermissions": 1
  }
}
```

-------------------------------------------------------------------------------
5) Legacy / Versiyonlama Notu
-------------------------------------------------------------------------------

- Bu doküman, permission-service için bulk-assign “v2 davranışını” tanımlar
  ancak path’ler `/api/v1/permissions/...` altında tutulur.  
- Daha eski, tek tek atama yapan uçlar için `permission.api.md` içindeki
  legacy bölümü referans alınmalıdır.  
- Gelecekte API yapısında breaking change gerekirse:
  - Yeni path’ler `/api/v2/permissions/...` altında tanımlanmalı,  
  - `v1` path’leri belirli bir süre “legacy” olarak tutulup kademeli olarak
    kaldırılmalıdır.

-------------------------------------------------------------------------------
6) Güvenlik
-------------------------------------------------------------------------------

- Kimlik doğrulama:
  - `Authorization: Bearer <jwt>` zorunludur.  
- Yetkilendirme:
  - Ops/administrative roller için ek rol/scope kontrolleri uygulanmalıdır
    (örn. `permission.bulk:write`).  
- Ortak header ve scope kuralları:
  - `docs/03-delivery/api/common-headers.md` dokümanına uygun olmalıdır.  

-------------------------------------------------------------------------------
7) Bağlantılar
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0003-access-permission-bulk-assign.md`  
- PRD: `docs/01-product/PRD/PRD-0003-access-permission-bulk-assign-api-v2.md`  
- Story: `docs/03-delivery/STORIES/STORY-0042-access-permission-bulk-assign-api-v2.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0042-access-permission-bulk-assign-api-v2.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0101-access-permission-bulk-assign-api-v2.md`  

