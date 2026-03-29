---
globs: backend/*-service/**
---
# Backend Service Rules
Follow AGENT-CODEX.backend.md (§Spring Boot Pattern: Controller → Service → Repository → Model → DTO).
Claude-only: run `cd backend && mvn test -pl <service-name>` before committing service changes.

## Auth Architecture (CRITICAL — do NOT change)
- Authorization: OpenFGA (Zanzibar) — `erp.openfga.enabled=true` in docker, `false` in local
- Authentication: Keycloak only — JWT identity tokens
- **permission-service is REMOVED** — do NOT re-add or reference it
- SecurityConfigLocal (`@Profile("local","dev")`) provides permitAll for local dev
- ScopeContextFilter order: `LOWEST_PRECEDENCE - 10` (AFTER Spring Security) — do NOT change
- **NEVER modify docker-compose.yml SPRING_PROFILES_ACTIVE** without explicit user approval
- **NEVER modify .env or .env.local files** without explicit user approval
