# Session Handoff — 2026-04-15 Zanzibar Recovery Day 2

**Onceki session'lar:**
- `session-handoff-20260415-live-recovery.md` — Day 1 sabah (MF React + live recovery)
- `session-handoff-20260414-deploy.md` — 2 gun once, nginx TLS + deploy drift
- `session-handoff-20260413-s2.md` — 3 gun once, Rev 19/20 + infra stabilization

**Bu session:** ~4 saat (ogleden sonra — aksam). Odak: Zanzibar Dalga 2 UI + P0
incident recovery + stack ayaga kaldirma + Rev 21 master plan housekeeping.

**Canli durum handoff yazildiginda:**
- ai.acik.com / → 200
- /api/v1/authz/version → 200 (`{"authzVersion":1}`)
- /api/v1/authz/explain → 200 (local permitAll, token'siz bile 200)
- /realms/serban → 200
- 22 container healthy (stack tam ayakta)
- user-service /actuator/health gateway uzerinden 500 (minor, local profile actuator secured)

---

## 1. Bu Session'da Yapilanlar

### 1.1 Merged PR'lar (kronolojik)

| # | SHA | Konu |
|---|-----|------|
| #392 | `5cbbe21e` | smoke-zanzibar izolasyon (compose project + workflow_run disable + doctor A21/A22) |
| #393 | `674beb0c` | RLS Phase 1 03/04/05 SQL files fresh-boot safe (DO $$ + IF EXISTS guard) |
| #394 | `5241b6e4` | Zanzibar Faz 4 Explain UX: ExplainPermissionModal + RoleDrawer inline "?" butonu |

### 1.2 P0 Incident Kronolojisi

**08:45** — Dun PR #390 deploy-backend success.

**08:50** — `Zanzibar Smoke Test` workflow auto-trigger (run 24445359188).
`scripts/docker-smoke-test.sh` trap cleanup EXIT → `docker compose down --volumes
--remove-orphans` → ayni `platform` compose project → **canli staging stack'in 17
servisi + volume'lari SILINDI**. `platform_vault_data` volume dahil gitti.

**14:06** — PR #392 merge (smoke containment).

**14:07** — deploy-backend retry (PR #393 henuz yok) → postgres fresh volume'da
`03-rls-phase1-entities.sql` ERROR: "relation permission_service.user_permission_scope
does not exist" → postgres exit 3 → tum stack cascading fail.

**14:20** — PR #393 merge (RLS fresh-boot safe).

**14:26** — deploy-backend tekrar retry → postgres bu sefer PASS (RLS guard calisti)
→ vault unseal fail (key dosyasi eski, volume sifirdi) → stack yarisi kalkti
(11 healthy + 4 Spring Boot "Created").

**15:35** — Vault fresh init + unseal manual intervention:
```bash
docker exec -e VAULT_ADDR=http://127.0.0.1:8200 platform-vault-1 \
  vault operator init -key-shares=1 -key-threshold=1 -format=json > vault-init.json
# extract key + token, write to vault-unseal-key + vault-root-token
docker compose restart vault-unseal
```

**15:44** — `docker compose up -d` → 19 container up. Ancak `compose up` vault'u
restart'a zorladi ve Vault tekrar SEALED oldu.

**15:46** — Manual unseal (key dosyasindaki guncel key ile):
```bash
docker exec -e VAULT_ADDR=http://127.0.0.1:8200 platform-vault-1 \
  vault operator unseal "$(cat /home/halil/platform/state/vault-dev/vault-unseal-key)"
```

**15:47** — PR #394 merged (Explain UX). Web-deploy tetiklendi.

**15:50** — deploy-web success, canli bundle 12:50:35. 22 container healthy.

**15:52** — Canli dogrulama: `/api/v1/authz/*` 200, bundle'da `explainModal` +
`ExplainPermission` string'leri mevcut.

### 1.3 Mimari Kararlar

**Smoke cleanup — 3 katman defense-in-depth (PR #392):**
1. `scripts/docker-smoke-test.sh` script'i icinde
   `export COMPOSE_PROJECT_NAME="platform-smoke-${GITHUB_RUN_ID:-$$}"` +
   fail-closed drift guard.
2. `.github/workflows/smoke-zanzibar.yml` `workflow_run` auto-trigger **gecici
   disabled**. Sadece `workflow_dispatch` + `schedule: '30 2 * * *'` nightly.
3. `backend/scripts/doctor-zanzibar.sh` A21 (smoke script izolasyonu) + A22
   (workflow auto-trigger disabled) drift guard.

**Re-enable kriterleri:** `docs/04-operations/RUNBOOKS/RB-smoke-isolation.md` §5.

**RLS fresh-boot — PR #381 pattern extension (PR #393):**
- `02-rls-policies.sql` PR #381'de idempotent yapilmis; ama 03/04/05 atlanmis.
- 4 tablo (`user_permission_scope`, `scopes`, `companies`, `variant_visibility`)
  icin `DO $$ BEGIN IF EXISTS (information_schema.tables) THEN ... END $$;`
  guard uygulandi.
- Uzun vade: RLS'leri `init-db/`'den `Flyway R__rls_*.sql` repeatable migration'a
  tasimak — ayri story.

**Explain UX modal tasarimi (PR #394):**
- Modal widget `mfe-access/widgets/explain-modal/` altinda (design-system'e degil,
  auth domain'e spesifik oldugu icin).
- RoleDrawer'da 3 permission tipinde (module/action/report) inline "?" butonu.
- 403 sayfasi precedent'inden (`UnauthorizedPage.ui.tsx`) hook + render patterni kopya.
- Barrel index.ts yerine direct import (role-drawer/ pattern'i ile tutarli + contract
  uyumluluk).
- i18n: tr + en 13 yeni anahtar. de/es/pseudo Phase 3 drawer keys'i de eksik (ayri
  `i18n-completeness` story).

---

## 2. Ogrenilen Dersler

### Smoke is destructive by default
Trap EXIT ile `down --volumes --remove-orphans` pattern'i idempotent smoke test
icin standart, ama ayni compose project'te canli stack varken **fatal**. Izole
project isimlendirme (env `COMPOSE_PROJECT_NAME`) defense-in-depth icin en hizli
fix. Nihai: smoke ayri Docker context'inde (nested Docker-in-Docker veya daemon
izolasyonu) calisabilir.

### "PR #381 pattern" kendi kendine extension olmaz
PR #381 commit mesajinda "IDEMPOTENT + FRESH-BOOT SAFE" deniyordu ama sadece 02'yi
duzeltiyordu. Aynı dizindeki 03/04/05 kardes dosyalari scope disinda kaldi — bug
bir ay uyudu, volume silinince patladi. Alinma: PR scope'larinda "benzer pattern'i
kardes dosyalara da uygula" check list maddesi eklenebilir.

### Vault re-init + `compose up` yaris
`docker compose up -d` vault container'ini recreate etti, vault-unseal sidecar
key'i hala eski dosyadan okudu ama vault fresh init oldugu icin key uyumsuz.
Fix sirasi kritik: **once vault init + key dosyasi update, sonra unseal restart,
en son compose up**. Aksi halde "sealed-loop" tekrar baslar.

### Staging local profile canary'yi anlamsiz kiliyor
`SecurityConfigLocal permitAll` token'siz 200 donduruyor → deny rate hep 0 →
canary guardrail sinyal vermez. Stage 1 dry-run ilan + STORY-0319 unlock (Stage 2).

---

## 3. Acik Kalan Isler

### 3.1 Kritik Sonraki Iş — STORY-0319

**Dosya:** `docs/03-delivery/STORIES/STORY-0319-staging-prod-profile-migration.md`

**Kapsam:**
- 7 backend servis `SPRING_PROFILES_ACTIVE=prod,docker`
- Staging GHCR image pull credentials
- Keycloak issuer/audience staging hostname adaptation
- Vault AppRole (prod secret mgmt)
- nginx `WEB_GATEWAY_UPSTREAM` DEPLOY_ENV-aware (PR #372 pattern genislet)
- doctor-infra.sh profile drift check

**Risk:** high. Vault prod seal stratejisi (KMS auto-unseal) ayri story olabilir
— mevcut 1-of-1 shamir dev convention.

**Yarinki session icin ilk adim:** STORY-0319 tasarimi, Vault prod seal
gerektirip gerektirmedigini degerlendirme, ADR cikarma (veya cikarmama karari).

### 3.2 Dusuk Oncelik (Dalga 2 %15 kalan)

- [ ] ZanzibarGate `disabled` → explain tooltip (micro, 2-3 saat)
- [ ] Playwright explain modal senaryosu
- [ ] de/es/pseudo i18n (ayri `i18n-completeness` story)

### 3.3 Minor Observability

- [ ] user-service `/actuator/health` gateway 500 — local profile actuator secured.
      Gateway route management config veya user-service security config incele.
- [ ] Smoke workflow (PR #392 sonrasi) ilk manual dispatch test yapilmali:
      `gh workflow run smoke-zanzibar.yml`. Beklenen: izole project'te calisir,
      canli `platform` stack intact.

### 3.4 Operasyonel — Sistem Bakimi

- [x] `web/logs/archive` 62 GiB temizlendi (disk avail 28G → 90G).
- [ ] Benzer arsivler kontrol edilebilir: `~/.npm`, Docker volumes, node_modules.

### 3.5 Post-Canary (Dalga 3)

STORY-0319 + Dalga 1 Stage 2/3 tamamlandiktan sonra:
- PR6a: auth-service `PermissionServiceClient` sokumu (Set.of() compat)
- PR6b: JWT `permissions` claim + downstream cleanup
- PR6c: report-service legacy HTTP client

Doctor A19 3 uyari bunun icin drift guard koyuyor, envanter TB-11'de.

---

## 4. Yarinki Session Icin Baslangic Rehberi

```bash
# 1) Plan + handoff oku
cat .claude/plans/zanzibar-master-plan.md   # rev 21
cat .claude/plans/session-handoff-20260415-zanzibar-recovery-day2.md   # bu dosya

# 2) Canli saglik
curl -sI https://ai.acik.com/
curl -s https://ai.acik.com/api/v1/authz/version
ssh staging-sw "docker ps --filter name=platform- --format '{{.Names}}\t{{.Status}}' | sort"

# 3) Son deploy durumu
gh run list --branch main --workflow=deploy-backend.yml --limit 3
gh run list --branch main --workflow=deploy-web.yml --limit 3

# 4) Zanzibar baseline (doctor)
bash backend/scripts/doctor-zanzibar.sh --quick   # beklenen: PASS 61/0/4

# 5) Acik PR var mi
gh pr list --state open

# 6) STORY-0319 oku — siradaki is
cat docs/03-delivery/STORIES/STORY-0319-staging-prod-profile-migration.md
```

---

## 5. Tek Bakista Ozet

| Konu | Durum |
|------|-------|
| Canli (ai.acik.com) | ✅ 200, login akisi Keycloak prod-like |
| Backend stack | ✅ 22 container healthy |
| Zanzibar endpoints | ✅ `/authz/version` + `/authz/explain` 200 |
| Dalga 0 (Canary Readiness) | ✅ PR #365 |
| Dalga 1 Stage 1 (deploy dry-run) | ✅ 2026-04-15 |
| Dalga 1 Stage 2 (gercek canary) | ⏸ STORY-0319 bekliyor |
| Dalga 2 (Explain UX) | ✅ %85 (PR #394) |
| Dalga 2 kalan (tooltip + Playwright) | ⏸ Dusuk oncelik |
| Dalga 3 (PR6a/b/c) | ⏸ Post-canary |
| STORY-0319 (staging prod-like) | ▶ **Yarinki session odak** |
| Vault | ✅ unsealed, 1-of-1 shamir |
| Smoke workflow | ✅ izole (PR #392), ilk manual test bekliyor |
| user-service actuator 500 | ⚠️ Minor, post-canary degerlendir |
| `web/logs/archive` | ✅ 62G temizlendi |

---

## 6. Referanslar

- **Master plan:** `.claude/plans/zanzibar-master-plan.md` (rev 21)
- **Decision registry:** `decisions/topics/zanzibar-openfga.v1.json` (D-001..D-008 FINAL)
- **Consultation:** `.autopilot-tmp/CNS-20260415-002-consultation.md` +
  `*-response.md` (158K token, Claude + Codex, APPROVE_WITH_CHANGES)
- **Runbooks:**
  - `docs/04-operations/RUNBOOKS/RB-smoke-isolation.md` (PR #392)
  - `docs/04-operations/RUNBOOKS/RB-zanzibar-canary.md` (Dalga 1)
  - `docs/04-operations/RUNBOOKS/RB-vault-dev-path-migration.md` (PR #377)
- **Memory:**
  - `project_zanzibar_status.md` — Zanzibar faz durumu
  - `feedback_ci_merge_deploy_verify.md` — CI→Merge→Deploy→Live kuralı
  - `feedback_compose_management.md` — Tek proje ismi `platform`
  - `feedback_infra_stability.md` — Compose + Vault + nginx kurallari
