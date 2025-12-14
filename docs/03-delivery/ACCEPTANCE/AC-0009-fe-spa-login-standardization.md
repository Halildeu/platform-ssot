# AC-0009 – FE SPA Login Standardization Acceptance

ID: AC-0009  
Story: STORY-0009-fe-spa-login-standardization  
Status: Planned  
Owner: @team/frontend

## 1. AMAÇ

- SPA login akışının (LoginPage + silent-check-sso + ProtectedRoute)
  kullanıcı deneyimi ve dokümantasyon açısından QLTY-FE-SPA-LOGIN-01
  gereksinimlerini karşıladığını doğrulamak.

## 2. KAPSAM

- `/login` rotasının shell içinde SPA bileşeni olarak çalışması.
- silent-check-sso, token refresh, redirect ve 401/403 davranışları.
- İlgili frontend mimari/dokümantasyon güncellemeleri.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – SPA Login Page:
  - Given: Shell uygulaması ve Keycloak entegrasyonu konfigüre edilmiştir.  
    When: Kullanıcı `/login` rotasına gider.  
    Then: Login sayfası shell içinde SPA bileşeni olarak render edilir; Keycloak
    ekranı yalnızca bizim UI üzerindeki login butonu çağrıldığında açılır.

- [ ] Senaryo 2 – silent-check-sso & redirect:
  - Given: Kullanıcının geçerli oturumu vardır veya refresh ile yenilenebilir.  
    When: Kullanıcı korunan bir route’a gider ve auth provider silent-check-sso
    akışını tetikler.  
    Then: Session yenilenir ve kullanıcı redirect parametresi ile önceki
    sayfaya döner.

- [ ] Senaryo 3 – 401/403 ve hata bildirimi:
  - Given: Kullanıcının oturumu geçersizdir veya yetkisi yoktur.  
    When: Korunan route’a erişim denendiğinde 401/403 alınır.  
    Then: Uygulama otomatik logout + redirect davranışı uygular; shell
    üzerinde toast/hata bildirimi gösterilir ve bu davranış dokümante edilmiştir.

## 4. NOTLAR / KISITLAR

- Detaylı unit/e2e senaryoları TP-0009 test planında listelenecektir.

## 5. ÖZET

- SPA login akışı shell tarafında tutarlı hale getirilmiş, silent-check-sso
  ve hata durumları öngörülebilir olmaktadır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0009-fe-spa-login-standardization.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0009-fe-spa-login-standardization.md  
- Legacy Acceptance: backend/docs/legacy/root/05-governance/07-acceptance/QLTY-FE-SPA-LOGIN-01.acceptance.md  

