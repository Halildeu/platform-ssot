---
globs: ci/**, scripts/**
---
# CI/Scripts Rules
Follow docs/OPERATIONS/CODING-STANDARDS.md for script conventions.
- Exit code 0 = pass, non-zero = fail (gate semantics)
- JSON reports to `.cache/reports/`
- All scripts idempotent, safe to re-run
