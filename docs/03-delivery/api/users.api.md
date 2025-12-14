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
5) Hata Modeli (ErrorResponse)
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
6) Güvenlik
-------------------------------------------------------------------------------

- Header: `Authorization: Bearer <jwt>`  
- Scope header'ları için: `docs/03-delivery/api/common-headers.md`

-------------------------------------------------------------------------------
7) Legacy / Deprecated Uçlar
-------------------------------------------------------------------------------

Aşağıdaki uçlar legacy olup geriye dönük uyumluluk için çalışmaya devam eder;
yeni geliştirmelerde v1 path'i tercih edilmelidir:

- `/api/users/all`  
- `/api/users/by-email/{email}`  
- `/api/users/register`  
- `/api/users/public/register`  
- `/api/users/internal/*`

-------------------------------------------------------------------------------
8) Kabul Kriterleri (Özet)
-------------------------------------------------------------------------------

- SSRM uyumlu deterministik sayfalama.  
- `advancedFilter` whitelist dışına çıktığında 400 `invalid_advanced_filter`.  
- `items/total/page/pageSize` zarfı FE/BE uyumlu.

-------------------------------------------------------------------------------
9) Bağlantılar
-------------------------------------------------------------------------------

- docs/02-architecture/services/user-service/TECH-DESIGN-user-service-overview.md  
