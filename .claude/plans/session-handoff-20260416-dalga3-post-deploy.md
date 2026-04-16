# Session Handoff — 2026-04-16 Dalga 3 Post-Deploy

**Önceki handoff:** `session-handoff-20260416-zanzibar-dalga1-done.md` (14+ saat, 10 PR merged, Dalga 1 DONE).

**Bu session:** ~7 saat. PR #422 (report-service direct OpenFGA SDK) baştan sona kadar, **3 PR merged** (#422 + #423 + #424), OpenFGA store+model init, canary-admin super-admin doğrulandı. **Zanzibar Dalga 3 core kod katmanı CANLI.**

**Canlı durum handoff yazılırken:**
- `ai.acik.com/` → 200
- `/authz/version` token'sız → 401 ✅
- **Direct permission-service** (`localhost:8090/api/v1/authz/me`) canary-admin token ile → **`{"userId":"1204","superAdmin":true,...}`** ✅
- 22 container healthy, 7/7 servis `prod,docker`
- Doctor-infra `75 check, 71 PASS, 0 FAIL, 4 WARN` → STATUS PASS
- **Kalan:** Gateway 500 (`/api/v1/*` token'lı `ai.acik.com` üzerinden) — direct service OK, gateway JWT decode / route sorunu

---

## 1. Bu Session'da Yapılanlar — 3 PR + operasyonel

| PR | SHA | Konu | Bölge |
|---|---|---|---|
| **#422** | `a5a4f389` | report-service direct OpenFGA SDK (PR6c-1). 12 dosya: OpenFgaAuthzConfig + PermissionCodeToTupleMapper + OpenFgaAuthzMeBuilder + 4 test + smoke + -2 legacy. 64/64 test PASS. | Dalga 3 core |
| **#423** | `29913194` | compose yml report-service env contract (ERP_OPENFGA_* + SECURITY_JWT_ISSUERS eksikti). 1 dosya, +14/-1. | Dalga 3 follow-up |
| **#424** | `a2913bbc` | doctor-infra L3-L8 drift guard + RUNBOOK. 2 dosya (script + doc), +171 sat. 4 iterasyon RUNBOOK şablon uyumu (KAPSAM eksikti, BAŞLATMA/DURDURMA eksikti, bash yorum `# 1.` regex collision). | Dalga 3 operational hotfix |

**Toplam CI/CD:** 50+ check tetiklendi, 3/3 merge, 3/3 deploy SUCCESS. Her biri "CI → merge → deploy → canlı doğrulama" zincirini takip etti.

### Operasyonel (repo dışı, staging hotfix)

1. **Self-hosted runner restart** — `stage-backend-ubuntu` offline idi (önceki session 11:48 UTC'de kapanmış). `setsid nohup ./run.sh` ile reset.
2. **Queued PR #419 cancelled** — eski SHA'lı deploy'u iptal ettik, PR #422 kuyruğa girsin diye.
3. **Canonical env hotfix** — `/home/halil/platform/env/backend.env` eksikti (prod,docker profile + ERP_OPENFGA_* + SECURITY_JWT_ISSUERS). Repo `.env`'den kopyalandı.
4. **Compose force-recreate** — deploy-backend.sh `--force-recreate` yapıyor (Codex tespit) ama canonical env drift olunca işe yaramıyordu. Manuel reconcile.
5. **Vault unseal** — compose recreate sonrası Vault sealed, `VAULT_ADDR=http://127.0.0.1:8200` ile manuel unseal.
6. **OpenFGA store+model init** — staging OpenFGA boştu (stores=[], models=[])! `backend/openfga/init.sh` ile yeni store `01KPBM48614TZ2F3ZR5AKVXC7B` + model `01KPBM488WJK8P7XHK751MDNGG`. Env güncellendi.
7. **canary-admin kullanıcı provision** — `user_service.users` PostgreSQL INSERT (ID=1204, ADMIN, enabled). KC'de zaten var idi, user-service DB'de yoktu.
8. **canary-admin admin tuple** — OpenFGA `user:1204 admin organization:default` yazıldı. Direct `/authz/me` → superAdmin:true DOĞRULANDI.

---

## 2. Codex İstişareleri (CNS-20260416-003, 4 tur ping-pong)

Thread `019d9688-233c-7c50-85f0-73ee5d106753`:

| Tur | Konu | Verdict |
|---|---|---|
| 1 | PR6c-1 draft plan (Pattern A/B/C seçim, 8 soru) | APPROVE_WITH_CHANGES — 5 zorunlu değişiklik |
| 2 | PR6c-1 implementation completion review | BLOCK — 3 blocker (ERP_OPENFGA env prefix, missing alias, base-url drift) |
| 3 | Post-deploy durum değerlendirme | Tavsiye — PR #423 ayrı PR, canary-admin provisioning ayrı, Dalga 2 E2E öncesi drift guard şart |
| 4 | Deploy-backend force-recreate bug hipotezi | Tanı düzeltme — `--force-recreate` zaten var, asıl sorun **canonical env SSOT drift** |

**Kritik bulgular:**
- `Locale.ROOT` regression: Türkçe JVM'de `"satis".toUpperCase() = "SATİS"` mapper fail. Test runtime'da yakalandı, 2 satır fix.
- Mapper eksik alias: `reports.fin-fatura-satirlari.financials` silent deny riski. Explicit eklendi.
- Canonical `/home/halil/platform/env/backend.env` vs repo `.env` drift. PR #424 doctor-infra L3-L8 fail-closed yakalıyor.

---

## 3. Kritik Staging Durumu

### OpenFGA (YENİ! eski ID'ler uçtu)
- **Store:** `erp-stage` → `01KPBM48614TZ2F3ZR5AKVXC7B`
- **Model:** `01KPBM488WJK8P7XHK751MDNGG`
- **Seed tuples:** `tuples-seed.json` uygulandı (init.sh)
- **canary-admin tuple:** `user:1204 admin organization:default` (manuel yazıldı)

### Users
- **canary-admin@stage.local** — KC user (realm `serban`), admin realm role ATANDI, user_service.users ID=**1204** (ADMIN, enabled)
- KC password: `CanaryPass123` (master admin için dikkat: `admin/admin` sadece master realm)
- **admin1@example.com** — handoff'ta var ama password doğrulanamadı (invalid_grant), user-service ID=1203 eski seed

### Client token alma
```bash
curl -s -X POST "http://localhost:8081/realms/serban/protocol/openid-connect/token" \
  -d "client_id=canary-load" \
  -d "client_secret=canary-load-secret-2026" \
  -d "grant_type=password" \
  -d "username=canary-admin@stage.local" \
  -d "password=CanaryPass123"
```
**Not:** `admin-cli` client scope limited — admin realm role token'a yansımıyor. `canary-load` confidential client kullanmak şart.

### .env dosyaları
- **Canonical:** `/home/halil/platform/env/backend.env` (deploy bu dosyayı kullanıyor, `BACKEND_DEPLOY_REMOTE_ENV_FILE`)
- **Repo:** `/home/halil/platform/repo/backend/.env` (compose runtime)
- Bu session'da **ikisi de** ERP_OPENFGA_STORE_ID + MODEL_ID yeni değerlere güncellendi.

### Doctor-infra L3-L8 (PR #424)
```bash
bash /home/halil/platform/repo/backend/scripts/doctor-infra.sh
# 75 check, 71 PASS, 0 FAIL, 4 WARN → STATUS PASS
```

---

## 4. Açık Sorunlar (Yarın)

### 🚨 Gateway 500 (öncelik P0)

```
# Direct permission-service OK
curl -H "Bearer <token>" http://localhost:8090/api/v1/authz/me
→ {"userId":"1204","superAdmin":true,...} HTTP 200

# Gateway üzerinden
curl -H "Bearer <token>" https://ai.acik.com/api/v1/authz/version
→ HTTP 500

# api-gateway recreate edildi ama sorun devam ediyor
# Log: Netty stack trace ama ERROR/Exception satırı yakalanmadı (muhtemelen log level TRACE/DEBUG filter)
```

**Hipotezler:**
1. Gateway JWT decode — canary-load token aud=[frontend, account, realm-management, broker, canary-load] — gateway audience check eksik olabilir
2. Gateway route tanımı değişmiş olabilir (`/api/v1/authz/*` → permission-service routing)
3. Service discovery: gateway Eureka'dan permission-service bulamıyor?

**Yarın ilk iş:**
```bash
ssh staging-sw 'docker logs platform-api-gateway-1 --since 5m 2>&1 | head -200'
# Aramak: 
#   - "Caused by"
#   - Route configuration error  
#   - JWT validation error
#   - Eureka "no instances for"
```

### 🎯 Dalga 2 Playwright E2E (gateway fix sonrası)

Kapsam: 4/5 reason badge (ALLOWED, DENIED_BY_ROLE, NO_PERMISSION, NO_ROLE — NO_SCOPE ayrı story). Codex'in önceki keşfi (thread `019d96bc`) şunu belirtti:
- `authz.zanzibar.spec.ts`'i genişlet VEYA yeni `authz.explain-modal.stage.spec.ts`
- Login pattern: `performBrowserLogin` inline (auth.real.ts'e ortaklaştırılabilir)
- Config: `web/tests/playwright/playwright.config.ts`
- ExplainModal testid'ler: `explain-trigger-module-*/action-*/report-*`, `explain-modal-body/loading/reason/user-roles`
- i18n: `web/packages/i18n-dicts/src/locales/*/access.ts`, pseudo localStorage override gerekli

**Şu an kullanabilir persona:** sadece canary-admin (super-admin). 4/5 reason için persona'ları da yaratmak gerek — canary-setup.mjs staging'de "Service token gerekli" diyor (internal endpoint requires service JWT). İki yol:
1. `service-manager` veya SERVICE_JWT_PRIVATE_KEY ile script çağrısı
2. Manuel 4 persona daha DB INSERT + OpenFGA tuple (her biri ~5dk)

---

## 5. Memory Kurallarına Eklemek (bu session'da öğrenilen)

Önerilen yeni kurallar `~/.claude/projects/.../memory/` altına:

1. **`feedback_staging_canonical_env_drift.md`** — deploy'da iki env dosyası: canonical (`/home/halil/platform/env/backend.env`) vs repo (`backend/.env`). Drift sessiz deny yaratır. Her deploy sonrası `doctor-infra.sh` L3-L8 çalıştır.

2. **`feedback_kc_client_scope_admin_role.md`** — `admin-cli` client Full Scope kapalı, admin realm role token'a yansımıyor. Admin API için `canary-load` (confidential, secret'li) kullan.

3. **`feedback_openfga_init_after_volume_recreate.md`** — OpenFGA data volume silinince stores/models boşalıyor. `backend/openfga/init.sh` çalıştır, yeni store/model ID'lerini hem canonical hem repo .env'e yaz, servisleri recreate et.

---

## 6. Sonuç Metrikleri

| Metrik | Değer |
|---|---|
| Bu session süresi | ~7 saat |
| PR merged | 3 (#422 + #423 + #424) |
| Commits | 5 (493b7790 + 8de40bdc + 3821f4a5 + 33edae88 + 46f93e61 + d4187897) |
| CI check | 50+ çalıştırıldı, 0 FAIL (son iterasyonlarda) |
| Test added | 64 (Mapper 26 + Builder 12 + Dashboard 8 + Export 6 + mevcut 11 korunur) + 2 mapper financials |
| Staging deploy | 3 SUCCESS |
| Doctor-infra.sh | 61 → 69 → 75 check (L3-L8 eklendi) |
| Codex ping-pong | 4 tur (APPROVE → BLOCK → fix → APPROVE → tavsiye → tanı) |
| Canary-admin super-admin canlı | ✅ doğrulandı (direct permission-service) |

---

## 7. Yarınki Session Başlangıç Rehberi

```bash
# 1. Plan + handoff
cat .claude/plans/zanzibar-master-plan.md                                    # Rev 23 — Dalga 1 DONE
cat .claude/plans/session-handoff-20260416-zanzibar-dalga1-done.md           # önceki
cat .claude/plans/session-handoff-20260416-dalga3-post-deploy.md             # bu dosya

# 2. Canlı sağlık
curl -sI -o /dev/null -w "%{http_code}\n" https://ai.acik.com/
curl -sI -o /dev/null -w "%{http_code}\n" https://ai.acik.com/api/v1/authz/version   # 401 beklenen

# 3. Staging infra
ssh staging-sw 'bash /home/halil/platform/repo/backend/scripts/doctor-infra.sh'     # 75/71/0F/4W PASS
ssh staging-sw 'docker ps --filter name=platform- --format "{{.Names}} {{.Status}}" | head -25'

# 4. Token + direct service test (gateway fix öncesi)
ssh staging-sw 'TOKEN=$(curl -sf -X POST "http://localhost:8081/realms/serban/protocol/openid-connect/token" \
  -d "client_id=canary-load" -d "client_secret=canary-load-secret-2026" \
  -d "grant_type=password" -d "username=canary-admin@stage.local" -d "password=CanaryPass123" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)[\"access_token\"])")
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8090/api/v1/authz/me | head -c 200'
# Beklenen: {"userId":"1204","superAdmin":true,...}

# 5. Yarın P0: Gateway debug
ssh staging-sw 'docker logs platform-api-gateway-1 --since 10m 2>&1 | head -200'
# Caused by / ERROR satırları ara

# 6. Gateway düzelince Dalga 2 E2E
#    web/tests/playwright/ altına yeni spec
#    canary-admin ile ALLOWED path E2E önce, sonra 4/5 reason persona seed
```

---

## 8. Tek Bakışta Özet

| Konu | Durum |
|---|---|
| Canlı (ai.acik.com) | ✅ Stabil |
| Dalga 1 (Stage 1+2+3 DONE önceki session) | ✅ |
| **Dalga 3 core — PR6c-1** | ✅ **CANLI** (direct service superAdmin=true) |
| **Dalga 3 follow-up — compose env** (PR #423) | ✅ CANLI |
| **Dalga 3 operational — drift guard** (PR #424) | ✅ CANLI |
| OpenFGA store/model init | ✅ Yeni ID'ler + env sync |
| canary-admin super-admin tuple | ✅ Direct permission-service doğrulandı |
| Gateway route/JWT | ⏳ **Yarın debug** (500 via gateway, 200 direct) |
| Dalga 2 release gate (Playwright E2E) | ⏳ Gateway fix sonrası |
| 4/5 persona provisioning | ⏳ service-token sorunu, ayrı ops task |
| Master plan | Rev 23 (değişmedi, Dalga 1 DONE kaydı hâlâ geçerli) |
| Memory kuralları | +3 yeni önerildi (bu handoff §5) |
| PR merged bu session | **3 PR** (#422 + #423 + #424) |

---

**Session metriği:** ~7 saat, 3 PR merged, 5 commit, 50+ CI check, 4 Codex tur, OpenFGA yeniden init, canary-admin super-admin CANLI. Dalga 3 core kod katmanı **staging'de test edilebilir durumda** (direct service path). Gateway fix + Dalga 2 E2E yarına devredildi.

**Öncelik sırası:**
1. **Gateway 500 debug** (~30-60dk) — log detaylı tarama, Caused by / ERROR bul
2. **Dalga 2 Playwright E2E** (2-3h, 4/5 reason) — canary-admin ALLOWED path önce
3. (opsiyonel) 4 persona seed — canary-setup.mjs service-token bypass veya manuel DB INSERT
4. (opsiyonel) TB-11 cleanup, Vault KMS, NO_SCOPE reason refactor
