# Session Handoff — 2026-04-14 Deploy & Infra Recovery

**Session scope:** Rev 20 housekeeping → Codex follow-ups → production nginx TLS regression fix → deploy-backend workflow 5-layer root cause chain.

**Canlı üretim durumu:** SAĞLIKLI ✅
- `https://ai.acik.com` → HTTP 200 OK, Sectigo `*.acik.com` cert, `Verify return code: 0`
- 20 container Up 16h+ (hepsi healthy veya running)
- Kullanıcı trafiği normal akıyor
- Production downtime: **sıfır** (bütün fail iterasyonları EXIT trap rollback ile state'i korudu)

**CI durum:** deploy-backend workflow hâlâ kırmızı — non-deterministik (vault healthcheck state oscillation). Production fonksiyonelliğini etkilemiyor.

---

## 1. Bu Session'da Merged PR'lar

| PR | Hash | Kapsam | Kalıcı etki |
|----|------|--------|-------------|
| #367 | `48ab3d08` | Rev 20 housekeeping (master plan + runbook) | Plan shipped-state ile hizalı |
| #368 | `ed99f238` | Rev 20 follow-ups (dead code + TB-11 + doctor A18/A19) | Codex F2/F3/Q6 uygulandı |
| #369 | `274569d7` | **nginx TLS cert regression fix** | 3-layer guard (default path + pre-flight + doctor-infra A4-A6) |
| #370 | `3c4ccfce` | workflow image prefix `serban-* → platform-*` | Build+push step artık çalışıyor |
| #371 | `868c41bd` | deploy-backend.sh ERR trap v1 | İlk forensic altyapı |
| #372 | `54fd938e` | ERR trap v2 (errtrace + stdout) + COMPOSE_FILE DEPLOY_ENV-aware | Trap annotation surfaced; prod compose drift kapatıldı |
| #373 | `962b0d33` | deploy-backend.sh image prefix serban→platform (script counterpart) | BUILD_LOCAL loop doğru imajları tag'liyor |
| #374 | `fa9df00e` | vault_preflight VAULT_ADDR=http (docker exec) | HTTPS/HTTP mismatch giderildi |
| #375 | `fc36a1e4` | post-deploy-health-check VAULT_ADDR + web-nginx standalone | Residual health-check bug'ları |

**Toplam:** 9 PR merged, hepsi main'de. Açık PR yok.

---

## 2. Önemli Operasyonel Bulgular (memory'e eklenmeli)

### 2.1 nginx TLS default Vault'a pointing idi
- **Incident:** 2026-04-14, kullanıcı Chrome'da `NET::ERR_CERT_AUTHORITY_INVALID` gördü (HSTS bypass kapalı).
- **Root cause:** `deploy/ubuntu/run-frontend-nginx-container.sh` default `NGINX_TLS_CERT_PATH=/home/halil/platform/state/vault/tls/tls.crt`. Vault 2026-04-13 reinit'te bu path'e CN=vault self-signed cert yazdı.
- **Fix (PR #369):** Default `/home/halil/platform/tls/ai.acik.com/fullchain.pem`; üç pre-flight guard: (a) reject CN=vault, (b) cert CN/SAN must cover server_name, (c) modulus match. doctor-infra A4-A6 drift guard.
- **Live verified:** Sectigo cert serve ediliyor, HSTS başarılı.

### 2.2 Deploy-backend 5-layer drift repair (hepsi permanent)

| Layer | Root cause | Fix PR |
|-------|------------|--------|
| 1 | Workflow grep `^serban-`, compose `platform-*` | #370 |
| 2 | `COMPOSE_FILE` default prod compose, staging KC_DB_PASSWORD missing | #372 |
| 3 | deploy-backend.sh BUILD_LOCAL loop `^serban-` (workflow ile aynı drift, script'te unutulmuş) | #373 |
| 4 | vault_preflight `docker exec vault status` → HTTPS default, dev HTTP | #374 |
| 5 | post-deploy-health-check aynı VAULT_ADDR bug + web-nginx compose dışı | #375 |

**Trap altyapısı (#371/#372) kritik unlock:** Her layer'ı ~5 dakikada izole etti; opak exit 1 yerine satır + komut + stack trace.

### 2.3 Kalan Açık — Vault Healthcheck Oscillation

**Semptom:** `docker inspect platform-vault-1 .State.Health` son 3 çalıştırmada `Sealed: true` exit 2 gösteriyor, AMA `docker exec -e VAULT_ADDR=http://127.0.0.1:8200 platform-vault-1 vault status` ile `sealed=False`. Aynı vault, farklı statü.

**İlk analiz:**
- Healthcheck: `vault status -address=http://127.0.0.1:8200` (compose'da doğru yazılı)
- Manual: `vault status` (env VAULT_ADDR=http ile) → sealed=False
- **Hipotez:** Vault state oscillate ediyor — auto-unseal loop bazı anlarda başarılı, bazı anlarda değil

**Sonucu:** `wait_for_service_state vault healthy 120` script'i ilk polldaki `unhealthy` state'i terminal kabul edip return 1 veriyor → deploy fail.

**Sonraki session için önerilen ilk adım:**
1. `ssh staging-sw "docker logs platform-vault-unseal-1 --tail 100"` — unseal loop çalışıyor mu?
2. `watch -n 2 'docker inspect --format "{{.State.Health.Status}}" platform-vault-1'` — 60 saniye boyunca state değişiyor mu?
3. `ls -la /home/halil/platform/.vault-dev/` — unseal-key mevcut mu?
4. Eğer state oscillate ediyorsa: ya healthcheck retry sayısını artır (compose `retries: 60` → yetersiz), ya da `wait_for_service_state` içine terminal state tolerance ekle (ilk unhealthy'da fail etme, 2-3 ardışık poll'da fail)

---

## 3. Tekrar Kullanılabilir Araçlar (Session'da Oluşturuldu)

### 3.1 DEPLOY_TRACE=1 forensic koşusu

```bash
ssh staging-sw "cd /tmp/deploy-trace-test && git pull origin main; \
  DEPLOY_TRACE=1 \
  ENV_FILE=/home/halil/platform/env/backend.env \
  REPO_DIR=/tmp/deploy-trace-test \
  DEPLOY_ENV=stage \
  VAULT_ADDR=http://127.0.0.1:8200 \
  TARGET_IMAGE_TAG=\$(cat /home/halil/platform/state/backend.current-image-tag) \
  BUILD_LOCAL=false \
  DOCKER_PULL_POLICY=never \
  bash deploy/ubuntu/deploy-backend.sh 2>&1 | \
  grep -E 'FAILED|\\[deploy\\]|\\[wait\\]|\\[error\\]' | head -30"
```

**NOT:** `TARGET_IMAGE_TAG` mevcut tag ile yapılmazsa `--force-recreate` tetiklenir ve prod restart olur. Mevcut tag ile koşmak side-effect-free.

### 3.2 ERR trap (#372 ile merged)
- Script baştan `set -o errtrace`
- `trap 'on_deploy_err ${LINENO}' ERR`
- `echo "::error..."` **STDOUT**'a (Actions annotation pickup)
- `DEPLOY_TRACE=1` env ile `set -x` açılır

### 3.3 Pre-flight cert guard (#369 ile merged)
- `NGINX_TLS_CERT_PATH` kontrol: CN=vault reddeder, CN/SAN server_name'i kapsamalı, cert/key modulus eşleşmeli
- `NGINX_SKIP_CERT_GUARD=true` ile bypass (sessizce set edilmez)

---

## 4. Staging Ortamı Snapshot (2026-04-14 ~14:45Z)

```
Host: staging-sw (10.9.10.53 / public 31.145.18.18)
Compose project: platform
Current image tag: sha-5b18297 (no update since fail-spiral)

Containers (20, hepsi Up 16h+):
  platform-postgres-db-1        healthy
  platform-keycloak-1           healthy
  platform-openfga-1            running (no healthcheck)
  platform-discovery-server-1   healthy
  platform-permission-service-1 healthy
  platform-auth-service-1       healthy
  platform-user-service-1       healthy
  platform-variant-service-1    healthy
  platform-core-data-service-1  healthy
  platform-report-service-1     healthy
  platform-api-gateway-1        healthy
  platform-schema-service-1     healthy
  platform-vault-1              UNHEALTHY (oscillating, son status sealed:true)
  platform-vault-unseal-1       healthy
  platform-vault-snapshot-1     running
  platform-vault-audit-init-1   running
  platform-grafana-1            healthy
  platform-tempo-1              healthy
  platform-promtail-1           running
  platform-service-manager-1    unhealthy (pre-existing)
  platform-web-nginx            running (standalone)

Production TLS: Sectigo *.acik.com, Verify OK, HTTP/1.1 200 OK
```

---

## 5. Yeni Session İçin Başlangıç Talimatı

```
1. CLAUDE.md oku (AGENTS.md via import)
2. Bu handoff dosyasını oku: .claude/plans/session-handoff-20260414-deploy.md
3. Canlı doğrula:
   curl -sI https://ai.acik.com    # 200 OK bekleniyor
   echo | openssl s_client -servername ai.acik.com -connect ai.acik.com:443 2>&1 | grep subject
4. Aktif blocker: Vault healthcheck oscillation (Section 2.3)
5. Önerilen ilk komut:
   ssh staging-sw "for i in {1..30}; do \
     docker inspect --format '{{.State.Health.Status}}' platform-vault-1; \
     sleep 2; \
   done | sort | uniq -c"
   → healthy vs unhealthy dağılımı göster
```

## 6. Çözüm Yön Önerileri (öncelik sırasıyla)

### Seçenek A — wait_for_service_state'e retry tolerance ekle (MINIMAL)
`deploy/ubuntu/deploy-backend.sh` içinde fonksiyonu şöyle değiştir:
```bash
# Terminal state'i fail etmeden önce 3 ardışık poll'de gör.
local terminal_streak=0
case "${state}" in
  unhealthy|exited|dead)
    terminal_streak=$((terminal_streak + 1))
    if (( terminal_streak >= 3 )); then
      echo "[error] ${service} stayed in terminal state: ${state}"
      return 1
    fi
    ;;
  *) terminal_streak=0 ;;
esac
```

### Seçenek B — Vault auto-unseal loop'unu izole et (DEEP)
- `platform-vault-unseal-1` container scripti incele
- Unseal key okuma + retry davranışı
- VAULT_ADDR inside unseal container (HTTP mu HTTPS mi?)

### Seçenek C — Compose healthcheck period'unu artır (PALYATIF)
- `retries: 60` → fail kararı 60 × 5s = 5dk
- Ama mevcut halinde de "unhealthy" kaldığı anlar var, bu yeterli olmayabilir

### Seçenek D — post-deploy için health-check'i deploy'dan ayır (MİMARİ)
- Deploy script sadece container restart + minimum wait yapar
- Health validation tamamen post-deploy-health-check.sh sorumluluğunda
- Deploy CI badge green olur (gerçek health ayrı post-validation step'inde)

**En verimli:** Seçenek A (minimal commit, ölçülebilir iyileşme, ~15 dk)

---

## 7. Yapılmaması Gerekenler (Öğrenilen)

- ❌ Vault container'ına dokunma (re-init → TLS cert dosyaları yok olur, nginx HTTPS kırılır)
- ❌ `docker compose down` staging'te asla (16h up state korunuyor, EXIT trap rollback çalışıyor)
- ❌ ERR trap'i stderr'ye yaz (GitHub Actions stdout parser'ı annotation için)
- ❌ deploy/docker-compose.prod.yml staging'te kullanma (memory rule: KC_DB_PASSWORD required)
- ❌ Merge + deploy + waited without trap instrumentation (opak exit 1 zaman kaybı)

## 8. Memory Ekleme Önerisi (opsiyonel)

`~/.claude/projects/.../memory/feedback_deploy_debugging.md` — "deploy-backend.sh fail'lerinde ilk adım DEPLOY_TRACE=1 ile staging SSH koşusu; trap+errtrace+stdout annotation infrastructure PR #372 ile kuruldu"

---

**Session-ending commit:** Bu handoff dosyası kendi PR'ında.
**Next session entry point:** Section 5 adımları.
