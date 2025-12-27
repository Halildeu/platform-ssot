# AC-0305 – M3 Direct-Gen Üretim Sistemi v1 Acceptance

ID: AC-0305  
Story: STORY-0305-m3-direct-gen-production-system-v1  
Status: Done  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `SPEC-0012` ve delivery zinciri (STORY/AC/TP-0305) için test edilebilir kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Doküman üretim hattı tanımı (BM → Benchmark/Trend/GAP → Türetme).
- M3 kalite standardı (zorunlu 6 parça) ve türetme kuralları.
- Repo uyumu: PROJECT-FLOW güncellemesi + doc-qa gate PASS.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

- [x] Senaryo 1 – Doc QA PASS (render-flow + zincir):
  - Given: `SPEC-0012`, `STORY-0305`, `AC-0305`, `TP-0305` ve `docs/03-delivery/PROJECT-FLOW.tsv` günceldir.  
  - When: Doc QA script seti çalıştırılır.  
  - Then: tüm kontroller PASS olmalıdır.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/docflow_next.py render-flow --check`  
    - Script: `python3 scripts/check_doc_templates.py`  
    - Script: `python3 scripts/check_doc_ids.py`  
    - Script: `python3 scripts/check_unique_delivery_ids.py`  
    - Script: `python3 scripts/check_doc_locations.py`  
    - Script: `python3 scripts/check_story_links.py STORY-0305`  
    - Script: `python3 scripts/check_doc_chain.py STORY-0305`  

- [x] Senaryo 2 – SPEC kapsamı net ve tek SSOT:
  - Given: `docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md` dokümanı vardır.  
  - When: doküman bölümleri gözden geçirilir.  
  - Then: 3 faz üretim hattı + M3 rubrik + türetme kuralları + Appendix A mevcut olmalıdır.  

- [x] Senaryo 3 – Negatif: PROJECT-FLOW drift yakalanır:
  - Given: `docs/03-delivery/PROJECT-FLOW.tsv` güncellenmiş ama `docs/03-delivery/PROJECT-FLOW.md` render edilmemiştir.  
  - When: `python3 scripts/docflow_next.py render-flow --check` çalıştırılır.  
  - Then: drift hatası ile FAIL olmalıdır.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/docflow_next.py render-flow --check`  
    - Runbook: `docs/04-operations/RUNBOOKS/RB-insansiz-flow.md`  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu story kapsamı dokümantasyondur; auto-PR enable/policy değişimi içermez.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Zincir dokümanları eklendiğinde doc-qa PASS olmalıdır.
- Üretim hattı SSOT’u `SPEC-0012` altında tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0305-m3-direct-gen-production-system-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0305-m3-direct-gen-production-system-v1.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md  
