# CLAUDE.md — Frontend Monorepo (dev/web)

## Stack
- React 18.2, TypeScript 5.x, Vite 8.0.1
- Tailwind CSS 4.x (via @tailwindcss/vite plugin)
- AG Grid Enterprise 34.3.1 + AG Charts Enterprise 12.3.1
- Module Federation (Vite) — mfe-shell hosts remotes
- State: Redux Toolkit + RTK Query + TanStack Query
- Design System: `@mfe/design-system` (monorepo package)
- Auth: Keycloak (login only), permission-service (authorization)
- Lucide React for icons

## Monorepo Structure
```
apps/
  mfe-shell/       — Host app (port 3000)
  mfe-suggestions/ — (port 3001)
  mfe-ethic/       — (port 3002)
  mfe-users/       — (port 3004)
  mfe-access/      — (port 3005)
  mfe-audit/       — (port 3006)
  mfe-reporting/   — (port 3007)
packages/
  design-system/   — @mfe/design-system
  shared-http/     — @mfe/shared-http
  shared-types/    — @mfe/shared-types
  i18n-dicts/      — @mfe/i18n-dicts
```

## Critical Rules
- **AG Grid v34.3.1** — See `.claude/rules/ag-grid.md` for API reference
- **No require()** — Vite uses ESM. Use `import` always. `require()` silently fails.
- **Design system icons** — Always use `lucide-react`, never inline SVG
- **Auth bypass (dev)** — `AUTH_MODE=permitAll VITE_ENABLE_FAKE_AUTH=true`
- **Vite stdin** — Dev servers use `stdin=subprocess.PIPE` (not DEVNULL) to prevent auto-shutdown

## Dev Server
```bash
# Start all (backend guard skip)
WEB_RUNTIME_REQUIRE_BACKEND_GUARD=0 npm start

# Shell only
cd apps/mfe-shell && AUTH_MODE=permitAll VITE_ENABLE_FAKE_AUTH=true npx vite

# Monitor
python3 scripts/health/monitor-dev-servers.sh --daemon
```

## Backend (Java Spring Boot)
```
~/Documents/dev/backend/
  user-service     — port 8089
  auth-service     — port 8088
  permission-svc   — port 8090
  report-service   — port 8095
  api-gateway      — port 8080
  keycloak         — port 8081
```

## Language
- User speaks Turkish, respond in Turkish for conversation
- Code, variable names, comments: English
