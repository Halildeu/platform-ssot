# Session Handoff — 2026-04-13

## Onceki Session Ne Yapti

Bu session'da Zanzibar (OpenFGA) authorization sisteminde 5 PR merge edildi:

1. **PR #349** — @PreAuthorize -> @RequireModule migration (backend)
2. **PR #351** — 6 serviste permitAll guvenlik acigi kapatildi + OpenFgaStartupGuard + E2E test (5 senaryo) + 28 test (Export/ContextHealth) + EP-016 rule + compat.ts kaldirildi + gateway audience fix + vault naming fix + ERP_OPENFGA_ENABLED default true + decision registry rev 3
3. **PR #350** — Outbox hardening: @EnableScheduling + SELECT FOR UPDATE SKIP LOCKED + gitlink temizligi + 9 test
4. **PR #352** — Faz 2 (multi-role UI, hooks fix, i18n, grid roles sutunu) + Faz 3 (RoleDrawer i18n, PAGE conditional render)
5. **PR #355** — 25 dependency bump + 111 design-system contract test fix + vitest compat

Toplam: 159 yeni test, 111 duzeltilen test, 6 karar cozuldu (K-1..K-6), 2 yeni constraint (C-006, C-007).

## BLOCKER — Ilk Cozulecek Is

### Module Federation React Duplicate Instance

**Sorun:** ai.acik.com/admin/users beyaz ekran. Console'da:
```
TypeError: Cannot read properties of null (reading 'useMemo')
```

**Neden:** Shell ve MFE remote'lari farkli react-dom bundle'lari yukluyor:
- Shell: `assets/react-dom-CveEYGh4.js`  
- Remote (users): `remotes/users/assets/react-dom-7kpv6KXI.js`

Module Federation shared config singleton dogru calismamis. @module-federation/vite 1.13 -> 1.14 yukseltmesi (PR #355) muhtemel neden.

**Cozum yolu:**
1. `web/apps/mfe-shell/vite.config.ts` oku — federation({ shared: ... }) bolumunu bul
2. `web/apps/mfe-users/vite.config.ts` oku — ayni bolum
3. shared config'de react ve react-dom icin su ayarlari dogrula:
```ts
shared: {
  react: { singleton: true, requiredVersion: '~18.2.0' },
  'react-dom': { singleton: true, requiredVersion: '~18.2.0' },
  'react-router-dom': { singleton: true },
  '@tanstack/react-query': { singleton: true },
  'react-redux': { singleton: true },
}
```
4. TUM MFE app'lerinde (mfe-users, mfe-access, mfe-audit, mfe-reporting, mfe-shell) ayni shared config olmali
5. Build + deploy et, ai.acik.com/admin/users calistigini dogrula

**Karar:** @module-federation/vite 1.14'te kal, downgrade yapma (K-6).

## STORY-0318 Faz Durumu

| Faz | Kapsam | Durum |
|-----|--------|-------|
| Faz 1 | OpenFGA model + backend API | TAMAMLANDI (onceki sessionlar) |
| Faz 1.5 | Object-level pilot (ZanbibarGate) | TAMAMLANDI (mfe-access, mfe-reporting) |
| Faz 2 | mfe-users multi-role UI | TAMAMLANDI (PR #352) |
| Faz 3 | mfe-access RoleDrawer i18n | TAMAMLANDI (PR #352) |
| Faz 4 | Erisim engeli UX (explain) | BASLAMADI — arastirma yapildi |
| Faz 5 | Temizlik | BASLAMADI |

### Faz 4 Arastirma Sonucu (%90 zaten implement edilmis)
- Backend /authz/explain endpoint: HAZIR (POST, 4 denial reason)
- useExplainPermission hook: HAZIR
- useCheckPermission hook: HAZIR (lokal cache)
- UnauthorizedPage + "Neden erisemiyorum?" butonu: HAZIR
- i18n key'ler (tr + en): HAZIR
- Design-system Modal/Dialog/Drawer: HAZIR
- **EKSIK:** Reusable explain modal/drawer bileseni + diger sayfalara entegrasyon

### Faz 5 Kapsam
- Hardcode modul listeleri kaldir (5 yer)
- Deprecated endpoint'ler kaldir
- doctor-zanbibar.sh guncelle
- i18n tamamla (de, es dilleri)
- Decision topic guncelle

## Cozulen Kararlar

| # | Karar | Sonuc |
|---|-------|-------|
| K-1 | ERP_OPENFGA_ENABLED | Staged rollout, compose default true |
| K-2 | schema-service AUTH_MODE | Kaldirildi, C-006 constraint |
| K-3 | MFE standalone auth | Shell korumasi yeterli |
| K-4 | Vault naming | compose'da platform-vault-1 |
| K-5 | PAGE permission tipi | Eklenmeyecek (V10/TB-21 karari korunuyor) |
| K-6 | @module-federation/vite | 1.14'te kal, shared config duzelt |

## Sunucu Bilgileri

- **Canli URL:** https://ai.acik.com
- **SSH:** `ssh staging-sw`
- **Repo dizini:** /home/halil/platform/repo
- **Backend compose:** /home/halil/platform/repo/backend/docker-compose.yml
- **Backend env:** /home/halil/platform/env/backend.env
- **Web root (nginx):** /home/halil/platform/web/current
- **Nginx container:** platform-web-nginx-1
- **pnpm sunucuda YOK** — build CI'da yapilip SSH ile kopyalaniyor

## Kritik Dosyalar

### Zanbibar
- Plan: .claude/plans/zanbibar-master-plan.md (rev 18)
- Decision registry: decisions/topics/zanbibar-openfga.v1.json (rev 3)
- Story: docs/03-delivery/STORIES/STORY-0318-zanbibar-auth-redesign-consultation.md
- OpenFGA model: backend/openfga/model.fga

### Backend
- OpenFgaAuthzService: backend/common-auth/src/main/java/com/example/commonauth/openfga/OpenFgaAuthzService.java
- TupleSyncService: backend/permission-service/src/main/java/com/example/permission/service/TupleSyncService.java
- TupleSyncOutboxPoller: backend/permission-service/src/main/java/com/example/permission/outbox/TupleSyncOutboxPoller.java
- SecurityConfig (6 servis): backend/*/src/main/java/**/SecurityConfig.java

### Frontend
- PermissionProvider: web/packages/auth/src/PermissionProvider.tsx
- useZanbibarAccess: web/packages/auth/src/useZanbibarAccess.ts
- useExplainPermission: web/packages/auth/src/useExplainPermission.ts
- UserDetailDrawer: web/apps/mfe-users/src/widgets/user-management/ui/UserDetailDrawer.ui.tsx
- RoleDrawer: web/apps/mfe-access/src/widgets/role-drawer/RoleDrawer.ui.tsx
- UnauthorizedPage: web/apps/mfe-shell/src/pages/unauthorized/UnauthorizedPage.ui.tsx

### CI/Governance
- Feature contract: extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json
- UX change map: extensions/PRJ-UX-NORTH-STAR/contract/ux_change_map.v1.json
- Enforcement rules: ci/check_enforcement_rules.py (EP-016 dahil)
- Doctor script: backend/scripts/doctor-zanbibar.sh

## Worktree Durumu

- Aktif worktree: festive-golick
- Aktif branch: feat/zanbibar-faz4-explain (plan commit'i icin)
- Dependabot branch (PR #355 merged): dependabot/npm_and_yarn/web/minor-and-patch-c92a78a545

## Codex Istisare

- ID: CNS-20260413-001
- Prompt: /tmp/codex-consultation/zanbibar-review-prompt.md
- Codex CLI: /Users/halilkocoglu/.nvm/versions/node/v20.19.4/bin/codex
- Config: .codex/config.toml (model: gpt-5.4, approval: never)

## Oncelik Sirasi

```
1. [BLOCKER] MF React singleton fix -> deploy -> test
2. [Faz 4]  Explain drawer/modal bileseni (2 saat)
3. [Faz 5]  Temizlik (hardcode, deprecated, i18n)
4. [Backlog] Tuple reconciliation daemon
5. [Backlog] Circuit breaker
6. [Backlog] k6 CI, JaCoCo, rollback test
```
