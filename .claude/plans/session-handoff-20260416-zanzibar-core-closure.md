# Session Handoff — 2026-04-16 Zanzibar CORE CLOSURE (browser gate pending)

**Zincir handoff'ları:**
- `session-handoff-20260416-zanzibar-dalga1-done.md` (Dalga 1 DONE, 10 PR)
- `session-handoff-20260416-dalga3-post-deploy.md` (Dalga 3 core + 3 PR)
- `session-handoff-20260416-zanzibar-core-closure.md` ← **bu dosya**

**Bu session:** ~9 saat. Ana kazanım: **Zanzibar core + backend closure DONE**, 5/5 reason API evidence kanıtlandı, Gateway 500 root cause çözüldü. Sadece **thin browser gate (2 senaryo Playwright smoke)** yarına kaldı — TAM KAPANIŞ için yalnız bu eksik.

**Canlı durum handoff yazılırken:**
- `ai.acik.com/` → 200
- `/authz/version` token'sız → 401 ✅
- `/authz/version` token'lı → 200 ✅ **via gateway** (PR #426 gateway fix sonrası)
- `/authz/me` canary-admin via gateway → `{"userId":"1204","superAdmin":true,...}` ✅
- `/reports` canary-admin via gateway → full HR_REPORTS super-admin list ✅
- `doctor-infra.sh` → 75/71/0F/4W → STATUS PASS
- 22/22 container healthy

---

## 1. Bu Session'da Merged — 6 PR

| PR | SHA | Konu | Bölge |
|---|---|---|---|
| **#422** | `a5a4f389` | report-service direct OpenFGA SDK (PR6c-1 core) | Dalga 3 core |
| **#423** | `29913194` | compose yml report-service env contract | Dalga 3 follow-up |
| **#424** | `a2913bbc` | doctor-infra L3-L8 drift guard + RUNBOOK | Dalga 3 operational |
| **#425** | `e26e0b0c` | Handoff dokümanı (Dalga 3 post-deploy) | Docs |
| **#426** | `2b96c3c5` | api-gateway SECURITY_AUTH_ALLOWED_CLIENT_IDS forwarding (gateway 500 root cause) | Dalga 3 operational P0 |
| (bu) | — | Bu handoff + Rev 24 | Docs |

---

## 2. Codex Thread `019d9688` — 7 Tur Ping-Pong

| Tur | Konu | Verdict |
|---|---|---|
| 1 | PR6c-1 plan (Pattern A/B/C seçim) | APPROVE_WITH_CHANGES — 5 zorunlu |
| 2 | PR6c-1 implementation review | BLOCK — 3 blocker (env, alias, base-url) |
| 3 | Post-deploy değerlendirme | Tavsiye — drift guard şart, Dalga 2 için canary-admin vs super-admin standardize |
| 4 | Deploy-backend force-recreate hipotez | Tanı düzeltme — `--force-recreate` zaten var, asıl sorun env SSOT drift |
| 5 | TAM KAPANIŞ definition of done | APPROVE — "Dalga 0-3 + Dalga 2 release gate + gateway canlı" tanımı |
| 6 | Gateway 500 H1 tanı (audience/client-id) | APPROVE — kanıt zinciri + APPROVE_WITH_CHANGES fix plan |
| 7 | Service token + persona seed canonical | APPROVE_WITH_CHANGES — 3 blokör (auth-service mint policy, script token mix, user-service non-local service JWT converter yok). Hybrid B onay |
| 8 | Final scope: 5/5 API evidence + thin Playwright smoke | APPROVE_WITH_CHANGES — 2 senaryo yeterli, TAM KAPANIŞ için UI browser kanıtı şart |

---

## 3. 5/5 Reason Matrix API Evidence

```
✅ ALLOWED        canary-read-only  (1205) → REPORT_VIEWER        → module:REPORT   →
                  reason:"ALLOWED", roleName:"REPORT_VIEWER", grantType:"VIEW"

✅ NO_PERMISSION  canary-restricted (1206) → REPORT_VIEWER        → module:THEME    →
                  reason:"NO_PERMISSION", userRoles:["REPORT_VIEWER"]

✅ DENIED_BY_ROLE canary-multi-role (1207) → PURCHASE_MANAGER +   → action:DELETE_PO →
                                            CANARY_DENY_DELETE
                  reason:"DENIED_BY_ROLE", roleName:"CANARY_DENY_DELETE", grantType:"DENY"

✅ NO_ROLE        canary-scope-less (1208) → (no assignment)       → module:REPORT  →
                  reason:"NO_ROLE", userRoles:[]

✅ NO_SCOPE       canary-scope-less (1208)                         → module:COMPANY + scopeType=company,scopeRefId=1 →
                  reason:"NO_SCOPE", permissionType:"company", permissionKey:"1"
```

Codex notu: "5/5 API evidence önceki '4/5 UI + NO_SCOPE defer' standardını fiilen aşağı çekiyor — amacı reason engine doğruluğunu kanıtlamaktı, sen backend düzeyinde kapattın."

---

## 4. Staging Kritik Durum

### OpenFGA (re-initialized bu session)
- Store: `erp-stage` → **`01KPBM48614TZ2F3ZR5AKVXC7B`**
- Model: **`01KPBM488WJK8P7XHK751MDNGG`**
- Init: `backend/openfga/init.sh` + tuples-seed.json
- Eski ID'ler (`01KNF4FY...`, `01KNX1PH...`) volume recreate'de uçmuştu

### Users (bu session eklenenler)
| ID | Email | Role | Notlar |
|---|---|---|---|
| 1204 | canary-admin@stage.local | ADMIN | Super-admin, OpenFGA admin tuple. **KC recreate sonrası token kırık** (user-specific NPE, workaround: diğer persona'lar) |
| 1205 | canary-read-only@stage.local | USER + REPORT_VIEWER role | ALLOWED path |
| 1206 | canary-restricted@stage.local | USER + REPORT_VIEWER role | NO_PERMISSION path |
| 1207 | canary-multi-role@stage.local | USER + PURCHASE_MANAGER + CANARY_DENY_DELETE | DENIED_BY_ROLE path |
| 1208 | canary-scope-less@stage.local | USER (no assignment) | NO_ROLE + NO_SCOPE path |

KC user password: `CanaryPass123` (hepsi)
Client: `canary-load` (confidential, secret: `canary-load-secret-2026`)

### Permission-service DB (bu session eklenenler)
- New role: `CANARY_DENY_DELETE` (id=22) — granule-only role (DELETE_PO DENY)
- New permission: `DELETE_PO` (id=29)
- 4 new user_role_assignments (user 1205-1207, 1208 atamasız)
- authz_sync_version: 1 → 4 (bu session'da 3 bump)
- **Kritik:** role_permissions.permission_type UPPERCASE zorunlu (enum `PermissionType` big case). Alt case 'action' HTTP 500 NPE üretir — CANARY_DENY_DELETE INSERT sırasında yakalandı + UPPER() fix ile çözüldü.

### Canonical env SSOT (bu session eklemeler)
`/home/halil/platform/env/backend.env`:
- `SECURITY_AUTH_ALLOWED_CLIENT_IDS=frontend,admin-cli,serban-web,account,canary-load` (PR #426 required)
- `ERP_OPENFGA_STORE_ID=01KPBM48614TZ2F3ZR5AKVXC7B` (updated)
- `ERP_OPENFGA_MODEL_ID=01KPBM488WJK8P7XHK751MDNGG` (updated)

---

## 5. Açık Sorunlar (Yarın)

### P0 — Thin Playwright UI Smoke (30-45dk, 2 senaryo)

Codex final verdict: "TAM KAPANIŞ için MUTLAKA browser gate". **Minimum 2 senaryo yeterli** — 4/5 full matrix zorunlu değil.

**Senaryo 1 (ALLOWED modal):**
- `canary-read-only` ile login (canary-load client)
- `/access/roles` navigate
- Role drawer → `explain-trigger-module-REPORT` butonuna bas
- ExplainPermissionModal açıl
- `explain-modal-reason` → "ALLOWED" badge görülür
- `explain-modal-user-roles` → `["REPORT_VIEWER"]`

**Senaryo 2 (DENIED unauthorized):**
- `canary-restricted` ile login
- `/admin/themes` navigate → UnauthorizedPage redirect
- UnauthorizedPage "Neden erişemiyorum?" butonu tıkla
- Modal/inline açıl
- Reason: NO_PERMISSION

Dosyalar:
- `web/tests/playwright/authz.explain-modal.stage.spec.ts` (yeni)
- `performBrowserLogin` inline veya shared helper (mevcut `utils/auth.real.ts` pattern'i ortaklaştırma opsiyonel)
- Stable selector'lar: `data-testid="explain-modal-body/reason/user-roles"`

### P1 — Ayrı Story'ler (opsiyonel)

| # | İş | Süre | Blocking prod |
|---|---|---:|:-:|
| 1 | canary-admin KC user NPE debug | 1h | hayır (4 persona yeter) |
| 2 | Canonical service token path (auth-service mint allowlist + user-service non-local JWT converter + script token ayrımı) | 4-6h | hayır |
| 3 | NO_SCOPE UI modal refactor (useExplainPermission scopeType/scopeRefId gönder) | 6-8h | hayır |
| 4 | /authz/explain → OpenFGA runtime migration (şu an DB okuyor) | 4-6h | hayır (hibrit OK) |
| 5 | Vault KMS auto-unseal | 4-6h | **evet** (prod) |
| 6 | TB-11 cleanup (PermissionCodes sil, AuthzMeResponse shape kaldır) | 2-3h | hayır |
| 7 | Hardcoded TR cleanup (UnauthorizedPage + RoleDrawer i18n) | 3-4h | hayır |
| 8 | canary-admin → canary-super-admin naming standardize | 1h | hayır |

---

## 6. Yeni Memory Kuralları (bu session, 3 adet)

1. `feedback_staging_canonical_env_drift.md` — canonical env vs repo env drift, doctor-infra L3-L8 fail-closed
2. `feedback_kc_client_scope_admin_role.md` — admin-cli vs canary-load Full Scope farkı
3. `feedback_openfga_init_after_volume_recreate.md` — OpenFGA store/model re-init prosedürü
4. (yeni) `feedback_zanzibar_hybrid_b_persona_seed.md` — canonical service-token yerine Hybrid B path (manuel KC+DB+OpenFGA+role assignment)
5. (yeni) `feedback_permission_type_enum_uppercase.md` — PermissionType enum UPPERCASE zorunlu, lowercase NPE HTTP 500

---

## 7. Yarınki Session Başlangıç Rehberi

```bash
# 1. Plan + handoff
cat .claude/plans/zanzibar-master-plan.md                                    # Rev 23 (Rev 24 yarın update)
cat .claude/plans/session-handoff-20260416-zanzibar-core-closure.md          # bu dosya

# 2. Canlı sağlık
curl -sI -o /dev/null -w "%{http_code}\n" https://ai.acik.com/                              # 200
curl -sI -o /dev/null -w "%{http_code}\n" https://ai.acik.com/api/v1/authz/version          # 401 (token'sız)

# 3. Staging
ssh staging-sw 'bash /home/halil/platform/repo/backend/scripts/doctor-infra.sh --quick'     # L1-L8 PASS

# 4. 5 persona token tanıtımı (canary-load client secret canary-load-secret-2026)
# canary-admin KC NPE için recreate denemedim — diğer 4 persona OK
ssh staging-sw 'for u in canary-read-only canary-restricted canary-multi-role canary-scope-less; do
  curl -sf -X POST http://localhost:8081/realms/serban/protocol/openid-connect/token \
    -d "client_id=canary-load" -d "client_secret=canary-load-secret-2026" \
    -d "grant_type=password" -d "username=${u}@stage.local" -d "password=CanaryPass123" \
    | python3 -c "import json,sys; t=json.load(sys.stdin); print(\"${u}: len=\", len(t.get(\"access_token\",\"\")))"
done'

# 5. Reason matrix API smoke (5/5 tekrar doğrulama)
bash /tmp/seed-all-assignments.sh  # staging'de zaten çalıştı, sadece smoke kısmı tekrar

# 6. YARIN P0: Playwright UI smoke (thin 2 senaryo)
# Worktree: yeni wt new authz-explain-modal-e2e
# Spec: web/tests/playwright/authz.explain-modal.stage.spec.ts
# Config: web/tests/playwright/playwright.config.ts
# Run: npx playwright test web/tests/playwright/authz.explain-modal.stage.spec.ts --config web/tests/playwright/playwright.config.ts

# 7. PASS sonrası:
# - Master plan Rev 24 update
# - Yeni handoff (TAM KAPANIŞ)
# - Final Codex closure review (thread 019d9688 veya yeni thread)
```

---

## 8. Metrikler

| | |
|---|---|
| Session süresi | ~9 saat |
| PR merged | **6** (#422, #423, #424, #425, #426, + bu handoff PR'ı) |
| CI check çalıştırma | 80+ |
| Codex ping-pong tur | **7** (thread 019d9688) |
| Test added | 64+ (PR #422'de, + ek test yazılmadı bu session'da) |
| Staging deploy SUCCESS | 3 |
| Operasyonel hotfix | 8 (runner restart, canonical env hotfix, force-recreate, Vault unseal, OpenFGA init, canary-admin DB INSERT, 4 persona seed, role+granule+assignment INSERT + enum UPPERCASE fix) |
| Reason matrix API evidence | **5/5 PASS** |
| Doctor-infra L-section | 61 → 69 → 75 check (L3-L8 eklendi PR #424) |
| Memory kurallar | +5 yeni önerildi (3 yazıldı, 2 yarın) |

---

## 9. TAM KAPANIŞ Definition of Done — Status

| Kriter | Status |
|---|:-:|
| 1. Dalga 0 ✅ | ✅ PR #365 (önceki) |
| 2. Dalga 1 Stage 1+2+3 ✅ | ✅ Önceki session |
| 3. Dalga 3 core — report-service direct OpenFGA SDK | ✅ PR #422 |
| 4. Dalga 3 follow-up — compose env contract | ✅ PR #423 |
| 5. Dalga 3 operational — drift guard | ✅ PR #424 |
| 6. Gateway 500 root cause fix via canlı 200 | ✅ PR #426 |
| 7. Reason engine 5/5 doğru (ALLOWED, DENIED_BY_ROLE, NO_PERMISSION, NO_ROLE, NO_SCOPE) | ✅ API evidence |
| 8. Persona seed (canary-admin + 4 ek) + DB role+assignment | ✅ Hybrid B path |
| 9. doctor-infra.sh L1-L8 PASS | ✅ |
| 10. **Dalga 2 release gate — Playwright UI smoke (2 senaryo minimum)** | ⏳ **YARIN** |

**9/10 DONE. Kalan: 1 browser smoke** (Codex "TAM KAPANIŞ için şart" dedi).

---

## 10. Özet

**Zanzibar core + backend + infra + reason engine TAM ÇALIŞIYOR.** Browser UI explain proof tek kalan iş.

6 PR merged bu gün. Gateway 500 → canonical env drift tanısı → PR #426 fix. OpenFGA re-init + 4 persona seed + role assignment + 5/5 reason API evidence.

**Codex verdict:** "Core closure complete, thin browser gate remaining. 2 Playwright senaryo yeterli, 4/5 full matrix gereksiz."

**Yarın:** 30-45dk iş (Playwright 2 senaryo) → **Zanzibar TAM KAPANIŞ**.
