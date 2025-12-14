## Ortak Başlıklar (Scope & Güvenlik)

Amaç: Şirket/proje/depo bağlamı gerektiren uçlarda gönderilecek standart
başlıkları ve güvenlik beklentilerini tanımlamak.

-------------------------------------------------------------------------------
1) Başlıklar
-------------------------------------------------------------------------------

- Zorunlu:
  - `X-Company-Id`
- Opsiyonel:
  - `X-Project-Id`
  - `X-Warehouse-Id`
- Güvenlik:
  - `Authorization: Bearer <jwt>`
  - (opsiyonel) `X-Internal-Api-Key` (sadece iç API’lerde)

Örnek:
```http
X-Company-Id: 42
X-Project-Id: 7
Authorization: Bearer eyJ...
```

-------------------------------------------------------------------------------
2) Bağlantılar
-------------------------------------------------------------------------------

- docs/03-delivery/api/users.api.md  
- docs/03-delivery/api/auth.api.md  
- docs/03-delivery/api/permission.api.md  
- backend/docs/legacy/root/01-architecture/03-services/01-user-service.md  
- backend/docs/legacy/root/01-architecture/03-services/02-permission-service.md  

-------------------------------------------------------------------------------
3) Notlar
-------------------------------------------------------------------------------

- Header isimleri ve güvenlik beklentileri
  `docs/00-handbook/STYLE-API-001.md` altında tanımlanan genel API güvenlik
  standartları ile uyumludur.

