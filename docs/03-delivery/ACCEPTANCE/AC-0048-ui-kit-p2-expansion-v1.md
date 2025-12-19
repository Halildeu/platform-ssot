# AC-0048 – UI Kit P2 Expansion v1 Acceptance

ID: AC-0048  
Story: STORY-0048-ui-kit-p2-expansion-v1  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- UI Kit P2 Expansion v1 için test edilebilir kabul kriterlerini tanımlamak.  
- P2 kapsamının “doküman zinciri + kalite gate planı” üzerinden izlenebilir olmasını sağlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doc QA + story-links + doc-chain (STORY-0048)  
- L2/L3: P2 strict gate’ler ve smoke test planı (TP-0048 üzerinden)  
- Kapsamın NAV/FORM/DATA/OVERLAY paketleri olarak takip edilebilir olması  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Docflow (L1)

- [ ] Senaryo 1 – Doc QA + link zinciri geçer:
  - Given: STORY-0048, AC-0048 ve TP-0048 dokümanları şablona uygundur.  
  - When: Doc QA ve story link kontrolleri çalıştırılır.  
  - Then: Template/ID/konum + PROJECT-FLOW zinciri PASS olur.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/check_doc_templates.py`  
    - Script: `python3 scripts/check_doc_ids.py`  
    - Script: `python3 scripts/check_doc_locations.py`  
    - Script: `python3 scripts/check_story_links.py STORY-0048`  

### Plan (L2/L3)

- [ ] Senaryo 2 – L2/L3 doğrulama planı tanımlıdır:
  - Given: P2 expansion için kalite gate’leri planlanmıştır.  
  - When: TP-0048 incelenir.  
  - Then: L2/L3 adımları ve hedef kanıt formatı listelenmiştir.  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu doküman v1 için “kabul kriteri” odaklıdır; backlog/komponent listesi STORY/TP tarafında SSOT olarak tutulmalıdır.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- L1 docflow zinciri PASS olmalıdır.  
- L2/L3 gate’ler TP-0048’de planlanmış olmalıdır.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0048-ui-kit-p2-expansion-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0048-ui-kit-p2-expansion-v1.md  

