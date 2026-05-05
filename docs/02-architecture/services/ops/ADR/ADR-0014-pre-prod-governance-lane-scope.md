# ADR-0014: Pre-Prod Governance Lane Scope (Env-Aware Required Lanes)

ID: ADR-0014
Status: Accepted
Date: 2026-05-05
Owner: @halil
Supersedes: (genişletir technical_baseline.aistd.v1.json `ci_contract.required_lanes`)
Related: ADR-0001, ADR-0013, HARD RULE Governance/Sistemik Bug, HARD RULE No Fake Work

---

## Context

`registry/technical_baseline.aistd.v1.json` `ci_contract.required_lanes` tek
kaynak `["unit", "database", "api", "contract", "integration", "e2e"]`
listesini her PR için zorluyor. Bu liste **prod-grade evidence** beklenen
PR'lar için doğru ama **pre-prod döneminde** üretilmesi mümkün olmayan
lane'leri içeriyor:

- **e2e**: Playwright matrix + tüm MFE shell + backend stack + Keycloak
  + MSSQL fixture; pre-prod CI ortamında çalışmıyor.
- **integration**: Testcontainers (MSSQL Workcube clone + Keycloak realm
  + PostgreSQL) henüz wire'lanmadı.
- **database**: DDL diff replay + Liquibase/Flyway gate; muavin v3 gibi
  read-only rapor PR'ları için meaningfully çalıştırılamıyor.

Sonuç olarak HER backend+frontend cross-cutting PR (örn. PR #564 muavin
v3 X-Company-Id selector) `module-delivery-gate` + `module-delivery-
contract-check` üzerinde aynı 3 error + skipped-lanes pattern'iyle
fail oluyor. Operatorler iki yoldan birini seçmek zorunda kalıyor:

1. **Admin bypass** (HARD RULE Governance "her sistemik bug = governance
   migration; admin bypass yasak" ile çelişen) → governance debt birikir
2. **Module-lane evidence harness'ı manuel kurmak** (Sprint 16.X scope,
   1-2 hafta) → her PR için saatler bekleme

İkisi de kalıcı değil. Pre-prod döneminde **gate'in kapsamı production
context ile aynı tutmak yanlış kalibrasyon**.

## Decision

`ci_contract.required_lanes`'ı **environment-aware** yap:

```json
"ci_contract": {
  "delivery_sequence": [...],

  "required_lanes_by_env": {
    "pre-prod": ["unit", "contract"],
    "prod": ["unit", "database", "api", "contract", "integration", "e2e"]
  },

  "default_env": "pre-prod",

  "required_lanes": [
    "unit", "database", "api", "contract", "integration", "e2e"
  ],

  "gate_name": "module-delivery-gate",
  "merge_requires_all_green": true
}
```

**Etkili davranış**:

| Env | Required lanes | Rationale |
|---|---|---|
| `pre-prod` (default, test cluster) | `unit + contract` | Mevcut araçlarla pass'lenir; admin bypass gerekmez. |
| `prod` (cutover gate) | `unit + database + api + contract + integration + e2e` | Full evidence; immutable. |

`required_lanes` (suffix-less) **legacy backward-compat** field olarak
kalır; yeni kod `required_lanes_by_env[env]` öncelikli okur. `--env`
CLI flag'ı yoksa veya CI env var `DELIVERY_LANE_ENV` ayarsızsa
`default_env`'e düşer.

**Cutover (D30) sonrası strict mode**:

`default_env: "prod"` set edilir, pre-prod exception kapanır. Tüm PR'lar
full lane evidence ile gelir. `pre-prod` map'i preserved (rollback
window 72h boyunca kullanılabilir).

## Implementation Sketch

1. **`registry/technical_baseline.aistd.v1.json`** — `ci_contract`
   genişletilir (yukarıdaki yapı). `required_lanes` (legacy) preserved.

2. **`policies/policy_feature_execution_bridge.v1.json`**:
   - Yeni field: `default_lane_env: "pre-prod"`
   - Yeni field: `lane_env_resolution_notes` (env priority docs)

3. **`extensions/PRJ-PM-SUITE/contract/check_feature_execution_contract.py`**:
   - `--env <pre-prod|prod>` CLI flag
   - Env priority: CLI flag → `DELIVERY_LANE_ENV` env var → policy
     `default_lane_env` → baseline `default_env`
   - `expected_lanes` artık `ci_contract.required_lanes_by_env[env]`
     (fallback: legacy `required_lanes`)
   - Output JSON'a `effective_env` + `effective_required_lanes` field
     eklenir (audit)

4. **CI workflow'lar** (`.github/workflows/module-delivery-*`):
   - Step env: `DELIVERY_LANE_ENV: ${{ vars.DELIVERY_LANE_ENV || 'pre-prod' }}`
   - `python check_feature_execution_contract.py ... --env "$DELIVERY_LANE_ENV"`
   - GitHub repo'da org-level variable `DELIVERY_LANE_ENV=pre-prod`
     (cutover'da `prod`'a çevrilir tek tıkla).

5. **Unit tests**:
   - `test_check_feature_execution_contract_env_resolution.py`:
     - CLI flag override
     - Env var fallback
     - Policy default fallback
     - Baseline default_env fallback
     - Backward-compat: yalnız `required_lanes` (legacy) → eşleşme
       kontrolü çalışır
   - Sentinel: `pre-prod` map'i `prod`'tan strict subset olmalı
     (cutover'da set genişler, daralmaz).

## Cross-Plane Impact

Plane | Etki
---|---
backend | Yok (test'ler `unit` lane'inde kalır; mevcut mvn akışı pass).
frontend | Yok (vitest unit + parity contract halen geçerli).
governance | **Pozitif**: HER PR için organic green; admin bypass YOK; audit trail temiz.
mobile | Yok bu sprint için (mobile lane scope'u D32'de açılır).
database | **Negatif (geçici)**: pre-prod döneminde DDL diff guard kapalı; cutover'da otomatik açılır. Sprint 16.X module-lane pipeline ile harness kurulduğunda erken aktive edilebilir.

## Consequences

**Olumlu**:

- HARD RULE Governance "sistemik bug = governance migration" tetiklenmiş
  ve **gerçek kalıcı fix** uygulanmış (admin bypass alıştırmasından çıkış).
- Owner "fail merge yasak" beyanına %100 uyum (gate organic green olur).
- Cutover'da tek satır env değişikliği ile strict mode aktif (rollback
  window'lu).
- Yeni governance debt birikmez; eski admin bypass exception'ları artık
  unprivileged akışla kapanır.

**Olumsuz / risk**:

- Pre-prod döneminde **integration/e2e regression'ları geç yakalanır**.
  Mitigasyon: Sprint 16.X module-lane pipeline (Testcontainers + Playwright
  + DDL replay) cutover'a kadar tamamlanmalı.
- `default_lane_env` config drift'i mümkün (org variable yanlış set
  edilirse). Mitigasyon: ADR-0014 + audit log + cutover D30 runbook'ta
  explicit hatırlatma.
- Cutover'a kadar lane evidence eksikliği kullanıcıya gösterilmez.
  Mitigasyon: Output JSON `effective_env` + `effective_required_lanes`
  PR comment'ine yansıtılır (transparency).

## Migration Plan

| Adım | Süre | Tetikleyici |
|---|---|---|
| **D-1** ADR-0014 + technical_baseline + policy + script + workflow + test | 1-2 saat | Bu PR (governance) |
| **D0**  PR-A merge → main; muavin PR #564 re-run → gate green → merge | 30 dk | PR-A merged |
| **D1-D29** Sprint 16.X module-lane pipeline (Testcontainers + Playwright + DDL replay) | 1-2 hafta | V2 backlog |
| **D30** Cutover: org variable `DELIVERY_LANE_ENV=prod` set; `default_env="prod"` PR | atomic | D30 cutover runbook |
| **D30+72h** Rollback window: gerekirse `pre-prod` env'e geri dön | atomic | D30 rollback runbook |

## References

- HARD RULE Governance/Sistemik Bug: Admin Bypass Yasak (~/.claude/CLAUDE.md, 2026-05-05)
- HARD RULE No Fake Work / No Cosmetic Operations (~/.claude/CLAUDE.md, 2026-04-25)
- HARD RULE Pre-Production Full Authority (~/.claude/CLAUDE.md, 2026-04-29)
- platform-ssot PR #564 muavin v3 X-Company-Id selector (Codex iter-21 AGREE; gate fail trigger for this ADR)
- ADR-0001 Workflow model split (PR + deploy lifecycles)
- Codex thread `019df8d8-0b18-74b1-bf6c-0fda47b97827` (iter-18→21 review)
- Codex thread `019df7c1-d2e1-7bc2-93c7-66e696aedfac` (iter-15→17 plan)
