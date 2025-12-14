# AC-0039 – Theme Overlay & Grid Tone Acceptance

ID: AC-0039  
Story: STORY-0039-theme-overlay-and-grid-tone  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Overlay ve grid yüzey tonu kararlarının yeni doküman zincirinde
  governance seviyesinde doğrulandığını göstermek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Dark/HC overlay token’ları ve table surface tonları.  
- UI Kit overlay bileşenleri ve grid yüzeyi.  
- Tema panelindeki ilgili kontroller.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [x] Senaryo 1 – Overlay Token Zinciri:  
  - Given: Overlay ve table surface için token → CSS var zinciri vardır.  
    When: Yeni Story/AC/TP dokümanları incelenir.  
    Then: Zincirin ana adımları bu dokümanlarda net şekilde tanımlanmıştır.

- [x] Senaryo 2 – Grid Yüzeyi:  
  - Given: Grid yüzeyi `var(--table-surface-bg)` üzerinden boyanır.  
    When: Governance dokümanları incelenir.  
    Then: Bu davranış E03-S03 acceptance ile uyumludur.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Teknik ve görsel testler TP-0039 içinde detaylandırılacaktır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Overlay ve grid yüzeyi için ana governance kararları yeni acceptance
  dokümanına taşınmıştır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0039-theme-overlay-and-grid-tone.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0039-theme-overlay-and-grid-tone.md  
