# TP-0046 – AI-Native Component Standard v1 Test Plan

ID: TP-0046  
Story: STORY-0046-ai-native-component-standard-v1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- AI-native komponent sözleşmesinin v1 doğrulama yaklaşımını tanımlamak.  
- Kontratın ekipler arası uygulanabilir ve test edilebilir olmasını sağlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doküman zinciri PASS (Doc QA + Story chain + PROJECT-FLOW render-check).  
- L2: Kontrat doğrulama gate’i (schema/typing) – plan.  
- L3: Örnek komponent senaryoları – plan.  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

### L1 (zorunlu – deterministik)

- `python3 scripts/docflow_next.py render-flow --check`  
- `python3 scripts/check_doc_templates.py`  
- `python3 scripts/check_doc_ids.py`  
- `python3 scripts/check_doc_locations.py`  
- `python3 scripts/check_story_links.py STORY-0046`  
- `python3 scripts/check_doc_chain.py STORY-0046`  

### L2/L3 (plan)

- Kontrat doğrulama yaklaşımı (schema/typing) ve örnek uygulama netleşince eklenir.  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] L1 – Doc QA + zincir (STORY-0046)  
- [ ] L2 – Kontrat doğrulama gate’i (plan)  
- [ ] L3 – Örnek akışlar (plan)  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- L1: Python Doc QA script’leri.  
- L2/L3: Kontrat doğrulama aracı (netleşince).  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Drift riski: “intent” ve “ui contract” farklı takımlarda ayrılaşırsa entegrasyon maliyeti büyür.  
- Error/fallback davranışı standartlaşmazsa kullanıcı deneyimi bozulur.  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- L1 ile delivery zinciri kilitlenir.  
- L2/L3 planı, kontrat uygulaması netleşince genişletilir.  

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0046-ai-native-component-standard-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0046-ai-native-component-standard-v1.md  

