# Session Handoff — 2026-04-18 Zanzibar OI-03 Canary Read-Path OPEN

**Session:** 2026-04-18 (Zanzibar-25)
**Duration:** ~10 hours
**PRs merged:** 24
**Closing state:** Zanzibar stage operational ~%97

## 🎯 Session Milestone

Canary auth chain **read path fully open** — `/authz/me` 200 with full persona context on staging. Entire 4-layer Bug B env wiring drift chain resolved + OI-02 Option B closed + 5 Codex drift-hunt follow-ups merged + 3 ops actions (tooling install, secret rotation, DB repair).

Remaining: canary **write path** (granule/assignment 500 — permission_id NULL violation) → OI-03 dedicated session.

## 📦 PR Chain (24 merged)

### Wave 1 — Drift guards + OI-02 Option B (11 PR)
- #464 nginx 502 hotfix docs
- #465 KMS rehearsal + escrow + break-glass runbook
- #466 doctor-infra Section M port drift guard
- #467 nginx upstream fail-closed assert (Codex #464 CRITICAL)
- #468 doctor-infra M1/M2/M3 robustness (Codex #466 MAJOR)
- #469 issuer/audience + OpenFGA idempotency + L2b
- #470 KV db/* + jwt path validation
- #471 OI-04 honest reframe C-path
- #472 seed-stage-approle HCL source-of-truth
- #473 SERVICE_JWT → AUTH_SERVICE_JWT naming unification
- #474 runbook scope split + OI-02 troubleshooting

### Wave 2 — Drift #2 rehearsal (4 PR)
- #475 render pre-deploy fail-closed flip (RENDER_ENV_BEFORE_DEPLOY=true default)
- #476 F5 keycloak postgres-db grep SIGPIPE fix
- #477 write_kv_if_present `return 0` silent death fix
- #478 render/write/check chain 5 missing keys (ERP_OPENFGA_*, SECURITY_JWT_ISSUER/ISSUERS, AUTHZ_USER_TABLE)

### Wave 3 — Codex Thread 5 drift hunt (5 PR)
- #479 canary wrapper preflight (tools + reachability + env fail-closed)
- #480 DB schema dual-read (canonical + spring.datasource.* alias)
- #481 schema-service SCHEMA_MSSQL_* canonical contract
- #482 state file contract hardening (preflight + age warn + login error hints)
- #483 post-deploy BACKEND_HEALTH_URLS edge-path validation

### Wave 4 — OI-03 canary enablement (4 PR)
- #484 auth-service SERVICE_CLIENT_USER_SERVICE_SECRET env wire
- #485 canary setup 3 fixes (KC password reset + UPSERT fallback + super-admin user JWT)
- #486 permission-service SECURITY_AUTH_ALLOWED_CLIENT_IDS env wire (Bug B layer 1)
- #487 compose SECURITY_JWT_SECONDARY_* substitution (Bug B layer 3)

## 🔧 Ops Actions (non-PR)

1. **Tooling install (staging-sw):** `sudo apt install nodejs jq` + `sudo snap install k6` — k6 v1.6.1 + node v22.22.2 + jq 1.6
2. **VAULT_TOKEN GH secret rotation:** staging current root token → gh env/stage secret (2026-04-18T14:06:50Z)
3. **Bug A DB repair (one-off):** `UPDATE user_service.users SET email='canary-super-admin@stage.local' WHERE email='canary-admin@stage.local' AND id=1204` (preserve id + OpenFGA tuple + 29 role_permissions)
4. **Canonical env extensions (staging):** `SECURITY_JWT_ISSUERS +http://localhost:8081/realms/serban`, `SECURITY_JWT_SECONDARY_AUDIENCE` full 8-audience list

## 🐛 Bug Chain Resolution Timeline

### Bug 1 — user-service duplicate key (PR #485)
- Symptom: POST /api/v1/users/internal/provision 500 (users_pkey)
- Fix: Canary setup fallback to `GET /by-email/{email}` when provision !ok

### Bug 2 — permission-service /api/v1/roles 401 (PR #485)
- Symptom: Mint token audience=permission-service 401 on role creation
- Root cause: Endpoint uses @RequireModule (user-based OpenFGA), not service-token
- Fix: Use super-admin persona user JWT via password grant

### Bug 3 — KC persona password tokens 401 (PR #485)
- Symptom: 4/5 persona password grant fails
- Root cause: kcEnsureUser existing-user path skipped password set
- Fix: `PUT /admin/realms/{realm}/users/{id}/reset-password` in existing path

### Bug A — canary-super-admin not in user-service DB (ops)
- Symptom: super-admin provision 500 duplicate + lookup 404
- Root cause: Legacy `canary-admin@stage.local` id=1204 drift (older naming)
- Fix: One-off DB rename preserving id

### Bug B — /authz/me 401 (4 layers)
- **Layer 1** (PR #486): permission-service SECURITY_AUTH_ALLOWED_CLIENT_IDS env not wired from canonical env
- **Layer 2** (canonical env): SECURITY_JWT_ISSUERS missing `http://localhost:8081/realms/serban` (KC_HOSTNAME emitted issuer)
- **Layer 3** (PR #487): compose SECURITY_JWT_SECONDARY_* hardcoded (no substitution)
- **Layer 4** (canonical env re-add): SECURITY_JWT_SECONDARY_AUDIENCE full 8-audience list — write-backend-deploy-stage.sh chain'e henüz eklenmedi (OI-03 follow-up)

## 🚧 Remaining (OI-03 Dedicated Session)

### Write-path 500 bug
- **Location:** `backend/permission-service/src/main/java/com/example/permission/controller/AccessControllerV1.java:219` (updateRoleGranules)
- **Error:** `null value in column "permission_id" of relation "role_permissions" violates not-null constraint`
- **Symptom:** Canary setup granule update 500 for all 5 roles; 2/4 user-role assignments 500; outbox version bump 120s timeout
- **Likely cause:** Permission key (UPSERT string, feedback_permission_type_enum_uppercase.md) → permission_id lookup broken in granule endpoint. Backend Java/SQL bug, not env drift.
- **Impact:** Full cold+warm canary run blocked. ESTIMATE_ONLY read-only path could still produce partial evidence.

### write-backend-deploy-stage.sh missing keys (cleanup PR)
- `SECURITY_JWT_SECONDARY_AUDIENCE` — added manually to canonical env but not in Vault KV chain
- Next deploy with RENDER_ENV_BEFORE_DEPLOY=true will drop the value
- Fix: add to write/render/check scripts (same pattern as PR #478)

### smoke-report-authz.sh ADMIN_USERNAME default drift
- Bug A DB rename broke `smoke-report-authz.sh:ADMIN_USERNAME=canary-admin@stage.local` default
- Needs update to new naming or configurable via env

## 🎛️ Next Session Bootstrap

**Starting state:**
- Zanzibar stage operational ~%97
- Canary auth chain read path OPEN (verified via direct /authz/me)
- All 24 PRs merged, staging deployed + verified

**First 3 actions:**
1. Read this handoff + `memory/project_zanzibar_status.md`
2. Consult Codex (mandatory rule `feedback_codex_mandatory_plan_fix.md`) with permission-service `AccessControllerV1.updateRoleGranules:219` + error `role_permissions.permission_id NULL` — strategy for granule endpoint permission_id lookup fix
3. Fix granule endpoint → canary cold+warm run → evidence manifest commit → OI-03 CLOSED

**OI-04 (prod cutover) still pending:** K8s-6 session D32 staging-sw-2 dependency (independent host for KMS auto-unseal failure domain).

## 📊 Codex Thread Register (this session)

15+ threads used: plan review × 3 + code review × 3 + drift hunt × 2 + post-mortem × 3 + OI-04 reframe + deep canary debug × 3

Key threads to continue:
- `019da124` — Bug A/B/C canary setup strategy
- `019da137` — Bug A canary-super-admin DB strategy
- `019da160` — Bug B deep auth chain analysis (issuer/audience/secondary)

## 🔗 References

- Live evidence: `ssh staging-sw` → `.cache/reports/zanzibar-canary/20260418-202657/setup.log` (last canary run with full persona context)
- Canonical env state: `/home/halil/platform/env/backend.env` (85 lines + SECURITY_JWT_SECONDARY_AUDIENCE manually added)
- Memory: `~/.claude/projects/-Users-halilkocoglu-Documents-dev/memory/project_zanzibar_status.md`
- K8s alignment: `/Users/halilkocoglu/Documents/platform-k8s-gitops/PLAN.md` (D32 = 2nd physical server staging-sw-2)
