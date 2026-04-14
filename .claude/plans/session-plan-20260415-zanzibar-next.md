# Session Plan — 2026-04-15 Zanzibar Next Steps

**Önceki session'lar:**
- `session-handoff-20260413-s2.md` — Zanzibar Rev 19/20 housekeeping + infra stabilizasyon
- `session-handoff-20260414-deploy.md` — Production nginx TLS + deploy-backend 5-layer drift repair
- `session-plan-20260414-zanzibar-context.md` — (bu dosya) Zanzibar deep-context + doc hygiene + yol haritası

**Branch bu plan yazıldığında:** `claude/stupefied-colden` (1 commit ahead of main)
**Son commit:** `0eee43ca docs(zanzibar): clarify permission-service TRANSFORMED (not REMOVED)`
**Doctor-zanzibar durumu:** 57 check, 0 hata, 4 uyarı (hepsi PR6a/6b bekliyor — beklenen drift)

---

## 1. Bu Session'da Yapılanlar (2026-04-14)

### 1.1 Zanzibar Deep-Context Raporu
`decisions/registry.v1.json` rev 4, 8 karar (D-001..D-008 FINAL), 6 reject, 8 constraint
okundu ve raporlandı. OpenFGA model, permission-service hub yapısı, common-auth SDK,
frontend `@mfe/auth` paketi, Vite proxy ve Docker compose detayları sohbette sunuldu.

### 1.2 "permission-service REMOVED" Stale Language Cleanup (commit 0eee43ca)

**Düzeltilen dosyalar:**

| Dosya | Değişiklik |
|-------|-----------|
| `docs/02-architecture/services/ops/ADR/ADR-0010-openfga-authorization.md` §D-003 DCP | Factual fix: `D-002` typo → `D-003`; D-002/D-003 ayrımı netleştirildi |
| `docs/02-architecture/services/ops/ADR/ADR-0012-jwt-identity-only.md` §Consequences | "Permission-service SPOF" → "OpenFGA SPOF"; backend OpenFGA SDK-direct (D-008/C-008) |
| `docs/02-architecture/runtime/service-communication-matrix.md` | auth/user/variant→permission-service satırları `(legacy, TB-11)` işaretlendi; OpenFGA SDK canonical satırı eklendi; D-003/D-008 + C-008 gözlem notu |
| `docs/04-operations/TB-11-legacy-permission-inventory.md` başlık + intro | "Legacy References **TO** Permission-Service" — envanter kapsamı netleşti; permission-service KALDIRILMAZ (C-005) notu |

**Taramada doğru görülen (dokunulmadı):** `decisions/topics/zanzibar-openfga.v1.json`,
`.claude/rules/*.md`, `AUTHORIZATION.md`, `SYSTEM-OVERVIEW.md`, `DOMAIN-MAP.md`,
`INDEX.md`, `ADR-0013`, `doctor-zanzibar.sh`, `backend/docs/legacy/**` (frozen).

---

## 2. Geri Alınan Öz-Tavsiye (Düzeltme)

Önceki handoff turunda "Rota B: auth cleanup öncelikli" tavsiye ettim. **Bu yanlıştı.**

TB-11 açık yazıyor: **"PR6-prereq (post-canary, CNS-20260414-003 Q1)"** — PR6a'nın ön koşulu,
Dalga 0 canary'sinin **prod'da rollout olup doğrulanması**. Canary fix'leri (B1-B5) PR #365
ile merge olmuş; ancak Vault oscillation deploy blocker'ı canary'nin prod'a yerleşmesini
engelliyordu. PR #376'daki `wait_for_service_state` 3-ardışık-poll fix'i **henüz canlı
testten geçmedi**.

**Dolayısıyla:** P0 (Vault + canary doğrulama) **boş bekleme değil, PR6 için gating
prerequisite**. Aşağıdaki P0/P0.5 atlanmadan P1 başlamamalı.

---

## 3. Yol Haritası (Kesin Sıra)

### P0 — Canary & Vault Doğrulama (blocking)

**Neden:** PR6-prereq post-canary. PR #376 fix'inin canlı testi bekliyor.

**Yapılacak:**
1. Main'e yeni push geldiğinde GitHub Actions `deploy-backend` workflow'unu izle.
2. `wait_for_service_state` 3-ardışık-poll mantığı `unhealthy → healthy` geçişini doğru yedi mi?
3. Başarılı ise: staging'de Vault oscillation giderildi say; prod canary rollout durumunu doğrula.
4. Başarısız ise (deploy 60-120s sealed:true'da asılı kalırsa): fallback D seçeneği —
   healthcheck timeout artırımı + `--start-period` inceleme (handoff bölüm 6'daki detay).

**Doğrulama komutları (session başlangıcı):**
```bash
cat .claude/plans/session-handoff-20260414-deploy.md
curl -sI https://ai.acik.com
ssh staging-sw "for i in {1..30}; do docker inspect --format '{{.State.Health.Status}}' platform-vault-1; sleep 2; done | sort | uniq -c"
```

**Beklenen:** 30/30 healthy, ai.acik.com 200 OK, Actions deploy job green.

---

### P0.5 — Zanzibar Canary Prod Health Doğrulama

**Neden:** B1-B5 fix'leri PR #365 ile merge olmuş ama prod'da canary gate metrikleri
yeşil mi görülmedi.

**Yapılacak:**
1. `/api/v1/authz/check` ve `/batch-check` prod endpoint'leri permission-service'te
   çalışıyor mu (B1). Staging'e curl at:
   ```bash
   curl -X POST https://staging.acik.com/api/v1/authz/check \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"user":"user:1","relation":"viewer","object":"company:1"}'
   ```
2. Grafana `authz-zanzibar-rules.yml` alert'leri false-positive vermiyor mu:
   - `deny_rate` (B3)
   - `tuple_sync_outbox_failed_total` (B4)
   - `openfga_circuit_breaker_state` (B4)
3. Variant-service sticky-deny cache 5dk sorunu çözüldü mü (B2 path-aware 503).
4. Compose'da `PERMISSION_SERVICE_BASE_URL` variant+core-data için set (B5).

**Beklenen:** 4/4 metric sağlıklı, hiçbir sticky 403 yok, rollout ilerlemeye hazır.

---

### P1a — PR6-prereq: auth-service PermissionServiceClient Shortcircuit

**Neden:** TB-11 planlaması — breaking drop yerine aşamalı. `AuthService.java:83`
çağrısı `Set.of()` kompat ile kısa devre + class stub.

**Scope (TB-11'den):**
- `backend/auth-service/src/main/java/com/example/authservice/permission/PermissionServiceClient.java:30` — class stub'a indir (HTTP kaldır, Set.of() dön)
- `backend/auth-service/src/main/java/com/example/authservice/service/AuthService.java:22,41,52,83` — import/field/çağrı kaldır ya da `Set.of()` döndürür hale getir
- `AuthServiceTest.java`, `AuthServiceSessionAuditTest.java` — mock'ları güncelle

**Doğrulama:**
```bash
cd backend/auth-service && mvn test
bash backend/scripts/doctor-zanzibar.sh --quick   # A19 uyarısı PermissionServiceClient için düşmeli
```

**Beklenen:** auth-service mvn test PASS, doctor A19 uyarısı azaldı.

---

### P1b — PR6b: JwtTokenProvider `permissions` Claim Cleanup

**Neden:** D-002 FINAL ihlali riskini sıfırla. Doctor A19'un son uyarısı.

**Scope:**
- `backend/*/JwtTokenProvider.java` (muhtemelen auth-service) — `permissions` claim yazımını kaldır
- Downstream consumer'ları kontrol et — `AuthorizationContextBuilder.java` zaten `Set.of()` kullanıyor (A17 pass), consumer yok olmalı

**Doğrulama:**
```bash
bash backend/scripts/doctor-zanzibar.sh --quick   # A17 + A19 temiz olmalı
```

**Risk:** Düşük — token consumer'ı kalmadığından davranış değişmez.

---

### P1c — PR6c: report-service PermissionServiceClient → OpenFGA SDK

**Neden:** TB-11'de 3 controller aktif tüketiyor — WebClient hattı. C-008 ihlali.

**Scope:**
- `backend/report-service/**/authz/PermissionServiceClient.java` — sök
- 3 controller'ı `OpenFgaAuthzService` (common-auth) kullanacak şekilde migrate et

**Doğrulama:**
```bash
cd backend/report-service && mvn test
bash backend/scripts/doctor-zanzibar.sh --quick
```

**Beklenen:** report-service mvn test PASS, C-008 ihlali yok.

---

### P2 — MF React Duplicate Instance Blocker (paralel çalışabilir)

**Neden:** `project_zanzibar_status.md` memory kaydı — "ai.acik.com white screen, shell
and remote load different react-dom bundles". Faz 5 cleanup bitişi için bloke.

**Hipotez:** `vite.config.ts` shared config'te `react-dom` için `eager: true` veya
`import: false` eksik ya da `requiredVersion` tutarsız.

**Yapılacak:**
1. `web/apps/mfe-shell/vite.config.ts` shared config'i oku
2. Tüm remote MFE'ler (mfe-users, mfe-access, mfe-audit, mfe-reporting, mfe-ethic,
   mfe-suggestions) vite.config shared config'i karşılaştır
3. `react` ve `react-dom` için `singleton: true, eager: true, requiredVersion: '18.2.0'`
   tutarlı hale getir
4. Test: `npm run build` sonrası `vite-bundle-visualizer` ile bundle karşılaştır
5. Staging'e deploy et, `ai.acik.com` beyaz ekran gider mi

**Doğrulama:**
```bash
cd web && npm run build
# Bundle analiz
npx vite-bundle-visualizer
# Staging verify
curl -s https://ai.acik.com | grep -c "react-dom"  # 1 olmalı
```

---

### P3 — Faz 4 Explain UX Drawer/Modal (son sıra)

**Neden:** %90 bitmiş. `@mfe/auth`'ta `useExplainPermission` + `ZanzibarGate` hazır.
Eksik: drawer/modal UI katmanı.

**Scope:**
- `web/packages/auth/src/useExplainPermission.ts` kullan
- `mfe-access` veya `mfe-users` içinde "403 sayfasında Neden? butonu" → drawer/modal component
- i18n stringleri ekle

**Doğrulama:**
```bash
cd web && npm test
# E2E
npx playwright test --grep "explain"
```

---

## 4. Quick-Wins (Plan Ana Akışı Dışında)

### QW1 — doctor-zanzibar A20 Drift Guard
Bu session'da düzelttiğimiz stale dil tekrar geri gelmesin diye:

```bash
# A20. Permission-service REMOVED language drift guard
header "A20. Permission-service 'REMOVED' language drift guard (non-legacy docs)"
STALE_REFS=$(grep -rln 'permission-service[^"]*REMOVED' "$BACKEND_DIR/../docs/02-architecture" "$BACKEND_DIR/../.claude/rules" 2>/dev/null \
  | grep -v 'OUTDATED\|aspirasyon\|change_log\|Original D-003' || true)
if [ -n "$STALE_REFS" ]; then
  fail "'permission-service REMOVED' stale dili non-legacy docs'ta: $STALE_REFS"
else
  pass "permission-service stale language drift guard temiz"
fi
```

Eklenecek yer: `backend/scripts/doctor-zanzibar.sh` — A19'dan sonra, runtime checks öncesi.

### QW2 — run_local_gate_chain.sh:81 Bash Strict-Mode Bug

`_fp_args[@]: unbound variable` hatası. `set -u` + boş array. Fix:

```bash
# Satır 81 güncellemesi:
python3 "${SCRIPT_DIR}/ops/compute_worktree_fingerprint.py" --repo-root "${_fp_root}" ${_fp_args[@]+"${_fp_args[@]}"}
```

`${arr[@]+"${arr[@]}"}` pattern — dizi boşsa expansion yok, bound variable sorunu kalkar.
Canonical tree'de `LOCAL_GATE_WORKTREE_MODE`/`LIGHT_MODE` set değilken full gate bozuluyor.

---

## 5. Dokunulmayacaklar (Hatırlatma)

AGENTS.md + CLAUDE.md + decision registry ortak kararları:

- `SPRING_PROFILES_ACTIVE`, `.env.local`, `AUTH_MODE` — user onayı olmadan **değiştirilmez**
- `decisions/registry.v1.json` FINAL kararlar — DCP olmadan revert yok
- `permission-service` silme — **C-005 HARD CONSTRAINT**
- `ScopeContextFilter` order `HIGHEST_PRECEDENCE` — **asla**
- Vite proxy `/api/v1/authz|/roles|/permissions` — **yalnızca 8090** (gateway YOK)
- `docker-compose.yml` — tek project name `platform`, dual-compose yasak
- Cron deploy — **DISABLED** (stabilizasyon bitene kadar, deploy handoff)
- Reddedilen alternatifler R-001..R-006 — user onayı olmadan denenmez

---

## 6. Canonical Doğrulama Komutları (her PR öncesi)

```bash
# Auth işleri için
bash backend/scripts/doctor-zanzibar.sh --quick

# Local gate (commit/push öncesi — canonical)
LOCAL_GATE_WORKTREE_MODE=1 LIGHT_MODE=1 bash scripts/run_local_gate_chain.sh
cat .cache/reports/local-gate-chain/status.json | jq '.overall_status'

# Compose tutarlılığı
bash scripts/ops/wt status
```

---

## 7. Session Başlangıç Komutları

```bash
# 1) Bu planı ve önceki handoff'u oku
cat .claude/plans/session-plan-20260415-zanzibar-next.md
cat .claude/plans/session-handoff-20260414-deploy.md

# 2) Production sağlık
curl -sI https://ai.acik.com

# 3) Vault oscillation test (P0 gating)
ssh staging-sw "for i in {1..30}; do docker inspect --format '{{.State.Health.Status}}' platform-vault-1; sleep 2; done | sort | uniq -c"

# 4) Zanzibar baseline (0 hata bekleniyor)
bash backend/scripts/doctor-zanzibar.sh --quick

# 5) Decision registry yenile
cat decisions/topics/zanzibar-openfga.v1.json | jq '.revision, .change_log[-1]'

# 6) Git durumu
git log --oneline origin/main..HEAD
git status
```

---

## 8. Memory Önerileri (session sonu)

Aşağıdaki şeyler belleğe eklenmeye değer (eğer doğrulanırsa):

- **Feedback memory:** "permission-service TRANSFORMED, REMOVED değil — doc cleanup 2026-04-14'te yapıldı;
  drift guard A20 doctor'a eklenirse tekrar sızmaz. Neden: agent'lar eski aspirasyonel D-003 dilini
  okuyup permission-service'i siler, Zanzibar bozulur."
- **Project memory (Vault oscillation çözüm testi sonrası):** "2026-04-15: wait_for_service_state
  3-ardışık-poll fix canlı test sonucu {PASS/FAIL}. Sebep: healthcheck state oscillation
  `unhealthy→healthy` geçişini tolere edecek şekilde güncellendi."

---

## 9. Karşı-Çıkış / Öz-Eleştiri

- **"Rota B tercihim" hatalıydı:** canary prereq'ini gözden kaçırdım. P0/P0.5 gating.
- **PR6 parçalanması 2 değil 3 PR:** PR6a/6b/6c ayrımı TB-11'de net.
- **`session-plan-20260414-zanzibar-context.md` dosyası önce yoktu** — plan sohbette kaldı; bu dosya
  o boşluğu kapatır.
- **Full gate chain flaky:** integration lane OpenFGA container gerektiriyor (connection refused);
  `JwtTokenProviderTest.shouldRejectTamperedTokens` ayrıca flaky. Light-mode worktree hook
  kullanılmalı. Full gate sadece CI'da (doğru — AGENTS.md §0d).

---

## 10. Session-End Checklist (yarın kapatırken)

- [ ] P0 Vault oscillation fix canlı test sonucu (PASS/FAIL)
- [ ] P0.5 Zanzibar canary 4/4 metric durumu
- [ ] PR6a/6b/6c — kaçı açıldı, kaçı merged
- [ ] doctor-zanzibar A19 uyarı sayısı (şu an 4, hedef 0)
- [ ] QW1 A20 drift guard merged mi
- [ ] QW2 run_local_gate_chain.sh bug fix atıldı mı
- [ ] MF React duplicate — progress notu
- [ ] Yeni handoff dosyası: `session-handoff-20260415-*.md`
- [ ] Memory güncellemesi: project_zanzibar_status.md faz durumu
