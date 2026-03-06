# Live Release Provisioning Contract v1

- Amaç: canary ve DAST gibi canlı guardrail akışlarının hangi secret/variable/hook seti ile güvenli şekilde çalışacağını tanımlamak.
- Son doğrulama: 2026-03-06

## Canary
- Workflow: `.github/workflows/release-canary.yml`
- Script: `backend/scripts/ops/release-canary.mjs`
- Live mod için zorunlu:
  - `CANARY_ENABLED`
  - `CANARY_PROM_URL`
  - `GRAFANA_API_KEY` veya `CANARY_API_KEY`
  - `CANARY_APPLY_WEIGHT_HOOK_URL` veya weight-specific hook'lar
  - `CANARY_ROLLBACK_HOOK_URL`
  - `CANARY_WEB_SMOKE_URL`
  - `CANARY_BACKEND_HEALTH_URLS`
  - metrics query variable set'i

## DAST
- Workflow: `.github/workflows/security-guardrails.yml`
- Script: `backend/scripts/ci/security/run-dast.sh`
- Zorunlu target: `ZAP_TARGET_URL`
- Auth mode:
  - `none`
  - `bearer_header`
- `bearer_header` için zorunlu:
  - `ZAP_AUTH_MODE=bearer_header`
  - `ZAP_AUTH_HEADER_NAME`
  - `ZAP_AUTH_HEADER_VALUE`

## Kurallar
- Eksik live provisioning sessiz geçilmez; fail-closed veya açık skip/notice davranışı gerekir.
- Secret değerleri log'a basılmaz.
- AUTH-REGISTRY, workflow env isimleri ve kontrat aynı isim setiyle kalmalıdır.
