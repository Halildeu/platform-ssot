# TP-0009 – FE SPA Login Standardization Test Planı

ID: TP-0009  
Story: STORY-0009-fe-spa-login-standardization
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- SPA login akışının (LoginPage, silent-check-sso, ProtectedRoute, 401/403
  davranışları) PRD/Story ve AC-0009’daki gereksinimlere uygun çalıştığını
  doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- `/login` route ve LoginPage bileşeni.
- ProtectedRoute + auth provider davranışları.
- silent-check-sso, redirect parametreleri ve 401/403 akışları.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Fonksiyonel testler:
  - Mutlu akış: geçerli oturum, redirect sonrası doğru route.
  - Oturum süresi dolmuş / yetkisiz senaryolar.
- Negatif testler:
  - Hatalı redirect parametreleri, expired token.
- E2E / UI testleri:
  - Playwright/Cypress ile temel login ve redirect senaryoları.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] SPA /login mutlu akış.  
- [ ] silent-check-sso ile sessiz giriş.  
- [ ] 401/403 sonrası otomatik logout ve redirect.  
- [ ] Hatalı redirect parametresi veya expired token davranışı.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Ortamlar:
  - Dev/stage ortamları; ilgili Keycloak realm konfigürasyonu.
- Araçlar:
  - Playwright/Cypress, Jest/RTL.
  - Browser devtools ve log panelleri.

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik riskler:
  - Yanlış redirect veya infinite redirect loop.
  - Sessiz girişin beklenmeyen logout’a sebep olması.
- Öncelikli senaryolar:
  - Mutlu login akışları ve 401/403 fallback davranışları.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı SPA login akışının fonksiyonel davranışını ve ana edge case’leri
  doğrulamayı hedefler.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0009-fe-spa-login-standardization.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0009-fe-spa-login-standardization.md  

