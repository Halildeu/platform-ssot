# CLAUDE.md — dev (full-stack ERP monorepo)

## Identity
Full-stack ERP monorepo: web/ (React MFE platform) + backend/ (Java Spring Boot microservices).
Managed repo under autonomous-orchestrator control-plane governance.

## Multi-Agent Coordination
- **AGENTS.md** is the canonical router for task-type classification ([BE], [WEB], [MOB], [AI], [DATA], [DOC])
- **AGENT-CODEX.web.md** — detailed web task guidance
- **AGENT-CODEX.backend.md** — detailed backend task guidance
- This file adds Claude Code-specific behavior only

## Authority Hierarchy
1. `standards.lock` + `docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md` (canonical)
2. `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md` (authority resolution)
3. `AGENTS.md` + `AGENT-CODEX.*.md` (transition-active guidance)

## Web Stack (web/)
- React 18.2, TypeScript 5.8.3, Webpack 5 Module Federation
- MFE apps:
  - mfe-shell:3000 (host), mfe-suggestions:3001, mfe-ethic:3002
  - mfe-users:3004, mfe-access:3005, mfe-audit:3006, mfe-reporting:3007
- Design system: `packages/design-system` (AG Grid 34.3.1, token chain)
- Start all: `npm start` or `bash scripts/health/run-dev-servers.sh --profile full`
- Lint: `npm run lint` (eslint + stylelint)
- Test: `npm test`

## Backend Stack (backend/)
- Java 21, Spring Boot 3.5.6, Spring Cloud 2025.0.1
- Flyway 11.7.2, PostgreSQL 18.3
- Services:
  - discovery-server:8761, api-gateway:8080
  - auth-service:8088, user-service:8089, permission-service:8084
  - core-data-service:8092, variant-service:8091, report-service:8095
- Start all: `cd backend && bash dev-start.sh` (infra + services + frontend)
- Start backend only: `cd backend && bash scripts/run-services.sh`
- Docker compose: `cd backend && docker compose up -d`

## Auth Model
- **Keycloak = login only** — handles authentication, issues JWT tokens
- **permission-service = all authorization** — RBAC, permissions, access control
- Dev bypass: `AUTH_MODE=permitAll` (no Keycloak needed)
- Keycloak dev credentials: see memory reference_dev_login.md

## Validation Commands
- Standards lock: `python3 ci/check_standards_lock.py`
- Architecture check: `python3 scripts/check_arch_vs_code.py`
- Module delivery lanes: `python3 ci/check_module_delivery_lanes.py --strict`
- Full lint: `python3 scripts/run_lint_all.py`
- Full test: `python3 scripts/run_tests_all.py`
- Security: `python3 scripts/check_security_all.py`

## Worktree Conventions
- Branch naming: `claude/<worktree-name>`
- Validate before commit: lint + tests for affected domain (web or backend)

## Code Conventions
- Web: TypeScript strict, functional components, design-system tokens
- Backend: Spring Boot conventions, controller/service/repository pattern
- Flyway: `V{N}__{description}.sql` naming, idempotent migrations
- Git: conventional commits `type(scope): message`
- Secrets: never commit — use env vars, .env files gitignored

## Language
- User communicates in Turkish; respond in Turkish for conversation
- Code, comments, variable names: English

## Path-Specific Rules
See `.claude/rules/` for domain-specific conventions.
