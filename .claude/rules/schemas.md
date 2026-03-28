---
globs: schemas/**
---
# Managed Repo Schema Rules

- Schemas synced from orchestrator via standards.lock
- Do NOT modify synced schemas directly — propose CHG in orchestrator
- Local schemas (if any): same naming as orchestrator (`*.schema.v1.json`)
- Validate: `python3 ci/check_standards_lock.py`
