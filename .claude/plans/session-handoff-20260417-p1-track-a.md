# Session Handoff — 2026-04-17 P1 Track A (4/7 DONE) + Admin Bootstrap

**Zincir handoff'ları:**
- `session-handoff-20260417-zanzibar-TAM-KAPANIS.md` (Dalga 2 DONE, 9 PR)
- `session-handoff-20260417-p1-track-a.md` ← **bu dosya**

**Session süresi:** ~6 saat (sabah TAM KAPANIŞ sonrası devam + öğleden sonra Track A). Kapsam: P1.4/P1.3/P1.2 cleanup + admin super admin kalıcı seed + P1 Track A (P1.1, P1.5, P1.6, P1.7).

---

## 1. Bu Session'da Merged — 7 PR

| PR | SHA | Konu | Kategori |
|---|---|---|---|
| **#438** | `1a32091a` | fix(compose): prod gateway CORS allowed origins env override | P1.4 |
| **#439** | `5be12c5c` | fix(permission-service): authz_sync_version UPDATE schema-qualify | P1.3 |
| **#440** | `489c371b` | fix(permission-service): canonical MODULE key via catalog | P1.2 |
| **#441** | `72cb2811` | feat(permission-service): admin bootstrap — full grants + OpenFGA admin tuple | Bonus |
| **#442** | `9abfd701` | fix(mfe): ExplainPermissionModal infinite re-fetch loop + E2E terminal state | P1.1 |
| **#443** | `c43b088f` | fix(api-gateway): OPTIONS preflight 403 cross-origin prod CorsWebFilter | P1.5 |
| **#444** | `3f860805` | feat(mfe-access): RoleDrawer member autocomplete — auto-add on selection | P1.7 |

**Closed (no-code):**
- PR #431 (superseded by #434)
- P1.6 workaround + P2 defer (memory doc: `feedback_canary_admin_kc_login_deferred.md`)

**Staging ops fixes (PR'sız, direct):**
- OpenFGA `user:1201 admin organization:default` tuple write
- DB role_permissions 3 yeni grant (PURCHASE VIEW, WAREHOUSE VIEW, DELETE_PO MANAGE)
- `authz_sync_version` 6→7→8 (V12 migration sonrası)
- KC admin@example.com password reset → `AdminPass2026`
- canary-admin KC user delete+recreate (fix deneme, başarısız → P2 defer)
- canary-admin realm admin role kaldırma (partial)

---

## 2. Codex İstişareleri — 2 Thread, 20+ Tur

| Thread | Kapsam | Verdict zinciri |
|---|---|---|
| `019d9a6c` | P1.4 + P1.3 + P1.2 | APPROVE_WITH_CHANGES × 2 → APPROVE (scope narrowed) |
| `019d9ab7` | PR #441 admin bootstrap | APPROVE_WITH_CHANGES × 2 → APPROVE (isManageLike parity + UPSERT + Q1 A Initializer) |
| `019d9b43` | P1.1 + P1.5 + P1.6 + P1.7 | APPROVE × 3 (P1.1, P1.5, P1.6 decision) + APPROVE_WITH_CHANGES → BLOCK → APPROVE (P1.7 userSearchValue fix) |

**Toplam:** ~3 thread, ~20 tur ping-pong. Tüm PR'lar Codex onaylı merge.

---

## 3. P1 Backlog Durumu

### Bitenler (4/7 Track A + P1.2/P1.3/P1.4 + admin bootstrap)

| # | İş | Status | PR |
|---|---|:-:|---|
| P1.1 | Spec loading state tolerance | ✅ | #442 |
| P1.2 | Backend canonical MODULE key | ✅ | #440 |
| P1.3 | Outbox `{h-schema}` fix | ✅ | #439 |
| P1.4 | Prod compose CORS env | ✅ | #438 |
| P1.5 | OPTIONS preflight 403 | ✅ | #443 |
| **P1.6** | canary-admin KC NPE | **⚠️ B workaround** | memory |
| P1.7 | RoleDrawer autocomplete + auto-add | ✅ | #444 |

### Kalanlar (3 story, ~14-20h)

| # | İş | Tahmin | Öncelik | Kritik yollar |
|---|---|:-:|:-:|---|
| **P1.8** | Canonical service-token path | 4-6h | H | auth-service mint policy + user-service non-local JWT converter + `zanzibar-canary-setup.mjs` token split |
| **P1.9** | NO_SCOPE UI modal refactor | 6-8h | M | `useExplainPermission` scopeType + scopeRefId signature; modal UI |
| **P1.10** | Vault KMS auto-unseal | 4-6h | H | Cloud KMS seçim + IAM + break-glass runbook + prod Vault re-seal |

---

## 4. P1.6 Detayı — canary-admin KC Deferred

**Root cause 1 (identify edildi):** canary-admin (user 1204) KC user'ında `admin` realm role var → KC authentication flow `resolve_required_actions` trigger ediyor ("Account is not fully set up").

**Denenen fix'ler:**
1. `admin` realm role kaldırıldı ✅
2. `requiredActions=[]`, `emailVerified=true`, `enabled=true` verified
3. Password reset (temporary=false)
4. User delete + recreate (clean state, no realm roles)

Hâlâ fail. Deep debug (KC authentication flow executor chain audit, realm flow dump, cache flush) 1-2h ek risk. Codex verdict **B workaround** — admin@example.com (user 1201) super admin path zaten çalışıyor (PR #441 sonrası), canary-admin biricikliği release gate için hayati değil.

**P2 backlog entry:** "canary-admin KC authentication flow deep debug"

**Memory:** `feedback_canary_admin_kc_login_deferred.md`

---

## 5. Teknik Notlar + Öğrenmeler

### `ExplainPermissionModal` Infinite Loop (P1.1)

Root cause: `httpPost: (url, body) => api.post(url, body)` inline arrow her render'da yeni ref → `useCallback` dep → `explain` identity değişir → useEffect re-fire → infinite re-fetch.

**Fix pattern:** Stable reference via `React.useCallback((url, body) => api.post(url, body), [])`. Aynı pattern `UnauthorizedPage.ui.tsx` içinde de normalize edildi (loop yok ama kırılgan).

### Prod CORS Preflight (P1.5)

Spring Cloud Gateway `globalcors` property config `SimpleUrlHandlerMapping` üzerinden — `add-to-simple-url-handler-mapping=true` alone does not fix preflight in prod. `@Order(HIGHEST_PRECEDENCE)` `CorsWebFilter` bean gerek. `LocalDevCorsConfig` vardı, `ProdCorsConfig` eksikti.

`allowed-headers=*` + `allowCredentials=true` CORS spec ihlali (Chrome 104+ reject). Explicit 12-header list (web bundle kanıtlı): Authorization, Content-Type, Accept, Cache-Control, X-Trace-Id, X-Correlation-Id, traceparent, tracestate, X-Company-Id, X-Project-Id, X-Warehouse-Id, X-Internal-Api-Key.

### Canonical Module Key Drift (P1.2)

`AccessRoleService.deriveModuleIdentity()` sadece `USERS` özel case, diğerleri `normalizeModuleKey(label)` Turkish locale'de `"Raporlama"` → `"RAPORLAMA"`. Fix: `RolePermissionGranuleDefaults.canonicalModuleKey()` public helper (code→MODULE mapping) + `PermissionCatalogService.getModuleLabel()` single source.

Non-MODULE granule parent derivation (`reports.HR_REPORTS` → `USER_MANAGEMENT`) out of scope — `PermissionCatalogService.REPORTS` asymmetric parent assignments simple prefix rule'a sığmıyor. P2 backlog.

### Autocomplete Controlled Input (P1.7)

`value={selectedUser?.value ?? ''}` pattern typing sırasında matched=null → input clear. Ayrı `userSearchValue` state gerek. Codex BLOCK'la yakaladı.

---

## 6. Metrikler

| | |
|---|---|
| Session süresi | ~6 saat |
| PR merged | **7** (#438 #439 #440 #441 #442 #443 #444) |
| CI check çalıştırma | 150+ |
| Codex ping-pong tur | **20+** (3 thread) |
| Staging deploy | **5** (deploy-backend stage × 3 + deploy-web × 2, hepsi SUCCESS) |
| P1 backlog | 4/7 Track A DONE + P1.2/P1.3/P1.4 + 1 workaround |
| Memory doc | 2 yeni (`feedback_canary_admin_kc_login_deferred.md` + `project_zanzibar_status.md` update) |

---

## 7. Yarınki Session Başlangıç Rehberi

```bash
# 1. Memory + plan
cat ~/.claude/projects/-Users-halilkocoglu-Documents-dev/memory/project_zanzibar_status.md
cat .claude/plans/session-handoff-20260417-p1-track-a.md             # bu dosya

# 2. Canlı sağlık
curl -sI https://ai.acik.com/ | head -1
curl -sI https://ai.acik.com/api/v1/authz/version | head -1           # 401 JWT zorunlu

# 3. P1.5 kanıt (cross-origin preflight)
curl -sI -X OPTIONS -H 'Origin: https://ai.acik.com' -H 'Access-Control-Request-Method: GET' \
  https://ai.acik.com/api/v1/authz/me | head -3   # HTTP 200 + ACAO + ACAC

# 4. admin@example.com super admin kanıt
TOKEN=$(ssh staging-sw 'curl -sf -X POST "http://localhost:8081/realms/serban/protocol/openid-connect/token" \
  -d "client_id=canary-load" -d "client_secret=canary-load-secret-2026" \
  -d "grant_type=password" -d "username=admin@example.com" -d "password=AdminPass2026" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)[\"access_token\"])"')
curl -s -H "Authorization: Bearer $TOKEN" -H "Origin: https://ai.acik.com" \
  https://ai.acik.com/api/v1/authz/me | python3 -m json.tool | head -10

# 5. P1.8/P1.9/P1.10 sıradaki (her biri dedike session)
```

---

## 8. Öncelik Matrisi — Yarın için

**İlk dalga (H öncelik, prod impact):**
- **P1.10** Vault KMS (prod deploy blocker) — Cloud KMS seçim + IAM + break-glass + runbook
- **P1.8** Canonical service-token (oncall yükü, canary automation unblocker)

**İkinci dalga (M öncelik, UX):**
- **P1.9** NO_SCOPE UI modal refactor

**Önerim:** P1.10 önce (prod readiness). P1.8 ikinci (canary otomasyonu). P1.9 en son (UX, acil değil).

---

## 9. Tek Bakışta Özet

| Konu | Durum |
|---|---|
| Canlı (ai.acik.com) | ✅ Stabil |
| Dalga 0 + 1 + 2 + 3 | ✅ |
| P1.1 / P1.2 / P1.3 / P1.4 / P1.5 / P1.7 | ✅ |
| P1.6 canary-admin KC | ⚠️ B workaround |
| Admin super admin bootstrap (user 1201) | ✅ Kalıcı (V12 + Initializer) |
| Prod CORS preflight | ✅ 200 + ACAO |
| Frontend explain modal re-fetch loop | ✅ Fixed |
| P1.8 canonical service-token | ⏳ Sonraki dalga |
| P1.9 NO_SCOPE modal | ⏳ |
| P1.10 Vault KMS | ⏳ (prod blocker) |

---

**Session metriği:** ~6 saat, 7 PR merged, 20+ Codex tur, 5 staging deploy, 150+ CI check. **Track A %57 DONE**.

**Sonraki session önceliği:** P1.10 Vault KMS → P1.8 canonical service-token → P1.9 NO_SCOPE modal. Her biri dedike session.

🏆 Zanzibar P1 backlog kapanışı yolda.
