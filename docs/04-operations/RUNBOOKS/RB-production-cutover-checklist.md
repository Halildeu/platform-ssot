# RB-production-cutover-checklist – Production Promote Checklist

ID: RB-production-cutover-checklist  
Service: production-cutover  
Status: Draft  
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Stage'de doğrulanmış backend ve deploy zincirini production'a kontrollü taşımak.
- Secret source of truth olarak Vault'u korumak.
- DNS/TLS/reverse proxy/frontend bağımlılıklarını tek checklist altında toplamak.

-------------------------------------------------------------------------------
2. BAŞLAMADAN ÖNCE
-------------------------------------------------------------------------------

- [ ] Stage backend deploy yeşil:
  - `deploy-backend` PASS
  - `post-deploy-validate` PASS
- [ ] Production hedefi net:
  - aynı host mu, ayrı host mu
  - public edge / reverse proxy hangi katmanda
- [ ] Rollback kararı net:
  - eski çalışan release tag'i biliniyor
  - `rollback.yml` prod manual akışı erişilebilir

-------------------------------------------------------------------------------
3. PROD VAULT HAZIRLIĞI
-------------------------------------------------------------------------------

Canonical path'ler:
- `secret/prod/backend-deploy/config`
- `secret/prod/ops/github/backend-deploy`
- `secret/prod/db/auth-service`
- `secret/prod/db/user-service`
- `secret/prod/db/permission-service`
- `secret/prod/db/variant-service`
- `secret/prod/jwt/auth-service`

Zorunlu `backend-deploy/config` anahtarları:
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

Önerilen ama ortama göre opsiyonel:
- `WEB_ORIGIN`
- `SECURITY_AUTH_ALLOWED_CLIENT_IDS`
- `COMPOSE_PROFILES`
- `REPORT_*`
- `SCHEMA_*`

Doğrulama:
- [ ] `backend/scripts/vault/check-backend-deploy-prod.sh` PASS
- [ ] `backend/scripts/vault/check-backend-deploy-stage.sh` ile stage/prod farkları karşılaştırıldı

-------------------------------------------------------------------------------
4. PROD GITHUB ENVIRONMENT
-------------------------------------------------------------------------------

Canonical environment:
- `prod`

Backend deploy secret'ları:
- `DEPLOY_ENABLED`
- `ROLLBACK_ENABLED`
- `BACKEND_SSH_DEPLOY_ENABLED`
- `BACKEND_DEPLOY_SSH_HOST`
- `BACKEND_DEPLOY_SSH_PORT`
- `BACKEND_DEPLOY_SSH_USER`
- `BACKEND_DEPLOY_SSH_KEY`
- `BACKEND_DEPLOY_SSH_KNOWN_HOSTS`
- `BACKEND_DEPLOY_REMOTE_ENV_FILE`
- `BACKEND_DEPLOY_REMOTE_REPO_DIR`
- `BACKEND_DEPLOY_REMOTE_COMPOSE_PROFILES`
- `BACKEND_HEALTH_URLS`
- `AUTONOMOUS_PIPELINE_SIGNING_PUBLIC_KEY_PEM`

Frontend/public smoke gerekiyorsa:
- `WEB_SMOKE_URL`
- `WEB_ROLLBACK_HOOK_URL`

Doğrulama:
- [ ] `vault-secrets-sync.yml` `mode=backend-deploy`, `env=prod`, `secret_scope=environment`, `github_environment=prod`, `dry_run=true`
- [ ] Aynı workflow `dry_run=false`

-------------------------------------------------------------------------------
5. PROD HOST HAZIRLIĞI
-------------------------------------------------------------------------------

Host'ta beklenenler:
- `/home/halil/platform/repo`
- `/home/halil/platform/env/backend.env`
- `/home/halil/platform/state/vault/approle/backend-deploy-prod.role-id`
- `/home/halil/platform/state/vault/approle/backend-deploy-prod.secret-id`

Adımlar:
- [ ] `backend/scripts/vault/materialize-backend-deploy-approle.sh` ile prod AppRole dosyaları üretildi
- [ ] `deploy/ubuntu/render-backend-env-approle.sh` ile prod `backend.env` render edildi
- [ ] `git`, `docker`, `curl`, `python3` hostta mevcut
- [ ] `docker compose -f backend/docker-compose.prod.yml config --services` PASS

-------------------------------------------------------------------------------
6. DOMAIN / TLS / REVERSE PROXY
-------------------------------------------------------------------------------

Minimum public edge gereksinimi:
- `ai.acik.com -> <public-edge-ip>` DNS A kaydı
- `Host: ai.acik.com` için ayrı binding / vhost / route
- hedef backend:
  - `10.9.10.53:8082` ya da prod host hangi iç hedefse o
- TLS sertifikası

Doğrulama:
- [ ] `dig ai.acik.com` public IP döndürüyor
- [ ] `curl -I https://ai.acik.com` HTTP cevap veriyor
- [ ] host binding yanlış siteye düşmüyor

-------------------------------------------------------------------------------
7. FRONTEND CANLI YAYIN
-------------------------------------------------------------------------------

- [ ] frontend static hosting prod publish tamam
- [ ] shell + remote URL'leri prod domainlerle hizalı
- [ ] backend gateway URL kararı net:
  - doğrudan `https://ai.acik.com/api`
  - veya ayrı API domain
- [ ] Keycloak redirect/origin ayarları prod domainlerle uyumlu

-------------------------------------------------------------------------------
8. PROD DEPLOY / VALIDATE / ROLLBACK
-------------------------------------------------------------------------------

Deploy:
- [ ] `deploy-backend.yml` workflow_dispatch `env=prod`

Validate:
- [ ] `post-deploy-validate.yml` workflow_dispatch `env=prod`, `target=backend`
- [ ] frontend hazırsa `target=all`

Rollback:
- [ ] `rollback.yml` workflow_dispatch `env=prod`, `confirm=ROLLBACK`

Canlı kapısı:
- [ ] backend health PASS
- [ ] login / token / protected endpoint PASS
- [ ] frontend -> gateway -> backend zinciri PASS
- [ ] rollback dry-run planı hazır

-------------------------------------------------------------------------------
9. CUTOVER ÇIKIŞ KRİTERİ
-------------------------------------------------------------------------------

Production canlı sayılması için:
- [ ] prod Vault PASS
- [ ] prod GitHub environment PASS
- [ ] prod host render/deploy PASS
- [ ] domain/TLS canlı
- [ ] frontend canlı
- [ ] public smoke PASS
- [ ] rollback yolu doğrulanmış
