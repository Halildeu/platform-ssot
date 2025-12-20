# TP-0050 – i18n Locale Propagation Fix v1 Test Plan

ID: TP-0050  
Story: STORY-0050-i18n-locale-propagation-fix-v1  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Locale switch sonrası stale UI riskini unit + e2e ile güvence altına almak.  
- Playwright smoke koşumunda backend bağımlılığı kaynaklı flakiness’i azaltmak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1: Doc QA + zincir (STORY/AC/TP + PROJECT-FLOW).  
- Unit: `pnpm -C web test` (MFE paket testleri).  
- E2E: Playwright YAML scenario runner (`story_0050_locale_switch_propagation`).  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

### L1 (zorunlu – deterministik)

- `python3 scripts/check_story_links.py STORY-0050`  
- `python3 scripts/check_doc_chain.py`  
- `python3 scripts/docflow_next.py render-flow`  

### Unit (zorunlu)

- `pnpm -C web test`  

### E2E (zorunlu – smoke)

- Public smoke:
  - `PW_MOCK_THEME_REGISTRY=1 PW_MOCK_API=0 pnpm -C web run pw:nightly --grep shell_login`  
- Auth-required smoke:
  - `PW_AUTH_MODE=token_injection PW_TEST_TOKEN=<redacted> PW_MOCK_THEME_REGISTRY=1 PW_MOCK_API=1 pnpm -C web run pw:nightly --grep story_0050_locale_switch_propagation`  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] L1 – Doc QA + zincir (STORY-0050)  
- [x] Unit – `pnpm -C web test`  
- [x] E2E – `story_0050_locale_switch_propagation` PASS + telemetry 5xx=0  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Node/pnpm (web workspace)  
- Playwright (scenario runner)  
- Python (docflow + doc QA)  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Risk: Backend/gateway availability → E2E flakiness.  
  - Mitigasyon: `PW_MOCK_API=1` ile minimum endpoint mock.  
- Risk: Memoization drift (useMemo deps) → stale UI.  
  - Mitigasyon: i18n hook callback’leri locale ile ilişkilendirilir.  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- L1 ile doküman zinciri ve flow kilitlenir.  
- Unit + E2E ile locale switch sonrası stale UI regresyonu yakalanır.  

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0050-i18n-locale-propagation-fix-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0050-i18n-locale-propagation-fix-v1.md  

-------------------------------------------------------------------------------
## 9. EVIDENCE (LAST KNOWN GOOD)
-------------------------------------------------------------------------------

- Playwright (local): `web/test-results/pw/pw-summary-2025-12-20T21-50-43-345Z.md`  
  - Komut: `PW_AUTH_MODE=token_injection PW_TEST_TOKEN=<redacted> PW_MOCK_THEME_REGISTRY=1 PW_MOCK_API=1 pnpm -C web run pw:nightly --grep story_0050_locale_switch_propagation`  

