# Session Handoff — 2026-04-20 — QLTY-PROACTIVE-06 Faz 1+2 Landed

## TL;DR

Audit consolidation roadmap **A → C kademeli** başlatıldı. **Faz 1** (feature-flag
cutover) ve **Faz 2** (shadow-compare diagnostic endpoint) stage'de canlı +
monitored. **Faz 3** (mirror durability / outbox pattern) için Codex 8 tur
iter'den sonra teknik plan AGREE seviyesinde ama **governance RED** — STORY/AC/TP
retarget gerekli. Faz 4/5 evidence-gated.

Oturum boyunca **14 PR merged**, 1 tracking issue açıldı (#533), 4 sweep
workflow çalıştı, stage'de canlı cutover yapıldı + verify edildi.

Kullanıcı notu: ai.acik.com 2 saatliğine (~2026-04-20 06:00 UTC+0'dan itibaren)
devre dışı. Stage internal (SSH + docker) etkilenmiyor; sadece public endpoint
curl'leri etkilenir. Kod/PR/CI akışı etkilenmez.

---

## Bu oturumda ship edilenler

### Audit consolidation (QLTY-PROACTIVE-06)

| PR | Faz | Scope |
|---|---|---|
| #520 | Faz 1 | `AUDIT_BACKEND_URI` env feature-flag, gateway route[5] bu env'den seçer |
| #521 | Faz 2 | `/api/audit/events/compare` shadow-compare endpoint (permission-service, AUDIT.manager) |
| #524 | docs | QLTY-PROACTIVE-06 roadmap A → C kademeli plan |
| #527 | Faz 2 v1.1 | Bearer-forward (compare endpoint user-service çağrısına admin bearer ilet) |
| #528 | Faz 1/2 v1.2 | Persistence: `render-backend-env.sh` + `deploy-backend.yml` env pass-through |
| #531 | Faz 2 monitoring | `staging-audit-compare-sweep.yml` daily workflow + script |
| #532 | Faz 2 monitoring v1.1 | `STAGING_ADMIN_PASS` secret wiring |

### Sweep infrastructure (QLTY-PROACTIVE-04/05)

| PR | Scope |
|---|---|
| #515 | `staging-error-sweep` Lane A MVP (cron + dispatch, self-hosted, JSON artifact) |
| #516 | Sweep JSON bug fix (Python not shell) |
| #517 | Sweep regex anchored to LOG LEVEL (DEBUG noise eliminated) |
| #518 | Sweep allowlist (Flyway/Eureka/Hikari startup noise suppressed) |
| #519 | Crawler multi-strategy token + `kc-provision-staging-sweeper.sh` |

### Pre-audit-consolidation fixes

| PR | Scope |
|---|---|
| #506 | api-gateway `/v1/theme-registry` permitAll |
| #509 | Frontend `__skipAuth` flag + theme-registry anonymous call |
| #514 | `/audit/events/live` + `/export/**` → permission-service (QLTY-PROACTIVE-03) |

### Parallel tracks (not our work but merged during session)

| PR | Scope |
|---|---|
| #522 | Frontend K8s MFE Docker image + GHCR (ADR-0002 Faz B) |
| #525-#526 | Frontend Dockerfile fixes |

---

## Operator state (stage)

### Canonical env additions (persistent via #528)
```
AUDIT_BACKEND_URI=lb://PERMISSION-SERVICE
STAGING_SWEEPER_CLIENT_SECRET=avHytVzkfcvkrnrxXK0wRxIW6GL0jtlL
```

### GH secrets added
- `STAGING_SWEEPER_CLIENT_SECRET`
- `STAGING_ADMIN_PASS`

### Keycloak artifacts
- Client: `staging-sweeper` (confidential, directAccessGrantsEnabled=true)
- 7 audience mappers: variant-/user-/permission-/report-/core-data-/schema-/api-gateway-service
- Usage: password grant with admin@example.com → token carries all service auds

### Workflows live
- `staging-error-sweep.yml` — daily cron, self-hosted stage-backend runner
- `staging-audit-compare-sweep.yml` — daily 04:00 UTC, 90-day artifact retention
- `deploy-backend.yml` now passes `AUDIT_BACKEND_URI` + `STAGING_SWEEPER_CLIENT_SECRET` to render

### Verified endpoints (admin token)
| Endpoint | HTTP | Notes |
|---|---|---|
| `/api/audit/events` | 200 | → permission-service (cutover active) |
| `/api/audit/events/live` | 000 (SSE open) | → permission-service SSE |
| `/api/audit/events/compare` | 200 | verdict=count-drift |
| `/api/v1/theme-registry` | 200 | anonymous OK |
| `/api/v1/me/theme/resolved` | 200 | post-issuer-fix |
| `/api/v1/authz/me` | 200 | Zanzibar OpenFGA |

### Current parity evidence
```json
{
  "verdict": "count-drift",
  "permissionTotal": 37,
  "userServiceTotal": 0,
  "permissionOnlyCount": 37,
  "userServiceOnlyCount": 0,
  "commonCount": 0,
  "fieldDiffs": 0,
  "userServiceErrors": []
}
```

Interpretation: `user_audit_events` table boş stage'de (reset sonrası mirror
geri doldurmamış). permission-service kendi tablosunda 37+ event (role
assignments, Zanzibar tuple writes, etc.). Mirror pipeline çalışıyor ama
user-service üretim yok → compare temiz ama "clean" değil.

---

## Roadmap tracking

Tracking issue: **#533** — [QLTY-PROACTIVE-06 Audit Consolidation A → C]

### Faz 3 — Mirror durability (NOT STARTED — governance blocker)

**Codex adversarial 8 iter özeti:**
- Teknik plan AGREE seviyesinde
- Governance RED: STORY-0319 FEC audit-consolidation'ı karşılamıyor

**Blocker 1: FEC scope isolation**
Aktif FEC `feature_id: staging-prod-profile-migration` (STORY-0319). "One story,
one contract, one verdict" rule. Seçenekler:
- (A) STORY-0316 (cross-plane-auth-session-audit-foundation) extend
- (B) Yeni STORY-0400+ aç

**Blocker 2: FEC glob syntax + db_migration flag**
- `V{N+1}__*` placeholder fnmatch'i karşılamaz → `V*__*` veya gerçek version
- `technical_contract.db_migration_required: false` → `true`

**Blocker 3: Canonical delivery chain**
- AC-0316 + TP-0316 mirror davranışını anlatıyor, outbox/idempotency/replay yok
- `audit-events.api.md` + INTERFACE-CONTRACT eski ack şekliyle — REPLACE gerek

**Codex thread:** `019da9a1` (8 iter history available)

**Technical plan (PR 0-6, AGREE'lenmiş):**

| PR | Tree | Scope |
|---|---|---|
| 0 | permission-service | `external_id` column + partial unique index + CTE upsert (DO UPDATE + xmax=0 discriminator) + 201 created / 200 deduped dual ack + SSE no-double-emit + 2x Flyway (migration/ + migration_schema_owned/) + tests |
| 1 | user-service | 2x Flyway for `user_service_outbox_events` (migration/ + migration_schema_owned/) + roadmap Faz 3 REPLACE with canonical metric names + gate thresholds |
| 2 | user-service | `@EnableAsync` + `@EnableScheduling` on UserApplication + OutboxConfig executor bean (corePool=2 max=4 queue=100 with MDC TaskDecorator) + JPA entity + JdbcTemplate repository |
| 3 | user-service | UserAuditEventService writes outbox row in domain @Transactional + emits AuditOutboxCreatedEvent + OutboxPublisher (@TransactionalEventListener AFTER_COMMIT + @Async) + shared publishAndFinalize(id) + atomic claimById |
| 4 | user-service | UserAuditOutboxPoller @Scheduled(10000ms) + stale PROCESSING reclaim (5min lease) + atomic batch claim (UPDATE ... WHERE id IN SELECT ... FOR UPDATE SKIP LOCKED WHERE created_at < NOW() - 5s) + Histogram `user_service_outbox_delivery_latency_seconds` + counter gauges |
| 5 | docs | `RB-audit-outbox-replay.md` full runbook + SQL requeue snippets + rollback V{N+1} / V16 SQL |
| 6 (opt) | infra | Grafana dashboard + Prometheus alerts |

**Canonical metric names (PR 1 sets this):**
- `user_service_outbox_delivery_latency_seconds` (Histogram, publish_latency = published_at - created_at)
- `user_service_outbox_pending_gauge`
- `user_service_outbox_oldest_pending_seconds_gauge`
- `user_service_outbox_failed_total`
- `user_service_outbox_published_total`
- `user_service_outbox_rejected_total` (TaskRejectedException)

**Faz 3 → Faz 4 gate:**
- p95(delivery_latency) < 30s over 7 days
- rate(failed_total[1h]) = 0 for 7 days
- `/compare` verdict ∈ {clean, id-drift} for 7 days
- No field-drift for 14 days
- oldest_pending_gauge < 60s at all monitoring ticks

### Faz 4 — Read-path cleanup (GATED)

Gate: Faz 3 shipped + evidence. Scope: 2 PR (~1 day after gate)
- Delete `user-service/AuditEventController.java`
- Route[5] hardcoded permission-service (flag removed)

### Faz 5 — Schema unwinding (GATED, 6+ months)

Gate: Faz 4 + retention policy + cold-storage export. Scope: 3 PR
- Retention export + archive verify
- Flyway drop `user_audit_events`
- Remove UserAuditEvent entity + Repository + Service write methods

---

## Pending / open items

### Open PRs (other authors / dependabot)
- #507 — Playwright crawler spec (local dev permitAll mode) — Halildeu, stale (session başından)
- #530, #529, #354, #353, #245, #243, #242, #239 — dependabot routine bumps

### Kararı bekleyen
- **PR #507 karar**: Close (superseded by #519 staging crawler) veya merge (local dev utility separate value)
- **Faz 3 başlangıç yolu**: (A) STORY-0316 extend mi, (B) yeni STORY mi?

### Oturumda başlanmadı
- **Prod deploy roadmap**: Stage pattern prod'a nasıl gidecek (ayrı doc)
- **K8s-7, K8s-8**: K8s migration wave (K8s-6 zaten merged)
- **Sweep Lane B v2**: Browser crawler'ı `staging-error-sweep.yml`'e lane olarak bağla (~30 dk, low effort high value)
- **AG Grid license warning**: `window.__env__.VITE_AG_GRID_LICENSE_KEY` inject path (minor)

---

## Operator runbook (stage — next session start)

### Quick verify (ai.acik.com back online)
```bash
ssh staging-sw '
SECRET=$(grep "^STAGING_SWEEPER_CLIENT_SECRET=" /home/halil/platform/env/backend.env | cut -d= -f2)
TOKEN=$(curl -s -X POST "https://ai.acik.com/realms/serban/protocol/openid-connect/token" \
    -d grant_type=password -d client_id=staging-sweeper -d client_secret="$SECRET" \
    -d username=admin@example.com -d password=AdminPass2026 \
    -d "scope=openid profile email" \
    | python3 -c "import json,sys; print(json.load(sys.stdin).get(\"access_token\",\"\"))")
curl -s -H "Authorization: Bearer $TOKEN" \
    "https://ai.acik.com/api/audit/events/compare?page=1&pageSize=10" \
    | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[\"diff\"])"
'
```

Expected: `verdict=count-drift` (until user-service starts producing mirrored events).

### Rollback cutover (if needed)
```bash
# Option 1: via canonical env (takes effect on next gateway recreate)
ssh staging-sw 'sed -i "s|^AUDIT_BACKEND_URI=.*|AUDIT_BACKEND_URI=lb://USER-SERVICE|" /home/halil/platform/env/backend.env'

# Option 2: via GH repo variable (applies on next deploy-backend)
gh api -X PATCH /repos/Halildeu/platform-ssot/actions/variables/AUDIT_BACKEND_URI \
  -f value=lb://USER-SERVICE -R Halildeu/platform-ssot
# Then trigger deploy-backend manually.

# Recreate api-gateway
ssh staging-sw '
cd /home/halil/actions-runner-stage/_work/platform-ssot/platform-ssot && \
  docker compose --env-file /home/halil/platform/env/backend.env -f backend/docker-compose.yml \
  up -d --force-recreate --no-deps api-gateway
'
```

### Sweep workflow dispatch (manual)
```bash
gh workflow run staging-audit-compare-sweep.yml -R Halildeu/platform-ssot -f page=1 -f page_size=50
```

### Artifact download
```bash
RUN_ID=$(gh run list -R Halildeu/platform-ssot --workflow=staging-audit-compare-sweep.yml --limit 1 --json databaseId -q '.[0].databaseId')
gh run download $RUN_ID -R Halildeu/platform-ssot --dir /tmp/compare-sweep/
```

---

## Next session opening

### Recommended start
1. Verify ai.acik.com back up (curl theme-registry 200)
2. Check compare sweep artifact (last 24h verdict stability)
3. Decide Faz 3 governance path:
   - **Option A:** Extend STORY-0316 (audit foundation) + FEC retarget — 1-2 saatlik governance PR, sonra PR 0 impl başlar
   - **Option B:** Yeni STORY aç — daha temiz ama ≈2 saat daha fazla iş
4. Başla PR 0 (permission-service external_id + idempotent upsert)

### Karar noktaları kullanıcıya
1. Faz 3 governance: A (extend STORY-0316) veya B (new STORY)?
2. PR #507 (eski Playwright): close veya merge?
3. Prod deploy roadmap yazılsın mı bu oturumda?
4. Sweep Lane B v2 bu oturum mu, Faz 3 sonrası mı?

---

## Codex thread history

- `019da771` — theme-registry bootstrap race analysis (Faz 1/2 öncesi)
- `019da7a2` — gateway audit SSE route fix (PR #514)
- `019da7f1` — audit cutover A vs B vs C analysis (RED on direct flip)
- `019da9a1` — Faz 3 outbox design iter 1-8 (AGREE teknik, RED governance)

---

## Files touched (grouped)

### Backend (permission-service)
- `backend/api-gateway/src/main/resources/application.properties` (routes[5] flag + routes[16/17/18] explicit)
- `backend/permission-service/src/main/java/com/example/permission/controller/AuditCompareController.java` (new)
- `backend/permission-service/src/main/java/com/example/permission/dto/AuditCompareResponse.java` (new)
- `backend/permission-service/src/main/java/com/example/permission/dto/AuditCompareDiff.java` (new)
- `backend/permission-service/src/main/java/com/example/permission/service/AuditCompareService.java` (new)

### Backend (compose + deploy)
- `backend/docker-compose.yml` (AUDIT_BACKEND_URI env)
- `deploy/ubuntu/render-backend-env.sh` (outbox + sweeper env passthrough)
- `deploy/ubuntu/render-backend-env-approle.sh` (env passthrough)
- `deploy/ubuntu/deploy-backend.sh` (env passthrough)

### Backend (ops scripts)
- `backend/scripts/ops/kc-provision-staging-sweeper.sh` (new)
- `backend/scripts/ops/staging-error-sweep.sh` (new, Lane A)
- `backend/scripts/ops/staging-error-allowlist.txt` (new)
- `backend/scripts/ops/staging-audit-compare-sweep.sh` (new, Faz 2 monitoring)

### Frontend
- `web/packages/shared-http/src/index.ts` (`__skipAuth` flag)
- `web/apps/mfe-shell/src/app/theme/theme-context.provider.tsx` (anon theme-registry)
- `web/apps/mfe-shell/src/app/layout/ThemeRuntimePanelButton.tsx` (anon theme-registry)
- `web/scripts/ops/staging-console-crawler.mjs` (multi-strategy token)

### Workflows
- `.github/workflows/staging-error-sweep.yml` (new, Lane A)
- `.github/workflows/staging-audit-compare-sweep.yml` (new, Faz 2 monitoring)
- `.github/workflows/deploy-backend.yml` (env pass-through)

### Contracts
- `extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json` (multiple path additions)
- `extensions/PRJ-UX-NORTH-STAR/contract/ux_change_map.v1.json` (crawler path)

### Docs
- `docs/03-delivery/ROADMAPS/QLTY-PROACTIVE-06-audit-consolidation-roadmap.md` (new, not created by us but referenced)

---

## Session metrics

- **Duration:** ~10 hours (with breaks)
- **PRs merged:** 14
- **PRs open (our work):** 0 (all merged or closed)
- **Stage deploys:** 6+ successful
- **Sweep workflow runs:** 4 (error-sweep v1, v1.2 dispatch + cron; compare-sweep v0 failure, v1 success)
- **Codex iter rounds:** 8 on Faz 3 design
- **Tracking issues opened:** 1 (#533)
- **Stage downtime awareness:** 2 hours (user-initiated, mid-session)
