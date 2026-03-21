# Release Channels

> Status: **Final** | Last updated: 2026-03-21

---

## Channels

| Channel | Tag | Cadence | Stability | Support Window |
|---------|-----|---------|-----------|---------------|
| **stable** | `latest` | Monthly | Production-ready | Until next minor |
| **canary** | `canary` | Daily (from main) | Pre-release | Best-effort, no SLA |
| **lts** | `lts` | As needed | Long-term support | 12 months |

---

## Channel Details

### stable

- **Purpose**: Production use
- **Versioning**: Strict semver (`MAJOR.MINOR.PATCH`)
- **Cadence**: Minor releases monthly, patch releases as needed
- **Guarantees**: No breaking changes within a major version, all tests passing, no known moderate+ CVEs
- **Install**: `npm install @halyard/design-system`

### canary

- **Purpose**: Early testing, CI integration testing, preview of upcoming features
- **Versioning**: Semver pre-release (`MAJOR.MINOR.PATCH-canary.YYYYMMDD.SHA`)
- **Cadence**: Daily automated build from `main` branch
- **Guarantees**: Tests passing at time of build; may contain experimental or incomplete features
- **Install**: `npm install @halyard/design-system@canary`
- **Note**: Not suitable for production. APIs may change without notice.

### lts

- **Purpose**: Long-term stability for teams on slower upgrade cycles
- **Versioning**: Patch increments only (`MAJOR.MINOR.PATCH`)
- **Cadence**: Security and critical bug patches only, as needed
- **Support window**: 12 months from LTS designation
- **Guarantees**: No new features, no behavior changes, security patches backported
- **Install**: `npm install @halyard/design-system@lts`

---

## Release Cadence

| Release Type | Frequency | Contents |
|-------------|-----------|---------|
| **Patch** (x.y.Z) | As needed | Bug fixes, security patches, documentation |
| **Minor** (x.Y.0) | Monthly | New features, non-breaking enhancements, deprecation notices |
| **Major** (X.0.0) | Annually (~Q1) | Breaking changes, deprecated API removal, dependency major bumps |

---

## Breaking Changes Policy

Breaking changes follow a structured deprecation-to-removal lifecycle:

1. **Deprecation notice** added in a minor release (minimum 6 months before removal)
2. **Migration guide** published alongside the deprecation notice
3. **Codemod** provided where automated migration is feasible
4. **Removal** in the next major version, no earlier than 6 months after deprecation

See [semver-deprecation.md](./semver-deprecation.md) for the full deprecation contract.

---

## Release Process

1. Feature freeze: 1 week before release
2. Release candidate (`rc`) tag published for validation
3. Changelog generated from conventional commits
4. Final release tagged and published to npm
5. GitHub Release created with changelog and migration notes
6. LTS branch cherry-picked if applicable

---

## Channel Promotion

```
main (daily) --> canary
                   |
            (monthly cut) --> stable
                                |
                         (annual LTS designation) --> lts
```

- `canary` is always the latest from `main`
- `stable` is cut monthly from a canary that passes release criteria
- `lts` is designated once per major version, receiving only security/critical patches
