---
globs: web/packages/**
---
# Shared Package Rules

- Packages are consumed by MFE apps via workspace dependency
- Versioned independently (package.json version field)
- Export via index.ts barrel file
- No side-effects in packages (pure functions, components, types)
- shared-http: axios instance with interceptors (auth, error handling)
- shared-types: TypeScript interfaces shared across apps
- shared-auth: Keycloak integration, AuthProvider, useAuth hook
