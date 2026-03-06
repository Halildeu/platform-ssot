# Backend Diagnostics Registry

- ID: `backend-diagnostics-registry-v1`
- Amaç: backend runtime, health, smoke ve log triage katmanlarını tek doctor akışında toplamak.
- Kanonik girişler:
  - `docs/02-architecture/context/backend-diagnostics.registry.v1.json`
  - `backend/scripts/ops/backend-doctor.py`
  - `docs/04-operations/RUNBOOKS/RB-backend-doctor.md`

## Katmanlar

1. `compose_service_matrix`
- `docker compose ps` üzerinden servis görünürlüğü, state, health ve port haritası.

2. `http_health_probes`
- Kritik servislerin `actuator/health` veya eşdeğer HTTP health yüzeyi.

3. `unauthorized_runtime_smoke`
- Token gerektirmeyen temel smoke zinciri:
  - gateway unauthorized davranışı
  - auth JWKS
  - Eureka registry

4. `log_triage`
- Ham log dump yazmadan, redacted error/exception excerpt özetleri.

5. `backend_doctor`
- Tek JSON/MD summary paketini üreten üst kontrol katmanı.

## Varsayılan preset

- `local-compose`
- Politika: `report_only`
- Side effect yok; mevcut runtime'ı gözlemler.

## Hard rules

- Secrets ve token değerleri evidence'a yazılmaz.
- Kritik servis veya kritik smoke kırmızıysa `PASS` üretilemez.
- Ham docker log dump'i artifact olarak tutulmaz; yalnız redacted triage özeti tutulur.
