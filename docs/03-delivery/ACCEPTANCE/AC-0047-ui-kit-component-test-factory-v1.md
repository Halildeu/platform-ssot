# AC-0047 – UI Kit Component Test Factory v1 Acceptance

ID: AC-0047  
Story: STORY-0047-ui-kit-component-test-factory-v1  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- UI Kit “component test factory” yaklaşımının v1 kabul kriterlerini tanımlamak.  
- Doküman zinciri ve kalite gate’lerinin uygulanabilir olmasını sağlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doc QA + story-links + doc-chain  
- L2/L3: Gate tasarımı ve planlanmış doğrulama adımları  
- UI Kit genişleme story’lerinde (örn. STORY-0048) referanslanabilirlik  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Docflow (L1)

- [ ] Senaryo 1 – Doc QA geçer:
  - Given: STORY-0047, AC-0047 ve TP-0047 dokümanları şablona uygundur.  
  - When: Doc QA script seti çalıştırılır.  
  - Then: Template/ID/konum kontrolleri PASS olur.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/check_doc_templates.py`  
    - Script: `python3 scripts/check_doc_ids.py`  
    - Script: `python3 scripts/check_doc_locations.py`  

- [ ] Senaryo 2 – PROJECT-FLOW zinciri geçer:
  - Given: STORY-0047 satırı PROJECT-FLOW SSOT’ta yer alır.  
  - When: Story link kontrolü çalıştırılır.  
  - Then: STORY/AC/TP linkleri tutarlıdır.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/check_story_links.py STORY-0047`  

### Plan (L2/L3)

- [ ] Senaryo 3 – L2/L3 gate yaklaşımı tanımlıdır:
  - Given: UI Kit kalite gate’leri planlanmıştır.  
  - When: TP-0047 incelenir.  
  - Then: L1 zorunlu, L2/L3 plan adımları net listelenmiştir.  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- v1’de geriye dönük tüm UI Kit komponentleri için zorunlu refactor yoktur; kademeli geçiş hedeflenir.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- L1 docflow doğrulaması zorunludur.  
- L2/L3 gate tasarımı TP-0047’de net olmalıdır.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0047-ui-kit-component-test-factory-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0047-ui-kit-component-test-factory-v1.md  

