# AC-0038 – Theme Runtime Integration Acceptance

ID: AC-0038  
Story: STORY-0038-theme-runtime-integration  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Tema runtime entegrasyonuna ilişkin governance kabul kriterlerini yeni
  doküman zincirinde doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- HTML data-* tema eksenleri (appearance/density/radius/elevation/motion).  
- Semantic token → CSS var → Tailwind mapping prensipleri.  
- UI Kit ve AG Grid’in bu eksenlere göre davranışı.  
- access prop’larının (`full|readonly|disabled|hidden`) tema/a11y ile
  ilişkilendirilmesi.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [x] Senaryo 1 – Tema Eksenleri:  
  - Given: HTML kökünde data-* eksenleri tanımlıdır.  
    When: Runtime tema switch akışı incelenir.  
    Then: Davranış Theme Runtime Integration için belirlenen doküman
    zinciriyle (STORY-0038 / AC-0038 / TP-0038) uyumludur.

- [x] Senaryo 2 – UI Kit & Grid:  
  - Given: UI Kit ve AG Grid bileşenleri tema/density/radius/elevation/
    motion kombinasyonlarına göre çalışmaktadır.  
    When: Örnek ekranlar ve dokümanlar incelenir.  
    Then: Governance seviyesinde beklenen kombinasyonlar tanımlanmıştır.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Teknik test ve görsel/a11y regresyon senaryoları ilgili TP-0038 içinde
  detaylandırılır; bu doküman governance checklist’ine odaklanır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Theme Runtime Integration kararı, yeni doküman yapısında izlenebilir
  hale getirilmiştir.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0038-theme-runtime-integration.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0038-theme-runtime-integration.md  
