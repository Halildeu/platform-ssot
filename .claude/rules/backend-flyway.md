---
globs: backend/*/src/main/resources/db/**
---
# Flyway Migration Rules
Follow AGENT-CODEX.backend.md (§Database: Flyway migrations).
- Naming: `V{N}__{description}.sql` (double underscore, sequential number)
- Never modify existing migration files (checksums will break)
- Current: Flyway 11.7.2, PostgreSQL 18.3
