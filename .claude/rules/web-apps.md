---
globs: web/apps/**
---
# MFE App Rules

- Module Federation: each app is a remote, mfe-shell is the host
- Routing: lazy-loaded routes, prefixed by app name
- State: TanStack Query for server state, local state for UI
- HTTP: use shared-http package for API calls (axios-based)
- Components: prefer design-system components over raw HTML/MUI
- Auth: use AuthProvider from shared-auth, AUTH_MODE=permitAll for dev
- i18n: all user-facing strings through react-i18next
- TypeScript strict mode, no `any` types
- Each app has webpack.dev.js + webpack.common.js
