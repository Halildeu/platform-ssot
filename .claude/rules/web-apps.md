---
globs: web/apps/**
---
# MFE App Rules
Follow AGENT-CODEX.web.md (§MFE conventions: Module Federation, routing, state, auth).
Claude-only: run `cd web && npm run lint && npm test` before committing app changes.

## Decision Registry (MUST READ FIRST)
Before modifying auth/proxy code, read `decisions/topics/zanzibar-openfga.v1.json`. Decisions marked FINAL cannot be reverted. Constraints are HARD RULES.

## Auth & Vite Config Rules (CRITICAL — DO NOT CHANGE)
- **NEVER modify `web/apps/mfe-shell/.env.local`** — developer's personal config
- **NEVER change AUTH_MODE** — it is `keycloak` (sektör standardı)
- **NEVER change vite.config.ts proxy targets** without explicit user approval:
  - `/api/v1/authz` → `http://localhost:8089` (user-service, NOT 8090)
  - `/api/v1/users` → `http://localhost:8089` (user-service)
  - `/api/v1/reports` → `http://localhost:8095` (report-service)
  - `/api/v1/companies` → `http://localhost:8092` (core-data-service)
  - `/api/v1/themes` → `http://localhost:8091` (variant-service)
  - Port 8090 (permission-service) is REMOVED — never use it
- `use-authorization.model.ts` contains OpenFGA module→legacy mapping — DO NOT remove
