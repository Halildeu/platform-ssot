# SPEC-0017: Workflow Tracking & Modeling SSOT v0.1

ID: SPEC-0017  
Status: Draft  
Owner: @team/platform

1. AMAÇ
Local SSOT yaklaşımında iş akışını izlemek, tıkanmaları teşhis etmek ve fix-loop’u lokalden yönetmek için kanonik model tanımlamak.

2. KAPSAM
- PR Lifecycle: push → PR → ci-gate → local fix-loop → merge (Merge Bot)
- Deploy Lifecycle: merge SHA → deploy → validate → rollback
- SSOT artefact’lar, minimum alanlar, failure taxonomy → action mapping

3. MODELLEME KARARI (ÖZET)
- PR Lifecycle ve Deploy Lifecycle iki ayrı state machine’dir.
- Join key: merge SHA (main commit).

4. PR LIFECYCLE (SSOT = PR-TRACKER.tsv)

4.1 SSOT Dosyası
- Local: `.autopilot-tmp/pr-tracker/PR-TRACKER.tsv` (gitignored)

4.2 Minimum Alanlar (şema özeti)
PR tracker için minimum alanlar:
- `PR`
- `DRAFT`
- `MERGEABLE_STATE`
- `MERGE_POLICY`
- `READY_LABEL`
- `FAIL_WORKFLOWS`
- `NEXT_ACTION`

4.3 NEXT_ACTION Kanonu (örnek)
- `DRAFT`
- `RESOLVE_CONFLICTS`
- `WAIT_CI_GATE`
- `FIX_CI`
- `POLICY_NO_MERGE`
- `ADD_READY_LABEL`
- `WAIT_MERGEABLE`
- `READY`

5. DEPLOY LIFECYCLE (SSOT = chain log index)

5.1 SSOT Artefact
- Local kanıt dizini: `artifacts/ci-logs/main-<sha7>/`
  - deploy run linkleri
  - validate/rollback run linkleri
  - `DEPLOY-CHAIN.md` / `DIGEST.md` / summary çıktıları

5.2 Kill-switch Semantiği
- `DEPLOY_ENABLED != "true"` → deploy/validate skip
- `ROLLBACK_ENABLED != "true"` → rollback skip
- Rollback manual (break-glass):
  - `workflow_dispatch` + `confirm=ROLLBACK`

6. FAILURE TAXONOMY → AKSİYON HARİTASI (Özet)
- conflict → `RESOLVE_CONFLICTS` (local)
- behind/out-of-date → update branch / rerun `ci-gate`
- `ci-gate` fail → `FIX_CI` (local fix-loop)
- merge-bot noop (missing label) → `ADD_READY_LABEL`
- merge-bot not triggered → `MERGE_BOT_DISPATCH` (fallback)
- deploy disabled → ops: `DEPLOY_ENABLED=true` (policy)
- validate fail → URL/secrets kontrolü → rollback (policy)

7. LİNKLER
- ADR: `docs/02-architecture/services/ops/ADR/ADR-0001-workflow-model-split-pr-and-deploy-lifecycles.md`
- Runbook: `docs/04-operations/RUNBOOKS/RB-insansiz-flow.md`
- Runbook: `docs/04-operations/RUNBOOKS/RB-local-merge-deploy-orchestrator.md`
