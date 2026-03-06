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
- Browser runtime telemetry: `pageerror`, `console.error`, `console.warn`, `xhr/fetch`, `requestfailed`
- Playwright YAML scenario runner
- Gateway smoke
- Local nightly integration
- CI log digest
- Frontend doctor

Doctor preset'leri:
- `ui-library` → `/ui-library`
- `shell-public` → `/login`, `/runtime/theme-matrix`, `/ui-library`
- `theme-admin` → `/admin/themes` (`token_injection` auth gerekir)

Kanonik giris noktaları:
- `web/scripts/ops/frontend-doctor.mjs`
- `web/tests/playwright/pw_scenarios.yml`
- `web/tests/playwright/scenario-runner.spec.ts`
- `web/tests/playwright/utils/pw_telemetry.ts`
- `docs/04-operations/RUNBOOKS/RB-web-playwright-smoke.md`
- `docs/04-operations/RUNBOOKS/RB-frontend-doctor.md`

Kural:
- Yeni route veya vitrin canonical senaryo olmadan tamamlanmış sayılmaz.
- Yeni UI library yüzeyi pageerror veya allowlist dışı console.error üretiyorsa release edilmez.
- Doctor, mevcut telemetry hattını orkestre eder; paralel ikinci smoke sistemi kurulmaz.
