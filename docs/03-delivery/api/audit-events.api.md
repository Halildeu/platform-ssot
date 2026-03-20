## Audit Events API Sözleşmesi

Amaç: MFE’lerde yapılan kritik işlemlerin izlenebilmesi için audit event’lerinin
listeleme, export ve canlı yayın (SSE) uçlarını tanımlamak.

-------------------------------------------------------------------------------
1) Listeleme
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/audit/events`
- Query Parametreleri:
  - `page` (number, >=1)
  - `pageSize` (number, 1..1000)
  - `from` (ISO datetime) — başlangıç zamanı
  - `to` (ISO datetime) — bitiş zamanı
  - `user` (string, opsiyonel) — aktör e‑posta/kimlik
  - `service` (string, opsiyonel) — kaynak servis adı (permission-service, user-service, …)
  - `level` (enum, opsiyonel) — `INFO|WARN|CRITICAL`
  - `id` (string, opsiyonel) — belirli bir olayı çekmek/öne çıkarmak için auditId
  - `search` (string, opsiyonel) — metin arama (kaynak, aktör, özet)
  - `sort` (string, opsiyonel) — `field,dir` formatı  
    - desteklenen alanlar: `occurredAt|userEmail|service|level|action|correlationId`  
    - `dir`: `asc|desc` (varsayılan: `occurredAt,desc`)

Desteklenen alias/legacy anahtarlar:
- `from` → `dateFrom`, `to` → `dateTo`
- `user` → `userEmail`
- `filter[<key>]` — eski filtre formatı (örn. `filter[action]=ASSIGN_ROLE`)

Yanıt (liste):
```json
{
  "events": [
    {
      "id": "a-123",
      "timestamp": "2025-11-03T10:15:30.000Z",
      "userEmail": "a***@example.com",
      "service": "permission-service",
      "action": "ASSIGN_ROLE",
      "level": "INFO",
      "details": "Role ADMIN assigned to user",
      "correlationId": "corr-123",
      "metadata": { "userId": 42, "email": "a***@example.com" },
      "before": { "name": "J***" },
      "after": { "name": "J***", "addressLine": "S***" }
    }
  ],
  "page": 0,
  "total": 1
}
```

Not: `page` alanı 0‑bazlıdır (0 ilk sayfa); UI tarafında sayfa numarası gösterilirken 1 eklenebilir.

-------------------------------------------------------------------------------
2) Export
-------------------------------------------------------------------------------

- Method: `POST`
- Path: `/api/audit/events/export-jobs`
- Body:
  - `format=csv|json` (default: `json`)
  - `limit` (opsiyonel)
  - `sort`
  - `filters` — listeleme ile ayni filtre anahtarlari
- Response:
```json
{
  "id": "job-123",
  "status": "PROCESSING",
  "format": "csv",
  "filename": null,
  "contentType": null,
  "eventCount": null,
  "requestedBy": "admin@example.com",
  "createdAt": "2026-03-14T09:15:00Z",
  "completedAt": null,
  "errorMessage": null,
  "downloadPath": "/api/audit/events/export-jobs/job-123/download"
}
```

Job durumu:
- Method: `GET`
- Path: `/api/audit/events/export-jobs/{jobId}`

Hazir artefact indirme:
- Method: `GET`
- Path: `/api/audit/events/export-jobs/{jobId}/download`
- Response:
  - Dosya indirme (`Content-Disposition`) — `audit-events-<jobId>.csv|json`

Legacy / gecis notu:
- `GET /api/audit/events/export` direct download yolu gecis uyumlulugu icin
  korunabilir; ancak canonical istemci akisi artik `export job` uzerinden
  calisir.
- Gateway `ExportGuardFilter` export akislarinda rate-limit ve `X-PII-Policy`
  header zorunlulugunu uygular.

-------------------------------------------------------------------------------
3) Canlı Yayın (SSE)
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/audit/events/live`
- Content-Type: `text/event-stream`
- Açıklama: Sunucu taraflı olayları gerçek zamanlı aktarır; bağlantı koparsa UI polling’e geri dönebilir.

-------------------------------------------------------------------------------
4) İç Servis Audit Ingest
-------------------------------------------------------------------------------

- Method: `POST`
- Path: `/api/v1/internal/audit/events`
- Header:
  - `X-Internal-Api-Key` zorunlu
- Amaç:
  - `auth-service` gibi iç servislerin kendi local audit kayıtlarını merkezi
    audit feed'e mirror etmesi.
- Request:
```json
{
  "eventType": "SESSION_CREATED",
  "performedBy": 99,
  "details": "Session created for user@example.com in company scope 42",
  "userEmail": "user@example.com",
  "service": "auth-service",
  "level": "INFO",
  "action": "SESSION_CREATED",
  "correlationId": "trace-123",
  "metadata": {
    "companyId": 42,
    "permissionCount": 3
  },
  "before": {},
  "after": {},
  "occurredAt": "2026-03-13T20:00:00Z"
}
```
- Response:
```json
{
  "status": "accepted",
  "auditId": "77"
}
```

-------------------------------------------------------------------------------
5) Deep‑Link
-------------------------------------------------------------------------------

- UI deep‑link örneği: `/admin/audit?event=a-123` (alternatif: `?auditId=a-123`)  
- Audit MFE, `event` veya `auditId` query param’ını alır; grid’de ilgili olayı
  vurgular ve drawer’ı açar.

-------------------------------------------------------------------------------
6) Güvenlik
-------------------------------------------------------------------------------

- Header: `Authorization: Bearer <jwt>`
- (opsiyonel) `X-Internal-Api-Key` — iç API’lerde fazladan doğrulama için
- Yanıt içindeki PII alanları (email, name, phone, address, token, identifier,
  IP vb.) sunucu tarafında maskelenir. E‑posta adresleri
  `a***@example.com` formatında kısaltılır; diğer string değerler ilk karakter
  + `***` ile gösterilir.

-------------------------------------------------------------------------------
7) Kabul Kriterleri
-------------------------------------------------------------------------------

- `id` param’ı verildiğinde tek olay döner (response `page=0`, `total=1`) veya 404 (bulunamadı).  
- Zaman aralığı/sayfalama deterministik; varsayılan ORDER BY `occurredAt desc`.  
- PII alanları maskelenir; payload diff’te yalnızca gerekli alanlar gösterilir.

-------------------------------------------------------------------------------
8) Hata Durumları
-------------------------------------------------------------------------------

- 400 `invalid_filter` — `from/to` tarihleri hatalı veya desteklenmeyen filtre kombinasyonu.  
- 401 `unauthorized` — geçersiz/eksik `Authorization` header.  
- 429 `too_many_requests` — export endpoint’i rate‑limit nedeniyle engellendiğinde.

-------------------------------------------------------------------------------
9) Bağlantılar
-------------------------------------------------------------------------------

- Permission ve user servislerinin mimari detayları için:  
  - docs/02-architecture/services/permission-service/TECH-DESIGN-*.md  
  - docs/02-architecture/services/user-service/TECH-DESIGN-user-service-overview.md  
