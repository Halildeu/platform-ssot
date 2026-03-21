# Long-Term Support (LTS) Policy

> Defines support timelines, security patching, and upgrade communication for the @mfe platform.

## Major Version Support Timeline

```
┌─────────────────────────────────┬──────────────────┬─────────┐
│         Active Support          │  Security Only   │   EOL   │
│          18 months              │    6 months      │         │
└─────────────────────────────────┴──────────────────┴─────────┘
 v1.0 release                    v2.0 release       v1 EOL
                                 (v1 → security)    (24 months
                                                     after v1.0)
```

| Phase | Duration | What's Included |
|---|---|---|
| **Active support** | 18 months from release | Bug fixes, security patches, minor features, docs updates |
| **Security only** | 6 months after next major | Critical security patches only, no new features |
| **End of life** | After security period | No patches, no support, upgrade required |

## Projected Timeline

| Version | Release | Active Until | Security Until | EOL |
|---|---|---|---|---|
| v1.0 | Q1 2026 | Q3 2027 | Q1 2028 | Q1 2028 |
| v2.0 | Q3 2027 (projected) | Q1 2029 | Q3 2029 | Q3 2029 |

## Dependency Support Matrix

### Node.js

The platform follows the [Node.js release schedule](https://nodejs.org/en/about/releases/):

| Node.js | @mfe support | Notes |
|---|---|---|
| 22.x LTS | Supported (primary) | Current LTS, used in CI |
| 20.x LTS | Supported | Previous LTS, tested in CI |
| 18.x | Deprecated | Reaches EOL April 2025, dropped in @mfe v1.4 |
| Odd versions (23, 25) | Not supported | Not tested, use at your own risk |

**Policy**: Support the current and previous Node.js LTS versions. Drop support 3 months after a Node.js LTS reaches EOL.

### React

| React | @mfe support | Notes |
|---|---|---|
| 18.x | Supported (primary) | Current target for v1.x |
| 19.x | Planned for v2.0 | Available on `next` channel for testing |
| 17.x | Not supported | Missing concurrent features required by platform |

**Policy**: Support the current React major version and the previous major version during the transition period.

### TypeScript

| TypeScript | @mfe support |
|---|---|
| 5.5+ | Supported |
| 5.0 - 5.4 | Best effort (not tested in CI) |
| 4.x | Not supported |

**Policy**: Support the latest two TypeScript minor versions. Types are published with `"moduleResolution": "bundler"` for maximum compatibility.

## Security Patching

### Active Support Phase

- **Critical (CVSS >= 9.0)**: Patch within 48 hours, advisory published
- **High (CVSS 7.0-8.9)**: Patch within 1 week
- **Medium (CVSS 4.0-6.9)**: Patch in next scheduled release
- **Low (CVSS < 4.0)**: Tracked, fixed opportunistically

### Security-Only Phase

- **Critical and High**: Backported to the security-only branch
- **Medium and Low**: Not backported; upgrade to active version recommended

### Emergency Security Patches

Emergency patches are backported to the **last 2 major versions**, regardless of LTS phase:

```bash
# Example: critical XSS fix
@mfe/design-system@1.4.8   # current stable
@mfe/design-system@1.3.12  # previous minor (if still in active)
```

## Upgrade Communication Timeline

| Milestone | Communication | Channel |
|---|---|---|
| New major announced | Blog post + GitHub Discussion | 6 months before release |
| Migration guide published | Docs site + npm `next` channel | 3 months before release |
| Release candidate | `next` channel, migration codemods | 1 month before release |
| New major released | Previous major enters security-only | Release day |
| Previous major EOL warning | Deprecation banner in docs | 3 months before EOL |
| Previous major EOL | Final advisory, npm deprecation notice | EOL date |

### npm Deprecation Notice

When a major version reaches EOL, we publish a deprecation message:

```bash
npm deprecate "@mfe/design-system@<1.0.0" "v0.x has reached end of life. Upgrade to v1.x: https://mfe.dev/migration"
```

## Codemods

Each major version ships with automated codemods to ease migration:

```bash
npx @mfe/codemod v2   # Applies all v1 → v2 transforms
```

Codemods handle:
- API renames and signature changes
- Import path updates
- Deprecated prop removal
- Theme token migration

Codemods cover ~80% of breaking changes. The remaining manual changes are documented in the migration guide.

## Version Support Check

Consumers can verify their version is still supported:

```bash
npx @mfe/cli check-support
# Output:
# @mfe/design-system@1.4.2 — Active support (until Q3 2027)
# Node.js 20.11.0 — Supported LTS
# React 18.3.1 — Supported
```
