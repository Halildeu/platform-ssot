---
globs: backend/*-service/**
---
# Backend Service Rules
Follow AGENT-CODEX.backend.md (§Spring Boot Pattern: Controller → Service → Repository → Model → DTO).
Claude-only: run `cd backend && mvn test -pl <service-name>` before committing service changes.

## Auth Architecture Rules (CRITICAL — DO NOT CHANGE)
- Authorization: OpenFGA (Zanzibar) via `OpenFgaAuthzService`
- **permission-service is REMOVED** — port 8090 does not exist
- `SecurityConfigLocal` (`@Profile("local","dev")`) provides permitAll
- `ScopeContextFilter` order: **`LOWEST_PRECEDENCE - 10`** (AFTER Spring Security)
  - DO NOT change to HIGHEST_PRECEDENCE — userId will be null
- report-service: `MockPermissionServiceClient` `@Profile("conntest","local","dev")`
- report-service: `PermissionServiceClient` `@Profile("!conntest & !local & !dev")`
- report-service: `SecurityConfig` `@Profile("!local & !dev")`
- **NEVER modify SPRING_PROFILES_ACTIVE or .env files** without user approval
