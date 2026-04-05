# RB-ubuntu-backend-github-vault-deploy – GitHub → GHCR → Ubuntu Backend Akışı

ID: RB-ubuntu-backend-github-vault-deploy  
Service: backend-deploy  
Status: Draft  
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Backend canlı dağıtım zincirini GitHub-first modelde standardize etmek.
- Secret yönetimini Vault merkezli tutmak.
- Ubuntu host üzerinde yalnızca materialized `backend.env` bırakmak.
- Cutover öncesi eksik key veya bozuk deploy sözleşmesini yan etkisiz doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Repo: `Halildeu/platform-ssot`
- Image registry: `ghcr.io`
- Runtime target: Ubuntu host
- Secret source of truth: Vault KV v2
- Deploy chain:
  - GitHub `main`
  - GitHub Actions `deploy-backend`
  - GHCR image’ları
  - Ubuntu host `deploy/ubuntu/deploy-backend.sh`

-------------------------------------------------------------------------------
3. CANONICAL PATH / DOSYA HARİTASI
-------------------------------------------------------------------------------

- Vault runtime config:
  - `secret/<env>/backend-deploy/config`
- Vault GitHub backend deploy secrets:
  - `secret/<env>/ops/github/backend-deploy`
- Ubuntu materialized env:
  - `/home/halil/platform/env/backend.env`
- Ubuntu deploy state:
  - `/home/halil/platform/state/backend.current-image-tag`
  - `/home/halil/platform/state/backend.previous-image-tag`
- Repo dosyaları:
  - `backend/docker-compose.prod.yml`
  - `backend/.env.prod.example`
  - `deploy/ubuntu/render-backend-env.sh`
  - `deploy/ubuntu/deploy-backend.sh`
  - `deploy/ubuntu/rollback-backend.sh`
  - `.github/workflows/deploy-backend.yml`
  - `.github/workflows/post-deploy-validate.yml`
  - `.github/workflows/rollback.yml`
  - `.github/workflows/vault-secrets-sync.yml`

-------------------------------------------------------------------------------
4. VAULT KEY MATRİSİ
-------------------------------------------------------------------------------

### 4.1 `secret/<env>/backend-deploy/config`

Zorunlu:
- `GIT_REMOTE_URL`
- `REPO_BRANCH`
- `GHCR_OWNER`
- `VAULT_URI`
- `VAULT_TOKEN`
- `KEYCLOAK_ISSUER_URI`
- `KEYCLOAK_JWKS_URI`
- `AUTH_VERIFICATION_BASE_URL`
- `AUTH_RESET_BASE_URL`
- `SERVICE_CLIENT_USER_SERVICE_SECRET`
- `PERMISSION_SERVICE_INTERNAL_API_KEY`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `OPENFGA_STORE_ID`
- `OPENFGA_MODEL_ID`
- `CORE_DATA_DB_URL`
- `CORE_DATA_DB_USERNAME`
- `CORE_DATA_DB_PASSWORD`

Önerilen / opsiyonel:
- `IMAGE_TAG`
- `COMPOSE_PROJECT_NAME`
- `TZ`
- `COMPOSE_PROFILES`
- `VAULT_SCHEME`
- `VAULT_FAIL_FAST`
- `WEB_ORIGIN`
- `SECURITY_AUTH_ALLOWED_CLIENT_IDS`
- `POSTGRES_DB`
- `AUTH_DB_SCHEMA`
- `USER_DB_SCHEMA`
- `PERMISSION_DB_SCHEMA`
- `VARIANT_DB_SCHEMA`
- `CORE_DATA_DB_SCHEMA`
- `OPENFGA_LOG_LEVEL`
- `REPORT_*`
- `SCHEMA_*`

### 4.2 `secret/<env>/ops/github/backend-deploy`

Her durumda zorunlu:
- `BACKEND_SSH_DEPLOY_ENABLED`

`BACKEND_SSH_DEPLOY_ENABLED=true` ise zorunlu:
- `BACKEND_DEPLOY_SSH_HOST`
- `BACKEND_DEPLOY_SSH_USER`
- `BACKEND_DEPLOY_SSH_KEY`
- `BACKEND_DEPLOY_SSH_KNOWN_HOSTS`
- `BACKEND_HEALTH_URLS`

Opsiyonel:
- `BACKEND_DEPLOY_SSH_PORT`
- `BACKEND_DEPLOY_REMOTE_ENV_FILE`
- `BACKEND_DEPLOY_REMOTE_REPO_DIR`
- `BACKEND_DEPLOY_REMOTE_COMPOSE_PROFILES`

-------------------------------------------------------------------------------
5. ADIM ADIM AKIŞ
-------------------------------------------------------------------------------

### 5.1 Vault yazımı

- Stage için:

```bash
ENV=stage \
VAULT_ADDR="https://vault.example.com" \
VAULT_TOKEN="..." \
GIT_REMOTE_URL="git@github.com:Halildeu/platform-ssot.git" \
REPO_BRANCH="main" \
GHCR_OWNER="halildeu" \
GHCR_USERNAME="github-user" \
GHCR_TOKEN="..." \
BACKEND_SSH_DEPLOY_ENABLED="true" \
BACKEND_DEPLOY_SSH_HOST="10.9.10.53" \
BACKEND_DEPLOY_SSH_USER="halil" \
BACKEND_DEPLOY_SSH_KEY="..." \
BACKEND_DEPLOY_SSH_KNOWN_HOSTS="..." \
BACKEND_HEALTH_URLS="https://api.example.com/actuator/health" \
bash backend/scripts/vault/write-backend-deploy-stage.sh
```

- Prod için aynı içerik `write-backend-deploy-prod.sh` ile yazılır.

### 5.2 Vault preflight

- Secret değerlerini göstermeden kontrat doğrulaması:

```bash
ENV=stage \
VAULT_ADDR="https://vault.example.com" \
VAULT_TOKEN="..." \
bash backend/scripts/vault/check-backend-deploy-stage.sh
```

### 5.3 GitHub secrets sync

- Önce dry-run:

```text
workflow: vault-secrets-sync.yml
mode: backend-deploy
env: stage
secret_scope: environment
github_environment: stage
dry_run: true
```

- Sonra gerçek sync:

```text
workflow: vault-secrets-sync.yml
mode: backend-deploy
env: stage
secret_scope: environment
github_environment: stage
dry_run: false
```

### 5.3.1 GitHub environment standardı

- Stage backend deploy secret'ları `stage` environment altında tutulur.
- Prod backend deploy secret'ları `prod` environment altında tutulur.
- Repo-level BACKEND_* secret'ları yalnız geçiş dönemi fallback'i olarak kalır; merge sonrası temizlenir.

### 5.4 Ubuntu host render

```bash
export VAULT_ADDR="https://vault.example.com"
export VAULT_TOKEN="..."
export DEPLOY_ENV="stage"

deploy/ubuntu/render-backend-env.sh
```

### 5.5 Deploy

- `main` branch’e merge sonrası:
  - `deploy-backend.yml`
  - GHCR push
  - SSH deploy
  - `post-deploy-validate.yml`
  - gerekirse `rollback.yml`

-------------------------------------------------------------------------------
6. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- [ ] Arıza senaryosu 1 – Vault config eksik:
  - Given: `check-backend-deploy-stage.sh` çalışır
  - When: `backend-deploy/config` altında required key eksik çıkar
  - Then: deploy zincirini durdur, eksik key’i Vault’a yaz, check’i tekrar çalıştır.

- [ ] Arıza senaryosu 2 – GitHub sync eksik:
  - Given: `vault-secrets-sync.yml` `mode=backend-deploy` ile çalışır
  - When: `dry_run=true` aşamasında required key eksik raporlanır
  - Then: Vault path’ini düzelt, dry-run PASS olmadan `dry_run=false` çalıştırma.

- [ ] Arıza senaryosu 3 – Ubuntu env render fail:
  - Given: `render-backend-env.sh` hostta çalışır
  - When: required key eksik veya Vault erişimi bozuksa
  - Then: `backend.env` üretme, Vault/erişim sorununu çöz, sonra render’ı tekrar çalıştır.

- [ ] Arıza senaryosu 4 – SSH deploy kapalı:
  - Given: `BACKEND_SSH_DEPLOY_ENABLED=false`
  - When: `deploy-backend.yml` çalışır
  - Then: image’lar GHCR’ye push edilir ama host deploy ve backend validate atlanır.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Secret source of truth Vault’tur.
- GitHub yalnız workflow secret consumer’dır.
- Ubuntu yalnız runtime consumer’dır.
- `backend.env` dosyası tek materialized secret setidir.
- Dry-run ve Vault preflight PASS olmadan canlı deploy zinciri başlatılmaz.

-------------------------------------------------------------------------------
8. LİNKLER
-------------------------------------------------------------------------------

- `docs/04-operations/RUNBOOKS/RB-vault.md`
- `docs/04-operations/RUNBOOKS/RB-local-merge-deploy-orchestrator.md`
- `deploy/ubuntu/README.md`
