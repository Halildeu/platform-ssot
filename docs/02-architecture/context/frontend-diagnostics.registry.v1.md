# Frontend Diagnostics Registry v1

Kanonik kaynak: `docs/02-architecture/context/frontend-diagnostics.registry.v1.json`

Amaç:
- frontend runtime hata tespiti,
- smoke,
- login/auth drift kontrolü,
- remote federation gürültüsü,
- UI Library gibi vitrin route'larının stabilitesi
tek bir control plane altında izlenebilsin.

Ana katmanlar:
- Browser runtime telemetry: `pageerror`, `console.error`, `console.warn`, `xhr/fetch`, `requestfailed`, `resource load failure`, `unhandled rejection`, `runtime overlay`
- Playwright YAML scenario runner (`route open` + `click-walk` + `step journal`)
- Gateway smoke
- Local nightly integration
- CI log digest
- Frontend doctor

Doctor preset'leri:
- `ui-library` → `/ui-library` (`ui_library_page` + `ui_library_navigation_walk` + `ui_library_foundation_wave_1_walk`)
  - stack mode: `shell-only`
  - foundation release-hardening dalgasinda `Button`, `Text`, `LinkInline`, `IconButton` click-walk kaniti uretir
- `shell-public` → `/login`, `/runtime/theme-matrix`, `/ui-library` (`shell_login` + `runtime_theme_matrix` + `ui_library_page` + `ui_library_navigation_walk` + `shell_public_route_walk`)
  - stack mode: `shell-only`
- `theme-admin` → `/admin/themes` (`theme_registry_page` + `theme_admin_navigation_walk`)
  - varsayılan auth modu: `token_injection`
  - varsayılan çalışma modu: `mock-backed route diagnostics`
  - stack mode: `shell-only`
  - gerçek client secret zorunlu değildir; sentetik test token + mock API ile UI crash/overlay/console/click regressions yakalanır
- `auth-business-routes` → `/access/roles`, `/audit/events`, `/admin/reports/users`
  - senaryolar: `access_roles_page`, `access_roles_navigation_walk`, `audit_events_page`, `audit_events_navigation_walk`, `reporting_users_page`, `reporting_users_navigation_walk`
  - varsayılan auth modu: `token_injection`
  - varsayılan çalışma modu: `mock-backed auth routes`
- `business-journeys` → gerçek görev akışı seviyesi preset
  - senaryolar: `access_roles_navigation_walk`, `audit_events_navigation_walk`, `reporting_users_navigation_walk`
  - route smoke değil, görev tamamlama kanıtı üretir

Kanonik giris noktaları:
- `web/scripts/ops/frontend-doctor.mjs`
- `web/tests/playwright/pw_scenarios.yml`
- `web/tests/playwright/scenario-runner.spec.ts`
- `web/tests/playwright/utils/pw_telemetry.ts`
- `docs/04-operations/RUNBOOKS/RB-web-playwright-smoke.md`
- `docs/04-operations/RUNBOOKS/RB-frontend-doctor.md`

Kural:
- Yeni route veya vitrin canonical senaryo olmadan tamamlanmış sayılmaz.
- Yeni etkileşimli vitrin veya admin route en az bir click-walk senaryosu olmadan tamamlanmış sayılmaz.
- Yeni UI library yüzeyi pageerror veya allowlist dışı console.error üretiyorsa release edilmez.
- Allowlist dışı `resource load failure`, `unhandled rejection` veya `runtime overlay` varsa release edilmez.
- Doctor, mevcut telemetry hattını orkestre eder; paralel ikinci smoke sistemi kurulmaz.
- `ui-library` preset'i shell'i kendi kaldirir; disaridan manuel dev server beklemez.
- Auth-required route diagnostics mümkünse mock-backed UI seviyesinde koşturulur; sırf browser crash tespiti için gerçek secret bağımlılığı eklenmez.
