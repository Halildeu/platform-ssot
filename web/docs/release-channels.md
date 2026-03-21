# Release Channels

> The @mfe platform publishes three npm dist-tags: `latest`, `next`, and `canary`.
> Choose the channel that matches your stability requirements.

## Channel Overview

| Channel | Dist-tag | Stability | Cadence | Use Case |
|---|---|---|---|---|
| **Stable** | `latest` | Production-ready | Every 2-4 weeks | Production apps |
| **Pre-release** | `next` | Feature preview | Weekly | Staging, early testing |
| **Canary** | `canary` | Bleeding edge | Nightly (automated) | Internal dev, experiments |

---

## Stable (`latest`)

The default channel. Every `npm install @mfe/design-system` resolves to this.

**Guarantees**:
- Full test suite passes (5,900+ tests)
- Typecheck clean across all packages
- Performance SLA met
- Visual regression approved
- Security scan clean (Trivy, Semgrep)
- Changelog published with every release
- Follows semantic versioning strictly

**Install**:
```bash
npm install @mfe/design-system
# or explicitly:
npm install @mfe/design-system@latest
```

---

## Pre-release (`next`)

Preview of upcoming features. May contain breaking changes that are not yet finalized.

**Guarantees**:
- Core test suite passes
- Typecheck clean
- Known issues documented in release notes
- No guarantee of API stability between `next` versions

**What to expect**:
- New components and APIs available early
- Breaking changes being evaluated (may be reverted)
- Performance may not meet SLA targets
- Migration notes provided when APIs change

**Install**:
```bash
npm install @mfe/design-system@next
```

**Version format**: `1.5.0-next.3` (semver pre-release)

---

## Canary (`canary`)

Automated nightly builds from the `main` branch HEAD. Not for production.

**Guarantees**:
- CI passes (typecheck + test + build)
- That is all. No further stability promises.

**What to expect**:
- Latest merged PRs, including experimental work
- May contain incomplete features
- API surface may change without notice
- Useful for testing if a specific fix landed

**Install**:
```bash
npm install @mfe/design-system@canary
```

**Version format**: `0.0.0-canary.20260321.abc1234` (date + commit hash)

---

## Migration Between Channels

### Stable to Next (opt-in to preview)

```bash
# Switch one package
npm install @mfe/design-system@next

# Switch all @mfe packages
npx npm-check-updates --filter '@mfe/*' --target greatest --pre 1
```

Review the `next` changelog for breaking changes before upgrading.

### Next to Stable (return to production)

```bash
# Pin back to latest stable
npm install @mfe/design-system@latest
```

If you adopted APIs that only exist in `next`, check the stable changelog to confirm they shipped.

### Canary to Stable

```bash
npm install @mfe/design-system@latest
```

Canary versions should never be pinned in `package.json`. Always move back to `latest` or `next`.

---

## Support Policy

| Channel | Bug fixes | Security patches | Breaking change notice |
|---|---|---|---|
| **Stable** | Yes | Yes (within 48h for critical) | 1 major version deprecation cycle |
| **Next** | Best effort | Yes | Changelog only |
| **Canary** | No | No | None |

### What "support" means:
- **Stable**: Issues are triaged per the [Issue Triage Runbook](/docs/issue-triage-runbook). P0/P1 response times apply.
- **Next**: Issues are accepted but may be deferred to the stable release cycle.
- **Canary**: No issue support. If something is broken, check if it is already fixed on `main`.

---

## CI/CD Integration

### Lock to stable in CI

```json
// package.json — do NOT use ^ or ~ with pre-release channels
{
  "@mfe/design-system": "1.4.2"
}
```

### Test against next in a scheduled job

```yaml
# .github/workflows/compat-next.yml
name: Compat (next channel)
on:
  schedule:
    - cron: '0 7 * * 3'  # Every Wednesday
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx npm-check-updates --filter '@mfe/*' --target greatest --pre 1 -u
      - run: npm install
      - run: npm test
```

This gives early warning of upcoming breaking changes without impacting production.
