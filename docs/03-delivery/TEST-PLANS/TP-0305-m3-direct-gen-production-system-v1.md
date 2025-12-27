# TP-0305 – M3 Direct-Gen Üretim Sistemi v1 Test Plan

ID: TP-0305  
Story: STORY-0305-m3-direct-gen-production-system-v1  
Status: Done  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `SPEC-0012` ve STORY/AC/TP-0305 doküman zincirinin doc-qa gate’lerine uyumunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Docs QA: render-flow drift, template, ID, location, unique ID, story links, doc chain.
- İçerik doğrulama: `SPEC-0012` bölümlerinin bulunurluğu (manuel gözden geçirme).

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Önce `PROJECT-FLOW.tsv` güncellenir ve `render-flow` ile `PROJECT-FLOW.md` senkronlanır.
- Ardından Doc QA gate seti çalıştırılır; PASS olmadan tamamlandı sayılmaz.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] Senaryo 1 – `python3 scripts/docflow_next.py render-flow --check` PASS.  
- [x] Senaryo 2 – `python3 scripts/check_doc_templates.py` PASS.  
- [x] Senaryo 3 – `python3 scripts/check_doc_ids.py` ve `python3 scripts/check_unique_delivery_ids.py` PASS.  
- [x] Senaryo 4 – `python3 scripts/check_doc_locations.py` PASS.  
- [x] Senaryo 5 – `python3 scripts/check_story_links.py STORY-0305` PASS.  
- [x] Senaryo 6 – `python3 scripts/check_doc_chain.py STORY-0305` PASS.  
- [x] Senaryo 7 – Negatif: PROJECT-FLOW drift `python3 scripts/docflow_next.py render-flow --check` ile yakalanır.  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3.x
- Repo scriptleri: `scripts/check_*.py`, `scripts/docflow_next.py`

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik risk: `PROJECT-FLOW.md` drift (mitigasyon: `render-flow`).
- post-deploy doğrulama (docs): PR/merge sonrası CI `Doc QA` workflow PASS olmalıdır (`.github/workflows/doc-qa.yml`).
- rollback / geri alma: gerekiyorsa ilgili commit revert edilerek doküman zinciri rollback yapılır.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu plan, doküman zincirinin deterministik olarak PASS olmasını hedefler.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0305-m3-direct-gen-production-system-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0305-m3-direct-gen-production-system-v1.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md  
