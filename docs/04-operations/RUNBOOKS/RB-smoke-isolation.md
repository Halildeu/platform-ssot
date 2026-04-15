# RB-smoke-isolation — Zanzibar Smoke Test Compose Project Isolation

**Tarih:** 2026-04-15
**Durum:** Active (containment phase)
**Kapsam:** `.github/workflows/smoke-zanzibar.yml`, `scripts/docker-smoke-test.sh`
**Ilgili decision:** zanzibar-openfga.v1.json D-003/D-008 (hub), C-005 (permission-service koruma)
**Ilgili kural:** feedback_compose_management.md (tek proje adi), feedback_infra_stability.md

---

## 1. Incident (2026-04-15)

### Gozlem
PR #390 `deploy-backend` 08:45:57Z success dondu. Ardindan canli staging:
- `/` (nginx) 200 OK
- `/api/v1/users/actuator/health` **502**
- `/api/v1/authz/me` **502**
- `/realms/serban` **502**

`docker ps -a` staging host'ta sadece 4 container:
```
platform-service-manager-1   Up 28 min (unhealthy)
platform-vault-audit-init-1  Up 35 hours
platform-vault-snapshot-1    Up 35 hours
platform-web-nginx           Up 25 min
```

17 servis (postgres-db, vault, openfga, openfga-migrate, discovery-server,
api-gateway, auth-service, user-service, permission-service, variant-service,
core-data-service, report-service, schema-service, loki, promtail, tempo,
prometheus, grafana) **hic yok** — `exited` bile degil. Explicit removal
pattern.

### Root Cause

`.github/workflows/smoke-zanzibar.yml`:
- `workflow_run` trigger: `deploy-backend` completion + success
- Runner: `[self-hosted, stage-backend]` (staging host'un kendi Docker'i)
- Script: `scripts/docker-smoke-test.sh`

`scripts/docker-smoke-test.sh`:
- `COMPOSE_FILE="$REPO_ROOT/backend/docker-compose.yml"` — `name: platform`
- `COMPOSE_PROJECT_NAME` override **YOK**
- `trap cleanup EXIT` → `docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans`

### Olay Siralamasi
```
08:45:57Z  deploy-backend PR #390 success → stack healthy
08:50:56Z  Zanzibar Smoke Test auto-trigger (run 24445359188)
           self-hosted stage-backend runner'da docker-smoke-test.sh
           docker compose up -d (zaten running stack uzerine no-op)
           openfga-migrate exit 1 (fresh DB bekledigi halde mevcut DB'de)
           script fail → trap cleanup EXIT
           docker compose down --volumes --remove-orphans
           → 'platform' project'in 17 servisi + volume'lari SILINDI
08:52:34Z  web-nginx bind-mount re-attach (bagimsiz container)
09:17+     curl canli dogrulama: 502'ler
```

Memory `feedback_compose_management.md`'nin "tek proje ismi platform,
dual-project yasak" kurali ile celismiyor — smoke aslinda ayni 'platform'
project'inde cleanup yaparak kuraldan yararlaniyordu; yanlislikla canli stack
ile ayni namespace'de olmasi self-destructive davranisa yol acti.

---

## 2. Fix (3 Katman Defense-in-Depth)

### Katman 1 — Script izolasyonu (`scripts/docker-smoke-test.sh`)
```bash
export COMPOSE_PROJECT_NAME="platform-smoke-${GITHUB_RUN_ID:-$$}"

if [[ ! "$COMPOSE_PROJECT_NAME" == platform-smoke-* ]]; then
  echo "::error::SMOKE ISOLATION VIOLATION: ..." >&2
  exit 1
fi
```

`COMPOSE_PROJECT_NAME` env variable `backend/docker-compose.yml` icindeki
`name: platform` key'ini override eder (Docker Compose v2 priority:
env > flag > file). Smoke artik `platform-smoke-<run_id>` project'inde
izole calisir. `down --volumes --remove-orphans` yalnizca o project'in
container + volume'larina etki eder.

### Katman 2 — Workflow auto-trigger disable (`.github/workflows/smoke-zanzibar.yml`)
```yaml
# workflow_run auto-trigger GECICI DISABLED:
on:
  workflow_dispatch:
    inputs:
      timeout:
        description: 'Smoke test timeout (seconds)'
        default: '120'
  schedule:
    - cron: '30 2 * * *'  # Nightly @ 02:30 UTC
```

Containment phase'de auto-trigger kapali. Manuel disptach + nightly schedule
ile smoke calisir. Izolasyon Katman 1'de zaten saglanmis olsa bile, auto-trigger
bir extra guvenlik tabakasi olarak geri aciliyor (gradual rollout).

### Katman 3 — Doctor drift guard (`backend/scripts/doctor-zanzibar.sh`)
```
A21. Smoke isolation — docker-smoke-test.sh drift guard
  - COMPOSE_PROJECT_NAME export var mi
  - SMOKE ISOLATION VIOLATION check var mi
A22. Smoke workflow auto-trigger disabled check
  - workflow_run disabled mi (containment phase)
```

Katman 1 ve 2'nin accidentally geri alinmasini yakalar. `doctor-zanzibar.sh
--quick` her worktree'de, `doctor-zanzibar.sh` (full) CI'da calisir.

---

## 3. Verification

### PR Olcekli
- [ ] `doctor-zanzibar.sh --quick` PASS (A21 + A22 dahil)
- [ ] Yerel `bash scripts/docker-smoke-test.sh --timeout 30 --skip-cleanup` test
  - `COMPOSE_PROJECT_NAME=platform-smoke-<pid>` olarak govde'de cikar
  - `docker compose -p platform-smoke-<pid> ps` izolasyonu dogrular
  - Cleanup sonrasi `docker volume ls | grep platform-smoke-` temiz

### Integration (stage-backend runner)
- [ ] Manual `gh workflow run smoke-zanzibar.yml` (workflow_dispatch)
- [ ] Run izole project'te calisir: stage host'ta `docker ps --filter name=platform-smoke-*`
- [ ] Smoke fail senaryosunda bile canli `platform` project'i intact

### Canli Dogrulama (post-merge)
- [ ] Manual dispatch sonrasi stage `platform` stack servisleri healthy (17 servis)
- [ ] Nightly schedule bir kez cali smoke PASS veya fail — her iki durumda canli stack intact
- [ ] Doctor full run PASS (A21 + A22)

---

## 4. Re-Enable Kriterleri (workflow_run geri acma)

Asagidaki SARTLARIN HEPSI saglandiginda `workflow_run: [deploy-backend]`
auto-trigger geri acilabilir:

1. **3 kez ardisik** manuel dispatch smoke PASS (farkli SHA'larda)
2. **1 hafta** nightly schedule smoke failure'i canli stack'i etkilememis
   (stage host'ta `platform` stack uptime continuous)
3. `doctor-zanzibar.sh` full `A21 + A22` PASS (regression olmamis)
4. Stage deploy + smoke bagimsiz test (farkli `deploy-backend.yml` run'lari)
5. Smoke isolation stratejisine uygun bir e2e test yazilmis (idempotent
   run: ayni run_id'de ikinci cagri namespace collision olmamali)

Re-enable PR'i olmasi gereken:
- `smoke-zanzibar.yml` `on:` block: `workflow_run` geri eklenir
- `if:` condition: `github.event.workflow_run.conclusion == 'success'` geri
- `doctor-zanzibar.sh` `A22` check'i soft warn'a cevrilir veya kaldirilir

---

## 5. Referanslar

- Incident: 2026-04-15 canli 502 + 17 servis kayip
- Consultation: CNS-20260415-002 (Claude + Codex, APPROVE_WITH_CHANGES)
- PR: `claude/smoke-containment` → main
- Session handoff: `.claude/plans/session-handoff-20260415-live-recovery.md`
- Master plan: `.claude/plans/zanzibar-master-plan.md` (rev 20)
- Decision registry: `decisions/topics/zanzibar-openfga.v1.json`
