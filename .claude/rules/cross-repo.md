---
globs: docs/OPERATIONS/**, standards.lock
---
# Cross-Repo Rules (Dev Perspective)

- This repo is managed by autonomous-orchestrator control-plane
- standards.lock must pass: `python3 ci/check_standards_lock.py`
- Do NOT modify synced files (OPERATIONS/*.md, standards.lock schemas) directly
- Changes to governance: propose CHG in orchestrator repo
- Auth model: Keycloak = login only, permission-service = all authorization
- Context consumption: see docs/OPERATIONS/MANAGED-REPO-CONTEXT-CONSUMPTION.v1.md
