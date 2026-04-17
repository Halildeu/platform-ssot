# RB-staging-prod-profile — Staging'i Prod-Profile'a Geçirme Runbook

ID: RB-staging-prod-profile  
Service: backend-stack (7 Spring Boot services)  
Status: Draft  
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Staging ortamını "prod-like" hale getirmek: 7 backend servisin
`SPRING_PROFILES_ACTIVE` içinde `local` kalmayacak, Vault AppRole secret
fetch fiilen çalışacak, GHCR image pull staging deploy'da gerçekten
egzersiz edilecek. Amaç iki:

- **Prod cutover risk azaltma:** Production'a ilk çıkışta bir path'in
  ilk kez gerçekleşmesini engellemek. Staging'de her adım ≥1 hafta
  stabil çalışırsa prod'da sürpriz yok.
- **Zanzibar canary sinyal anlamlılığı:** Local profile'da
  `SecurityConfigLocal permitAll` JWT doğrulamayı kapatıyor,
  deny-rate/tuple-sync metrikleri sahte yeşil veriyor. Prod-profile
  staging canary run'larının anlamlı olmasını sağlar (Dalga 1 Stage 2
  önkoşul).

**Bu runbook STORY-0319 acceptance'ını karşılar ve Dalga 1 Stage 2
synthetic canary run'un prereq'ini belgeler.**

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

**Sorumlu ekipler:** Platform Engineering (operasyon).
**Ortam:** staging (`ai.acik.com`, host-backed docker compose).
**Base:** 7 Spring Boot servisi (user, auth, variant, core-data,
api-gateway, permission, report), Vault 1.21.4 + AppRole, HashiCorp Vault
dev-path (staging), GHCR registry.

**İlgili dosyalar:**
- `backend/docker-compose.yml` — compose default (D-105 + C-103 gereği değişmez)
- `backend/.env.prod.example` — canonical env template
- `deploy/ubuntu/render-backend-env.sh` — canonical env render script (host-side AppRole; `VAULT_ADDR`+`VAULT_TOKEN` zorunlu)
- `deploy/ubuntu/deploy-backend.sh` — staging deploy entry point
- `.github/workflows/deploy-backend.yml` — CI deploy workflow (şu an sadece `env` input; `build_local`+`docker_pull_policy` PR #3'te eklenecek)
- `backend/scripts/doctor-infra.sh` — L1-L8 profile drift guard
- `backend/{auth,permission}-service/src/main/resources/application-prod.yml`
  — prod profile Spring Cloud Vault actuator + KV wiring (report-service'te bu bağ şu an yok; scope'a dahil değil)
- Staging canonical env: `/home/halil/platform/env/backend.env` (staging host tarafı)
- Vault host-side AppRole referansı: `docs/04-operations/RUNBOOKS/RB-ubuntu-backend-github-vault-deploy.md`

**Kapsam dışı:**
- Production deploy (bu runbook sadece staging — prod için ayrı runbook).
- Canary metric üretimi (RB-zanzibar-canary).
- Vault KMS auto-unseal (RB-vault-kms-autounseal, P1.10'dan).
- report-service Spring Cloud Vault integrasyonu (PR #3 scope'u yalnızca auth + permission;
  report-service ayrı follow-up'a taşındı — mevcut model host-side env render
  ile secret fetch yapıyor, in-container Vault client egzersizi yok).

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

### BAŞLATMA — Prod-profile geçişi (staging)


### Pre-migration kanıt toplama

```bash
# Mevcut staging profile durumunu kaydet
ssh staging-sw 'cd /home/halil/platform/repo/backend && bash scripts/doctor-infra.sh' \
  | tee .cache/reports/staging-pre-prod-profile-$(date +%Y%m%d).log
```

L1-L8 başlangıç snapshot'u: hangi servisler hâlâ `local,docker` ?
hangi canonical env key'leri blank ?

### Render contract güncellemesi (PR #2 sonrası)

```bash
# render-backend-env.sh host-side AppRole'dan KV mount okur; VAULT_ADDR ve
# VAULT_TOKEN zorunlu (script line 5-6 assert ediyor). Deploy runner AppRole
# login ile kısa ömürlü VAULT_TOKEN alır — RB-ubuntu-backend-github-vault-deploy
# §3 bu flow'u tarif eder.
ssh staging-sw '
  cd /home/halil/platform/repo && \
  VAULT_ADDR="${VAULT_ADDR:?set in /etc/platform/vault.env}" \
  VAULT_TOKEN="${VAULT_TOKEN:?approle login ile alınmalı}" \
  RENDER_ENV_BEFORE_DEPLOY=true \
  DEPLOY_ENV=stage \
  bash deploy/ubuntu/render-backend-env.sh
'

# Canonical env doğrula
ssh staging-sw '
  grep -E "^(USER|AUTH|VARIANT|CORE_DATA|API_GATEWAY|PERMISSION|REPORT)_SERVICE_PROFILES" \
    /home/halil/platform/env/backend.env
'
# Beklenen: hepsi prod,docker
```

### Vault actuator smoke — FUTURE STATE (PR #3 sonrası)

> **Not (2026-04-17):** Mevcut staging modeli Vault secret fetch'i **host-side
> AppRole + `render-backend-env.sh` canonical env materialization** üzerinden
> yapıyor (RB-ubuntu-backend-github-vault-deploy §3). Container içi Spring
> Cloud Vault client auth-service ve permission-service `application-prod.yml`
> tarafında tanımlı olsa da staging compose `SPRING_CLOUD_VAULT_ENABLED=false`
> hardcoded (`backend/docker-compose.yml:99, 452`). Bu compose default
> D-105 + C-103 gereği değişmez. Aşağıdaki smoke yol haritası PR #3 sonrası
> geçerli olur — o PR container override'ını ve actuator wiring'i ekler.
>
> PR #3 öncesi bu bölüm **non-executable** — manual canonical env append
> yolu repo gerçekliğiyle çalışmıyor, kullanmayın.

PR #3 sonrası hedef akış (executable olur):

```bash
# Container içi actuator vault health (auth + permission)
ssh staging-sw '
  curl -fsS http://localhost:8088/actuator/health/vault | jq .status
  curl -fsS http://localhost:8090/actuator/health/vault | jq .status
'
# Beklenen: "UP" her ikisi için
```

report-service bu turda kapsam dışı; secret fetch host-side render üzerinden
devam eder (değişiklik yok).

### GHCR pull staging deploy — FUTURE STATE (PR #3 sonrası)

> **Not (2026-04-17):** `.github/workflows/deploy-backend.yml:10-17` şu an
> sadece `env` input'unu tanımlıyor. `build_local` ve `docker_pull_policy`
> workflow input'ları **PR #3'te eklenecek**. Aşağıdaki `gh workflow run`
> çağrısı bu inputs eklendikten sonra geçerli olur.
>
> PR #3 öncesi staging deploy `BUILD_LOCAL=true` + `DOCKER_PULL_POLICY=never`
> default'larıyla çalışıyor (local build + GHCR'ye push, stage host pull
> etmiyor — bkz. `deploy-backend.yml:344` current state).

PR #3 sonrası hedef akış (executable olur):

```bash
# Workflow dispatch (inputs eklendikten sonra)
gh workflow run deploy-backend.yml \
  -f env=stage \
  -f build_local=false \
  -f docker_pull_policy=always

# Post-deploy assertion
ssh staging-sw '
  docker images --filter=reference=ghcr.io/halildeu/platform-ssot-*
'
# Beklenen: 7 image, GHCR digest'leriyle (sha256:...)
```

### Post-deploy doctor-infra (PR #4 sonrası — otomatik)

CI workflow `post-deploy-doctor-infra` job'ı deploy sonrası otomatik
çalışır. Manuel tetikleme için:

```bash
gh workflow run deploy-backend.yml -f env=stage
# Her başarılı deploy sonunda post-doctor PASS annotation beklenir
```

### DURDURMA — Rollback

#### 4.1. Profile rollback (canonical env)

Migration regresyonu → staging canary down → canonical env restore:

```bash
ssh staging-sw '
  cp /home/halil/platform/env/backend.env.bak-YYYYMMDD \
     /home/halil/platform/env/backend.env && \
  cd /home/halil/platform/repo/backend && \
  docker compose --env-file /home/halil/platform/env/backend.env \
    up -d --force-recreate
'
```

### GHCR pull rollback — FUTURE STATE (PR #3 sonrası)

> **Not:** `build_local` workflow input'u PR #3'te eklenecek. Bu rollback
> path'i o PR merge olana kadar manual staging host intervention gerektirir
> (aşağıdaki fallback).

PR #3 öncesi emergency fallback (staging host manual):

```bash
# Runner'a SSH + manual docker build + compose up
ssh staging-sw '
  cd /home/halil/platform/repo/backend && \
  BUILD_LOCAL=true \
  bash /home/halil/platform/repo/deploy/ubuntu/deploy-backend.sh
'
```

PR #3 sonrası hedef rollback (executable olur):

```bash
gh workflow run deploy-backend.yml \
  -f env=stage \
  -f build_local=true  # emergency override
```

**Uyarı:** `build_local=true` kullanımı sadece emergency. Normal akış
`build_local=false`. Kullanım sonrası GHCR credential rotation runbook
adımı çalıştırılmalı (`GHCR_TOKEN` yenileme + workflow secret update).

### Vault actuator rollback — FUTURE STATE (PR #3 sonrası)

> **Not:** §3.3 Vault actuator smoke PR #3 sonrası geçerli. Bu rollback
> path'i de PR #3 sonrası anlamlı olur.

PR #3 sonrası hedef akış:

```bash
# Canonical env'de Spring Cloud Vault geçici disable
ssh staging-sw '
  sed -i "s/SPRING_CLOUD_VAULT_ENABLED=true/SPRING_CLOUD_VAULT_ENABLED=false/" \
    /home/halil/platform/env/backend.env && \
  cd /home/halil/platform/repo/backend && \
  docker compose --env-file /home/halil/platform/env/backend.env \
    up -d --force-recreate auth-service permission-service
'
```

**Kök neden tespiti:** `docker logs vault` + `vault status` kontrol et;
`VAULT_DEV_PATH` staging override doğru mu (feedback_infra_stability.md §Vault).

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

### Canlı smoke

```bash
# Profile doğrulama (doctor-infra L1)
ssh staging-sw 'docker exec platform-user-service-1 printenv SPRING_PROFILES_ACTIVE'
# Beklenen: prod,docker (local YOK)

# JWT filter doğrulama (doctor-infra L2)
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  https://ai.acik.com/api/v1/authz/check \
  -H 'Content-Type: application/json' \
  -d '{"relation":"can_view","objectType":"module","objectId":"REPORT"}'
# Beklenen: 401

# Canonical env drift doğrulama (doctor-infra L3-L8)
ssh staging-sw 'cd /home/halil/platform/repo/backend && bash scripts/doctor-infra.sh'
# Beklenen: L1-L8 hepsi PASS
```

### Vault actuator health (auth + permission) — FUTURE STATE (PR #3 sonrası)

```bash
ssh staging-sw '
  curl -fsS http://localhost:8088/actuator/health/vault | jq .status
  curl -fsS http://localhost:8090/actuator/health/vault | jq .status
'
# Beklenen: "UP" her ikisi için
```

PR #3 öncesi: actuator/vault endpoint yok; Vault secret fetch host-side
render AppRole akışı ile yapılır, runtime log'da Spring Cloud Vault kaydı
olmaz (D-105 + C-103 compose default gereği).

### GHCR pull log — FUTURE STATE (PR #3 sonrası)

```bash
gh run view <RUN_ID> --log | grep -E "pull|image" | head -20
# Beklenen: "docker pull ghcr.io/halildeu/platform-ssot-*" SUCCESS
```

PR #3 öncesi staging deploy `BUILD_LOCAL=true` ile çalışır — GHCR pull
log satırı oluşmaz (push log oluşur).

### Prometheus (Dalga 1 Stage 2 prereq'i için)

Bu runbook sadece profile migration kapsamı. Canary metric gözlemi
`RB-zanzibar-canary.md` §4'te.

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

### Staging canary sahte yeşil

**Semptom:** `/authz/check` token'sız 200 dönüyor, canary deny rate 0.
**Kök neden:** Canonical env'de `{SERVICE}_PROFILES` blank → compose
default `local,docker` devreye girdi → `SecurityConfigLocal permitAll` aktif.
**Çözüm:** §3.2 render contract rehearsal + doctor-infra L1 check.

### Boot log "Unable to connect to Vault" — PR #3 SONRASI

**Semptom:** auth-service/permission-service boot fail Vault connection error.
**Kök neden:** PR #3 Spring Cloud Vault override aktifleştirdikten sonra
Vault sealed veya AppRole material eksik (container'a `VAULT_ROLE_ID` /
`VAULT_SECRET_ID` inmiyor).
**Çözüm:** `vault status` + container env kontrolü; sealed ise §4.3
rollback + unseal recovery (RB-vault-dev-path-migration §5).
**PR #3 öncesi:** Bu senaryo geçerli değil — Vault client container içinde
aktif değil, secret fetch host-side AppRole render akışıyla yapılıyor.

### GHCR pull HTTP 401 / rate-limit

**Semptom:** `docker pull ghcr.io/...` auth fail.
**Kök neden:** `GHCR_TOKEN` expired veya rate-limit hit.
**Çözüm:** GitHub → Settings → Developer settings → Personal access tokens
→ new token (read:packages scope) → workflow secret update. §4.2 emergency
rollback ile kesintiyi minimize et.

### nginx /api/* 502

**Semptom:** Frontend /api/* 502 döner; curl direct gateway 200.
**Kök neden:** nginx `WEB_GATEWAY_UPSTREAM` prod default (8082) staging'de
override edilmedi.
**Çözüm:** `deploy/ubuntu/run-frontend-nginx-container.sh` DEPLOY_ENV
fallback'i çalışıyor mu kontrol et (DEPLOY_ENV=stage → 8080). PR #4
workflow cleanup sonrası bu asimetri kapanır.

### Post-deploy doctor-infra FAIL

**Semptom:** Workflow `post-deploy-doctor-infra` step RED.
**Kök neden:** L1-L8 herhangi biri FAIL — output annotation'da hangi
check belirtilir.
**Çözüm:** Annotation'a göre §3 ilgili step'i rehearse et;
`RB-backend-env-drift-guard.md` §4 detaylı drift repair prosedürü.

### Host-side render VAULT_TOKEN expired / Vault unreachable

**Semptom:** `render-backend-env.sh` çağrısı `VAULT_ADDR required` veya
`VAULT_TOKEN required` assert fail ile durur; deploy-backend pipeline
canonical env render adımında CRIT exit 1.
**Kök neden:** AppRole login token'ı expire oldu (kısa ömürlü — 1h tipik),
Vault unsealed ama token invalid; veya Vault sealed/unreachable
(`vault status` → sealed: true).
**Çözüm:**

- **Vault status (host AppRole env'i yükleyerek):**
  ```bash
  ssh staging-sw '
    set -a && . /etc/platform/vault.env && set +a && \
    vault status
  '
  ```
  Sealed ise unseal sidecar'ı kontrol et (`RB-vault-dev-path-migration §5`).
- **Unsealed + token invalid (AppRole login tekrar):**
  ```bash
  ssh staging-sw '
    set -a && . /etc/platform/vault.env && set +a && \
    vault write -field=token auth/approle/login \
      role_id="$VAULT_ROLE_ID" \
      secret_id="$VAULT_SECRET_ID"
  '
  ```
  Dönen token'ı `VAULT_TOKEN` olarak export et, render script'i yeniden
  çalıştır (§3.2 örneğindeki gibi).
- **AppRole material eksik:** `VAULT_ROLE_ID`/`VAULT_SECRET_ID` staging
  host `/etc/platform/vault.env` içinde set olmalı (host-side AppRole
  deploy flow — `RB-ubuntu-backend-github-vault-deploy §3`).
- **Persistent unreachable:** compose `vault` container log'u + raft storage
  durumu kontrol et; gerekirse vault container recreate (Shamir seal
  durumunda unseal key manual).

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

Acceptance checklist:


- [ ] Staging 7 servis `SPRING_PROFILES_ACTIVE=prod,docker` (L1 PASS)
- [ ] `/authz/check` token'sız 401/403 (L2 PASS)
- [ ] Canonical env `ERP_OPENFGA_*` + `SECURITY_JWT_ISSUER(S)` non-blank (L3-L8 PASS)
- [ ] Vault actuator smoke UP — auth (8088) + permission (8090)
  `/actuator/health/vault` (PR #3 sonrası; report-service scope dışı)
- [ ] GHCR pull staging deploy SUCCESS (BUILD_LOCAL=false)
- [ ] nginx stage/prod upstream symmetry (workflow cleanup done)
- [ ] Post-deploy CI guard 5+ ardışık SUCCESS (`post-doctor-infra` job)
- [ ] Dalga 1 Stage 2 synthetic canary run prereq karşılandı
  (→ `RB-zanzibar-canary.md` §3.1 handoff)

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: `docs/03-delivery/STORIES/STORY-0319-staging-prod-profile-migration.md`
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0319-staging-prod-profile-migration.md`
- Test plan: `docs/03-delivery/TEST-PLANS/TP-0319-staging-prod-profile-migration.md`
- Canary runbook (downstream): `docs/04-operations/RUNBOOKS/RB-zanzibar-canary.md`
- Env drift guard: `docs/04-operations/RUNBOOKS/RB-backend-env-drift-guard.md`
- Vault dev-path runbook: `docs/04-operations/RUNBOOKS/RB-vault-dev-path-migration.md`
- Decision registry: `decisions/topics/security-local-dev.v1.json`
- Master plan: `.claude/plans/zanzibar-master-plan.md`
