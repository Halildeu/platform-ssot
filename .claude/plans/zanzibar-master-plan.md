# Zanzibar Master Plan — Rev 20 (Post-Dalga 0 Housekeeping)

**Tarih:** 2026-04-14
**Kaynak:** Rev 19 + CNS-20260414-003 (164K token, gpt-5.3-codex) + Claude (Opus 4.6) degerlendirme
**Base:** main @ eaa3d7a1
**Uzlasi:** Dalga 0 tamamlandi (PR #365); FAZ B post-canary'ye ertelendi

---

## 0. REV 19 -> REV 20 DEGISIKLIK OZETI

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
| Explain UX (403 sayfasinda "Neden?" butonu + useExplainPermission + i18n) | Kismi |
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

### DALGA 1: Canary Rollout (3-5 gun)

**On kosul:** Dalga 0 tamamlandi.

**Canary Asamalari (RB-zanzibar-canary runbook):**

| Asama | Gun | Bayraklar | Basari Kriteri |
|-------|-----|-----------|----------------|
| Stage 1: Deploy | Gun 1 | Compose default (true) | Tum container'lar healthy |
| Stage 2: Canary | Gun 2-4 | ON (admin + restricted) | p95 <50ms, error <0.5%, deny <10% |
| Stage 3: Full | Gun 5+ | ON (tum kullanicilar) | 48h stabil, 0 regression |

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

### DALGA 2: Explain UX Polish (2-3 gun, Dalga 1 sonrasi)

**Mevcut (zaten tamamlanan):**
- 403 sayfasinda "Neden erisiemiyorum?" butonu + useExplainPermission hook + i18n (15 anahtar)
- Backend `/v1/authz/explain` (permission-service + core-data)

**Kalan is (Dalga 0 B1 sonrasi netlesecek):**
- [ ] `/authz/explain` route sahipligini birlestir (iki servis -> tek canonical)
- [ ] ExplainDrawer bileseni (mfe-access) — opsiyonel, 403 sayfasi zaten calisiyor
- [ ] ZanzibarGate `disabled` -> explain tooltip
- [ ] Playwright test

---

### DALGA 3: Legacy Temizlik (3-4 gun, Dalga 1 ile paralel calisabilir)

**PR Sirasi (TB-11):**

| PR | Kapsam | Dosya |
|----|--------|-------|
| PR6-prereq | auth-service PermissionServiceClient -> OpenFGA | ~6 dosya |
| PR6 | PermissionCodes sil + tuketici migration | ~20 dosya |
| PR8 | report-service migration | ~3 dosya |

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

**Bekleyen karar (Dalga 4):**
- [ ] Scope reconciliation stratejisi: scheduled + on-demand hibrit (Codex onerisi)

**Post-canary karar (FAZ B / PR6-prereq, CNS-20260414-003 Q3):**
- [ ] auth-service login response DTO `permissions: Set<String>` alani: breaking drop yerine `Set.of()` kompat (frontend `auth.slice.ts` + `LoginPopover.tsx` fallback icin).
- [ ] TB-11 scope bolme: PR6a (auth-service only) -> PR6b (JWT claim + downstream) -> PR6c (report-service). Kanit: Codex Q4 + F3.

---

## 6. ISTISARE KAYDI

| ID | Tarih | Katilimcilar | Token | Konu |
|----|-------|-------------|-------|------|
| CNS-20260413-001 | 2026-04-13 | Claude + Codex | 150K | Rev 17 gap analysis |
| CNS-20260414-001 | 2026-04-14 | Claude + Codex | 482K | Rev 18 dogrulama, 6 bulgu |
| CNS-20260414-002 | 2026-04-14 | Claude + Codex | 212K | Round 2: bulgu dogrulama, uzlasi |
| CNS-20260414-003 | 2026-04-14 | Claude + Codex (gpt-5.3) | 164K | Rev 20 housekeeping + FAZ B timing — APPROVE_WITH_CHANGES |

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

## 8. SESSION BASLANGIC REHBERI

```
1. Plan oku: .claude/plans/zanzibar-master-plan.md (rev 20)
2. ✅ Dalga 0: Canary Readiness — TAMAMLANDI (PR #365, eaa3d7a1)
   a. [x] B1: /authz/check -> permission-service'e tasindi
   b. [x] B2: JWT fallback -> path-aware 503 + cache skip
   c. [x] B3: authz_decisions_total Micrometer counter live
   d. [x] B4: outbox_failed + circuit_breaker metric + schema fix
   e. [x] B5: compose PERMISSION_SERVICE_BASE_URL eklendi
   f. [x] FIX: runbook text + fail-closed aciklamasi
   g. [x] Dogrulama: doctor 50/50 + mvn test + npm test PASS
3. ▶ Dalga 1: Canary rollout (3 asamali, RB-zanzibar-canary) — SIRADAKI ADIM
   - Manuel dispatch: `gh workflow run deploy-backend.yml`
   - 48h monitor penceresinde auth-service donuk (FAZ B ertelendi)
4. Dalga 2: Explain UX polish
5. Dalga 3: Legacy temizlik — FAZ B revize (CNS-20260414-003)
   - PR6a: auth-service only (Set.of() kompat, post-canary)
   - PR6b: JWT claim + downstream consumer cleanup
   - PR6c: report-service legacy HTTP client
   - PR6-skip: user-service rename only (F3)
6. Dalga 4: Backlog (reconciliation, model versioning, k6 CI, doctor 51-52)
```
