# TEST-PLAN – FE Keycloak / OIDC Integration

ID: TP-0034  
Story: STORY-0034-fe-keycloak-oidc
Status: Planned  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Frontend Keycloak/OIDC entegrasyonunun AC-0034’te tanımlanan senaryolara
  göre doğru çalıştığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- FE shell login/refresh/logout akışları.  
- HTTP katmanında Bearer header eklenmesi ve 401/redirect davranışları.  
- Dev/local permitAll modu.  
- İlgili CI/smoke testleri.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Vitest/Jest tabanlı FE birim ve entegrasyon testleri ile login/route
  koruma davranışını doğrulamak.  
- Gerekirse e2e veya smoke test ile gerçek Keycloak ortamında akışı
  doğrulamak.  
- Gateway log’larında Authorization header ve 401 durumlarını incelemek.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Başarılı login ve korumalı sayfalara erişim.  
- [ ] Token süresi dolduğunda yenileme veya redirect akışı.  
- [ ] Bearer header’ın tüm kritik `/api/v1/**` çağrılarına eklenmesi.  
- [ ] Dev/local permitAll modunun sınırlarının test edilmesi.  
- [ ] Prod/test ortamlarında permitAll davranışının devre dışı olması.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- FE test runner (Vitest/Jest).  
- Gerekirse Playwright/Cypress ile e2e smoke testleri.  
- Keycloak test realm’i veya QA ortamı.  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Yanlış konfigürasyon prod/test’te 401 fırtınasına neden olabilir; rollout
  için feature flag önerilir.  
- Local permitAll sınırlarının belirsiz olması güvenlik borcu yaratabilir;
  dokümantasyon kritik.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, frontend Keycloak/OIDC entegrasyonunun tüm kritik
  senaryolarda güvenilir ve öngörülebilir şekilde çalıştığını doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0034-fe-keycloak-oidc.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0034-fe-keycloak-oidc.md  

