# AC-0034 – FE Keycloak / OIDC Integration Acceptance

ID: AC-0034  
Story: STORY-0034-fe-keycloak-oidc  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Frontend Keycloak/OIDC entegrasyonunun login/refresh/logout, Bearer header
  ve permitAll davranışları açısından beklendiği gibi çalıştığını
  doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- FE shell ve MFE’lerin Keycloak client kullanımı.  
- HTTP katmanında Bearer token eklenmesi ve 401/redirect davranışı.  
- Dev/local profillerinde permitAll modu.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Başarılı login:
  - Given: Geçerli Keycloak kullanıcı hesabı vardır.  
    When: Kullanıcı shell login ekranından giriş yapar.  
    Then: OIDC akışı başarıyla tamamlanır, FE tarafında oturum açılmış
    durumda ProtectedRoute alanlarına erişilebilir.

- [ ] Senaryo 2 – Token süresi doldu:
  - Given: Kullanıcı login olmuştur ve access token süresi dolmuştur.  
    When: FE tarafı yeni bir API çağrısı yapar.  
    Then: Token yenilenir veya 401 alınırsa kullanıcı login ekranına veya
    kontrollü “session expired” akışına yönlendirilir.

- [ ] Senaryo 3 – Bearer header:
  - Given: Kullanıcı login olmuştur.  
    When: FE herhangi bir `/api/v1/**` endpoint’ine istek gönderir.  
    Then: İstek Header’ında `Authorization: Bearer <jwt>` bulunur; dev/local
    profilinde permitAll modunda ise bu header opsiyoneldir.

- [ ] Senaryo 4 – Dev/local permitAll:
  - Given: Uygulama dev veya local profilde çalışmaktadır.  
    When: FE, kimlik doğrulama olmadan belirli ekranlara erişir.  
    Then: Dokümante edilmiş permitAll kapsamı içinde bu erişim mümkündür;
    prod/test’te aynı davranış gözlenmez.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Detaylı test akışları ve CI log’ları TP-0034 test planında
  listelenecektir.  
- Backend Keycloak ayarları kapsam dışıdır; yalnız FE tarafındaki client
  ve HTTP davranışı kontrol edilir.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Bu acceptance, frontend Keycloak/OIDC entegrasyonunun hem prod/test hem
  de dev/local profillerinde beklenen davranışı sağladığını doğrular.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0034-fe-keycloak-oidc.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0034-fe-keycloak-oidc.md  

