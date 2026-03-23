---
globs: ci/**, scripts/**
---
# CI/Scripts Rules

- Exit code 0 = pass, non-zero = fail
- JSON report output to `.cache/reports/`
- Session tracking: `.cache/runtime_guard/` for startup state
- Health checks: check-runtime-guard.py, check-web-runtime-guard.py
- Module delivery lanes: ci/run_module_delivery_lane.py (unit → api → contract → integration → e2e)
- Standards lock: ci/check_standards_lock.py (governance gate)
- All scripts idempotent, safe to re-run
