# F7 Policy Pack — DRAFT

## Status: FRAMEWORK ONLY — No external commitments

---

## 1. Support Policy

### Tiers
- **Community**: GitHub issues, community forum, best-effort response
- **Professional**: 48h response SLA, priority queue, email support
- **Enterprise**: 4h critical response, dedicated channel, custom patches

### Scope
- Bug reports: all tiers
- Feature requests: Professional+
- Custom development: Enterprise only
- Security patches: all tiers (critical within 24h)

---

## 2. Security Policy

### Vulnerability Disclosure
- Report via: security@[domain] (encrypted)
- Response: acknowledge within 48h
- Fix timeline: Critical <= 7 days, High <= 30 days, Medium <= 90 days

### Security Practices
- Dependencies audited weekly (npm audit, Snyk)
- No known critical vulnerabilities in releases
- CSP-compatible output
- XSS prevention in editor/form-builder

---

## 3. Release Channels

| Channel | Cadence | Stability | Support |
|---------|---------|-----------|---------|
| stable | Monthly | Production-ready | Full |
| canary | Weekly | Pre-release | Best-effort |
| LTS | Quarterly | Long-term | 18 months |

### Version Strategy
- stable: semver, no breaking changes in minor
- canary: semver-pre, may contain breaking
- LTS: patch-only backports for critical/security

---

## 4. Compatibility Promise

### Browser Matrix
- Chrome/Edge: last 2 versions
- Firefox: last 2 versions
- Safari: last 2 versions
- Mobile: iOS Safari 16+, Chrome Android 120+

### Framework
- React: 18.x, 19.x
- TypeScript: 5.x
- Node.js: 20.x, 22.x (for SSR)

### Peer Dependencies
- AG Grid: 34.x
- AG Charts: 12.x
- Tiptap: 2.x (x-editor only)
- @dnd-kit: 6.x (x-kanban only)

---

## 5. Semver / Deprecation Contract

### Breaking Changes
- Major version only
- 6-month deprecation warning before removal
- Codemod provided for automated migration
- Migration guide published

### Deprecation Process
1. Mark with @deprecated JSDoc + console.warn in dev mode
2. Document in CHANGELOG
3. Provide migration path
4. Remove in next major (minimum 6 months later)

---

## 6. Licensing Framework

### Structure: Open Core
- **Community (MIT)**: Core components, basic features
- **Pro (Commercial)**: Advanced features, enterprise patterns
- **Enterprise (Commercial)**: Full suite, support, SLA

### Package Licensing
| Package | Community | Pro | Enterprise |
|---------|-----------|-----|-----------|
| x-data-grid (basic) | Y | Y | Y |
| x-data-grid (server-side, export) | | Y | Y |
| x-charts (basic 4 types) | Y | Y | Y |
| x-charts (advanced 6 types) | | Y | Y |
| x-scheduler | | Y | Y |
| x-kanban | | Y | Y |
| x-editor | Y | Y | Y |
| x-form-builder (renderer) | Y | Y | Y |
| x-form-builder (designer) | | | Y |
