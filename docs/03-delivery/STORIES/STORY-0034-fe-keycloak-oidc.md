# STORY-0034 – FE Keycloak / OIDC Integration

ID: STORY-0034-fe-keycloak-oidc  
Epic: QLTY-FE-KEYCLOAK  
Status: Done  
Owner: @team/frontend  
Upstream: QLTY-FE-KEYCLOAK-01 (legacy spec)  
Downstream: AC-0034, TP-0034

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- FE shell ve MFE’lerde Keycloak tabanlı OIDC login akışını prod/test
  ortamlarında güvenli ve tutarlı şekilde devreye almak.  
- Axios interceptor üzerinden tüm `/api/v1/**` çağrılarına Bearer token
  eklenmesini ve yetkisiz durumlarda kontrollü redirect davranışını
  standardize etmek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Frontend ekibi olarak, shell ve MFE’lerin aynı Keycloak/OIDC client üzerinden login/register/refresh/logout akışını kullanmasını istiyoruz; böylece kimlik doğrulama davranışı her uygulamada aynı olsun.
- Güvenlik/ops ekibi olarak, prod/test ortamlarında zorunlu JWT + Bearer header, dev/local’de ise kontrollü permitAll davranışı istiyoruz; böylece güvenlik ve geliştirici deneyimi arasında dengeli bir yapı kurabilelim.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- FE shell’de Keycloak client konfigürasyonu (url/realm/clientId, prod/test
  profilleri).  
- `@mfe/shared-http` benzeri HTTP katmanında `Authorization: Bearer <token>`
  header’ının otomatik eklenmesi.  
- 401 yanıtlarında login sayfasına veya ortak “session expired” akışına
  yönlendirme.  
- Dev/local profillerinde dokümante edilmiş permitAll modu.

Hariç:
- Backend Keycloak/IdP konfigürasyon değişiklikleri (mevcut prod ayarları
  korunur).  
- MFA veya gelişmiş auth özellikleri (ayrı Story’lerle ele alınır).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] Prod/test çevrelerinde shell + MFE’ler Keycloak OIDC client ile
  login/refresh/logout akışını tamamlar; yetkisiz kullanıcılar korumalı
  sayfalara erişemez.  
- [x] HTTP katmanı tüm `/api/v1/**` çağrılarına Bearer token ekler; token
  yoksa veya süresi dolmuşsa FE login akışına yönlendirme yapılır.  
- [x] Dev/local profillerinde permitAll modu yalnız dokümante edilen
  ayarlar ile aktiftir.  
- [x] İlgili frontend mimari dokümanları ve CI/smoke testleri bu davranışı
  kanıtlar.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Legacy QLTY-FE-KEYCLOAK-01 story snapshot’ı  
- Legacy QLTY-FE-KEYCLOAK-01 acceptance snapshot’ı  
- STYLE-API-001.md  
- web/docs/architecture/frontend/frontend-project-layout.md (FE proje yapısı)  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Keycloak/OIDC entegrasyonu frontend tarafında yeni docs yapısında
  STORY/AC/TP zinciri ile izlenebilir hale getirilmiştir.  
- Prod/test ortamları için zorunlu JWT/Bearer akışı, dev/local için
  kontrollü permitAll davranışı standardize edilmiştir.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0034-fe-keycloak-oidc.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0034-fe-keycloak-oidc.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0034-fe-keycloak-oidc.md`  
- Legacy input seti: QLTY-FE-KEYCLOAK-01 archive snapshot’ı  
