# TP-0303 – Autopilot Auto-Fix + Deploy + Rollback v0.1 Test Plan

ID: TP-0303  
Story: STORY-0303-autopilot-auto-fix-deploy-rollback-v0-1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Auto-fix + deploy + validate + rollback akışını uçtan uca smoke senaryolarıyla doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- PR seviyesinde: `ci-gate` FAIL → log-digest → auto-fix PR → PASS → otomatik merge.  
- main seviyesinde: deploy-web/deploy-backend → post-deploy validate → (gerekirse) rollback.  
- Guardrails: allowlist, recursion önleme, kill-switch.  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- v0.1 stratejisi “deterministik + fail-safe”:
  - Auto-fix yalnız bilinen pattern’lerde küçük patch üretir; aksi durumda noop + digest ile görünürlük sağlar.  
  - Deploy/validate/rollback:
    - `DEPLOY_ENABLED!=true` ise job’lar skip olur (deploy yok).
    - `DEPLOY_ENABLED=true` ise gerekli parametreler zorunludur; eksikse workflow FAIL eder (silent PASS yok).

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Docs-only doğrulama:
  - Hedef: Doc QA PASS (ID/template/location + story links + chain).
  - Komutlar: `python3 scripts/check_doc_ids.py`, `python3 scripts/check_doc_templates.py`, `python3 scripts/check_doc_locations.py`, `python3 scripts/check_story_links.py STORY-0303`, `python3 scripts/check_doc_chain.py STORY-0303`

- [ ] Senaryo 2 – FAIL → auto-fix PR:
  - Hedef: Bilerek docs ID boz → `ci-gate` FAIL → auto-fix PR açılır (`<!-- auto-fix:v1 -->`).  
  - Beklenen: auto-fix PR’da `ci-gate` PASS; merge-bot squash merge; `<!-- pr-merge:result --> Result: merged`.  

- [ ] Senaryo 3 – Auto-fix recursion guard:
  - Hedef: Bot branch’inde fail üretildiğinde auto-fix yeniden PR açmamalı (noop).  

- [ ] Senaryo 4 – Deploy (kill-switch OFF):
  - Hedef: `DEPLOY_ENABLED` kapalıyken main push sonrası deploy/validate job’ları **skip** olmalıdır.  

- [ ] Senaryo 5 – Deploy + validate + rollback (kill-switch ON, opsiyonel):
  - Hedef: `DEPLOY_ENABLED=true` ile deploy + post-deploy validate koşar.  
  - Ön koşul: `WEB_DEPLOY_HOOK_URL`, `WEB_SMOKE_URL`, `BACKEND_HEALTH_URLS` tanımlıdır.
  - Beklenen: validate FAIL olursa rollback tetiklenir ve `<!-- incident:v1 -->` comment’i yazılır.  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- GitHub Actions:
  - Workflows: `ci-gate`, `log-digest`, `auto-fix`, `deploy-web`, `deploy-backend`, `post-deploy-validate`, `rollback`  
- Secrets (örnek isimler; değerler burada yok):
  - `AUTO_FIX_ENABLED`, `DEPLOY_ENABLED`  
  - Web: `WEB_DEPLOY_HOOK_URL`, `WEB_SMOKE_URL`  
  - Backend: `BACKEND_HEALTH_URLS` (+ GHCR erişimi `github.token` ile)  
  - Rollback (opsiyonel): `ROLLBACK_ENABLED`, `WEB_ROLLBACK_HOOK_URL`, `BACKEND_ROLLBACK_HOOK_URL`

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik risk: yanlışlıkla prod deploy veya geniş kapsamlı auto-fix patch (mitigasyon: kill-switch + allowlist + limitler).  
- İkinci risk: repo policy (required reviews / token write kısıtı) insansız merge’i bloklayabilir.  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- v0.1 test planı; önce docs zinciri, sonra automation smoke senaryoları ile “fail→fix→merge→deploy→rollback” hattını doğrular.  

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0303-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0303-autopilot-auto-fix-deploy-rollback-v0-1.md  
