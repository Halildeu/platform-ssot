---
globs: backend/common-auth/**
---
# Common Auth Module Rules

- Shared library consumed by all backend services
- JWT token parsing and validation
- Keycloak public key retrieval for signature verification
- Spring Security filter chain configuration
- Version: 1.0.0 (referenced by services as dependency)
- Changes here affect ALL services — test thoroughly
