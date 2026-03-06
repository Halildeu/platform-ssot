# RB-frontend-doctor – Frontend Diagnostics Control Plane

ID: RB-frontend-doctor  
Service: frontend-doctor  
Status: Draft  
Owner: Frontend Platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Frontend runtime hata toplama, route smoke, login davranışı ve gateway smoke zincirini
  tek komut ve tek kanıt paketi altında çalıştırmak.
- Özellikle `UI Library` gibi vitrin alanlarında `pageerror`, `console.error`,
  route çökmesi ve smoke regressions'larını kullanıcı söylemeden görmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Kapsam:
  - `web/scripts/ops/frontend-doctor.mjs`
  - `docs/02-architecture/context/frontend-diagnostics.registry.v1.json`
  - `web/tests/playwright/pw_scenarios.yml`
  - `web/tests/playwright/scenario-runner.spec.ts`
  - `web/tests/smoke/gateway-smoke.mjs`
- Varsayılan preset: `ui-library`
- Çıktılar:
  - `web/test-results/diagnostics/frontend-doctor/*/frontend-doctor.summary.v1.json`
  - `web/test-results/diagnostics/frontend-doctor/*/frontend-doctor.summary.v1.md`
  - `web/test-results/diagnostics/frontend-doctor/*/logs/*.log`

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

- Ön koşullar:
  - `web/` bağımlılıkları kurulu olmalı.
  - Shell route'u erişilebilir olmalı (`http://localhost:3000` varsayılan).
  - Playwright browser'ları yüklü olmalı.

- Başlatma:
  - `npm -C web run doctor:frontend -- --preset ui-library`

- Opsiyonel parametreler:
  - `--base-url http://localhost:3000`
  - `--soft-mode 1`
  - `--auth-mode none`

- Durdurma:
  - Doctor tek-shot çalışır; çalışan alt süreç yoksa özel kapatma gerekmez.
  - Uzayan süreçte ilgili `npm`, `node` veya `playwright` süreci sonlandırılır.

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Kanonik özet:
  - `frontend-doctor.summary.v1.json`
  - `frontend-doctor.summary.v1.md`
- Loglar:
  - `logs/shell_build.log`
  - `logs/tailwind_lint.log`
  - `logs/login_test.log`
  - `logs/playwright_ui_library.log`
  - `logs/gateway_smoke.log`
- Minimum metrikler:
  - `overall_status`
  - `base_url_check.ok`
  - step bazlı `PASS/FAIL`
  - Playwright scenario raporu var mı
  - Gateway smoke artefact'ı var mı

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- [ ] Arıza senaryosu 1 – Base URL erişilemiyor:
  - Given: `frontend-doctor` çalıştırıldı,
  - When: `base_url_check.ok=false`,
  - Then:
    - Shell dev server veya deployed target erişimini doğrula.
    - `--base-url` override gerekiyorsa explicit ver.

- [ ] Arıza senaryosu 2 – UI Library Playwright FAIL:
  - Given: `playwright_ui_library` step'i FAIL,
  - When: `pw-scenario-ui-library-page-*.md` raporunda `pageerror`, `console.error` veya selector hatası var,
  - Then:
    - Önce route crash veya invalid React element var mı bak.
    - Sonra `pw_scenarios.yml` selector'leri ile `DesignLabPage` testid'lerini karşılaştır.
    - Beklenen remote eksikliği varsa allowlist kuralını registry/pw_scenarios üzerinde açık yaz.

- [ ] Arıza senaryosu 3 – Gateway smoke FAIL:
  - Given: `gateway_smoke` FAIL,
  - When: auth veya route davranışı değişmiş görünür,
  - Then:
    - `web/tests/smoke/artifacts/gateway-smoke.log` dosyasını aç.
    - Beklenen `401/200` davranışını gateway ve auth config ile karşılaştır.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- `frontend-doctor`, mevcut Playwright telemetry ve gateway smoke hattını yeniden yazmaz;
  tek paket altında orkestre eder.
- Yeni vitrin veya önemli route, canonical scenario ve doctor kanıtı olmadan stabil sayılmaz.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Registry: `docs/02-architecture/context/frontend-diagnostics.registry.v1.json`
- Registry özeti: `docs/02-architecture/context/frontend-diagnostics.registry.v1.md`
- Playwright runbook: `docs/04-operations/RUNBOOKS/RB-web-playwright-smoke.md`
- Doctor script: `web/scripts/ops/frontend-doctor.mjs`
- Scenario listesi: `web/tests/playwright/pw_scenarios.yml`
