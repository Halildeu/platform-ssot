# AC-0035 – MF Router Shared & Version Pin Acceptance

ID: AC-0035  
Story: STORY-0035-mf-router-shared-version-pin  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- MF router shared & version pin kuralının hem config hem test seviyesi
  açısından beklendiği gibi uygulandığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- MF shared config (host + tüm remote MFE’ler).  
- package.json bağımlılık versiyonları.  
- Playwright/MF smoke testleri.  
- Frontend mimari dokümanı.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – MF shared config:
  - Given: Host ve tüm remotelar için MF config dosyaları vardır.  
    When: `react-router` ve `react-router-dom` paylaşımları incelenir.  
    Then: Tüm MFE’lerde bu paketler singleton ve aynı versiyonla shared
    olarak tanımlanmıştır.

- [ ] Senaryo 2 – package.json versiyonları:
  - Given: Host ve remote projelerin package.json dosyaları mevcuttur.  
    When: `react-router` ve `react-router-dom` versiyonları karşılaştırılır.  
    Then: MF shared config ile uyumsuz versiyon yoktur; drift durumunda CI
    kırmızıya döner.

- [ ] Senaryo 3 – Smoke test:
  - Given: MF stack docker/dev ortamında ayağa kaldırılmıştır.  
    When: Router smoke testi (ör. `tests/playwright/router-smoke.spec.ts`)
    çalıştırılır.  
    Then: Router drift veya çift kopya tespit edilirse test fail eder; drift
    yoksa yeşil geçer.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Versiyon pin denetimleri QLTY-FE-VERSIONS-01 kapsamıyla paylaşılabilir;
  bu acceptance yalnız router odaklı kontrolleri kapsar.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Router shared & version pin kuralı MF config, package.json ve smoke
  testler üzerinden doğrulanabildiğinde bu acceptance tamamlanmış sayılır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0035-mf-router-shared-version-pin.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0035-mf-router-shared-version-pin.md  
