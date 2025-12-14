# AC-0033 – Auth REST/DTO v1 Migration Acceptance

ID: AC-0033  
Story: STORY-0033-auth-rest-dto-v1  
Status: Planned  
Owner: @team/backend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Auth REST/DTO v1 geçişinin login/kayıt/şifre/e‑posta doğrulama akışları ve
  hata modeli açısından beklendiği gibi tamamlandığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `/api/v1/auth/sessions`, `/registrations`, `/password-resets`,
  `/password-resets/{token}`, `/email-verifications/{token}` uçları.  
- Legacy `/api/auth/*` uçları (deprecated mod).  
- `docs/03-delivery/api/auth.api.md` dokümanı.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Başarılı login:
  - Given: Geçerli kimlik bilgilerine sahip bir kullanıcı vardır.  
    When: `POST /api/v1/auth/sessions` ile login isteği yapılır.  
    Then: Yanıtta JWT, role, permissions ve `expiresAt/sessionTimeoutMinutes`
    alanları beklendiği gibi gelir.

- [ ] Senaryo 2 – Hatalı login:
  - Given: Hatalı parola ile giriş denemesi yapılır.  
    When: `POST /api/v1/auth/sessions` çağrılır.  
    Then: 401 döner ve gövdede ErrorResponse yapısı (`error`, `message`,
    `fieldErrors`, `meta.traceId`) bulunur.

- [ ] Senaryo 3 – Şifre sıfırlama akışı:
  - Given: Kayıtlı bir kullanıcı vardır.  
    When: `POST /api/v1/auth/password-resets` ve ardından
    `POST /api/v1/auth/password-resets/{token}` çağrılır.  
    Then: Kullanıcının parolası güncellenir ve eski token kullanılamaz hale
    gelir.

- [ ] Senaryo 4 – Legacy uçlar:
  - Given: Eski FE entegrasyonları `/api/auth/*` uçlarını kullanmaktadır.  
    When: Bu uçlara istek yapılır.  
    Then: Uçlar çalışmaya devam eder ancak log veya header seviyesinde
    deprecation sinyali verilir; yeni v1 uçlarının kullanılması gerektiği
    belgelenmiştir.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Performans ve rate-limit senaryoları TP-0033 test planında daha detaylı
  ele alınmalıdır.  
- Vault veya IdP kesintisi durumlarında verilecek yanıtlar
  (`VAULT_UNAVAILABLE` vb.) ayrı acceptance senaryolarında genişletilebilir.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Auth REST/DTO v1 geçişi, kritik akışlar ve hata modeli açısından güvenilir
  şekilde doğrulandığında bu acceptance tamamlanmış sayılır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0033-auth-rest-dto-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0033-auth-rest-dto-v1.md  

