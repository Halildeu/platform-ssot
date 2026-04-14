# Runbook: Vault Dev Path Migration (staging/prod)

**Tarih:** 2026-04-14
**Kapsam:** Staging + prod servers running the `vault-unseal` sidecar

## Arka Plan

Mevcut `backend/docker-compose.yml` `vault-unseal` bind mount'u relative path
kullanıyordu: `./.vault-dev:/vault-dev:ro`. Relative path docker compose dosyasının
bulunduğu dizine göre çözülür.

- **Local dev:** Compose `backend/` altından çalıştırılır → mount `backend/.vault-dev/` → dev_init.sh ile aynı yer. Tutarlı.
- **Staging (self-hosted runner):** `deploy-stage-host` job `repo_dir="${GITHUB_WORKSPACE}"` kullanır → runner'ın **ephemeral workdir**'i. Container bind mount o inode'a kilitlenir. Sonraki CI job workdir'i temizleyip yeniden checkout yaptığında inode değişir, bind stale olur, vault-unseal sidecar key dosyasını bulamaz → **vault sealed-loop**.

**2026-04-14 incident:** Vault 2+ saat sealed kaldı; çözüm manuel key copy + container restart. Bkz. session-plan-20260415-zanzibar-next.md.

## Fix — Compose Override Pattern

Compose mount artık `VAULT_DEV_PATH` env ile override edilebilir:

```yaml
volumes:
  - ${VAULT_DEV_PATH:-./.vault-dev}:/vault-dev:ro
```

- **Local dev:** env set edilmez → default `./.vault-dev` → eskisi gibi çalışır.
- **Staging/prod:** env'de `VAULT_DEV_PATH=/home/halil/platform/state/vault-dev` set edilir → permanent state path kullanılır, runner workdir'inden bağımsız.

## Staging Server Migration Adımları

SSH ile staging'e bağlan, aşağıdaki adımları uygula:

### 1. Permanent state dir oluştur + mevcut key'i taşı

```bash
ssh staging-sw
# Permanent path
sudo mkdir -p /home/halil/platform/state/vault-dev
sudo chown halil:halil /home/halil/platform/state/vault-dev
sudo chmod 700 /home/halil/platform/state/vault-dev

# Mevcut key'i taşı (permanent repo'dan)
sudo cp /home/halil/platform/repo/backend/.vault-dev/vault-unseal-key \
        /home/halil/platform/state/vault-dev/
sudo cp /home/halil/platform/repo/backend/.vault-dev/vault-init.json \
        /home/halil/platform/state/vault-dev/ 2>/dev/null || true
sudo cp /home/halil/platform/repo/backend/.vault-dev/vault-root-token \
        /home/halil/platform/state/vault-dev/ 2>/dev/null || true

sudo chown -R halil:halil /home/halil/platform/state/vault-dev
sudo chmod 600 /home/halil/platform/state/vault-dev/*

# Dogrula
ls -la /home/halil/platform/state/vault-dev/
```

### 2. Backend env file'a VAULT_DEV_PATH ekle

```bash
sudo tee -a /home/halil/platform/env/backend.env <<'EOF'

# Vault dev state path (compose override — relative mount ephemeral CI workdir'e
# kilitleniyordu, permanent state path kullan)
VAULT_DEV_PATH=/home/halil/platform/state/vault-dev
EOF

# Dogrula
grep VAULT_DEV_PATH /home/halil/platform/env/backend.env
```

### 3. Sonraki deploy tetiklendiğinde

Main'e yeni push geldiğinde `deploy-stage-host` job çalışır. Yeni compose:
- `VAULT_DEV_PATH` env'den okur
- Mount `/home/halil/platform/state/vault-dev/` permanent path'e bind edilir
- vault-unseal sidecar key'i görür, vault unseal olur

### 4. Doğrulama

```bash
# Containers'ın yeni mount'u almasi icin recreate gerekebilir
ssh staging-sw
cd /home/halil/platform/repo/backend   # VEYA runner workdir — compose file doğru mount'ı alacak
source /home/halil/platform/env/backend.env && \
  docker compose up -d --force-recreate vault-unseal

# 20-30s sonra
docker inspect platform-vault-unseal-1 --format '{{range .Mounts}}{{.Source}}{{println}}{{end}}'
# Beklenen: /home/halil/platform/state/vault-dev

docker logs platform-vault-unseal-1 --tail 5
# Beklenen: "OK: unsealed"

docker exec -e VAULT_ADDR=http://127.0.0.1:8200 platform-vault-1 vault status | grep Sealed
# Beklenen: Sealed false
```

### 5. Eski path'i temizle (opsiyonel, validasyon sonrası)

Eğer 24 saat boyunca sorunsuz çalıştıysa:
```bash
# Güvenlik: key dosyası world-readable idi (644) — permanent path'te 600 oldu
# Eski path'i sil veya permission kısıtla
sudo rm -rf /home/halil/platform/repo/backend/.vault-dev
```

## Rollback

Eğer migration sonrası sorun olursa:

```bash
# 1. env'deki satırı sil/yorumla
sudo sed -i 's/^VAULT_DEV_PATH=/#VAULT_DEV_PATH=/' /home/halil/platform/env/backend.env

# 2. Eski key'i geri kopyala (silmemiştin)
# Zaten duruyor /home/halil/platform/repo/backend/.vault-dev/

# 3. Recreate
docker compose up -d --force-recreate vault-unseal
```

## Doctor Check (gelecek geliştirme)

`backend/scripts/doctor-infra.sh`'a eklenebilir:
```bash
# Check: staging env'de VAULT_DEV_PATH set mi
if [[ "${DEPLOY_ENV}" == "stage" || "${DEPLOY_ENV}" == "prod" ]]; then
  if [[ -z "${VAULT_DEV_PATH:-}" ]]; then
    warn "VAULT_DEV_PATH env yok — relative mount runner workdir'ine baglanir (sealed-loop riski)"
  fi
fi
```

## İlgili

- `backend/docker-compose.yml` line ~308-315 (vault-unseal mount)
- `.github/workflows/deploy-backend.yml` line ~334 (deploy-stage-host repo_dir)
- `backend/scripts/vault/dev_init.sh` (local dev init — değişmedi)
- `.claude/plans/session-plan-20260415-zanzibar-next.md` (P0.5a)
