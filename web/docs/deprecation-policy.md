# Deprecation Policy

## Deprecation Lifecycle
1. **Deprecation Notice** — Component/prop marked `@deprecated` with JSDoc + console.warn in dev mode
2. **Migration Period** — Minimum 2 minor versions (typically 8-12 weeks)
3. **Removal** — Major version only; never in minor/patch

## Current Deprecations
| Component/Prop | Deprecated In | Remove In | Migration |
|---------------|---------------|-----------|-----------|
| Badge `tone` | v1.8 | v2.0 | Use `variant` |
| Segmented `appearance` | v1.8 | v2.0 | Use `variant` |
| Select `selectSize` | v1.7 | v2.0 | Use `size` |

## Deprecation Communication
- CHANGELOG.md updated with deprecation notice
- Console warning in development mode
- TypeScript `@deprecated` JSDoc tag
- Migration guide in docs portal
