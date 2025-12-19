# TP-0047 – UI Kit Component Test Factory v1 Test Plan

ID: TP-0047  
Story: STORY-0047-ui-kit-component-test-factory-v1  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- UI Kit component test factory v1 için L1/L2/L3 doğrulama setini tanımlamak.  
- Docflow zinciri ve gate yaklaşımını netleştirerek kalite drift’ini azaltmak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doküman zinciri PASS (Doc QA + Story chain + PROJECT-FLOW render-check).  
- L2: UI Kit kalite gate tasarımı (plan).  
- L3: UI Kit demo/smoke doğrulaması (plan).  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

### L1 (zorunlu – deterministik)

- `python3 scripts/docflow_next.py render-flow --check`  
- `python3 scripts/check_doc_templates.py`  
- `python3 scripts/check_doc_ids.py`  
- `python3 scripts/check_doc_locations.py`  
- `python3 scripts/check_story_links.py STORY-0047`  
- `python3 scripts/check_doc_chain.py STORY-0047`  

### L2/L3 (plan)

- UI Kit scope “strict” gate’leri ve demo/smoke seti netleşince eklenir.  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] L1 – Doc QA + zincir (STORY-0047)  
- [ ] L2 – UI Kit gate’ler (plan)  
- [ ] L3 – Demo/smoke (plan)  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- L1: Python Doc QA script’leri.  
- L2/L3: UI Kit kalite script’leri ve web tooling (netleşince).  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Drift riski: komponent artefact standardı uygulanmazsa genişleme story’leri (örn. STORY-0048) tutarsızlaşır.  
- Gate’ler fazla gürültülü olursa false-positive üretir; scope ve allowlist tasarımı önemlidir.  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- L1 ile delivery zinciri kilitlenir.  
- L2/L3 planı, gate tasarımı netleşince genişletilir.  

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0047-ui-kit-component-test-factory-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0047-ui-kit-component-test-factory-v1.md  

