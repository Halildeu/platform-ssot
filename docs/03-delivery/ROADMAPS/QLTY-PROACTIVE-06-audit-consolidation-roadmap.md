# QLTY-PROACTIVE-06 — Audit Consolidation Roadmap (A → C Kademeli)

**Target architecture:** `permission-service` becomes the single owner of audit read + write; `user-service` retains only domain-event producers that POST to permission-service's internal endpoint. `user_audit_events` table eventually dropped after retention.

**Motivation:** D-003 FINAL made permission-service the OpenFGA hub; audit was also meant to consolidate there. v1 left audit dual-owned, producing:
- 404 on `/api/audit/events/live` (PR #514 fixed — subsurface routes)
- `userEmail`/`correlationId` payload drift between sources
- Two different auth semantics (`AUDIT.viewer` gated vs. ungated)
- `fire-and-forget` mirror HTTP without durability

**Codex adversarial review:** thread `019da7f1` → RED on direct flip, PARTIAL on feature-flag path.

---

## Faz 1 ✅ — Feature-flag cutover (PR #520 merged 2026-04-19)

**What:** Compose env `AUDIT_BACKEND_URI` controls gateway `routes[5].uri` for the base `GET /api/audit/events` list. Default `lb://USER-SERVICE` (back-compat). Flip in canonical env → `lb://PERMISSION-SERVICE` → recreate api-gateway → cutover active.

**Rollback:** env one-liner + recreate (3 min). No code change.

**Out of scope:** `/live` + `/export/**` still always route to permission-service via `routes[16,17]` (order=-1).

**Operator action needed:**
```bash
ssh staging-sw
# Enable cutover in stage:
echo "AUDIT_BACKEND_URI=lb://PERMISSION-SERVICE" >> /home/halil/platform/env/backend.env
cd /home/halil/platform && docker compose up -d --force-recreate api-gateway
```

---

## Faz 2 ✅ — Shadow-compare endpoint (PR #521 merged 2026-04-19)

**What:** `GET /api/audit/events/compare` (permission-service, `AUDIT.manager` gated). Calls BOTH user-service (HTTP) and permission-service (in-service), returns both + diff JSON.

**Verdict ladder:** `clean` / `id-drift` / `count-drift` / `field-drift` / `user-service-unreachable`.

**Operator usage:**
```bash
curl -s -H "Authorization: Bearer <admin-token>" \
  "https://ai.acik.com/api/audit/events/compare?page=1&pageSize=50" | jq .diff
```

**Evidence-gathering protocol (before Faz 4):**
- Daily call for 7+ days
- Track `verdict` + sample `fieldDiffs`
- Fix identified field-drift (likely: permission-service `userEmail` missing for mirrored events; `correlationId` format mismatch)

---

## Faz 3 ⏳ — Mirror durability upgrade (2-4 weeks)

**Gate:** Faz 2 evidence collected + drift patterns understood.

**Scope:**
- Replace `UserAuditMirrorClient` fire-and-forget HTTP with **transactional outbox pattern**
  - New table `user_service_outbox_events` (service-local)
  - Writes to `user_audit_events` + outbox in same transaction
  - Background poller (SELECT FOR UPDATE SKIP LOCKED) sends to permission-service
  - Retry + DLQ + metrics
- Lag SLO: p95 < 30s observable via `permission_audit_events.mirror_lag_seconds`
- Failure mode: stage sweep FAIL if lag > 5 min for 3 consecutive scans

**Files:**
- `backend/user-service/src/main/java/com/example/user/outbox/*` (new package)
- `backend/user-service/src/main/resources/db/migration/V{N}__user_service_outbox.sql`
- `backend/permission-service/src/main/java/com/example/permission/audit/MirrorLagMetricsPublisher.java`

---

## Faz 4 ⏳ — Read-path dead-code removal (#4) (4-6 weeks)

**Gate:**
- Faz 1 `AUDIT_BACKEND_URI=lb://PERMISSION-SERVICE` active **in prod** for 7+ days
- Faz 2 `/compare` verdict `clean` (or all field-diffs remediated) for 7+ days
- Faz 3 mirror outbox live, lag SLO met

**Scope:**
- Delete `backend/user-service/src/main/java/com/example/user/controller/AuditEventController.java`
- Remove `UserAuditEventRepository.findAll` usage from controller (save() remains for writes)
- Gateway `routes[5]` collapsed: remove feature-flag, hardcode `lb://PERMISSION-SERVICE`
- Optional: remove compose env `AUDIT_BACKEND_URI`

**NOT in scope (stays alive for writes):**
- `UserAuditEventService` (called by `UserControllerV1`, `NotificationPreferencesService`, `CsvExportGuardService`)
- `UserAuditEventRepository.save`
- `UserAuditEvent` entity
- `UserAuditMirrorClient` / outbox poller

**Rollback window:** 24h after merge; longer via route config revert (not full code revert).

---

## Faz 5 ⏳ — Schema unwinding (retention-gated, 6+ months)

**Gate:**
- `user_audit_events` retention policy (default 6 months) elapsed
- Cold-storage snapshot exported for regulatory compliance
- Prod running on consolidated stack for 60+ days without audit incidents

**Scope:**
- Delete `backend/user-service/src/main/java/com/example/user/model/UserAuditEvent.java`
- Delete `UserAuditEventRepository.java` (entire)
- Delete `UserAuditEventService.java` (entire — write path migrates to direct HTTP/outbox to permission-service)
- `UserControllerV1`, `NotificationPreferencesService`, `CsvExportGuardService`: refactor to call permission-service's internal audit endpoint directly (or via outbox)
- Flyway migration: `DROP TABLE user_audit_events` (reversible window 24h via schema backup)

**End-state:** Zero audit code in user-service. permission-service is single SSOT. Zero feature flags. Zero conditional routing. Zero HTTP fire-and-forget.

---

## Tracking

| Faz | Status | PR / Issue | Owner | ETA |
|---|---|---|---|---|
| 1 | ✅ MERGED | #520 | claude | 2026-04-19 |
| 2 | ✅ MERGED | #521 | claude | 2026-04-19 |
| 3 | ⏳ NOT STARTED | TBD | claude | 2-4 weeks after Faz 2 evidence |
| 4 | ⏳ GATED | TBD | claude | 4-6 weeks |
| 5 | ⏳ GATED | TBD | claude | Retention cycle |

## Decision registry impact

This roadmap satisfies `decisions/topics/zanzibar-openfga.v1.json` — D-003 FINAL "permission-service as authorization hub" explicitly extends to audit surface. Pre-cutover dual ownership was transitional; post-Faz 5 state matches D-003 intent.
