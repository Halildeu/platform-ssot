# Zanzibar Master Plan — Rev 18 (Session Kapanisi)

**Tarih:** 2026-04-13 (guncellendi 12:55 UTC)
**Kaynak:** Claude analizi + Codex istisaresi (CNS-20260413-001)
**Son main commit:** b8c83e9b (PR #355 merged)

---

## 1. TAMAMLANAN ISLER (Bu Session)

### PR-A: PR #349 — ADR-0012 Phase 3 [MERGED]
- [x] @PreAuthorize -> @RequireModule migration
- [x] RequireModule annotation (common-auth)
- [x] RequireModuleInterceptor (permission-service)
- [x] AccessControllerV1ScopeSecurityTest aktif
- **Merge:** 2026-04-12T22:32 UTC

### PR-B/D/E: PR #351 — Security Hardening + E2E + Kalite [MERGED]
- [x] 6 serviste anyRequest().permitAll() -> anyRequest().authenticated()
  - report-service, user-service, api-gateway, variant-service, auth-service
  - schema-service: AUTH_MODE kill-switch tamamen kaldirildi
- [x] OpenFgaStartupGuard (InitializingBean) — non-local fail-open uyari
- [x] Vault container_name: backend-vault-1 -> platform-vault-1
- [x] E2E RoleTupleCheckIntegrationTest (5 senaryo, Testcontainers OpenFGA)
- [x] ERP_OPENFGA_ENABLED default true (docker-compose.yml)
- [x] .env.example guncellendi
- [x] EP-016 enforcement rule (legacy auth import ban, WARN)
- [x] compat.ts kaldirildi (useAuthorization shim, aktif consumer yok)
- [x] Gateway audience fix: variant-service -> api-gateway,frontend,account,serban-web
- [x] ExcelStreamingExporterTest (6 test)
- [x] CsvStreamingExporterTest (8 test)
- [x] ContextHealthControllerTest (14 test)
- [x] Feature execution contract scope guncellemeleri
- [x] Decision registry rev 3 (C-006, C-007, K-1..K-4 cozuldu)
- **Merge:** 2026-04-12T23:40 UTC

### PR-C: PR #350 — Outbox Hardening [MERGED]
- [x] @EnableScheduling eklendi (poller artik calisiyor)
- [x] .claude/worktrees gitlink kaldirildi + .gitignore
- [x] SELECT FOR UPDATE SKIP LOCKED (multi-instance guvenlik)
- [x] TupleSyncOutboxPollerTest (9 test)
- [x] CI: database scope + enforcement fix
- **Merge:** 2026-04-12T23:49 UTC

### PR #352 — Faz 2 + Faz 3 [MERGED]
- [x] Faz 2: React hooks siralama duzeltmesi (useQuery'ler early return ustune)
- [x] Faz 2: Hardcoded Turkce -> i18n (17 key, tr + en)
- [x] Faz 2: "Tumunu Sec" checkbox (indeterminate state)
- [x] Faz 2: Rol validasyonu (save disabled when no roles + uyari)
- [x] Faz 2: modulePermissions grid sutunu -> roles Badge sutunu
- [x] Faz 3: RoleDrawer tum section basliklar i18n (10 key, tr + en)
- [x] Faz 3: Action ALLOW/DENY label'lari i18n
- [x] Faz 3: Module level label'lari i18n (Oku/Yonet)
- [x] Faz 3: PAGE section conditional render (backend'de PAGE tipi yok)
- [x] CI: UX change map + feature execution contract guncellemeleri
- [x] CI: vitest MF alias fix (mfe_shell/i18n)
- **Merge:** 2026-04-13T04:08 UTC

### PR #355 — 25 Dependency Bump + 111 Test Fix [MERGED]
- [x] 25 npm paket guncelleme (Dependabot)
- [x] lucide-react 1.7.0 pin (1.8 breaking change, pnpm override)
- [x] vitest-browser-react 2.1.0 pin (pnpm override)
- [x] 111 design-system contract test fix (53 dosya):
  - 14 access=hidden component fix (Button, GridShell, 10 Sidebar, Carousel, TreeTable)
  - 40+ AppSidebar useSidebar mock ekleme
  - 14 Form ConnectedComponent mock ekleme
  - 7 primitive test fix (Dialog showModal, Modal portal, Drawer, Tooltip)
  - 20+ component prop fix (Carousel, Combobox, Timeline, Toast, vb)
  - 10 enterprise component fix (ControlChart, EmptyStateBuilder, vb)
  - 10 pattern test fix (DetailSummary, ShellHeader, vb)
  - 6 motion test fix (AnimatePresence, StaggerGroup, Transition)
  - 2 performance benchmark threshold artirma (10ms -> 50ms)
  - 2 ServerPaginationFooter gridApi mock
- [x] vitest --workspace flag kaldirildi (4.x auto-discovery)
- [x] Root vitest.config.ts environment: 'jsdom' eklendi
- [x] ZanbibarPilot test guncelleme (Button null vs invisible)
- **Merge:** 2026-04-13T09:09 UTC

### Deploy
- [x] deploy-web: SUCCESS (5 kez — her PR merge sonrasi)
- [x] deploy-backend: SUCCESS (gateway + permission-service rebuild)
- [x] post-deploy-validate: SUCCESS
- [x] release-canary: SUCCESS
- [x] Backend servisleri: gateway port fix (docker-proxy kill)

### Kararlar
- [x] K-1: ERP_OPENFGA_ENABLED -> staged rollout (compose default true)
- [x] K-2: schema-service AUTH_MODE -> KALDIRILDI (C-006)
- [x] K-3: MFE standalone auth -> Shell korumasi yeterli
- [x] K-4: Vault naming -> compose'da platform-vault-1
- [x] PAGE permission tipi -> V10'da kaldirildi, geri eklenmeyecek (TB-21)

---

## 2. BILINEN SORUNLAR (Bu Session Sonunda)

### BLOCKER: Module Federation React Duplicate
- **Belirti:** ai.acik.com/admin/users beyaz ekran
- **Hata:** TypeError: Cannot read properties of null (reading 'useMemo')
- **Neden:** Shell react-dom-CveEYGh4.js vs Remote react-dom-7kpv6KXI.js — farkli bundle hash
- **Kok neden:** @module-federation/vite 1.13 -> 1.14 shared config degisikligi
- **Karar:** Ust versiyonda kal, uzun vadeli shared config duzelt
- **Etki:** Tum MFE remote'lari (users, access, audit, vb) calismaz
- **Cozum yolu:** vite.config.ts Module Federation shared config'de react/react-dom singleton + requiredVersion ayarla

### Gateway Port Conflict (Cozuldu)
- docker-proxy PID 8080'i tutuyordu, sudo kill ile cozuldu
- Gelecekte: docker compose down + up yerine restart kullan

---

## 3. KALAN ISLER (Sonraki Session)

### P0 — BLOCKER
| # | Is | Efor | Dosya |
|---|-----|------|-------|
| 1 | MF React singleton fix | 2-4 saat | web/apps/*/vite.config.ts shared config |

### P1 — Faz 4: Erisim Engeli UX
| # | Is | Efor | Durum |
|---|-----|------|-------|
| 1 | Explain drawer/modal bileseni | 2 saat | Backend+hook HAZIR, UI bileseni eksik |
| 2 | "Neden erisemiyorum?" butonu yayginlastirma | 1 saat | UnauthorizedPage'de var, baska yerlere ekle |
| 3 | Scope denial detay gorunumu | 1 saat | Hangi scope var/yok goster |

### P2 — Faz 5: Temizlik
| # | Is | Efor |
|---|-----|------|
| 1 | Hardcode modul listeleri kaldir (5 yer) | 2 saat |
| 2 | Deprecated endpoint'ler kaldir | 1 saat |
| 3 | doctor-zanzibar.sh guncelle | 1 saat |
| 4 | i18n tamamla (de, es dilleri) | 1 saat |

### P3 — Backlog
| # | Is | Efor |
|---|-----|------|
| 1 | Tuple reconciliation daemon | 1 gun |
| 2 | Circuit breaker (OpenFGA write) | 1 gun |
| 3 | OpenFGA model version management | 1 gun |
| 4 | k6 CI workflow | 0.5 gun |
| 5 | JaCoCo rapor threshold | 0.5 gun |
| 6 | Rollback playbook staging testi | 0.5 gun |

---

## 4. KARAR SONUCLARI

| # | Karar | Sonuc | Constraint | Tarih |
|---|-------|-------|-----------|-------|
| K-1 | ERP_OPENFGA_ENABLED | Staged rollout, compose default true | - | 2026-04-13 |
| K-2 | schema-service AUTH_MODE | Kaldirildi, her zaman authenticated() | C-006 | 2026-04-13 |
| K-3 | MFE standalone auth | Shell korumasi yeterli | - | 2026-04-13 |
| K-4 | Vault naming | compose'da platform-vault-1 | - | 2026-04-13 |
| K-5 | PAGE permission tipi | Eklenmeyecek (V10/TB-21) | - | 2026-04-13 |
| K-6 | @module-federation/vite | 1.14'te kal, shared config duzelt | - | 2026-04-13 |

---

## 5. SAYISAL OZET

| Metrik | Deger |
|--------|-------|
| Merged PR | 5 (#349, #350, #351, #352, #355) |
| Yeni test | 159 (28 export/health + 9 outbox + 5 E2E + 6 Zanzibar + 111 DS) |
| Duzeltilen test | 111 (design-system contract) |
| Degisen dosya | ~120+ |
| Yeni constraint | 2 (C-006, C-007) |
| Cozulen karar | 6 (K-1..K-6) |
| Codex istisare | 1 (CNS-20260413-001, 150K token) |
| Deploy | 6 (5 web + 1 backend) |

---

## 6. CODEX ISTISARE KAYDI

**ID:** CNS-20260413-001
**Katilimcilar:** Claude (Opus 4.6) + Codex (gpt-5.4)
**Token:** 150,307

**Kabul edilen:** permitAll fiili acik, @EnableScheduling, gitlink, startup guard, schema-service profil, MFE nuans
**Reddedilen:** Oncelik sirasi (PR #349 once), PR #350 "rework" -> "hardening"

---

## 7. SONRAKI SESSION BASLANGIC REHBERI

```
1. Plan oku: .claude/plans/zanzibar-master-plan.md (rev 18)
2. BLOCKER: MF React singleton fix
   - web/apps/mfe-shell/vite.config.ts
   - web/apps/mfe-users/vite.config.ts (ve diger remote'lar)
   - shared: { react: { singleton: true, requiredVersion: '~18.2.0' } }
   - Test: ai.acik.com/admin/users calistigini dogrula
3. Faz 4: Explain drawer/modal
4. Faz 5: Temizlik
5. Backlog: reconciliation, circuit breaker, k6
```

---

## 8. DOSYA REFERANSLARI

### Zanzibar Core
- Decision registry: decisions/topics/zanzibar-openfga.v1.json (rev 3)
- OpenFGA model: backend/openfga/model.fga
- Doctor script: backend/scripts/doctor-zanbibar.sh

### Backend Auth
- OpenFgaAuthzService: backend/common-auth/.../openfga/OpenFgaAuthzService.java
- OpenFgaStartupGuard: backend/common-auth/.../openfga/OpenFgaStartupGuard.java
- TupleSyncService: backend/permission-service/.../service/TupleSyncService.java
- TupleSyncOutboxPoller: backend/permission-service/.../outbox/TupleSyncOutboxPoller.java

### Frontend Auth
- PermissionProvider: web/packages/auth/src/PermissionProvider.tsx
- useZanbibarAccess: web/packages/auth/src/useZanbibarAccess.ts
- useExplainPermission: web/packages/auth/src/useExplainPermission.ts
- useCheckPermission: web/packages/auth/src/useCheckPermission.ts

### Story
- STORY-0318: docs/03-delivery/STORIES/STORY-0318-zanbibar-auth-redesign-consultation.md
