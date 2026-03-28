# STORY-0035 – MF Router Shared & Version Pin

ID: STORY-0035-mf-router-shared-version-pin  
Epic: QLTY-MF-ROUTER  
Status: Done  
Owner: @team/frontend  
Upstream: QLTY-MF-ROUTER-01 (legacy snapshot), STYLE-WEB-001.md  
Downstream: AC-0035, TP-0035

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Frontend MFE’lerinde `react-router` ve `react-router-dom` bağımlılıklarının
  tek kopya/singleton olarak paylaşılmasını ve versiyon drift’inin engellenmesini
  sağlamak.  
- Bu kuralın MF shared config, package.json ve smoke testler üzerinden
  izlenebilir olmasını sağlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Frontend platform ekibi olarak, host ve tüm remote MFE’lerin aynı router kopyasını ve versiyonunu kullanmasını istiyoruz; böylece navigation ve guard davranışları her yerde tutarlı olsun.
- Ops/QA ekibi olarak, router drift veya çift kopya durumunun MF smoke testlerinde erken kırmızıya düşmesini istiyoruz; böylece prod’da gizli router hataları yaşamayalım.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- MF shared listesinde `react-router` ve `react-router-dom` paketlerinin
  singleton + versiyon pin’i ile tanımlanması.  
- package.json bağımlılık versiyonlarının MF shared ile uyumlu tutulması.  
- Playwright veya MF smoke testlerinde router drift/çift kopya tespiti.  
- Frontend mimari dokümanında (shell/router bölümü) bu kuralın açıkça
  belgelenmesi.

Hariç:
- Keycloak/OIDC entegrasyonu (QLTY-FE-KEYCLOAK-01 kapsamında).  
- UI Kit model seçimi ve komponent yapısı (QLTY-MF-UIKIT-01 kapsamında).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] Shell ve tüm remote MFE’lerin MF shared listesinde `react-router` ve
  `react-router-dom` singleton + aynı versiyonla tanımlıdır.  
- [x] package.json bağımlılık versiyonları MF shared config ile uyumludur;
  drift yoktur.  
- [x] Playwright veya MF smoke testi router drift/çift kopya tespitini
  yapar ve hata durumunda CI kırmızıya düşer.  
- [x] Frontend mimari dokümanında v1 router paylaşım kuralı ve versiyon pin
  gereksinimi açıkça yazılıdır.  
- [x] PROJECT-FLOW ve session-log QLTY-MF-ROUTER-01 için Done durumunu
  göstermektedir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Legacy QLTY-MF-ROUTER-01 story snapshot’ı  
- Legacy QLTY-MF-ROUTER-01 acceptance snapshot’ı  
- web/docs/01-architecture/01-shell/01-frontend-architecture.md  
- STYLE-WEB-001.md  
- QLTY-FE-VERSIONS-01 (versiyon pin audit)

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- MF router shared & version pin kuralı yeni docs yapısında STORY/AC/TP
  zinciri ile izlenebilir hale getirilmiştir.  
- Amaç, hem kodda hem CI’de router drift/çift kopya riskini erken ve
  deterministik şekilde yakalamaktır.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0035-mf-router-shared-version-pin.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0035-mf-router-shared-version-pin.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0035-mf-router-shared-version-pin.md`  
- Legacy input seti: QLTY-MF-ROUTER-01 archive snapshot’ı  
