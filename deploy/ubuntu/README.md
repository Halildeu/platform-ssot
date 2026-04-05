# Ubuntu Backend Deploy

Bu klasör GitHub-first backend deploy akışının Ubuntu tarafındaki scriptlerini içerir.

## Akış

1. GitHub Actions backend image'larını GHCR'ye push eder.
2. Host üzerindeki `backend.env` dosyası Vault'tan render edilmiş halde bulunur.
3. Workflow SSH ile Ubuntu host'a bağlanır.
4. `deploy-backend.sh` repo'yu GitHub'dan senkronize eder, GHCR image'larını çeker ve `docker compose up -d` çalıştırır.
5. `rollback-backend.sh` bir önceki image tag'ine geri döner.

## Host ön koşulları

- `git`
- `docker` + Compose v2
- `curl`
- `jq`
- `/home/halil/platform/env/backend.env`
- GitHub repo clone erişimi (`GIT_REMOTE_URL`)
- GHCR read erişimi deploy workflow tarafından ephemeral olarak taşınır
- Backend deploy secret'ları için önerilen GitHub target'ı environment bazlı `stage` / `prod` secret setidir

## Vault sözleşmesi

- Canonical deploy env path'i: `secret/<env>/backend-deploy/config`
- Canonical GitHub backend deploy secret path'i: `secret/<env>/ops/github/backend-deploy`
- Host üzerindeki materialized env dosyası:
  - `/home/halil/platform/env/backend.env`
- Render script:
  - `deploy/ubuntu/render-backend-env.sh`
- Preflight script:
  - `backend/scripts/vault/check-backend-deploy-stage.sh`
  - `backend/scripts/vault/check-backend-deploy-prod.sh`

Örnek kullanım:

```bash
mkdir -p "$HOME/platform/env"

export VAULT_ADDR="https://vault.example.com"
export VAULT_TOKEN="..."
export DEPLOY_ENV="stage"

deploy/ubuntu/render-backend-env.sh
```

Vault preflight:

```bash
ENV=stage \
VAULT_ADDR="https://vault.example.com" \
VAULT_TOKEN="..." \
bash backend/scripts/vault/check-backend-deploy-stage.sh
```

## GitHub Secrets

- `BACKEND_SSH_DEPLOY_ENABLED`
- `BACKEND_DEPLOY_SSH_HOST`
- `BACKEND_DEPLOY_SSH_PORT`
- `BACKEND_DEPLOY_SSH_USER`
- `BACKEND_DEPLOY_SSH_KEY`
- `BACKEND_DEPLOY_SSH_KNOWN_HOSTS`
- `BACKEND_DEPLOY_REMOTE_ENV_FILE` (opsiyonel)
- `BACKEND_DEPLOY_REMOTE_REPO_DIR` (opsiyonel)
- `BACKEND_DEPLOY_REMOTE_COMPOSE_PROFILES` (opsiyonel)
- `BACKEND_HEALTH_URLS`

Bu secret'lar elle yazılmak zorunda değil. `vault-secrets-sync.yml` artık `mode=backend-deploy` ile `secret/<env>/ops/github/backend-deploy` path'inden GitHub Actions secret'larına senkron yapabiliyor.

Önerilen hedef:
- `stage` backend secret'ları GitHub `stage` environment'ına yazılır
- `prod` backend secret'ları GitHub `prod` environment'ına yazılır
- Repo-level duplicate secret'lar merge sonrası temizlenir

## GHCR erişimi

- Server üzerinde kalıcı `GHCR_TOKEN` tutmuyoruz.
- `deploy-backend.yml` ve `rollback.yml`, GitHub Actions runtime token'ını SSH oturumu üzerinden `deploy-backend.sh` / `rollback-backend.sh` script'lerine ephemeral geçirir.
- Bu yüzden `backend.env` içinde `GHCR_USERNAME` ve `GHCR_TOKEN` zorunlu değildir.

## Notlar

- Secret değerleri repo'ya commit edilmez.
- Host üzerindeki `backend.env` dosyası Vault kaynaklı tek materialized secret setidir.
- `IMAGE_TAG` alanı deploy/rollback sırasında script tarafından güncellenir.
- `backend/scripts/vault/write-backend-deploy-stage.sh` ve `write-backend-deploy-prod.sh` helper script'leri ilgili Vault path'lerini doldurmak için eklendi.
- `RB-ubuntu-backend-github-vault-deploy.md` deploy zincirinin canonical runbook özetidir.
