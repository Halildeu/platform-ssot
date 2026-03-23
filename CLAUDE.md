# CLAUDE.md — dev (full-stack ERP monorepo)

@AGENTS.md

## Claude Code-Specific (AGENTS.md'de olmayan)

### Quick Start
- Web full stack: `npm start` (7 MFE, ports 3000-3007)
- Backend full stack: `cd backend && bash dev-start.sh`
- Backend docker only: `cd backend && docker compose up -d`

### Auth Model
- **Keycloak = login only** — handles authentication, issues JWT tokens
- **permission-service = all authorization** — RBAC, permissions, access control
- Dev bypass: `AUTH_MODE=permitAll` (no Keycloak needed)

### Worktree Conventions
- Branch naming: `claude/<worktree-name>`
- Validate before commit: lint + tests for affected domain

### Language
- User communicates in Turkish; respond in Turkish for conversation
- Code, comments, variable names: English

### Path-Specific Rules
See `.claude/rules/` for domain-specific conventions.
