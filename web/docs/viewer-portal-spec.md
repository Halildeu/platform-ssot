# Secure Viewer Portal Specification

## Architecture
- Nextra-based docs portal (apps/docs)
- Authentication: Keycloak SSO integration
- Authorization: role-based content visibility
- Deployment: static export + CDN

## Access Levels

| Level | Sees | Auth |
|-------|------|------|
| Public | Getting started, overview | None |
| Team | Full docs + examples | SSO |
| Admin | + quality dashboard, governance | SSO + role |

## Content Structure

```
apps/docs/
  pages/
    index.mdx            # Public — landing
    getting-started/      # Public — quick start guides
    components/           # Team — full component docs
    recipes/              # Team — composition recipes
    api/                  # Team — API reference
    quality/              # Admin — quality dashboard
    governance/           # Admin — governance reports
    _meta.json            # Navigation + access annotations
```

## Security

- CSP headers on static assets
- SRI for external scripts
- No credentials in docs content
- Audit log for access
- Rate limiting on SSO callback

### Content Security Policy

```
default-src 'self';
script-src 'self' 'sha256-{hash}';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://img.shields.io;
connect-src 'self' https://sso.internal;
frame-ancestors 'none';
```

### Subresource Integrity

All external scripts loaded with `integrity` attribute:
```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-{hash}"
        crossorigin="anonymous"></script>
```

## Authentication Flow

1. User visits protected route
2. Keycloak proxy intercepts unauthenticated requests
3. Redirect to SSO login
4. On success, JWT issued with role claims
5. Nextra middleware checks role against page access level
6. Authorized content rendered; unauthorized shows 403

## Deployment

```bash
# Build static docs
pnpm --filter @mfe/docs build

# Output: apps/docs/out/ — static HTML + assets
# Deploy to internal CDN with Keycloak proxy
```

### Infrastructure

- Static HTML served from CDN edge nodes
- Keycloak reverse proxy for protected routes
- Webhook on merge to `main` triggers rebuild
- Blue-green deployment with instant rollback
