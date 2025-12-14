# TP-0002 – Backend Keycloak JWT Sertleştirme Test Planı

ID: TP-0002  
Story: STORY-0002-backend-keycloak-jwt-hardening
Status: Draft  
Owner: @team/backend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Backend servislerde Keycloak JWT sertleştirme çalışmasının doğrulanması:
  - Prod/test profillerinde yalnız geçerli Keycloak JWT’lerin kabul edilmesi,
  - Dev/local profillerinde kontrollü permitAll/legacy davranışı,
  - Güvenlik smoke test pipeline’ının yeşil olması.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Dahil:
  - api-gateway, auth-service, user-service, permission-service, variant-service.
  - Prod/test ve dev/local profilleri.
- Hariç:
  - FE shell güvenlik akışları (ayrı story/acceptance ile ele alınır).

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Profil bazlı test:
  - Prod/test → yalnız Keycloak JWT.  
  - Dev/local → permitAll + legacy token akışları.
- Otomatik ve manuel smoke test kombinasyonu:
  - mvn test profili + curl zinciri.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

### 1) Prod/Test – Geçerli JWT

- [ ] Geçerli Keycloak JWT ile `/api/users` isteği 200 döner.  
- [ ] Geçerli JWT ile `/api/permissions` isteği 200 döner.  
- [ ] Geçerli JWT ile `/api/variants` isteği 200 döner.

### 2) Prod/Test – Legacy Token / Hatalı JWT

- [ ] Legacy service token ile `/api/users` isteği 401/403 döner ve log’da `legacy_token_blocked` etiketi görülür.  
- [ ] Yanlış imzalı JWT ile istekler 401 döner; loglarda uygun hata mesajı yer alır.

### 3) Dev/Local – PermitAll & Legacy Davranışı

- [ ] Dev profilde legacy service token ile istekler kabul edilir (bekleniyorsa).  
- [ ] PermitAll profilde test endpoint’leri authentication olmadan çalışır; prod/test’te bu davranış gözlenmez.

### 4) Pipeline & Runbook

- [ ] Güvenlik smoke test pipeline (mvn + curl) yeşil.  
- [ ] RB-keycloak güncellenip gözden geçirilmiştir (break-glass/rollback adımları dahil).

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- CI:
  - Security smoke pipeline (mvn profili + curl script).
- Ortamlar:
  - Dev/local, test, prod.

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Yanlış config’in prod’da permitAll’a yol açması en kritik risktir; prod/test için ayrı config doğrulama adımları zorunludur.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu plan, backend Keycloak JWT sertleştirme çalışmasının doğru uygulandığını
  ve geri dönüş (rollback) adımlarının hazır olduğunu doğrular.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0002-backend-keycloak-jwt-hardening.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0002-backend-keycloak-jwt-hardening.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-keycloak.md  
