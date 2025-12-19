# TP-0045 – Invoice Approval v1 Test Plan

ID: TP-0045  
Story: STORY-0045-invoice-approval-v1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Invoice Approval v1 için L1 doküman zinciri ve test yaklaşımını tanımlamak.  
- AI önerisi + deterministik karar kombinasyonunun doğrulanabilir olmasını sağlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doküman zinciri PASS (Doc QA + Story chain + PROJECT-FLOW render-check).  
- L2/L3: Uygulama testleri (unit/integration/e2e) – plan.  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

### L1 (zorunlu – deterministik)

- `python3 scripts/docflow_next.py render-flow --check`  
- `python3 scripts/check_doc_templates.py`  
- `python3 scripts/check_doc_ids.py`  
- `python3 scripts/check_doc_locations.py`  
- `python3 scripts/check_story_links.py STORY-0045`  
- `python3 scripts/check_doc_chain.py STORY-0045`  

### L2/L3 (plan)

- Uygulama testleri için servis/endpoint netleşince ilgili test komutları buraya eklenecek.  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] L1 – Doc QA + zincir (STORY-0045)  
- [ ] L2/L3 – Uygulama test seti (plan)  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- L1: Python Doc QA script’leri.  
- L2/L3: Unit/Integration/E2E (servisler netleşince).  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Kritik risk: AI servis bağımlılığı sebebiyle flaky davranış; fallback testleri zorunlu.  
- Audit izinin atlanması veya drift üretmesi (regression).  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- L1 ile delivery zinciri kilitlenir.  
- L2/L3 planı, uygulama detayları netleşince genişletilir.  

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0045-invoice-approval-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0045-invoice-approval-v1.md  

