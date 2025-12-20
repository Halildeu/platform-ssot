# AC-0048 – UI Kit P2 Expansion v1 Acceptance

ID: AC-0048  
Story: STORY-0048-ui-kit-p2-expansion-v1  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- UI Kit P2 kapsamının (NAV/FORM/DATA/OVERLAY) “tek zincir” kalite kontratlarına uygun şekilde tamamlandığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- P2 backlog SSOT + drift gate yaklaşımı.  
- Spec/Demo/Design Lab görünürlüğü ve “stable” tanımı.  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

- [x] Senaryo 1 – Doküman zinciri PASS:
  - Given: `STORY-0048`, `AC-0048`, `TP-0048` mevcuttur.  
  - When: Doc QA çalıştırılır.  
  - Then: Şablon/ID/lokasyon/zincir kontrolleri PASS olmalıdır.  

### Web

- [x] Senaryo 2 – P2 paketleri tamamlanmıştır:
  - Given: P2 kapsamı NAV/FORM/DATA/OVERLAY alt başlıklarıyla tanımlıdır.  
  - When: UI Kit backlog SSOT takip edilir.  
  - Then: P2 kapsamı tamamlanmış görünmelidir (remaining=0 hedefi).  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- P2 kapsamı genişledikçe “tek zincir” kontratları gevşetilmez; drift gate kırılımı regresyon sayılır.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- UI Kit P2 genişleme v1 acceptance kriterleri tamamlanmıştır.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0048-ui-kit-p2-expansion-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0048-ui-kit-p2-expansion-v1.md  

