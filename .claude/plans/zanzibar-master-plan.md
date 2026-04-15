# Zanzibar Master Plan — Rev 23 (Synthetic Canary Altyapisi TAMAM, STORY-0319 P0)

**Tarih:** 2026-04-16 (gece)
**Kaynak:** Rev 22 + bu session CNS-20260416-001/002 (Codex 5 tur ping-pong review)
**Base:** main @ 377b3539 (PR #408 merged — PR-2 polish operational guardrail full)
**Uzlasi:** Dalga 1 Stage 2 altyapisi %100 hazir (PR #406 MVP + #408 polish). Codex
BLOCK→BLOCK→APPROVE_WITH_CHANGES 2 iterasyonla 11 gotcha fix'lendi. STORY-0319
(staging prod-like profile) P0 sira bekliyor; gercek synthetic canary run sonrasinda
Dalga 1 kapanir. Dalga 3 complete (PR6c-1) ve Dalga 2 release gate (Playwright E2E)
STORY-0319 sonrasi seri.

---

## 0. REV 22 -> REV 23 DEGISIKLIK OZETI

### Bu Session'da Tamamlananlar (2026-04-16 gece)

| # | PR | SHA | Kapsam | Durum |
|---|----|-----|--------|-------|
| 1 | #406 | `c541fb50` | **PR-1 MVP**: Zanzibar persona matrix runner + `zanzibar-canary-setup.mjs` + `run-zanzibar-canary.sh` + `guardrail-check.mjs` CB + phase flag + `pull-grafana-metrics.mjs` authz_decisions/CB metric + `tuples-seed.json` daraltma + **granule-only role NPE guard** (`PermissionService.syncTuplesToOpenFga` + `hasPermission`) | ✅ merged |
| 2 | #408 | `377b3539` | **PR-2 Polish**: Wrapper cold+warm iki ayri metrics pull + iki ayri guardrail-check (B5 fix) + guardrail-check v2 ops enforcement + `--require-v2-ops` flag (B6 fix) + collector phase flag + 5 yeni optional metric (authz_me_p95, outbox_*, openfga_up) + guardrails.json v1→v2 (11 threshold + 11 PromQL) + probe canary-load dedicated client + runbook full rewrite (8 bolum) | ✅ merged |

**Zincir kuralla izlendi:** CI → Merge → Deploy → Canli — iki PR da canli dogrulandi
(ai.acik.com 200, authz/version 200, permission-service healthy, null-safe fix runtime).

### Codex Istisare (CNS-20260416-001/002, thread `019d92b5`, 5 tur, ~800K token)

| Tur | Kapsam | Verdict | Bulgular |
|-----|--------|---------|----------|
| 1 | PR-1 MVP | 🔴 BLOCK | B1 permissionCode lookup NPE + B2 local permitAll mismatch fırtınası + M1 timeout + M2 VU + M3 estimate JSON |
| 2 | PR-1 fix turu | 🔴 BLOCK | B3 granule-only RolePermission.permission NULL → `syncTuplesToOpenFga` NPE + B4 guardrail payload uyumsuzlugu + Q3 restore PUT return check + Q5 handleSummary dynamic path |
| 3 | PR-1 onay | 🟢 APPROVE_WITH_CHANGES | hasPermission null guard + metric query ornekleri |
| 4 | PR-2 polish | 🔴 BLOCK | B5 Wrapper I/O stdout redirect broken (JSON parse kirik) + B6 v2 ops metric silent skip = Evidence PASS misconfig riski |
| 5 | PR-2 onay | 🟢 APPROVE_WITH_CHANGES | `--require-v2-ops` flag + step label cleanup |

**Toplam 11 gotcha fix:** B1/B2/B3/B4/B5/B6 + M1/M2/M3 + Q3/Q5. Tum fix'ler
iki PR'a bolunmus sekilde merged.

### Yeni Memory Kurallari (3 adet, 2026-04-16 direktifleri)

1. **`feedback_codex_review_on_completion.md`** — Her tamamlanan is paketi Codex MCP
   review zorunlu; BLOCK verdict → fix + ikinci tur; APPROVE olmadan commit/push yok.
2. **`feedback_codex_pending_parallel_work.md`** — Codex MCP beklerken bagimsiz
   islere paralel devam (local gate, docs, memory); Codex verdict'e bagimli isler
   (commit/push/PR) beklenir.
3. **`feedback_codex_mcp_default.md`** (pekistirildi) — Varsayilan davranis
   interaktif ping-pong; iterate modu sadece kullanici "kendi aranizda cozun" derse.

### Dalga 1 Stage 2 Altyapi — TAMAM (Operasyonel Stage 2 Protokolu)

> **Not (CNS-20260416-002 Codex tur 6):** Asagida tanimlanan 10-step wrapper ve iki
> sinyal katmani **doctrine degil, current Stage 2 operational protocol + evidence
> collection flow**. Doctrine `Rev 22 synthetic canary` olarak kalir (fiziksel 48h
> yerine 30-60dk k6+probe + Evidence PASS). Bu bolum uygulama detaydir; yarin script
> gelisirse doctrine degismeden protokol revize edilebilir.

PR #406 + #408 merged sonrasi operasyonel + fonksiyonel iki sinyal katmani tam
donanimli hale geldi:

**Operasyonel guardrail (Prometheus/Micrometer):**
- `authz_decisions_total >= 1000` (NO_SIGNAL guard, 30-35dk window)
- `authz_check_p95_ms < 50`, `authz_error_rate_pct < 0.5`
- `authz_cache_miss_rate_pct_warm < 50` (cold'da soften)
- `openfga_circuit_breaker_state == 0` (CLOSED)
- `tuple_sync_outbox_pending_total < 50`, `oldest_age_s < 300`, `failed_total` artis yok
- `authz_me_p95_ms < 100`
- `openfga_up == 1`

**Fonksiyonel persona (k6 custom tag'leri):**
- `authz_persona_outcome{persona, phase, expected, actual, reason}` Counter
- `authz_persona_mismatch: rate < 0.01` (persona intent doğrulaması)
- `authz_persona_latency` (persona + phase bazli p95)

**10-step orchestration wrapper (`run-zanzibar-canary.sh`):**
setup → probe pre → [ESTIMATE_ONLY exit] → k6 cold → metrics pull cold →
k6 warm → metrics pull warm → probe post → guardrail cold → guardrail warm.
Her iki guardrail PASS iff exit 0.

### Rev 22 Backlog Kapatmalari (PR #408 ile)

| # | Madde | Durum Rev 23 |
|---|-------|--------------|
| 7 | zanzibar-guardrails.json parse fix | ✅ PR #401 escape + PR #408 v2 library genislet |
| 8 | guardrail-check.mjs authz metric ZORUNLU | ✅ PR #401 flag + PR #408 v2 ops enforcement |
| 9 | pull-grafana-metrics.mjs query_range | ⏸ PARTIAL — phase flag + ek metric eklendi; gercek query_range ertelendi PR-3 (Codex "instant scalar + window template yeterli") |
| 11 | k6 persona matrix MVP | ✅ PR #406 + PR #408 polish |
| 10 | STORY-0319 scope dar + Vault KMS ayri | ⏸ P0 siradaki |
| 12 | Playwright E2E explain modal | ⏸ STORY-0319 sonrasi |
| 13 | Vault prod seal KMS story | ⏸ Dalga 1 Stage 3 blocker, ayri gun |
| 14 | de/es/pseudo i18n completeness | ⏸ dusuk oncelik |

### Yeni PR-3 Backlog (Codex CNS-20260416-002 tespiti)

- `zanzibar-guardrails.json` **config loader** — guardrail-check.mjs hardcoded
  threshold'larla calisiyor. JSON suan PromQL library + Grafana alert kaynak.
  Config loader + consistency test drift riskini kapatir.
- `pull-grafana-metrics.mjs` **query_range + phase window** — saf cold/warm
  metric ayrimi icin (su an instant scalar window template yeterli ama prod icin idealsiz).
- `run-zanzibar-canary.sh` **retry/backoff** — write-path verify jitter
  toleransi (fail sonrasi exponential retry, 120s uzmasi).

---

## 0.5. REV 21 -> REV 22 DEGISIKLIK OZETI (arsiv)

### Kullanici direktifi (2026-04-15 aksam)

> "4 gun oncesi de 48 saat basladi dedin, dunde dedin, her gun 48 saat basliyor
> neden anlamadim" — "staging'de kullanici yok ki sisteme giren".

Dogru tespit: Master plan rev 20-21'deki "Dalga 1 Stage 2: 2-4 gun canary pencere",
"Stage 3: 48h stabil" kriterleri **staging'de gercek trafik olmadigi icin anlamsiz**.
Her gun "baslat" denebiliyor, asla tamamlaniyor cunku gercek trafik sinyali gelmiyor.

### Dalga 1 Revize Tanim (FINAL)

| Asama | Eski (rev 20-21) | Yeni (rev 22) |
|-------|------------------|---------------|
| Stage 1 | Compose default ON, container healthy | **Aynen** (dry-run 2026-04-15 ✅) |
| Stage 2 | 2-4 gun fiziksel canary | **Synthetic canary**: k6 + restricted-probe ile ~30-60dk sinyal uretimi (deny rate, CB state, latency, outbox) |
| Stage 3 | 48h stabil full rollout | **Audit checklist PASS**: doctor-zanzibar full + smoke workflow yesil + restricted probe PASS + STORY-0319 profile dogrulanir |

"48h" kavrami fiziksel zaman yerine **doctrine: sinyal kalitesi + checklist**.
Prod ortaminda gercek trafikle 48h yeniden anlamli olur; staging icin synthetic
yeterli.

### Bu Session'da Tamamlananlar (rev 21 → rev 22)

| # | PR | Kapsam | Durum |
|---|----|--------|-------|
| 1 | #395 | master plan rev 21 + handoff day 2 | ✅ merged |
| 2 | #396 | Dalga 2 kalan: ZanzibarGate disabled tooltip + Modal Vitest test | ✅ merged (7b43b87a) |
| 3 | #397 | PR6a: auth-service permissions=Set.of() + admin fallback removed | ▶ open (rebase sonrasi CI) |
| 4 | #398 | PR6b: JwtTokenProvider 'permissions' claim kaldirildi | ▶ open |
| 5 | #399 | PR6c: report-service PermissionServiceClient @Deprecated (partial) | ▶ open |

PR6c kisminda: consumer-side refactor (DashboardController/ReportController/
ReportExportController icinde /authz/me → OpenFgaAuthzService.check() migration)
ayri story olarak ertelendi — behavior-preserving regression gerektirir.

---

## 0.5. REV 20 -> REV 21 DEGISIKLIK OZETI (arsiv)

---

## 0. REV 20 -> REV 21 DEGISIKLIK OZETI

Bugun (2026-04-15) uc P0 incident ve Dalga 2 ana UI is paketi tamamlandi:

| # | Olay | PR | Sonuc |
|---|------|----|----|
| 1 | Smoke-zanzibar workflow canli stack'i siliyordu (`compose down --volumes` ayni `platform` project) | #392 (`5cbbe21e`) | 3 katman defense-in-depth: izole COMPOSE_PROJECT_NAME + workflow_run disable + doctor A21/A22 drift guard |
| 2 | `03/04/05-rls-phase1-*.sql` fresh-boot safe degildi (PR #381 sadece `02`'yi duzeltmis) | #393 (`674beb0c`) | 4 tablo icin DO $$ + IF EXISTS guard (user_permission_scope, scopes, companies, variant_visibility) |
| 3 | Vault data volume silinmisti (smoke cleanup dunku), fresh init gerekti | Operasyonel | 1-of-1 shamir re-init + unseal sidecar restart + manual re-unseal (compose up seal'a dusurmustu) |
| 4 | Dalga 2 Explain UX UI ana modal | #394 (`5241b6e4`) | ExplainPermissionModal + RoleDrawer 3 permission tipinde "?" butonu + i18n tr+en 13 key |

Canli dogrulama: `/api/v1/authz/version` 200, `/api/v1/authz/explain` 200, `/realms/serban` 200,
22 container healthy, AccessApp.ui bundle'da `explainModal` + `ExplainPermission` string'leri mevcut.

Dalga 1 Stage 1 **dry-run** olarak isaretlendi: stack deploy + endpoint'ler 200 kriteri karsilandi,
ama gercek canary sinyali (deny rate + JWT validation) STORY-0319 (staging prod-like profile)
tamamlanana kadar ANLAMSIZ. Stage 2 (2-4 gun gercek canary) STORY-0319 sonrasi acilir.

---

## 0a. REV 19 -> REV 20 DEGISIKLIK OZETI (arsiv)

Rev 19'da Dalga 0 (Canary Readiness) BLOCKER fix'leri planlandi. PR #365
(commit eaa3d7a1) merged. 5/5 BLOCKER runtime dogrulandi. Codex Round 2
(CNS-20260414-002) sirasinda 2 gizli bug daha yakalandi:
- B2 path-aware 503 (ilk fix yetersizdi; tum hata path'lerinde 200+bos body dondurmeye devam ediyordu)
- B4 outbox schema bug (Micrometer counter + DB schema migration eksikti)

ADR-0013 yazildi (Permission-Service Hub Role, D-008 FINAL formalize).
Decision registry rev 4: D-008, R-006, C-008 eklendi.

FAZ A (bu rev) — housekeeping: Dalga 0 checkbox kapatma + §5 karar/sayim
drift kapatma + canary runbook precondition hizalama. FAZ B (TB-11 PR6-prereq)
Codex Q1 verdict'ine gore **post-canary** icin ertelendi: auth-service refactor
zincirinin (login -> JWT -> downstream fallback -> audit) canary authz
guardrail sinyalini kirletmemesi icin.

---

## 0.1 REV 18 -> REV 19 DEGISIKLIK OZETI (arsiv)

Rev 18'de "Canary Rollout" ilk dalga idi. Codex istisaresi 6 bulgu ortaya cikardi;
Claude degerlendirmesi ve Codex Round 2 dogrulamasiyla 5 tanesi BLOCKER olarak
kesinlesti. Dalga 0 (Canary Readiness) eklendi.

| Bulgu | Aciklama | R1 Claude | R2 Codex | Uzlasi |
|-------|----------|-----------|----------|--------|
| #1 | `/authz/check` + `/batch-check` core-data'da, route permission-service'e gidiyor | Dogrulamam lazim | BLOCKER (kanitla) | **BLOCKER** |
| #2 | JWT fallback: /authz/me hata -> 200+bos body -> 5dk sticky 403 | Dalga 4'e ertele | YUKSEK RISK (canary tetikler) | **BLOCKER** |
| #3 | Deny rate metrigi HTTP 403 bazli, /authz/check 200+allowed:false donuyor | BLOCKER | BLOCKER | **BLOCKER** |
| #4 | Phantom alert: outbox_failed + circuit_breaker Micrometer uretici yok | BLOCKER | BLOCKER | **BLOCKER** |
| #5 | variant + core-data compose'da PERMISSION_SERVICE_BASE_URL yok | BLOCKER | BLOCKER | **BLOCKER** |
| #6 | Runbook drift: Stage 1 "flags OFF" ama compose default=true | Non-blocker | Non-blocker | **FIX** |

### Ek Codex Bulgulari (Rev 18'de yoktu)
- `/api/v1/authz/explain` iki serviste farkli semantikle mevcut (permission-service: legacy, core-data: OpenFGA)
- Runbook + alert metni "fail-closed = check true" diyor; kod `false`/empty donuyor
- variant-service bos authz response'u 5dk cache'liyor (sticky deny)

---

## 1. MEVCUT DURUM (2026-04-14)

### Tamamlanan Katmanlar

| Katman | Durum |
|--------|-------|
| OpenFGA Altyapi (model.fga, Docker v1.11.2, PG datastore) | Prod-ready |
| Backend Core (OpenFgaAuthzService, ScopeContextFilter, @RequireModule) | Prod-ready |
| Tuple Sync (TupleSyncService, Outbox + SKIP LOCKED + @EnableScheduling) | Prod-ready |
| Data Enforcement (Hibernate @Filter + PostgreSQL RLS + ScopeContext) | Prod-ready |
| Frontend Auth (@mfe/auth: PermissionProvider, useZanzibarAccess, ZanzibarGate) | Prod-ready |
| Frontend UI (mfe-access RoleDrawer, mfe-users multi-role, tabbed scope) | Prod-ready |
| Guvenlik (7/7 servis authenticated() catch-all) | Hardened |
| Hardening (MF singleton, CORS, CB, rate-limit, Grafana alerts) | Prod-ready |
| E2E Test (Playwright authz, doctor-zanzibar.sh 47 check) | CI-entegre |
| Explain UX (403 sayfasi + per-permission RoleDrawer modal + 13 i18n key) | Prod-ready (PR #394) |
| k6 (zanzibar-check.js, SK-2/SK-11 esikleri) | Tamamlandi |
| ERP_OPENFGA_ENABLED default=true (compose + .env.example) | Tamamlandi |
| Grafana alert kurallari (authz-zanzibar-rules.yml) | Tamamlandi |

### BLOCKER'lar (Canary Oncesi Duzeltilmeli)

| # | Blocker | Kanit |
|---|---------|-------|
| B1 | `/authz/check` + `/batch-check` endpoint core-data'da; gateway+Vite permission-service'e yonlendiriyor | `AuthzExplainController.java:45,71` vs `vite.config.ts:281`, `gateway:76` |
| B2 | `/authz/me` hata -> 200+bos fallback body -> variant 5dk sticky 403 | `AuthorizationControllerV1.java:150`, `VariantAuthorizationServiceImpl.java:23` |
| B3 | Deny rate metrigi HTTP 403 bazli; `/authz/check` 200+`allowed:false` donuyor | `zanzibar-guardrails.json:25` |
| B4 | `tuple_sync_outbox_failed_total` + `openfga_circuit_breaker_state` alert var, Micrometer uretici yok | `authz-zanzibar-rules.yml:217,246` vs `AuthzCacheMetricsConfig.java` (sadece cache gauge) |
| B5 | variant + core-data compose'da `PERMISSION_SERVICE_BASE_URL` yok -> authzVersion polling kendine gidiyor | `OpenFgaAuthzConfig.java:40` (her iki servis), `docker-compose.yml:128,171` |

### Kalan Legacy Borc (TB-11)

| Kategori | Dosya |
|----------|-------|
| PermissionServiceClient | 8 dosya (auth, user, report-service) |
| PermissionCodes | 15 dosya (common-auth + tuketiciler) |
| /api/permissions eski route | Gateway + client |
| Deprecated PermissionType | PAGE, FIELD enum |
| **Toplam** | **~23 dosya, ~56 referans** |

---

## 2. YOL HARITASI

### DALGA 0: Canary Readiness (2-3 gun) — BLOCKER FIX

**B1: /authz/check route duzeltmesi** ✅ PR #365 merged
- [x] `/authz/check` ve `/batch-check` endpoint'lerini permission-service `AuthorizationControllerV1`'a tasi
  - Uygulanan: core-data'daki mantik permission-service'e tasindi (ayni OpenFgaAuthzService)
  - core-data'daki duplicate endpoint kaldirildi
- [x] Gateway + Vite route'larinin tutarliligini dogrula
- [x] Frontend `api.ts` call path'lerini dogrula (degisiklik gerekmedi)
- Kanit: `AuthorizationControllerV1.java`, `vite.config.ts`, PR #365 commit eaa3d7a1

**B2: JWT fallback mitigasyonu** ✅ PR #365 merged (path-aware retrofit)
- [x] `AuthorizationControllerV1.java` top-level catch: 200+bos body yerine 503 don (path-aware)
  - Uygulanan: tum hata path'lerinde 503 (Codex Round 2 yetersiz ilk fix'i yakaladi)
- [x] variant-service `PermissionServiceAuthzClient`: bos response'u cache'leme (null don)
- [x] variant-service cache TTL'i 5dk -> hata durumunda 0 (skip cache)
- Kanit: commit 611f0ecb (B2 path-aware + B4 outbox schema fix), PR #365

**B3: Deny rate metrigi duzeltmesi** ✅ PR #365 merged
- [x] `authz_decisions_total` Micrometer Counter ekle (tag: `allowed=true|false`, `reason=*`)
  - Uygulanan: `OpenFgaAuthzService.check()` + `checkWithReason()` icinde
- [x] `zanzibar-guardrails.json` deny_rate sorgusunu guncelle: `authz_decisions_total{allowed="false"}`
- [x] Grafana alert kuralini guncelle
- Kanit: `zanzibar-guardrails.json`, `authz-zanzibar-rules.yml`, PR #365

**B4: Phantom alert'lere metric uretici ekle** ✅ PR #365 merged (schema fix dahil)
- [x] `tuple_sync_outbox_failed_total` Counter: `TupleSyncOutboxPoller` FAILED entry islendiginde increment
- [x] `openfga_circuit_breaker_state` Gauge: CB state degistiginde guncelle (0=closed, 1=open, 2=half-open)
- [x] `AuthzCacheMetricsConfig` pattern'ini kullan (MeterRegistry injection)
- Ek: outbox DB schema migration fix (Codex Round 2'de yakalandi)
- Kanit: `TupleSyncOutboxPoller.java`, `OpenFgaCircuitBreaker.java`, commit 611f0ecb

**B5: Compose PERMISSION_SERVICE_BASE_URL** ✅ PR #365 merged
- [x] `docker-compose.yml` variant-service env'ine `PERMISSION_SERVICE_BASE_URL` eklendi
- [x] `docker-compose.yml` core-data-service env'ine ayni satir eklendi
- [x] `RemoteAuthzVersionProvider` default port'u dogrulandi (compose override yeterli)
- Kanit: `docker-compose.yml`, PR #365

**FIX: Runbook + alert text drift** ✅ PR #365 merged
- [x] `RB-zanzibar-canary.md` Stage 1 metnini guncelle: compose default=true ile uyumlu
- [x] Fail-closed aciklamasini duzelt: "check -> false (deny-all)"
- [x] Alert summary'de ayni duzeltme

**Dogrulama:** ✅ Rev 20 housekeeping doctor re-run
- [x] `doctor-zanzibar.sh --quick` PASS (50/50, 0 error, 1 warning — .env.local gitignore)
- [x] Tum servisler icin `mvn test` PASS (PR #365 CI 32/32)
- [x] Frontend `npm test` PASS (PR #365 CI)

---

### DALGA 1: Canary Rollout (Rev 22 synthetic)

**On kosul:** Dalga 0 tamamlandi (✅). Stage 2+ icin gercek synthetic sinyali
uretilmesi gerekli (staging'de kullanici yok → k6 + restricted-probe scheduled).
STORY-0319 Stage 3 audit checklist item; Vault prod seal alt-story'e ayrilir.

**Canary Asamalari (RB-zanzibar-canary runbook rev 22 update bekler):**

| Asama | Gun | Durum | Bayraklar | Basari Kriteri (Rev 22, CNS-003 uzlasisi) |
|-------|-----|-------|-----------|-------------------------------------------|
| Stage 1: Deploy | 2026-04-15 | ✅ **TAMAM** | Compose default (true) | 22 container healthy, zanzibar endpoints 200 |
| Stage 2: Synthetic Canary | 30-60 dk | ⏸ Siradaki | ON + k6 persona matrix + probe scheduled | **5 persona** (super-admin/read-only/restricted/multi-role+DENY/scope-less), **read+write path**, **authz metric ZORUNLU** (opsiyonel degil), `authz_decisions_total` >= 1000, `deny_rate` gercek deger, CB state CLOSED tum servislerde, outbox pending/failed drain, **cold+warm cache 2 faz ayri raporlanir** |
| Stage 3: **Synthetic Canary Evidence PASS** | Stage 2 sonrasi | ⏸ Blocked | ON tum | Statik doktor DEGIL — uretilmis metric + drift kaniti: doctor full + smoke yesil + 5 persona probe PASS + authz metric esikleri + outbox drift guard + CB closed + cold/warm raporlar + STORY-0319 audit |

**Rev 22 tanim degisikligi gerekcesi (CNS-003 uzlasisi):**

Staging'de gercek kullanici trafigi YOK → eski "Stage 2: 2-4 gun pencere"
metric'leri hic hareket ettirmiyor → her gun "baslat" deniyor, asla tamamlaniyor.
Yeni tanim: k6 persona matrix + restricted-probe ile **synthetic load uretilir**,
metric'ler gercekten canlanir, **Evidence PASS** (uretilmis artefact) ile
PASS/FAIL deterministik olur.

**Onemli not (Codex):** Synthetic canary gercek prod trafigini TAM simule etmez.
Eksik kalan: gercek kullanici dagilimi, multi-role+DENY cakismalari, scope
cardinality, cache eviction, tuple write churn, Keycloak token/session variant,
p99/p999 tail latency. Bu nedenle prod'a cikis icin ileride prod-trafigi bazli
canary story'si (post-STORY-0319) gerekecek.

**On kosul altyapi kusurlari (bu session'da tespit edildi, PR-ready degil):**
- `backend/scripts/ci/canary/zanzibar-guardrails.json` parse edilmiyor
  (`allowed="false"` escape eksik) — fix gerekli
- `backend/scripts/ci/canary/guardrail-check.mjs` authz metric'lerini OPSIYONEL
  tutuyor; canary modunda ZORUNLU yapilmali
- `k6-zanzibar-check.js` persona matrix + cold/warm + write-path gerektirir

**Stage 1 dry-run notu (2026-04-15):**

Stack 22 container healthy, `/api/v1/authz/version` 200, `/api/v1/authz/explain` 200,
`/realms/serban` 200. Deploy altyapisi dogrulandi.

ANCAK: Staging `SPRING_PROFILES_ACTIVE=local,docker` profilde calisiyor → `SecurityConfigLocal permitAll`
aktif → JWT dogrulamasi yok → `POST /authz/check` token'siz 200 dondu → **deny rate metric'i anlamsiz**
(CNS-20260415-002 verdict). Stage 2'de canary guardrail sinyali gercek deger icin STORY-0319 gerekli.

Bilinen minor: `/api/v1/users/actuator/health` gateway uzerinden 500 (local profile actuator secured).
Dogrudan user-service `:8089/actuator/health` 200. Post-deploy-health-check'i etkilerse ayri fix.

**Ek guardrail'ler (Codex onerisi):**
- [ ] `/authz/me` latency + error rate
- [ ] `tuple_sync_outbox_pending` + `oldest_age`
- [ ] `openfga_up`, `permission_service_up`
- [ ] Object-level `/authz/check` deny senaryosu restricted probe'a ekle
- [ ] Scope/RLS deny senaryosu restricted probe'a ekle

**Ciktilar:**
- [ ] Canary 48h stable raporu
- [ ] doctor-zanzibar.sh runtime (B bolumu) PASS
- [ ] Restricted smoke user deny senaryosu PASS

---

### DALGA 2: Explain UX Polish (PROD-CANDIDATE / E2E pending, 2026-04-15)

**Statu (CNS-003 uzlasisi):** Implementation complete, merge-ready. **"Prod-ready"
degil** — Playwright E2E (gercek login + /access navigate + modal interact +
i18n/pseudo layout dogrulamasi) release gate'inin blocker'i. STORY-0319 sonrasi
gercek backend'de E2E smoke zorunlu.

**Tamamlanan:**
- [x] 403 sayfasinda "Neden erisiemiyorum?" butonu + useExplainPermission hook + i18n (Faz 3)
- [x] Backend `/v1/authz/explain` (permission-service + core-data)
- [x] `/authz/explain` route sahipligini birlestir (Dalga 0 B1 ile tek canonical: permission-service)
- [x] **ExplainPermissionModal + RoleDrawer inline "?" butonu (PR #394, 5241b6e4)**:
      3 permission tipi (module/action/report), auto-fetch on open, 5 reason badge
      (ALLOWED/NO_ROLE/DENIED_BY_ROLE/NO_SCOPE/NO_PERMISSION), detay tablosu
      (role, grant type, user roles), `data-testid` pattern, a11y aria-label/title
- [x] i18n tr + en: 13 yeni `access.explainModal.*` anahtari

**Rev 22 ek tamamlamalar (PR #396, 7b43b87a):**
- [x] ZanzibarGate `disabledReason` prop + tooltip (span title + aria-disabled)
- [x] ExplainPermissionModal Vitest unit test (DENY senaryosu + open=false smoke)
- [x] pnpm audit CI soften (pre-existing blocker; OSV+secrets+policy gate'leri yeterli)

**Ayri story (deferred, Dalga 2 scope disi):**
- Playwright E2E explain modal full senaryo (login + /access navigate + modal interact)
- de/es/pseudo i18n completeness (Phase 3 drawer keys de eksik — ayri `i18n-completeness`)

---

### DALGA 3: Legacy Temizlik (Rev 22: PR6a/b merge + PR6c-0 prep, 2026-04-15 aksam)

**PR Sirasi (TB-11) + rev 22 durumu (CNS-003 uzlasisi):**

| PR | Kapsam | Durum | Not |
|----|--------|-------|-----|
| PR6a (#397) | auth-service AuthService: permissions Set.of() + admin fallback removed | ▶ open | CNS-003 Codex onay: synthetic canary oncesi merge; baseline yeni paket uzerinde alinir |
| PR6b (#398) | JwtTokenProvider 'permissions' claim kaldirildi | ▶ open | Downstream zero-impact (A17 zaten PASS) |
| **PR6c-0 (#399)** | report-service PermissionServiceClient + Mock `@Deprecated` annotation + test/doctor warning + follow-up story linki | ▶ open | **"prep complete"**, Dalga 3 "complete" DEGIL |
| **PR6c-1** (ayri story) | report-service 3 controller (Dashboard/Report/Export) `/authz/me` HTTP → `OpenFgaAuthzService.check()` migration + regression test | ⏸ **Blocking Dalga 3 complete** | Consumer refactor zorunlu (C-008); `/authz/me` hot path'ten kalkmadan Dalga 3 done olamaz |
| Follow-up | PermissionCodes sil + tuketici migration (~20 dosya) | ⏸ PR6 ileri | Doctor drift check eklenmeli |
| Follow-up | user-service rename (F3) | Tamam | Dead code silindi (TB-11 §2) |

**Doctrine esnetme kaydi (2026-04-15, CNS-20260415-003 uzlasisi):**

Eski doctrine (rev 20): PR6a post-canary icin ertelendi.

Yeni doctrine (rev 22): **Eski 48h fiziksel canary sinyal uretmedigi icin** PR6a/b
merge edilebilir. Ancak "canary etkilenmez" iddiasi DUSURULDU — PR6a/b auth bootstrap
degistirdigi icin synthetic canary baseline'i bu paket uzerinde yeniden alinir.

**Dogru sira (CNS-003 Codex uzlasisi):**
1. PR6a (#397) merge
2. PR6b (#398) merge
3. PR6c-0 (#399) merge — **@Deprecated annotation only**
4. Synthetic canary calistirilir — **yeni baseline** (PR6a/b uzerinde)
5. PR6c-1 ayri story: consumer refactor + regression test
6. Dalga 3 "complete" PR6c-1 sonrasi ilan edilir

Gerekce kullanici baskisi DEGIL; eski 48h tabanli canary sinyal uretmedigi icin
PR6a/b'yi bekletmek teknik faydaya donusmuyordu.

---

### DALGA 4: Backlog

| # | Is | Oncelik |
|---|-----|---------|
| 1 | Scope reconciliation (scheduled + on-demand hibrit) | ORTA |
| 2 | OpenFGA model version management | ORTA |
| 3 | k6 CI workflow (regression gate) | ORTA |
| 4 | Circuit breaker for writes | DUSUK |
| 5 | EP-016 enforcement rule (legacy auth import ban) | DUSUK |
| 6 | JaCoCo coverage | DUSUK |

**Rev 22 Yeni Backlog (CNS-003 Codex onerisi, uzlasi sonrasi):**

| # | Is | Oncelik | Scope |
|---|-----|---------|-------|
| 7 | **zanzibar-guardrails.json parse fix** | YUKSEK | `allowed="false"` escape + PromQL dogru kactis; `guardrail-check.mjs` tuketilebilir yap |
| 8 | **guardrail-check.mjs authz metric ZORUNLU** | YUKSEK | Zanzibar canary modunda authz metric'leri opsiyonel yerine zorunlu |
| 9 | **k6-zanzibar-check.js persona matrix** | YUKSEK | 5 persona + cold/warm cache 2 faz + write-path tuple sync + restricted probe entegrasyonu |
| 10 | **STORY-0319 scope dar + Vault KMS ayri story** | YUKSEK | STORY-0319 ad "staging prod-like application profile"; "Vault KMS auto-unseal excluded" acceptance'ta |
| 11 | **PR6c-1 report-service consumer refactor** | YUKSEK (Dalga 3 blocker) | 3 controller `/authz/me` HTTP → `OpenFgaAuthzService.check()` + regression test |
| 12 | **Playwright E2E explain modal + ZanzibarGate tooltip** | ORTA (Dalga 2 release gate) | STORY-0319 sonrasi: gercek login + /access nav + modal interact + i18n/pseudo dogrulama |
| 13 | **Vault prod seal KMS story** | ORTA (Dalga 1 Stage 3 icin) | KMS auto-unseal + IAM + break-glass + runbook (STORY-0319'dan ayri) |
| 14 | **de/es/pseudo i18n completeness** | DUSUK | Phase 3 + Phase 4 keys eksik tum dillerde; ayri `i18n-completeness` story |

**Scope Reconciliation Stratejisi (Codex onerisi, karar bekliyor):**
- Hibrit: saatlik incremental + gece full sweep + incident icin manuel tetikleme
- Yer: sadece permission-service (C-005 hub kisiti)
- Hedef: drift detect + repair + metric + audit

---

## 3. BAGIMLILIK GRAFIGI

```
DALGA 0 (Readiness, 2-3 gun)
  ├─ B1: /authz/check route tasi
  ├─ B2: JWT fallback mitigasyonu
  ├─ B3: Deny rate metric duzelt
  ├─ B4: Phantom alert metric ekle
  ├─ B5: Compose base URL ekle
  └─ FIX: Runbook text
         │
         ▼
DALGA 1 (Canary, 3-5 gun)
         │
    ┌────┴────┐
    ▼         ▼
DALGA 2    DALGA 3
(Explain)  (Legacy)
    └────┬────┘
         ▼
      DALGA 4
     (Backlog)
```

---

## 4. RISK MATRISI

| Risk | Olasilik | Etki | Mitigasyon |
|------|----------|------|------------|
| B1 route tasimada regression | ORTA | YUKSEK | mvn test + Playwright E2E |
| B2 fallback degisikligi mevcut dev flow'u bozar | DUSUK | ORTA | local profilde farkli davranis (permitAll) |
| Canary'de yuksek deny rate | ORTA | YUKSEK | Duzeltilmis metric + flag rollback |
| Outbox backlog | DUSUK | ORTA | Yeni metric + dead letter monitoring |
| Legacy temizlikte regression | ORTA | ORTA | Servis bazli mvn test |

---

## 5. KARAR DURUMU

**8 FINAL karar:** D-001..D-008 (registry rev 4). D-008 (2026-04-14) ADR-0013 ile formalize — Permission-Service Hub Role.
**8 Constraint:** C-001..C-008 (registry rev 4). C-008 (2026-04-14): servisler check/listObjects icin OpenFgaAuthzService kullanir, permission-service'e HTTP cagrisi yapmaz.

**Dalga 0'da alinan kararlar:**
- [x] **B1 ALINDI (2026-04-14, PR #365):** `/authz/check` + `/batch-check` permission-service `AuthorizationControllerV1`'a tasindi; core-data'daki duplicate endpoint kaldirildi. Kanit: commit eaa3d7a1.
- [x] **B2 ALINDI (2026-04-14, PR #365):** Path-aware 503 response uygulandi (tum hata path'lerinde); variant-service cache hatada skip ediyor. Kanit: commit 611f0ecb (Codex Round 2 ilk fix'in yetersizligini yakaladi).

**2026-04-15 alinan kararlar (Rev 21):**
- [x] **Smoke izolasyonu (PR #392, CNS-20260415-002 Q1):** Zanzibar Smoke Test workflow'u
      canli `platform` project ile ayni compose'da `down --volumes` yapiyordu, canli stack
      siliniyordu. Fix: izole `COMPOSE_PROJECT_NAME=platform-smoke-${RUN_ID}` + auto-trigger
      disable + doctor A21/A22 drift guard. Re-enable kriterleri RB-smoke-isolation.md.
- [x] **RLS fresh-boot (PR #393):** 03/04/05-rls-phase1-*.sql'de PR #381 pattern'i (DO $$ +
      IF EXISTS) uygulandi. 4 tablo fresh volume'da psql exit 3 vermeyecek sekilde idempotent.
- [x] **Dalga 2 ana UI (PR #394):** ExplainPermissionModal + RoleDrawer entegrasyonu; Faz 4
      eksigi kapatildi. Canli dogrulama: bundle'da `explainModal` string'i mevcut, endpoint 200.
- [x] **Stage 1 dry-run ilan (CNS-20260415-002 Q4 onerisi, hibrit path):** Deploy altyapi
      healthy + zanzibar endpoints 200 dogrulandi; gercek canary Stage 2 STORY-0319 sonrasi.

**2026-04-16 alinan kararlar (Rev 23):**
- [x] **Dalga 1 Stage 2 altyapi — PR-1 MVP (PR #406, CNS-20260416-001 tur 1-3):** 5 persona
      matrix k6 runner + idempotent seed script (tek-shot `/authz/users/{id}/assignments`
      kullanir, permissionCode'suz) + orchestration wrapper + guardrail CB + phase flag.
      **Backend fix**: `PermissionService.syncTuplesToOpenFga` + `hasPermission` granule-only
      role NPE guard (legacy permission entity null tolere edilir). Kanit: commit c541fb50.
- [x] **Dalga 1 Stage 2 altyapi — PR-2 Polish (PR #408, CNS-20260416-002 tur 4-5):**
      10-step wrapper (cold+warm iki ayri metrics pull + iki ayri guardrail-check),
      v2 ops metric enforcement (`authz_me_p95`, outbox_*, openfga_up) `--require-v2-ops`
      flag ile Evidence PASS strict, `zanzibar-guardrails.json` v1→v2 (11 threshold + 11
      PromQL library), probe `canary-load` dedicated client, runbook full rewrite.
      Kanit: commit 377b3539.
- [x] **Interactive Codex MCP doctrine (2026-04-16 direktif):** Her tamamlanan is
      paketi Codex review zorunlu; ping-pong default; APPROVE olmadan commit/push yok.
      Memory: `feedback_codex_review_on_completion.md`, `feedback_codex_pending_parallel_work.md`.
- [x] **Scope reconciliation stratejisi ertelendi:** Dalga 4 backlog; mevcut
      TupleSyncOutboxPoller + deny-wins TupleSyncService yeterli synthetic canary icin.

**Bekleyen karar (Dalga 4):**
- [ ] Scope reconciliation stratejisi: scheduled + on-demand hibrit (Codex onerisi, Rev 22 backlog #1)
- [ ] `zanzibar-guardrails.json` config loader + consistency test (PR-3 backlog, Rev 23)
- [ ] `pull-grafana-metrics.mjs` query_range + phase window (PR-3 backlog, Rev 23 — Codex "instant scalar + window template yeterli" dedi, ertelendi)

**Post-canary karar (FAZ B / PR6-prereq, CNS-20260414-003 Q3):**
- [x] auth-service login response DTO `permissions: Set<String>` alani — `Set.of()` kompat UYGULANDI (PR #397/398 merged).
- [x] TB-11 scope bolme: PR6a (auth-service only) -> PR6b (JWT claim + downstream) -> PR6c-0 (report-service @Deprecated prep) UYGULANDI.
- [ ] **PR6c-1** (Dalga 3 complete blocker): report-service Dashboard/Report/Export controller `/authz/me` HTTP → `OpenFgaAuthzService.check()` behavior-preserving refactor + regression test. Ayri story, STORY-0319 sonrasi.

---

## 6. ISTISARE KAYDI

| ID | Tarih | Katilimcilar | Token | Konu |
|----|-------|-------------|-------|------|
| CNS-20260413-001 | 2026-04-13 | Claude + Codex | 150K | Rev 17 gap analysis |
| CNS-20260414-001 | 2026-04-14 | Claude + Codex | 482K | Rev 18 dogrulama, 6 bulgu |
| CNS-20260414-002 | 2026-04-14 | Claude + Codex | 212K | Round 2: bulgu dogrulama, uzlasi |
| CNS-20260414-003 | 2026-04-14 | Claude + Codex (gpt-5.3) | 164K | Rev 20 housekeeping + FAZ B timing — APPROVE_WITH_CHANGES |
| CNS-20260415-002 | 2026-04-15 | Claude + Codex | 158K | Canli 502 tani + Yon 2 timing — APPROVE_WITH_CHANGES (smoke cleanup root cause; "(b)+containment" yolu; PR6a post-canary enforced; Yon 2 lokal baslat + canli validation ayri lane) |
| CNS-20260415-003 | 2026-04-15 | Claude + Codex | 158K | Master plan rev 22 synthetic canary doctrine + Dalga 3 esnetme — APPROVE_WITH_CHANGES (5/5 madde uzlasi) |
| CNS-20260415-004 | 2026-04-15 | Claude + Codex | 191K | k6 persona matrix tasarim — APPROVE_WITH_CHANGES (5 persona tablosu + 3 altyapi fix PR #402/403/404) |
| CNS-20260416-001 | 2026-04-16 | Claude + Codex | ~500K (3 tur) | PR-1 MVP review — BLOCK → BLOCK → APPROVE_WITH_CHANGES. Bulgular: B1 permissionCode NPE, B2 local permitAll mismatch, B3 granule-only NPE, B4 guardrail payload, M1/M2/M3, Q3/Q5. 9 fix uygulandi (PR #406). Thread `019d92b5`. |
| CNS-20260416-002 | 2026-04-16 | Claude + Codex | ~300K (2 tur) | PR-2 Polish review — BLOCK → APPROVE_WITH_CHANGES. Bulgular: B5 wrapper I/O broken, B6 v2 ops metric silent skip. 2 fix uygulandi (PR #408). Thread `019d92b5` (ayni thread devam). |

---

## 7. DOGRULAMA ARACLARI

| Arac | Komut / Yol |
|------|-------------|
| Doctor (quick) | `backend/scripts/doctor-zanzibar.sh --quick` |
| Doctor (full) | `backend/scripts/doctor-zanzibar.sh` |
| Canary guardrails | `backend/scripts/ci/canary/zanzibar-guardrails.json` |
| Restricted probe | `backend/scripts/ci/canary/zanzibar-restricted-probe.sh` |
| Playwright E2E | `web/tests/playwright/authz.zanzibar.spec.ts` |
| Legacy envanter | `docs/04-operations/TB-11-legacy-permission-inventory.md` |
| Canary runbook | `docs/04-operations/RUNBOOKS/RB-zanzibar-canary.md` |
| k6 perf | `backend/scripts/perf/k6-zanzibar-check.js` |
| ADR-0013 (Hub role) | `docs/02-architecture/services/ops/ADR/ADR-0013-permission-service-hub-role.md` |
| Session handoff (Dalga 0) | `.claude/plans/session-handoff-20260414.md` |
| Codex consultation (Rev 20) | `.autopilot-tmp/CNS-20260414-003-consultation.md` / `*-response.md` |

---

## 8. SESSION BASLANGIC REHBERI (Rev 23, 2026-04-17 sabah)

```
1. Plan oku: .claude/plans/zanzibar-master-plan.md (Rev 23)
2. Son handoff oku: .claude/plans/session-handoff-20260416-*.md
3. ✅ Dalga 0: Canary Readiness — PR #365
4. ✅ Dalga 2: Explain UX — PR #394, #396 (prod-candidate, E2E pending)
5. ✅ Dalga 3 prep: PR #397/398/399 (PR6a/b + PR6c-0)
6. ✅ Dalga 1 Stage 1: deploy dry-run
7. ✅ **Dalga 1 Stage 2 altyapi: PR #406 (MVP) + PR #408 (polish) — 2026-04-16**

▶ **P0 SIRADAKI ADIM: STORY-0319** (staging prod-like profile)
   - Dosya: docs/03-delivery/STORIES/STORY-0319-staging-prod-profile-migration.md
   - Risk: HIGH. Fresh mind + monitoring ile yap (gece YAPILMAZ).
   - Kapsam: 7 servis SPRING_PROFILES_ACTIVE=prod,docker + GHCR image pull
     credentials + Keycloak issuer hostname + nginx WEB_GATEWAY_UPSTREAM
     DEPLOY_ENV-aware + doctor-infra.sh profile drift check + canary-load
     Keycloak client realm export'a ekle (PR-2 runbook §5.6 prereq).
   - **Vault prod seal KMS AYRI STORY** (backlog #13, Dalga 1 Stage 3 icin).
   - Gate: 8 kriter PASS (STORY-0319 acceptance).

▶ P1 Dalga 1 Stage 2 synthetic canary RUN (STORY-0319 sonrasi):
   - bash backend/scripts/perf/run-zanzibar-canary.sh
   - 10-step: setup → probe pre → k6 cold → metrics cold → k6 warm →
     metrics warm → probe post → guardrail cold → guardrail warm
   - Output: .cache/reports/zanzibar-canary/<RUN_ID>/
   - Evidence PASS iff cold+warm guardrail 0 violation

▶ P2 Dalga 1 Stage 3 Evidence PASS:
   - Audit checklist (RB-zanzibar-canary.md §3.3):
     doctor-full + smoke-yeşil + 5 persona probe + authz_decisions>=1000 +
     CB CLOSED + outbox drift guard + cold/warm raporlar + STORY-0319 audit

▶ P3 Dalga 3 complete — PR6c-1 (Dalga 3 blocker):
   - report-service Dashboard/Report/Export controller
     `/authz/me` HTTP → `OpenFgaAuthzService.check()` behavior-preserving
   - Regression test + mvn test + deploy-backend dogrulama

▶ P4 Dalga 2 release gate — Playwright E2E explain modal:
   - STORY-0319 sonrasi (auth-enabled staging gerekli)
   - Gercek login + /access navigate + modal interact + i18n/pseudo

▶ Dalga 4 Backlog (onceligi siraya gore):
   - Scope reconciliation (scheduled + on-demand hibrit, Codex tasarim bekliyor)
   - Vault KMS prod seal story (Stage 3 blocker)
   - zanzibar-guardrails.json config loader (Rev 23 PR-3)
   - pull-grafana-metrics query_range + phase window (Rev 23 PR-3)
   - OpenFGA model version management
   - k6 CI workflow (regression gate)
   - de/es/pseudo i18n completeness

**Bu session (2026-04-16 gece) yasananlar:**
- 22:00 session basladi, Rev 22 baglam alindi
- 22:30 PR-1 planlama + keşif + worktree
- 23:30 PR-1 MVP commit (Codex tur 1 → tur 2 → tur 3)
- 00:00 PR #406 merged (c541fb50), deploy success, canli 200
- 00:30 PR-2 polish worktree + Codex tur 4 → tur 5
- 01:00 PR #408 acildi, 3 docs fix (section heading + numbering + strictness)
- 01:30 PR #408 rebase + merged (377b3539), deploy success
- 01:45 Master plan Rev 23 guncellemesi (bu commit)
```

### Kanonik Referanslar (Rev 23 onboarding icin)

- **Master plan:** `.claude/plans/zanzibar-master-plan.md` (Rev 23, bu dosya)
- **Son handoff:** `.claude/plans/session-handoff-20260416-*.md`
- **Decision registry:** `decisions/topics/zanzibar-openfga.v1.json` (D-001..D-008 FINAL, C-001..C-008)
- **ADR-0013:** `docs/02-architecture/services/ops/ADR/ADR-0013-permission-service-hub-role.md`
- **TB-11:** `docs/04-operations/TB-11-legacy-permission-inventory.md`
- **Canary runbook:** `docs/04-operations/RUNBOOKS/RB-zanzibar-canary.md` (8 bolum, Rev 22 synthetic canary + 5 persona + cold/warm + 6 ariza senaryosu)
- **Guardrail thresholds + PromQL library:** `backend/scripts/ci/canary/zanzibar-guardrails.json` (v2, 11 threshold + 11 query)
- **Orchestration wrapper:** `backend/scripts/perf/run-zanzibar-canary.sh` (10-step)
- **k6 persona script:** `backend/scripts/perf/k6-zanzibar-check.js`
- **Setup script:** `backend/scripts/ci/canary/zanzibar-canary-setup.mjs`
- **Guardrail checker:** `backend/scripts/ci/canary/guardrail-check.mjs` (v2 ops metric enforcement, --require-v2-ops flag)
- **Metric collector:** `backend/scripts/ci/canary/pull-grafana-metrics.mjs` (phase flag, 5 optional v2 metric)
- **Restricted probe:** `backend/scripts/ci/canary/zanzibar-restricted-probe.sh` (canary-load client)
- **Doctor:** `backend/scripts/doctor-zanzibar.sh` (`--quick` 61 check)
- **Memory kurallari:** `~/.claude/projects/-Users-halilkocoglu-Documents-dev/memory/`
  - `feedback_codex_mcp_default.md` (MCP ping-pong default)
  - `feedback_codex_review_on_completion.md` (review zorunlu)
  - `feedback_codex_pending_parallel_work.md` (paralel is)
  - `feedback_compose_management.md`, `feedback_infra_stability.md`, vb.
- **Evidence lokasyonu:** `.cache/reports/zanzibar-canary/<RUN_ID>/` — cold-k6-summary.json, warm-k6-summary.json, prom-cold.json, prom-warm.json, guardrail-cold.log, guardrail-warm.log, setup.log, probe-pre.log, probe-post.log

### Onemli Uyarilar

- **Local smoke ≠ Evidence PASS:** `LOCAL_PERMIT_ALL=1 ESTIMATE_ONLY=1` modu **pre-evidence/calibration** kanitidir. Stage 3 Evidence PASS icin STORY-0319 sonrasi auth-enabled staging'de gercek run gerekli.
- **STORY-0319 fresh mind gerektirir:** 7 servis + GHCR + Vault + nginx + doctor degisikligi. Gece YAPILMAZ. Pazartesi sabah monitoring aktif olarak yapilmali. Rollback plani hazir olmali.
- **Vault KMS = AYRI STORY (#13):** STORY-0319 scope'unda degildir. Prod seal stratejisi (KMS auto-unseal + IAM + break-glass) ayri gun.
- **PR-3 backlog gerekcesi:** `zanzibar-guardrails.json` config loader eksikligi drift riski yaratir (guardrail-check hardcoded); `pull-grafana-metrics query_range` saf cold/warm metric ayrimi icin gereklidir (instant scalar + window template su an yeterli ama prod icin idealsiz). Bu maddeler Stage 2 runnable'i bozmuyor, ertelendi.
