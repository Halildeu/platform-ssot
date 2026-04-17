# Zanzibar Open Items Index — v27

**Status:** Working index (authority DEĞİL). Canonical delivery dokümanları:
`docs/03-delivery/PROJECT-FLOW.md`, `STORIES/**`, `ACCEPTANCE/**`, `TEST-PLANS/**`,
`docs/04-operations/RUNBOOKS/**` per `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md`.
Bu dosya master plan Rev 27'in konsolide open-items snapshot'ı.

**Referans plan:** `.claude/plans/zanzibar-master-plan.md` (Rev 27, §2 link).

**Oluşturuldu:** 2026-04-17, Codex MCP uzlaşı thread `019d9cc5-7d57-78f3-b126-cce0f3d1d657`
(4 tur REVISE→REVISE→PARTIAL→AGREE, ready_for_impl: true).

---

## Gate Taxonomy (master plan §1)

| Gate | Tanım |
|------|-------|
| `stage-2-runnable` | Synthetic canary wrapper teknik olarak koşabilir (altyapı + config valid) |
| `stage-2-execution` | Canlı synthetic canary run fiilen icra edildi (k6+probe+metrics) |
| `stage-3-evidence` | Evidence PASS audit checklist geçti |
| `prod-cutover-gate` | Prod deploy öncesi zorunlu manuel operasyonel rehearsal (KMS + IAM + escrow + break-glass) |
| `non-blocking` | Tespit edildi, ana path'i bloklamıyor (operasyonel drift veya design follow-up) |

---

## Open Items (14 açık)

| ID | İş | Gate | Home | Owner | Bağımlılık |
|----|-----|------|------|-------|-----------|
| OI-01 | STORY-0319 4-PR completion (staging prod-like profile) | `stage-2-runnable` | `docs/03-delivery/STORIES/STORY-0319-staging-prod-profile-migration.md` | @halil | [PR #451](https://github.com/Halildeu/platform-ssot/pull/451) merged + [PR #452](https://github.com/Halildeu/platform-ssot/pull/452) merged; PR #3/4 + PR #4/4 kaldı |
| OI-02 | Dalga 1 Stage 2 synthetic canary **canlı run** | `stage-2-execution` | `docs/04-operations/RUNBOOKS/RB-zanzibar-canary.md` + `backend/scripts/perf/run-zanzibar-canary.sh` | @halil | OI-01 |
| OI-03 | Dalga 1 Stage 3 Evidence PASS audit | `stage-3-evidence` | `RB-zanzibar-canary.md` §3.3 | @halil | OI-02 |
| OI-04 | Cloud KMS staging rehearsal + IAM + recovery-key escrow + AppRole rotation + KMS loss path | `prod-cutover-gate` | `docs/03-delivery/ACCEPTANCE/AC-0320-zanzibar-prod-cutover-prep.md` Senaryo 2/5/6 + `docs/03-delivery/TEST-PLANS/TP-0320-zanzibar-prod-cutover-prep.md` §4 + `docs/04-operations/RUNBOOKS/RB-vault-kms-autounseal.md` §8 | @halil | OI-03 |
| OI-05 | Scope reconciliation (scheduled + on-demand hybrid) | `non-blocking` | ADR (yeni, açılacak) | @halil | Codex tasarım bekliyor |
| OI-06 | OpenFGA model version management | `non-blocking` | ADR (yeni, açılacak) | @halil | — |
| OI-07 | k6 CI workflow regression gate | `non-blocking` | `.github/workflows/*` | @halil | OI-02 baseline |
| OI-08 | `zanzibar-guardrails.json` config loader + consistency test | `non-blocking` | `backend/scripts/ci/canary/` | @halil | — |
| OI-09 | `pull-grafana-metrics.mjs` query_range + phase window | `non-blocking` | `backend/scripts/ci/canary/pull-grafana-metrics.mjs` | @halil | — |
| OI-10 | `run-zanzibar-canary.sh` retry/backoff (write-path verify jitter) | `non-blocking` | `backend/scripts/perf/run-zanzibar-canary.sh` | @halil | — |
| OI-11 | Circuit breaker for writes | `non-blocking` | `backend/common-auth/` | @halil | — |
| OI-12 | EP-016 legacy auth import ban (enforcement rule) | `non-blocking` | `.github/workflows/enforcement-*` | @halil | — |
| OI-13 | JaCoCo coverage — threshold gate uplift + CI report artifact | `non-blocking` | `backend/pom.xml` + `.github/workflows/` | @halil | — |
| OI-14 | de/es/pseudo i18n completeness (Phase 3+4 keys) | `non-blocking` | `web/packages/i18n/` | @halil | — |

---

## Parking (2 item, aktif bloklayıcı değil)

| ID | İş | Gate | Home | Owner | Not |
|----|-----|------|------|-------|-----|
| PK-01 | P1.6 canary-admin + admin1@example.com KC login pre-auth flow deep debug | `non-blocking` | `~/.claude/projects/-Users-halilkocoglu-Documents-dev/memory/feedback_canary_admin_kc_login_deferred.md` | @halil | Workaround: `admin@example.com` super admin path aktif; canary k6/Playwright matrix buna çevrildi |
| PK-02 | `/api/v1/users/actuator/health` gateway 500 (local profile actuator secured) | `non-blocking-operational-drift` | **Ayrı ops-story** (master plan kapsamı DIŞI, açılacak) | @halil | Direct user-service `:8089/actuator/health` 200; post-deploy-health-check'i etkilemez |

---

## Bağımlılık zinciri (kritik path)

```
OI-01 (STORY-0319 4-PR)
  └─▶ OI-02 (Stage 2 canlı run)
        └─▶ OI-03 (Stage 3 Evidence PASS)
              └─▶ OI-04 (prod cutover gate: KMS rehearsal + IAM + escrow)
                    └─▶ Prod cutover hazır

Bağımsız paralel (non-blocking, herhangi bir sırayla ilerlenebilir):
OI-05, OI-06, OI-07 (OI-02 baseline sonrası), OI-08, OI-09, OI-10,
OI-11, OI-12, OI-13, OI-14
```

---

## Süpersede ve kapatma semantiği

**Master plan Rev 22-26 gövdesindeki open-item referansları bu index ile konsolide edilmiştir.** Eski backlog numaraları (Rev 22 Dalga 4 #1-14 + Rev 23 PR-3 #1-3 + Rev 25/26 update'ler):
- Dalga 4 #1 → OI-05
- Dalga 4 #2 → OI-06 (revize: `authz_sync_version` monotonicity ayrıldı, ADR-0013'te mevcut)
- Dalga 4 #3 → OI-07
- Dalga 4 #4 → OI-11
- Dalga 4 #5 → OI-12
- Dalga 4 #6 → OI-13
- Dalga 4 #12 (Dalga 2 Playwright E2E) → **SUPERSEDED** (PR #437 TAM KAPANIŞ; post-profile rerun gerekirse STORY-0319 AC içinde)
- Dalga 4 #13 (Vault prod seal KMS story) → OI-04 (`prod-cutover-gate` + Home re-bind)
- Dalga 4 #14 → OI-14
- Rev 23 PR-3 #1 → OI-08
- Rev 23 PR-3 #2 → OI-09
- Rev 23 PR-3 #3 → OI-10

**STORY-0316** (cross-plane auth session audit) bu index'e DAHİL EDİLMEMİŞTİR — upstream reference, Zanzibar migration arc kapsamı dışı.

---

## Güncelleme politikası

- Bir item kapandığında: tablodan **çıkar** (audit trail commit mesajında).
- Yeni item eklenmesi: master plan revizyonu (Rev 28+) ile birlikte; bu dosya tek başına "canonical backlog" değildir.
- Item scope değişikliği: Home kolonu güncellenir + commit mesajında açıklanır.
- State drift tespit edilirse: master plan gövdesi + bu index eş zamanlı güncellenir.

**Son güncelleme:** 2026-04-17, Rev 27 açılışı.
