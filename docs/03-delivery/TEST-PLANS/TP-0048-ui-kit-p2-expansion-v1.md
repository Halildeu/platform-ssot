# TP-0048 – UI Kit P2 Expansion v1 Test Plan

ID: TP-0048  
Story: STORY-0048-ui-kit-p2-expansion-v1  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- P2 genişleme programı için L1/L2/L3 doğrulama setini tanımlamak.  
- Autopilot üretim dalgasında “stable kapısı + guardrails” zincirinin bozulmamasını sağlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doküman zinciri PASS (Doc QA + Story chain + PROJECT-FLOW render-check).  
- L2: UI-kit strict guardrails + factory gate + designlab:index drift (deterministik).  
- L3: Design Lab smoke + “P2 demo render smoke” (Playwright plan).  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

### L1 (zorunlu – deterministik)

- `python3 scripts/docflow_next.py render-flow --check`  
- `python3 scripts/check_doc_templates.py`  
- `python3 scripts/check_doc_ids.py`  
- `python3 scripts/check_doc_locations.py`  
- `python3 scripts/check_story_links.py STORY-0048`  
- `python3 scripts/check_doc_chain.py STORY-0048`  

### L2 (zorunlu – ui-kit strict)

L2 giriş komutu (SSOT runner):
- `python3 scripts/docflow_next.py run STORY-0048 --level L2 --mode local --impact web`  

0) i18n gate v1.1 (ui-kit strict + shell rapor)
- `python3 scripts/check_i18n_key_usage.py`  (usage → dict strict)  
- `python3 scripts/check_i18n_hardcoded_strings.py --scope ui-kit-prod`  (strict)  
- `python3 scripts/check_i18n_hardcoded_strings.py --scope ui-kit-demo`  (strict)  
- `python3 scripts/check_i18n_hardcoded_strings.py --scope shell --report-path web/test-results/ops/i18n-hardcode-burndown.md`  (rapor, exit 0)  

1) Dynamic Axes guardrail (ui-kit strict)
- `python3 scripts/check_dynamic_axes_usage.py`  
- ui-kit scope ihlali → FAIL (exit 1)  

2) UI Kit Factory / Stable gate
- Local/Docflow: `python3 scripts/check_ui_kit_component_factory.py`  (eksikler WARN; exit 0)  
- CI/Web-QA: `python3 scripts/check_ui_kit_component_factory.py --strict`  (eksikler FAIL; exit 1)  

3) Design Lab index drift
- `npm -C web run designlab:index`  
- (gate) index drift check (Sprint 2+): export/where-used uyuşmazlığı → FAIL  

L2 Evidence formatı:
- i18n gate:
  - `python3 scripts/check_i18n_key_usage.py` PASS  
  - `python3 scripts/check_i18n_hardcoded_strings.py --scope ui-kit-prod` PASS  
  - `python3 scripts/check_i18n_hardcoded_strings.py --scope ui-kit-demo` PASS  
  - Shell burndown: `web/test-results/ops/i18n-hardcode-burndown.md`  
  - Shell top10: `web/test-results/ops/i18n-hardcode-top10.md`  
- Factory autopilot summary:
  - `web/test-results/ops/ui-kit-factory-summary.md` (Track: P2, sonuç tablosu)  
  - Beklenen: `Completed: true`, `Remaining: 0`  
  - Not: TourCoachmarks v1 “planned-only” olabilir (Spec/Demo/Export/DesignLab üretimi zorunlu değil).  
  - Kapanış (2025-12-18):
    - P2: `Completed: true`, `Remaining: 0` → `web/test-results/ops/ui-kit-factory-summary.md`
    - L2 PASS: `python3 scripts/docflow_next.py run STORY-0048 --level L2 --mode local --impact web`
- Design Lab index:
  - `web/apps/mfe-shell/src/pages/admin/design-lab.index.json`  

### L3 (Playwright – plan)

Amaç: “demo render” ve “taxonomy görünürlüğü” smoke doğrulaması.

- Design Lab smoke:
  - `/admin/design-lab` açılır  
  - `design-lab-tree` görünür  
  - 0-count subgroup’lar görünür (`(0)`)  
- P2 demo render smoke:
  - seçili bir P2 component demo alanı render olur (network yok, deterministik)  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] L1 – Doc QA + zincir:
  - render-flow --check  
  - check_doc_*  
  - check_story_links / check_doc_chain (STORY-0048)  

- [ ] L2 – Strict gate’ler:
  - check_dynamic_axes_usage (ui-kit strict)  
  - check_ui_kit_component_factory (local) / check_ui_kit_component_factory --strict (CI)  
  - designlab:index + drift check (plan)  

- [ ] L3 – Playwright (plan):
  - Design Lab smoke  
  - P2 demo render smoke  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- L1: Python doc QA script’leri (scripts/).  
- L2: Guardrail script’leri + web tooling (`npm -C web ...`).  
- L3: Playwright scenario runner (web/tests/playwright).  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Demo bakım yükü: demo’lar minimal/deterministik olmalı; business logic ve network yok.  
- Drift riski: export/where-used değişimlerinde `designlab:index` unutulursa görünürlük bozulur.  
- Strict gate geçişi: shell scope’ta grace kaldırılmadan P2 strict hedefi gürültü üretebilir; burn-down listesi şart.  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- L1 ile P2 doküman ve backlog SSOT deterministik kilitlenir.  
- L2 ile ui-kit strict guardrail ve stable kapısı korunur.  
- L3 ile Design Lab smoke + demo render smoke planlanır.  

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: `docs/03-delivery/STORIES/STORY-0048-ui-kit-p2-expansion-v1.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0048-ui-kit-p2-expansion-v1.md`  
- Upstream:
  - `docs/03-delivery/SPECS/SPEC-0008-ui-kit-component-test-factory-v1.md`  
  - `docs/00-handbook/DYNAMIC-AXES-CONTRACT-v1.md`  
