---
globs: web/apps/**
---
# MFE App Rules
Follow AGENT-CODEX.web.md (§MFE conventions: Module Federation, routing, state, auth).
Claude-only: run `cd web && npm run lint && npm test` before committing app changes.

## Auth & Environment Rules (CRITICAL)
- **NEVER modify `web/apps/mfe-shell/.env.local`** — this is the developer's personal config
- Auth mode is `AUTH_MODE=keycloak` (sektör standardı) — do NOT change to permitAll
- `VITE_ENABLE_FAKE_AUTH` is for CI only — do NOT enable in .env.local
- If tests need permitAll, use test-specific env files or test fixtures, NOT .env.local
- Dev login: Keycloak (http://localhost:8081) → admin@example.com
- Backend local profile: SecurityConfigLocal provides permitAll for API endpoints
- Frontend always uses Keycloak login — this is intentional
