## Managed Repo Onboarding PR

### 1) Onboarding Scope
- Managed repo root:
- Repo slug (`owner/repo`):
- Target default branch: `main`
- Onboarding mode: `new_repo` / `retrofit_existing`

### 2) Standards Sync
- [ ] `standards.lock` synced
- [ ] `.github/CODEOWNERS` synced
- [ ] `.github/workflows/gate-enforcement-check.yml` synced
- [ ] `.github/workflows/module-delivery-lanes.yml` synced
- [ ] `ci/module_delivery_lanes.v1.json` synced (veya bilinçli override)
- [ ] `docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md` synced

### 3) Lane Override Matrix
- [ ] Repo lane matrix dosyası güncel (`docs/OPERATIONS/module-delivery-lane-override-matrix.v1.json`)
- [ ] `unit` lane komutu doğrulandı
- [ ] `contract` lane komutu doğrulandı
- [ ] `integration` lane komutu doğrulandı
- [ ] `e2e` lane komutu doğrulandı

### 4) CI / Gate Kanıtı
- [ ] `python3 ci/check_standards_lock.py` => `OK`
- [ ] `python3 ci/check_module_delivery_lanes.py --strict` => `OK`
- [ ] `python3 ci/run_module_delivery_lane.py --lane unit` => `OK`
- [ ] `python3 ci/run_module_delivery_lane.py --lane contract` => `OK`
- [ ] `python3 ci/run_module_delivery_lane.py --lane integration` => `OK`
- [ ] `python3 ci/run_module_delivery_lane.py --lane e2e` => `OK`

### 5) Branch Protection Lock
- [ ] required checks set:
  - `module-delivery-gate`
  - `enforcement-check`
  - `validate-schemas`
  - `policy-dry-run`
  - `gitleaks`
- [ ] `strict=true`
- [ ] `enforce_admins=true`
- [ ] `required_approving_review_count>=1`

### 6) Evidence
- branch protection report path:
- lane reports path:
- drift scoreboard path:
- release-evidence snapshot path:

### 7) Risk / Rollback
- Risk notes:
- Rollback plan:
  - branch protection contexts eski haline dön
  - onboarding commit revert
  - managed manifestten repo çıkar
