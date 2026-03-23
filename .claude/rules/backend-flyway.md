---
globs: backend/*/src/main/resources/db/**
---
# Flyway Migration Rules

- Naming: `V{N}__{description}.sql` (double underscore, sequential number)
- Idempotent: use IF NOT EXISTS, ON CONFLICT DO NOTHING where possible
- Each service has own schema: `<service_name>` (e.g., permission_service)
- History table: `<service>_flyway_history` (custom per service)
- baseline-on-migrate: true (configured in application.properties)
- Never modify existing migration files (checksums will break)
- Test migrations on clean database before committing
- Current: Flyway 11.7.2, PostgreSQL 18.3
