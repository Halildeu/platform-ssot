# STORY-0044 – Theme SSOT Single-Chain v1

ID: STORY-0044-theme-ssot-single-chain-v1  
Epic: QLTY-THEME-SSOT  
Status: Done  
Owner: @team/frontend  
Upstream: STORY-0038-theme-runtime-integration, STORY-0022-theme-personalization-v1  
Downstream: AC-0044, TP-0044, ADR-0002, RB-web-playwright-smoke

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Tema sisteminde “tek kaynak + tek zincir” yaklaşımını kontrat olarak kilitlemek.  
- Fallback/hardcode/heuristic mapping kopyalarını kaldırmak için kararları,
  sınırları ve guardrail’leri netleştirmek.  
- Theme Registry (Admin) ekranını (global + user overrides) tema özelleştirmenin
  tek giriş noktası haline getirmek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir platform ekibi olarak, tema sistemi için tek kaynak ve tek zincir
  istiyoruz; böylece aynı token/mode bilgisinin farklı yerlerde farklı şekilde
  tutulması (drift) engellensin ve özelleştirme merkezi olarak yönetilebilsin.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Zincir SSOT haritası ve kontratı:
  - `web/design-tokens/figma.tokens.json` → generator → `theme.css` → Tailwind map
    → runtime apply → UI apply.  
- Theme Contract v0.1 kararı (ADR ile):
  - `meta.themeContract` SSOT, build-time “generated contract JSON” yaklaşımı.  
  - Mode/appearance alias SSOT (light/dark/hc).  
- “Fallback yasak” politikası:
  - `var(--x, fallback)` kullanımı yasaklanır; eksik var build-time yakalanır.  
- “Derived mapping” politikası:
  - Theme Registry entry’leri `cssVars[]` ile bir semantic key’in birden fazla
    CSS var’a uygulanmasını tarif eder (UI hardcode mapping yasak).  
- Allowlist politikası (GLOBAL/USER):
  - P0: axes (density/radius/elevation/motion/accent, surfaceTone)  
  - P1: semantic renk grupları (surface/text/border/accent/overlay/grid)  
  - P2: raw token edit (varsayılan kapalı; admin-only opsiyon)  
- Faz planı:
  - F1: Contract + mapping tek API + guardrail kilidi  
  - F2: UI bypass/hardcode temizliği (hex/rgb/px/text-white vb.)  
  - F3: Design Lab (admin-only) görünürlük + token kullanım haritası

Kapsam dışı (v1):
- Theme token tasarımının (Figma) yeniden tasarlanması.  
- Tüm modüllerde tam görsel QA (bu TP’de smoke + guardrail hedeflenir).

F1.0 Keşif Notu (top offenders, dosya: satır):
- Fallback (`var(--x, fallback)`) / hardcode fallback:
  - `web/apps/mfe-shell/src/widgets/app-shell/ui/LoginPopover.ui.tsx:26`  
  - `web/apps/mfe-shell/src/widgets/app-shell/ui/NotificationCenter.ui.tsx:35`  
  - `web/apps/mfe-shell/src/widgets/app-shell/ui/AppLauncher.ui.tsx:55`  
  - `web/apps/mfe-shell/src/index.css:17` (`--surface-page-bg` fallback)  
  - `web/apps/mfe-shell/src/index.css:35`, `web/apps/mfe-shell/src/index.css:42` (radius fallback)  
  - `web/apps/mfe-shell/src/styles/theme.css:991` (table surface fallback; generator kaynaklı)  
  - `web/scripts/theme/generate-theme-css.mjs:101` (table surface fallback üretimi)  
  - `web/tailwind.config.js:51` (surface.page fallback)
- Hardcoded palette class / token bypass:
  - `web/tailwind.config.js:17`, `web/tailwind.config.js:18` (safelist palette)  
  - `web/packages/ui-kit/src/components/Button.tsx:19` (`text-white`)  
  - `web/packages/ui-kit/src/components/entity-grid/EntityGridTemplate.tsx:56` (`text-white`)
- `serban-*` mapping kopyaları (tek API’ye taşınacak):
  - `web/packages/ui-kit/src/runtime/theme-controller.ts:64`–`81`  
  - `web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx:209`–`456`  
  - `web/apps/mfe-shell/src/app/ShellApp.ui.tsx:548`–`550`  
  - `web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.tsx:103`–`105`  
  - `web/apps/mfe-shell/src/features/theme/theme-matrix.constants.ts:2`–`36`  
  - `web/apps/mfe-shell/src/pages/runtime/ThemeMatrixPage.tsx:16` (metin referansı)

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: Theme Contract v0.1 kararı (ADR-0002) ve API kontratı mevcuttur,  
  When: Theme sistemi “tek zincir” kontratına göre çalıştırılır,  
  Then: Mode/alias/registry mapping tek kaynaktan okunur; mapping kopyası kalmaz.  
- [ ] Given: Theme Registry entry’lerinde `cssVars[]` tanımlıdır,  
  When: Admin/global override girilir,  
  Then: UI hardcode var listesi olmadan, tek semantic key ile birden çok var
  doğru uygulanır.  
- [ ] Given: USER allowlist kuralı tanımlıdır,  
  When: allowlist dışı override denenir,  
  Then: UI + backend bunu kabul etmez ve “BLOCKED/INVALID_OVERRIDE_KEY” olarak
  raporlar.  
- [ ] Given: Playwright scenario-runner “soft mode” ile çalışır,  
  When: auth_mode=none,  
  Then: public senaryolar PASS; auth_required senaryolar BLOCKED; FAIL=0.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Backend theme endpoints (variant-service + gateway):
  - `GET /api/v1/theme-registry`  
  - `GET /api/v1/me/theme/resolved` (auth required)  
  - `PUT /api/v1/themes/global/*` (THEME_ADMIN)  
- Web tarafında ThemeProvider/ThemeController ve Tailwind token map.  
- Doc QA / chain kontrolleri: `scripts/check_doc_*` + `scripts/check_story_links.py`.

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Theme Contract v0.1 ile “tek kaynak + tek zincir” sözleşmesi tanımlanır.  
- Registry `cssVars[]` mapping’i ile UI’daki heuristic/hardcode mapping kaldırılır.  
- Guardrail + Playwright smoke ile drift erken yakalanır.

-------------------------------------------------------------------------------
## 6.1 F1 DURUMU
-------------------------------------------------------------------------------

- F1 (Theme Contract v0.1 + single API + guardrails) doğrulandı: L2 PASS ve `tokens:build --check` drift üretmiyor.  
- L3 Playwright (localhost): auth_mode=none → PASS=2/BLOCKED=4/FAIL=0; token_injection → PASS=6/FAIL=0 (readonly=0).  

-------------------------------------------------------------------------------
## 6.2 F2 KICKOFF (PLAN, KOD YOK)
-------------------------------------------------------------------------------

F2 (dar kapsam) tamamlandı:
- Grid/inline style kaçakları temizlendi (hex/rgba ve `var(--x, fallback)` yok; token-only).  
- Reporting typography fallback’leri temizlendi (token-only).  
- L2 guardrail seti PASS (drift/hardcode/fallback yok).  

Doğrulama:
- L2: `python3 scripts/docflow_next.py run STORY-0044 --level L2 --mode local --impact web` → PASS

-------------------------------------------------------------------------------
## 6.3 F3 DURUMU
-------------------------------------------------------------------------------

- `/admin/design-lab` admin-only route eklendi (MVP: tree/search + demo tabs + copy import).  
- F3.2: “where used” MVP tamamlandı:
  - Index üretimi: `npm -C web run designlab:index`  
  - Output: `web/apps/mfe-shell/src/pages/admin/design-lab.index.json`  
  - UI: seçili component için dosya listesi + copy path (admin-only).  

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0044-theme-ssot-single-chain-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0044-theme-ssot-single-chain-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0044-theme-ssot-single-chain-v1.md  
- ADR: docs/02-architecture/services/theme-system/ADR/ADR-0002-theme-contract-v0-1.md  
- API: docs/03-delivery/api/theme-registry.api.md
