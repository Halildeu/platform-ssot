# TP-0044 – Theme SSOT Single-Chain v1 Test Plan

ID: TP-0044  
Story: STORY-0044-theme-ssot-single-chain-v1  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Theme SSOT “tek kaynak + tek zincir” kontratının drift üretmeden
  sürdürülebileceğini doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1 (deterministik): doc QA + story chain.  
- L2 (deterministik): token/contract/registry drift guardrail’leri + web/backend lint/test.  
- L3 (nightly/ops): Playwright scenario runner (soft mode → hard mode geçişi).

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- L1:
  - Doküman şablon, ID, lokasyon ve Story zinciri kontrolleri.  
- L2:
  - Theme kontrat ve token map drift kontrolü (guardrail).  
  - “Hardcode theme style” (hex/rgb/px) tespiti (guardrail).  
  - Web + backend lint/unit (impact seçici koşum ile).  
- L3:
  - Staging/localhost baseUrl ile Playwright YAML scenario runner.  
  - Soft mode: job fail etmez; PASS/BLOCKED/FAIL dağılımını raporlar.  
  - Hard mode: readonly ihlali / tokenlı 401 / 5xx gibi eşiklerle FAIL.

Başarı kriterleri (hedef):
- auth_mode=none: PASS=2 (public), BLOCKED=4 (AUTH_NOT_CONFIGURED), FAIL=0.  
- token_injection: PASS=6 (auth ok), FAIL=0 (readonly ihlali=0).  
- Readonly violations: 0 (hard mode’a geçiş ön koşulu).

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] L1 – Doc QA + zincir:
  - `python3 scripts/check_doc_templates.py`  
  - `python3 scripts/check_doc_ids.py`  
  - `python3 scripts/check_doc_locations.py`  
  - `python3 scripts/check_story_links.py STORY-0044`  
  - `python3 scripts/check_doc_chain.py STORY-0044`

- [ ] L2 – Guardrails (kontrat + drift):
  - check_theme_contract_consistency (F1)  
  - check_no_hardcoded_theme_styles (F2)  
  - check_tailwind_token_map (F1)  
  - check_theme_override_allowlist (F1)

- [ ] L3 – Playwright smoke (YAML):
  - shell_login  
  - runtime_theme_matrix  
  - theme_registry_page  
  - access_roles_page  
  - audit_events_page  
  - reporting_users_page

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Local:
  - Web: `npm -C web run dev` veya repo standardındaki shell dev komutu.  
  - Playwright: `npm -C web run pw:nightly` (soft mode).  
- CI:
  - PR gate: L1 + L2 deterministik.  
  - Nightly: L3 staging (baseUrl + token injection ile).

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Staging auth: token injection için Keycloak client/role konfigürasyonu şarttır.  
- Readonly false-positive: token refresh gibi istisnalar allowlist ile yönetilmelidir.  
- Flaky e2e: soft mode ile ölçüm yapılmadan hard mode’a geçilmemelidir.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu TP, tek zincirin drift üretmediğini L1/L2 deterministik kontrollerle,
  L3’te ise e2e smoke ile doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0044-theme-ssot-single-chain-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0044-theme-ssot-single-chain-v1.md  
- ADR: docs/02-architecture/services/theme-system/ADR/ADR-0002-theme-contract-v0-1.md

-------------------------------------------------------------------------------
## 9. EVIDENCE
-------------------------------------------------------------------------------

Playwright L3 (localhost):
- auth_mode=token_injection + readonly_enforce=1: `web/test-results/pw/pw-summary-2025-12-15T18-15-20-227Z.md`
  - PASS=6, FAIL=1 (`access_roles_page`: 403 GET `/api/v1/roles`, console.error=1)
  - Not: Token injection için `roles:read`/Access yetkisi verilince hedef PASS=7/FAIL=0 olur.

Guardrails (L2):
- `python3 scripts/docflow_next.py run STORY-0044 --level L2 --mode local --impact web` → PASS
  - `tokens:build --check` OK (theme.css + theme-contract.json drift yok)
  - `check_theme_contract_consistency` OK
  - `check_tailwind_token_map` OK
  - `check_theme_override_allowlist` OK
  - `check_no_hardcoded_theme_styles` OK
