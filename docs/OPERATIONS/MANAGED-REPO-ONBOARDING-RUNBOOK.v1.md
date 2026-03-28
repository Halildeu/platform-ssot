# MANAGED-REPO-ONBOARDING-RUNBOOK (v1)

Amaç: Yeni taşeron repoyu standart lane/gate sistemiyle hızlı ve güvenli şekilde devreye almak.

## 1) Onboarding Scope
- Kaynak SSOT repo: `autonomous-orchestrator`
- Hedef taşeron repo: `<repo_root>`
- Zorunlu branch: `main`

## 2) Standards Sync
- SSOT manifeste repo eklenir: `.cache/managed_repos.v1.json`
- Standartlar apply edilir:
  - `python3 scripts/sync_managed_repo_standards.py --manifest-path .cache/managed_repos.v1.json --apply --validate-after-sync`

## 3) Lane Contract Doğrulaması
- `python3 ci/check_standards_lock.py --repo-root <repo_root>`
- `python3 ci/check_module_delivery_lanes.py --strict`

## 4) Lane Zinciri (zorunlu sıra)
- `python3 ci/run_module_delivery_lane.py --lane unit`
- `python3 ci/run_module_delivery_lane.py --lane contract`
- `python3 ci/run_module_delivery_lane.py --lane integration`
- `python3 ci/run_module_delivery_lane.py --lane e2e`

## 5) Branch Protection Kilidi
Required checks:
- `module-delivery-gate`
- `enforcement-check`
- `validate-schemas`
- `policy-dry-run`
- `gitleaks`

Zorunlu ayarlar:
- `strict=true`
- `enforce_admins=true`
- `required_approving_review_count>=1`

## 6) Evidence Paketleme
- Drift scoreboard: `.cache/reports/drift_scoreboard.v1.json`
- Tekil repo snapshot: `.cache/reports/release-evidence/<repo>_gate_lock_snapshot.v1.json`
- Portföy snapshot: `.cache/reports/release-evidence/managed_repo_gate_lock_snapshot.v1.json`
- Lane matrix: `.cache/reports/release-evidence/managed_repo_lane_override_matrix.v1.json`

## 7) Done Kriteri
- Lane zinciri yeşil
- Branch protection required checks eksiksiz
- Drift scoreboard `status=OK`
- Snapshot `snapshot_status=OK`
