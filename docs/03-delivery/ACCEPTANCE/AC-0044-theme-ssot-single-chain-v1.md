# AC-0044 – Theme SSOT Single-Chain v1 Acceptance

ID: AC-0044  
Story: STORY-0044-theme-ssot-single-chain-v1  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Tema özelleştirmenin tek kaynak + tek zincir kontratına göre çalıştığını
  doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Theme Contract v0.1 (mode/alias/defaultMode/allowedModes).  
- Theme Registry entry’leri: `editableBy`, `controlType`, `cssVars[]`.  
- Fallback/hardcode/mapping kopyalarının kaldırılması (drift önleme).  
- P0/P1/P2 allowlist politikası (GLOBAL vs USER).  
- L2 guardrail ve L3 Playwright smoke hedefleri.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

- [ ] Senaryo 1 – Doküman zinciri (SSOT):
  - Given: `STORY-0044`, `AC-0044`, `TP-0044`, `ADR-0002` ve API dokümanı mevcuttur.  
  - When: Doc QA çalıştırılır.  
  - Then: Story/AC/TP şablon, ID ve link kontrolleri PASS olmalıdır.  
  - Kanıt/Evidence:
    - Script: `python3 scripts/check_doc_templates.py`  
    - Script: `python3 scripts/check_doc_ids.py`  
    - Script: `python3 scripts/check_doc_locations.py`  
    - Script: `python3 scripts/check_story_links.py STORY-0044`  
    - Script: `python3 scripts/check_doc_chain.py STORY-0044`

### Web

- [ ] Senaryo 2 – Tek zincir: mapping kopyası yok:
  - Given: Theme Contract v0.1 ve registry mapping tek kaynaktır.  
  - When: Web runtime theme apply akışı çalışır.  
  - Then: UI’da serban-* / light-dark alias mapping kopyası bulunmaz; tek API
    (resolveThemeMode/resolveThemeContract) kullanılır.

- [ ] Senaryo 3 – Fallback yasak:
  - Given: Theme CSS var’ları contract’a göre üretilir.  
  - When: `theme.css` ve Tailwind map taranır.  
  - Then: `var(--x, fallback)` veya hardcoded hex/rgb/px fallback bulunmaz.
  - Kanıt/Evidence:
    - Kod: `web/apps/mfe-shell/src/styles/theme.css`  
    - Kod: `web/apps/mfe-shell/src/index.css` (TW4 CSS-native config)

- [ ] Senaryo 4 – Special-case yok (surface.default.bg hack kaldırıldı):
  - Given: Registry entry `cssVars[]` multi-apply mapping sağlar.  
  - When: Admin Theme Registry üzerinden semantic key güncellenir.  
  - Then: UI’da localStorage veya hardcoded css var listesi olmadan, doğru
    var set’i uygulanır.

### Backend

- [ ] Senaryo 5 – Allowlist enforcement:
  - Given: Theme Registry `editableBy` alanları tanımlıdır.  
  - When: USER scope’ta allowlist dışı override gönderilir.  
  - Then: Backend `INVALID_OVERRIDE_KEY` (veya eşdeğer) ile reddeder; allowlist
    içi key’ler kabul edilir.

### Operations / E2E

- [ ] Senaryo 6 – Playwright smoke hedefi:
  - Given: Playwright scenario runner “soft mode” ile çalışır.  
  - When: `auth_mode=none` ve `readonly_enforce=0`.  
  - Then: Public 2 senaryo PASS, auth_required senaryolar BLOCKED, FAIL=0.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- “Tek zincir” yaklaşımında UI’da hardcode css var listesi veya fallback
  bulunması regresyon kabul edilir.  
- P2 (raw token edit) varsayılan olarak kapalı kabul edilir; açılırsa yalnız
  admin scope’ta uygulanmalıdır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Theme Contract v0.1 ve Theme Registry mapping tek kaynak olur.  
- Fallback/hardcode/mapping kopyaları kaldırılır ve guardrail ile korunur.  
- E2E smoke “soft mode” ile gürültüsüz doğrulama sağlar.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0044-theme-ssot-single-chain-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0044-theme-ssot-single-chain-v1.md  
- ADR: docs/02-architecture/services/theme-system/ADR/ADR-0002-theme-contract-v0-1.md
