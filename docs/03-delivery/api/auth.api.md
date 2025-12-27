## Auth API (v1) — Login, Kayıt, Şifre İşlemleri

Amaç: Kullanıcıların giriş, kayıt, şifre sıfırlama ve e‑posta doğrulama
işlemlerini güvenli ve tutarlı bir sözleşme üzerinden yürütmek; FE/MFE
uygulamalarının kimlik altyapısı ile aynı API seti üzerinden çalışmasını
sağlamak.

-------------------------------------------------------------------------------
1) Login — v1
-------------------------------------------------------------------------------

- Method: `POST`  
- Path: `/api/v1/auth/sessions`  
- Body:
```json
{ "email": "admin@example.com", "password": "admin1234", "companyId": 1 }
```
- Response:
```json
{
  "token": "<JWT>",
  "email": "admin@example.com",
  "role": "ADMIN",
  "permissions": ["VIEW_USERS", "MANAGE_USERS"],
  "expiresAt": 1762624688000,
  "sessionTimeoutMinutes": 15
}
```

-------------------------------------------------------------------------------
2) Kayıt — v1
-------------------------------------------------------------------------------

- Method: `POST`  
- Path: `/api/v1/auth/registrations`  
- Body:
```json
{ "name": "Yeni Kullanıcı", "email": "new@example.com", "password": "Strong#123" }
```
- Response:
```json
{
  "userId": 42,
  "email": "new@example.com",
  "status": "PENDING_VERIFICATION",
  "message": "Kayıt talebiniz alındı. Lütfen e-posta adresinizi doğrulayın."
}
```

-------------------------------------------------------------------------------
3) Şifre Sıfırlama — v1
-------------------------------------------------------------------------------

- İstek oluştur: `POST /api/v1/auth/password-resets`  
```json
{ "email": "user@example.com" }
```
- Şifreyi güncelle: `POST /api/v1/auth/password-resets/{token}`  
```json
{ "newPassword": "YeniParola#123" }
```

-------------------------------------------------------------------------------
4) E-posta Doğrulama — v1
-------------------------------------------------------------------------------

- Method: `POST`  
- Path: `/api/v1/auth/email-verifications/{token}`

-------------------------------------------------------------------------------
5) JWT Claims (Özet)
-------------------------------------------------------------------------------

- `sub`: kullanıcı e‑postası  
- `iss`: `auth-service`  
- `aud`: varsayılan `user-service` (çoklu aud desteklenebilir)  
- `userId`, `role`, `permissions[]`, `companyId?`, `sessionTimeoutMinutes`

-------------------------------------------------------------------------------
6) Hata Modeli (ErrorResponse)
-------------------------------------------------------------------------------

```json
{
  "error": "invalid_credentials",
  "message": "Email veya şifre hatalı",
  "fieldErrors": [],
  "meta": { "traceId": "abc-123" }
}
```

-------------------------------------------------------------------------------
7) Legacy / Deprecated Uçlar
-------------------------------------------------------------------------------

Aşağıdaki uçlar legacy olup geriye dönük uyumluluk için çalışmaya devam eder;
yeni geliştirmelerde v1 uçları tercih edilmelidir:

- `/api/auth/login`  
- `/api/auth/register`  
- `/api/auth/forgot-password`  
- `/api/auth/reset-password`  
- `/api/auth/verify-email`

-------------------------------------------------------------------------------
8) Güvenlik
-------------------------------------------------------------------------------

- Bearer token zorunlu; servis‑içi uçlar için service token’lar `client_credentials` akışı ile mint edilir.  
- Ortak header sözleşmesi: `docs/03-delivery/api/common-headers.md`

-------------------------------------------------------------------------------
9) Bakım / Vault Outage Yanıtı (Özet)
-------------------------------------------------------------------------------

Vault erişilmezken gateway `/api/v1/auth/*` çağrılarına 503 dönebilir:

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 60
X-Serban-Outage-Code: VAULT_UNAVAILABLE
Content-Type: application/json

{
  "error": "vault_unavailable",
  "message": "Kimlik altyapısı devrede değil. Bakım tamamlanınca otomatik denenecek.",
  "fieldErrors": [],
  "meta": {
    "traceId": "abc-123",
    "outageCode": "VAULT_UNAVAILABLE"
  }
}
```

FE davranışı (özet):
- `outageCode === "VAULT_UNAVAILABLE"` aldığında Shell `MaintenanceBanner` bileşenini gösterir, periyodik retry 60 saniye aralıkla yapılır.

-------------------------------------------------------------------------------
10) Bağlantılar
-------------------------------------------------------------------------------

- docs/03-delivery/api/common-headers.md  
- docs/03-delivery/guides/GUIDE-0001-api-client-updates.md  
