# Session Handoff — 2026-04-15 Live Recovery & MF React Fix

**Önceki session'lar:**
- `session-handoff-20260413-s2.md` — Zanzibar Rev 19/20 + infra stabilization
- `session-handoff-20260414-deploy.md` — nginx TLS + deploy 5-layer drift
- `session-plan-20260415-zanzibar-next.md` — yarın için plan (eski; bu session farklı yöne gitti)

**Bu session'ın oturum süresi:** ~6 saat (sabah erken — öğle)
**Branch çalışması:** `claude/stupefied-colden` worktree → birden fazla feature branch açıldı

**Canlı durum bu handoff yazılırken:**
- ai.acik.com → HTTP 200, login flow çalışır
- deploy-backend SON RUN: ✅ success (2026-04-15 11:51, ilk yeşil backend deploy bugün)
- deploy-web SON RUN: ✅ success
- 0 unhealthy container, 0 console error

---

## 1. Bu Session'da Yapılanlar

### 1.1 Merged PR'lar (kronolojik)

| # | SHA | Konu |
|---|---|---|
| #377 | `d817f97` | Zanzibar governance + vault path migration |
| #378 | `3ec3b5d` | nginx auto-recover + gate bug + STORY-0319 |
| #379 | `5a5e0e5` | nginx auto-restart -f fix |
| #380 | `bbcf4b2` | deploy-backend preserves standalone web-nginx |
| #381 | `6f26fc6` | postgres RLS idempotent + fresh-boot safe |
| #382 | `c400bf0` | compose volume SSOT + drift guard |
| #383 | `17a8282` | (hatalı) eager:true on remotes — sonra geri alındı |
| #384 | `885bf6e` | strictVersion replacement (Layer 1 asymmetric sharing) |
| #385 | `e87e0bc` | import:false on remote shared deps |
| #386 | `f2626f4` | (hatalı) shareStrategy:loaded-first — federation init bozdu |
| #387 | `2c7a7ad` | revert(#386) loaded-first |
| #388 | `9362bcb` | deploy-web stage nginx upstreams pinned (8080/8081) |
| #390 | `497e63a` | **live-recovery** (MFE hostOnly+0.0.0 + HomePage + nginx + Keycloak grant) — **bugünkü ana iş** |

PR #389 superseded by #390, kapatıldı.

### 1.2 Canlı Üzerine Doğrudan Yapılan Müdahaleler (Server-Side, Repo Dışı)

Bu değişiklikler `backend.env` ve runtime state'te kalıcı, deploy onları ezmiyor (`RENDER_ENV_BEFORE_DEPLOY=false`):

- `backend.env` ekleri:
  - `VAULT_DEV_PATH=/home/halil/platform/state/vault-dev`
  - `KC_HOSTNAME=https://ai.acik.com`
- Vault re-initialized (1-of-1 shamir). Key: `/home/halil/platform/state/vault-dev/vault-unseal-key` (root-token + init.json yan tarafta)
- Orphan volume cleanup: `platform_vault-data`, `platform_vault_file`, `platform_backend_keycloak_data`, `platform_keycloak_data`, `serban_postgres_data`, `serban_vault-data` silindi. Canonical 6 volume kaldı.
- Keycloak DB schema grant — bir defa manuel uygulandı (canlı volume için), repo'da #390 ile kalıcılaştı

### 1.3 Mimari Çözümlenen Problemler

**MF React Duplicate Instance** (gün sonu çözüldü, 4 iterasyon):
- Plugin: `@module-federation/vite@1.14.2` (NOT @originjs)
- Default `shareStrategy: 'version-first'` → remote stub'ları gerçek version ile share-scope'a giriyor → shell ile yarışıyor
- **Canonical fix:** `hostOnly()` helper — `singleton + import:false + version:'0.0.0'` sentinel
  - 7 remote'taki React family (react, react-dom, react-router, react-router-dom, react-redux, @reduxjs/toolkit) bu pattern
  - Diğer shared'ler (ag-grid, @mfe/*, @tanstack/react-query) plain singleton
- Runtime state doğrulama: `__FEDERATION__.__SHARE__.mfe_users.default.react.from === "mfe_shell"` ✅

**Nginx Mount Stale (Symlink)** — kritik öğrendi:
- `/home/halil/platform/web/current` symlink — Docker bind mount **resolve at attach time**
- Symlink değişse bile container içinde mount eski inode'a kilitli kalır
- `docker restart` YETMEZ — `docker rm -f && docker run` (recreate) gerekli
- Çözüm: `bash deploy/ubuntu/run-frontend-nginx-container.sh` her yeni release sonrası

**Keycloak Public Issuer** — login akışı için:
- `KC_HOSTNAME=http://localhost:8081` (compose default) → public discovery `iss=localhost:8081` → browser unreachable redirect
- Fix: `KC_HOSTNAME=https://ai.acik.com` (backend.env)
- Doğrulama: `https://ai.acik.com/realms/serban/.well-known/openid-configuration` → issuer doğru

**Postgres Public Schema (PG 15+)**:
- Liquibase fresh DB'de `CREATE TABLE public.databasechangelog` → "permission denied"
- Fix: `00-create-keycloak-db.sql`'e `GRANT USAGE, CREATE ON SCHEMA public TO keycloak_user` (#390)

**Browser Cache Hash-Lock**:
- `index.html` ve `remoteEntry.js` referans hash'leri cache'lendiğinde, asset path'leri stale kalır → 404 → cache'den eski içerik
- Fix: nginx `Cache-Control: no-store` entry-files için (#390 ile run-frontend-nginx-container.sh template'inde)
- /assets/ ve /remotes/ hash-based, `1h immutable` korundu

### 1.4 HomePage Public Build Simplification

`/home` cockpit-api orchestrator (port 8790) endpoint'lerine bağlıydı, public hostta yok → "Unexpected token <" crash.
Fix: 7 widget kaldırıldı, sadece "Hoş geldiniz" başlığı kaldı (#390).
Internal-ops için widgets repo'da duruyor, future flag-gated reintroduce.

---

## 2. Mevcut Canlı Konfigürasyon (Source of Truth)

### Backend Stack
```
SPRING_PROFILES_ACTIVE = local,docker  (TÜM 7 servis)
KC_HOSTNAME = https://ai.acik.com
VAULT_DEV_PATH = /home/halil/platform/state/vault-dev
ERP_OPENFGA_ENABLED = true (compose default)
```

### Volume İnventarı (Canonical SSOT, PR #382)
```
platform_postgres_data
platform_vault_data
platform_vault_logs
platform_vault_snapshots  (yalnız prod'da mount edilir)
platform_loki_data
platform_tempo_data
```

### Frontend Stack
```
Module Federation: @module-federation/vite@1.14.2
Shell host: mfe_shell — eager + singleton React family
7 Remote: hostOnly (import:false, version:'0.0.0' sentinel) — React family
         singleton (default) — ag-grid, @mfe/*, @tanstack/react-query
HomePage: minimal "Hoş geldiniz" (cockpit widgets removed)
```

### Nginx
```
/         → no-store (entry)
/index.html → no-store
/remoteEntry.js → no-store
/remotes/*/remoteEntry.js → no-store
/assets/ → 1h immutable (hashed)
/remotes/*/assets/ → 1h immutable (hashed)
/cockpit-api/ → 503 application/json (graceful)
/api/* → 127.0.0.1:8080 (gateway, staging)
/realms/* → 127.0.0.1:8081 (keycloak, staging)
/api/services/* → 127.0.0.1:8795 (service-manager)
```

---

## 3. Açık Kalan İşler (Yarınki Session İçin)

### 3.1 Düşük Risk, Hızlı Win

**A. web-lint pnpm audit endpoint 410 fix** (tüm PR'larda görülüyor)
- npm registry endpoint retired. `pnpm audit` bulk advisory endpoint'e geçmeli.
- `package.json`'da `"audit": "pnpm audit --audit-level=high --registry=https://registry.npmjs.org/"` yetmez; `pnpm` versiyon güncelleme veya `--bulk` flag gerek.
- Konum: `web/package.json` script ya da `.github/workflows/web-lint.yml`
- Etki: CI noise, blocking değil ama her PR'da kırmızı görünüyor.

**B. KC_HOSTNAME + VAULT_DEV_PATH deploy-backend.yml env block'una taşımak**
- Şu an `backend.env` server-side. Audit/version control için workflow env block'unda olmalı.
- Konum: `.github/workflows/deploy-backend.yml` deploy-stage-host job env section
- Etki: dokümantasyon + drift guard

**C. `release-canary` ve `post-deploy-validate` workflow'ları**
- main'e merge sonrası bunlar çalışıyor (gh run list main).
- Şu an bunların ne kontrol ettiği belgelenmemiş — kalan iş: canary metrikleri review et.

### 3.2 Orta Risk, Stratejik

**STORY-0319 — Staging → Prod Profile Migration** (zaten yazılı, repo'da `docs/03-delivery/STORIES/STORY-0319-staging-prod-profile-migration.md`)
- `SPRING_PROFILES_ACTIVE=local,docker` → `prod,docker` geçişi
- 6 acceptance kriteri
- High risk_level (canary down olabilir)
- Önkoşul: GHCR image pull credentials çalışır, Keycloak realm prod hostname'e adapte

**Zanzibar PR6a/6b/6c cleanup** (önceki session plan'ında P1 idi)
- auth-service'te `PermissionServiceClient` legacy
- `JwtTokenProvider` `permissions` claim yazılması
- report-service `PermissionServiceClient` → OpenFGA SDK migration
- Önkoşul: bugün canary stable çalışıyor → şartlar hazır

**MF Architecture Documentation**
- `hostOnly` pattern — neden gerekli, nasıl çalışır, hangi paketler için kullanılır
- `version: '0.0.0'` sentinel rasyoneli
- Ekibe (Codex + agent ajanlar) tekrar açıklama yerine doc

### 3.3 Yüksek Risk, Büyük Kapsam

**Compose Tek Sahiplik (Codex'in earlier observation'u)**
- `platform_*` project altında iki kaynak var: `backend/docker-compose.yml` (çoğu) + GitHub runner workspace (openfga)
- `platform-web-nginx` standalone (compose dışı)
- Karışıklık: deploy farklı sahiplik modeli
- Çözüm: tek compose veya açık ayrım

**Keycloak Realm Konfigürasyonu**
- Realm config `serban` — frontend client `frontend` redirect URIs, allowed origins, vs. → public hostname'e adapte mi?
- Bugün login akışı çalıştı ama edge case'ler test edilmedi (refresh, logout, silent-check-sso vs.)
- Manuel test: tam login → /home → logout → tekrar login

**Vault Production-Grade Seal Strategy**
- Şu an: 1-of-1 shamir + dosya tabanlı sidecar (dev convention)
- Production: KMS (AWS/GCP/Azure) + auto-unseal
- Memory'de not düşüldü, ayrı story gerek (STORY-prod-vault-seal-strategy)

---

## 4. Memory Eklemeleri Bu Session'da

Yeni eklenen:
- `feedback_ci_merge_deploy_verify.md` — **Her PR akışı zincir izlenir kuralı** (2026-04-15 user direktifi)

Güncellenen:
- `feedback_infra_stability.md` — Vault path migration, nginx upstream port DEPLOY_ENV-aware notu, staging=prod hedefi
- `project_zanzibar_status.md` — 2026-04-14 notları (önceki session'dan)
- `MEMORY.md` index — yeni feedback dosyası eklendi

Yarın session'da hatırlanması için **kritik ders öğrenilen:**
- Docker bind mount symlink **attach time'da resolve edilir** — symlink değişse bile mount eski inode'a kalır → recreate gerek
- `@module-federation/vite` `version-first` strategy + remote `import:false` stub gerçek version'la yarışır → `0.0.0` sentinel canonical fix
- Browser HTTP cache index.html + remoteEntry.js no-store olmadan deploy'lar invalidate olmaz

---

## 5. Yarınki Session Başlangıç Komutları

```bash
# 1) Bu handoff + önceki plan'ı oku
cat .claude/plans/session-handoff-20260415-live-recovery.md
cat .claude/plans/session-plan-20260415-zanzibar-next.md  # eski plan, override edildi

# 2) Canlı sağlık
curl -sI -k https://ai.acik.com/
curl -s -k https://ai.acik.com/api/v1/authz/version
ssh staging-sw "docker ps --format '{{.Names}}\t{{.Status}}' | grep -v healthy | head"

# 3) Son deploy durumu
gh run list --branch main --workflow=deploy-backend.yml --limit 3
gh run list --branch main --workflow=deploy-web.yml --limit 3

# 4) Zanzibar baseline
bash backend/scripts/doctor-zanzibar.sh --quick

# 5) Açık PR var mı
gh pr list --state open

# 6) Branch durumu (worktree)
git log --oneline origin/main..HEAD | head
```

---

## 6. Tek Bakışta Özet

| Konu | Durum |
|---|---|
| Canlı (ai.acik.com) | ✅ HTTP 200, login OK, /home temiz |
| Backend deploy | ✅ Yeşil (bugünün ilk yeşil, PR #390 sonrası) |
| Web deploy | ✅ Son 7 yeşil |
| MF React duplicate | ✅ Kalıcı çözüldü (hostOnly + 0.0.0) |
| Keycloak public issuer | ✅ Doğru (https://ai.acik.com/realms/serban) |
| Cockpit widgets crash | ✅ Removed from public build |
| Nginx browser cache | ✅ Entry no-store, hashed assets immutable |
| Postgres fresh-boot | ✅ RLS idempotent + Keycloak grant kalıcı |
| Vault sealed-loop | ✅ Permanent path + canonical volume + sentinel pattern |
| **web-lint pnpm audit 410** | ❌ Open (non-blocking, ayrı PR) |
| **STORY-0319 staging=prod** | ⏸ Planlandı, implement edilmedi |
| **Zanzibar PR6a/b/c** | ⏸ Önkoşul (canary stable) sağlandı, başlatılabilir |

---

## 7. Yarınki İlk İş (Önerim)

**Üç olası yön, sıraya göre:**

1. **Browser canlı tam test** (15 dk): tam login → /home → logout → yeniden login → API çağrıları. Eğer sorun varsa hemen düzelt. (KURAL: CI→Merge→Deploy→Canlı zinciri)

2. **web-lint pnpm audit fix** (30 dk, küçük PR): CI noise temizleme.

3. **Zanzibar PR6a auth-service cleanup** (1-2 saat, planlanmış iş): bugünkü canary stable temeli üzerinde TB-11 cleanup başlangıcı.

Yön seçimi user'a bırakılır.
