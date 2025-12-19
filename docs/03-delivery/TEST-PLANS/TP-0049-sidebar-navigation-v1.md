# TP-0049 – Sidebar & Navigation v1 Test Plan

ID: TP-0049  
Story: STORY-0049-sidebar-navigation-v1  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Sidebar ve navigasyonun (SSOT registry + UX davranışları) doğrulama planını tanımlamak.  
- Drift riskini (header vs sidebar) L2/L3 ile erken yakalamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doküman zinciri ve PROJECT-FLOW SSOT doğrulaması.  
- L2: UI kalite gate’leri (dynamic axes/hardcode + i18n + registry drift) – plan.  
- L3: Playwright E2E (sidebar navigation smoke) – plan.  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

### L1 (zorunlu – deterministik)

- `python3 scripts/docflow_next.py render-flow --check`  
- `python3 scripts/check_doc_templates.py`  
- `python3 scripts/check_doc_ids.py`  
- `python3 scripts/check_doc_locations.py`  
- `python3 scripts/check_story_links.py STORY-0049`  
- `python3 scripts/check_doc_chain.py STORY-0049`  

### L2 (plan – sidebar scope strict)

Hedef: Sidebar/nav scope’ta “hardcode” ve drift’i CI’da FAIL edecek gate’lere bağlamak.

- Dynamic axes / hardcode taraması (sidebar scope strict):
  - Tailwind default spacing/radius/duration, inline px/ms, arbitrary `[...]` kullanımı yakalanır.  
  - Beklenen: sidebar scope ihlali → FAIL.  
- i18n hardcoded taraması (sidebar/nav scope strict):
  - Nav item label’ları i18n key üzerinden gelmeli; hardcoded string drift’i FAIL.  
- Nav registry drift check:
  - Registry key/path/permission/labelKey değişimleri ile UI (header/sidebar) uyumsuzluğu FAIL.  

### L3 (plan – Playwright YAML senaryosu)

Senaryo hedefi (v1):
- Sidebar açılır ve görünür (`data-testid="shell-sidebar"`).  
- Collapse/expand yapılır ve persistence doğrulanır (reload).  
- Search açılır (Ctrl+K / search button), arama sonucu navigasyon yapılır.  
- Keyboard navigation: arrow + enter akışı.  
- Permission gating: token injection modunda yetkisiz item görünürlüğü/disable politikası doğrulanır.  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] L1 – Doc QA + zincir (STORY-0049)  
- [ ] L2 – Sidebar strict gate’ler (plan)  
- [ ] L3 – Playwright sidebar_navigation smoke (plan)  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- L1: Doc QA script’leri (Python).  
- L2: CI (web-qa) + quality guardrails (plan).  
- L3: Playwright scenario runner (plan).  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Flaky risk: keyboard/focus senaryoları selector stabilitesi ister (data-testid).  
- Drift riski: header/sidebar farklı kaynaklardan nav item üretirse davranış ayrışır.  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- L1 ile doküman zinciri kilitlenir.  
- L2/L3 ile sidebar UX ve SSOT drift kontrollü şekilde güvence altına alınır.  

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0049-sidebar-navigation-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0049-sidebar-navigation-v1.md  

-------------------------------------------------------------------------------
## 9. EVIDENCE (LAST KNOWN GOOD)
-------------------------------------------------------------------------------

- Playwright (local): `web/test-results/pw/pw-summary-2025-12-18T22-20-28-012Z.md` (PASS 8/8)  
  - Permission gating (hidden policy): yetkisiz item DOM’da yok (Playwright: `sidebar_navigation_smoke` içinde `expectNotPresent`)  
  - Komut: `PW_AUTH_MODE=token_injection PW_TEST_TOKEN=<redacted> npm -C web run pw:nightly`  
- L2 (web impact): `python3 scripts/docflow_next.py run STORY-0049 --level L2 --mode local --impact web` (PASS)  
