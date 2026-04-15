# RUNBOOK – Zanzibar Canary Deployment

ID: RB-zanzibar-canary
Service: permission-service, core-data-service, openfga
Status: Active
Owner: @halil

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Zanzibar authorization sisteminin staging'den production'a feature-flag ile
kademeli gecisini yonetmek. Ref: CNS-20260411-001, Dalga 2 Plan.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Sorumlu: Platform Engineering (operasyon), @halil (owner).
- Ortamlar: stage (canary), prod (rollout).
- Servisler: permission-service, core-data-service, user-service, variant-service, openfga.
- SLA: Authz check p95 < 50ms, error rate < 0.5%, deny rate < 10%.

Pre-conditions:
- [x] Dalga 1+2 PR'lar merged (#305-#318, #346, #347)
- [x] Staging 24h stable (error rate < 0.1%) — 18 healthy verified
- [x] doctor-zanzibar.sh PASS (47/47 quick check, 0 error)
- [x] Restricted smoke user seeded (stage-keycloak-smoke-user seed-smoke-role)
- [x] OpenFGA v1.11.2 pinned (was :latest)
- [x] SK-2 latency PASS (11-15ms, target <15ms)
- [x] Vault auto-unseal watcher active (PR #347)
- [x] Canary authz guardrail wiring complete (4/4 metrics) — PR #365 (eaa3d7a1)
  - authz_decisions_total (Counter, tags: allowed, reason) — OpenFgaAuthzService
  - tuple_sync_outbox_failed_total (Counter) — TupleSyncOutboxPoller
  - openfga_circuit_breaker_state (Gauge: 0=closed, 1=open, 2=half-open) — OpenFgaCircuitBreaker
  - scope_cache_* (Gauge) — AuthzCacheMetricsConfig (pre-existing, re-verified)

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

Stage 1 — Deploy (Flags ON by default, verify health, Day 1):
- Merge main branch to prod deploy.
- docker compose pull && docker compose up -d
- Verify: all containers healthy.
- Verify: ERP_OPENFGA_ENABLED=true (compose default). Services start with OpenFGA enabled.
- Run: smoke-zanzibar.yml workflow (manual dispatch).
- Rollback: Standard rollback (previous image tag).

Stage 2 — Synthetic Canary (Rev 22, CNS-20260415-003/004 uzlaşısı):
- **Tanım değişikliği (Rev 22):** Eski "48h fiziksel canary" staging'de gerçek kullanıcı trafiği olmadığı için metric üretemiyor → synthetic load ile deterministik Evidence PASS.
- **Runner:** `bash backend/scripts/perf/run-zanzibar-canary.sh`
- **Guardrail metric query env'leri (auth-enabled run için ZORUNLU, CNS-20260416-001):**
  - `CANARY_PROM_URL`, `CANARY_AUTHZ_CHECK_QUERY`, `CANARY_AUTHZ_DENY_QUERY`, `CANARY_AUTHZ_ERROR_QUERY`, `CANARY_AUTHZ_CACHE_MISS_QUERY`
  - `CANARY_AUTHZ_DECISIONS_QUERY='sum(increase(authz_decisions_total[35m]))'` (NO_SIGNAL guard, >= 1000)
  - `CANARY_OPENFGA_CB_QUERY='max(openfga_circuit_breaker_state)'` (0=CLOSED)
  - Local smoke: `SKIP_METRICS=1` ile guardrail skip
- **Akış:** setup (idempotent seed + write-path version verify) → probe pre → k6 cold (~30dk) → k6 warm (version bump YOK) → probe post → Prometheus metrics pull → guardrail-check.
- **5 persona matrix:** super-admin / read-only / restricted / multi-role+DENY / scope-less. Yük profili: ~160 decisions/min toplam → 30dk'da 4800+ (NO_SIGNAL guard `authz_decisions_total >= 1000` karşılanır).
- **İki sinyal katmanı:**
  - Operasyonel: Prometheus — `authz_decisions_total`, p95, error rate, warm cache miss, `openfga_circuit_breaker_state=0` (CLOSED).
  - Fonksiyonel: k6 custom — `authz_persona_mismatch: rate<0.01` (persona intent ile gerçekleşen farkı).
- **Intentional deny bandı %4-5** (aggregate guardrail persona intent ile kirlenmesin).
- **Cold+warm iki ayrı run:** cold'da cache miss threshold soften (log-only), warm'da < 50% zorunlu.
- **Local smoke (STORY-0319 öncesi):** `LOCAL_PERMIT_ALL=1 ESTIMATE_ONLY=1 bash .../run-zanzibar-canary.sh` → OpenFGA disabled permitAll'da smoke + decision floor projeksiyonu.
- **Rollback:** `ERP_OPENFGA_ENABLED=false` + restart (< 1 dk).

Stage 3 — Synthetic Canary Evidence PASS (Rev 22):
- **Eski:** "48h stable full rollout" (staging sinyal üretmediği için anlamsız).
- **Yeni kriter:** Audit checklist PASS — doctor-zanzibar full + smoke workflow yeşil + 5 persona probe PASS + `authz_decisions_total >= 1000` + CB CLOSED + outbox pending/failed drift guard + cold/warm raporlar + STORY-0319 profile doğrulandı.
- **Prod-trafiği canary:** Post-STORY-0319 ayrı story (synthetic gerçek prod pattern'ini tam simule etmez).

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

Guardrails:

| Metric                 | Threshold | Action on Breach                    |
|------------------------|-----------|-------------------------------------|
| authz_check_p95_ms     | > 50ms    | Investigate cache, consider warm-up |
| authz_check_p95_ms     | > 150ms   | Rollback (flags OFF)                |
| authz_deny_rate_pct    | > 10%     | Investigate model, check tuple sync |
| authz_error_rate_pct   | > 0.5%    | Rollback (flags OFF)                |
| authz_cache_miss_rate  | > 50%     | Check TTL, cache size               |
| OpenFGA down           | up == 0   | Fail-closed active, rollback flags  |

Loglar:
- docker logs serban-permission-service-1 --tail 200
- docker logs serban-openfga-1 --tail 200

Metrikler:
- Prometheus: http://localhost:9090 (permission-service, core-data, openfga targets)
- Grafana: authz-zanzibar alert rules (10 rule)

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- [ ] Ariza senaryosu 1 — OpenFGA down:
  - Given: OpenFGA container crashed veya network partition.
    When: up{job="openfga"} == 0 alert fires.
    Then: Fail-closed aktif (tum check'ler false/deny doner). Flags OFF + restart.

- [ ] Ariza senaryosu 2 — Yuksek deny rate:
  - Given: authz_deny_rate_pct > 10%.
    When: Model regression veya tuple sync hatasi.
    Then: doctor-zanzibar.sh calistir, tuple dump incele, rollback flags.

- [ ] Ariza senaryosu 3 — Cache miss storm:
  - Given: authz_cache_miss_rate > 50% sustained.
    When: Version bump loop veya TTL cok kisa.
    Then: SCOPE_CACHE_TTL_SECONDS artir (30 → 60), cache size kontrol.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Canary 3 asamali: deploy (OFF) → canary (ON, admin+restricted) → rollout.
- Rollback her asamada < 1 dk (flag OFF + restart).
- Restricted user deny senaryosu canary'nin zorunlu parcasi.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Master plan: .claude/plans/zanzibar-master-plan.md (rev 19)
- Decision registry: decisions/topics/zanzibar-openfga.v1.json
- Guardrails config: backend/scripts/ci/canary/zanzibar-guardrails.json
- Doctor script: backend/scripts/doctor-zanzibar.sh
- Restricted probe: backend/scripts/ci/canary/zanzibar-restricted-probe.sh
