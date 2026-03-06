# Business Journey E2E Matrix v1

ID: business-journey-e2e-matrix
Status: active

Amaç: route smoke seviyesinden çıkıp, kritik kullanıcı görevlerinin action + evidence + runtime hygiene ile korunması.

## Kapsam
- `access_role_review` → `access_roles_navigation_walk`
- `audit_event_investigation` → `audit_events_navigation_walk`
- `reporting_user_filtering` → `reporting_users_navigation_walk`

## Zorunlu kurallar
- Her journey gerçek kullanıcı görevi olmalı; yalnız açılış smoke olamaz.
- Auth-required journey'lerde mock-backed token injection zorunlu.
- Journey PASS için allowlist dışı console/pageerror/runtime overlay kabul edilmez.
- Journey evidence en az scenario markdown + PW artefact üretmelidir.

## Doctor preset
- `business-journeys`
- Gerekli adımlar:
  - `shell_build`
  - `tailwind_lint`
  - `playwright_business_journeys`
  - `gateway_smoke`
  - `base_url_fetch_check`
