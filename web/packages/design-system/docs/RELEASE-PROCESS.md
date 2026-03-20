# Release Process

This document describes how `@mfe/design-system` is released and the available release channels.

## Release Channels

| Channel  | npm tag   | Purpose                          | Trigger          |
| -------- | --------- | -------------------------------- | ---------------- |
| Stable   | `latest`  | Production-ready releases        | Manual           |
| Canary   | `canary`  | Pre-release testing from main    | Automatic on push |
| Next     | `next`    | Preview of upcoming major version | Manual           |

---

## Canary Releases

Canary versions are published automatically when source files change on `main` or `develop`.

**Version format:** `X.Y.Z-canary.{timestamp}.{sha}`

**Install:**
```bash
npm install @mfe/design-system@canary
```

**Manual canary publish:**
```bash
# Dry run first
node scripts/release/publish-canary.mjs --dry-run

# Publish
node scripts/release/publish-canary.mjs
```

**What happens:**
1. Verifies clean working tree
2. Builds the package
3. Runs tests
4. Publishes to npm with the `canary` tag
5. Restores `package.json` to the original version

Canary versions never move the `latest` tag.

---

## Stable Releases

Stable releases are published manually after passing the full quality gate checklist.

### Pre-release Checklist

Run the checklist before every stable release:

```bash
node scripts/release/pre-release-check.mjs
```

This validates:
1. Clean working tree
2. Build succeeds
3. Tests pass
4. Bundle size within budget
5. Semver compliance (no unintentional breaking changes)
6. Deprecation annotations are valid
7. `npm pack` dry run
8. `npm publish` dry run

### Publishing a Stable Release

```bash
# Patch release (bug fixes)
node scripts/release/publish-stable.mjs patch

# Minor release (new features, backward compatible)
node scripts/release/publish-stable.mjs minor

# Major release (breaking changes)
node scripts/release/publish-stable.mjs major

# Dry run any of the above
node scripts/release/publish-stable.mjs minor --dry-run
```

**What happens:**
1. Verifies clean working tree and `main` branch
2. Runs all quality gates (build, test, bundle budget, semver, deprecation audit)
3. Prompts for confirmation
4. Updates `CHANGELOG.md` with the release date
5. Bumps `package.json` version
6. Creates a git commit and annotated tag (`vX.Y.Z`)
7. Publishes to npm with the `latest` tag

**After publishing:**
```bash
git push origin main --follow-tags
```

---

## Hotfix Releases

For urgent fixes to a published version:

1. Branch from the release tag: `git checkout -b hotfix/vX.Y.Z vX.Y.Z`
2. Apply the fix and commit
3. Run the pre-release checklist: `node scripts/release/pre-release-check.mjs`
4. Publish a patch: `node scripts/release/publish-stable.mjs patch`
5. Cherry-pick back to `main` if applicable

---

## Version Policy

- **Patch** (`1.0.x`): Bug fixes, dependency updates, documentation
- **Minor** (`1.x.0`): New components, new props on existing components, new utilities
- **Major** (`x.0.0`): Removed/renamed components, changed prop contracts, removed CSS custom properties

All public API changes are tracked by `scripts/ci/semver-check.mjs`. Deprecated APIs follow the timeline defined in `DEPRECATION-POLICY.md` and are audited by `scripts/ci/deprecation-audit.mjs`.

---

## Rollback Procedure

If a release introduces a regression:

1. **Immediate:** Point `latest` back to the last good version:
   ```bash
   npm dist-tag add @mfe/design-system@<last-good-version> latest
   ```

2. **Follow up:** Publish a patch release with the fix.

3. **Deprecate** the broken version:
   ```bash
   npm deprecate @mfe/design-system@<broken-version> "Known regression, use <fixed-version>"
   ```

---

## CI Workflow

The canary release CI workflow (`.github/workflows/canary-release.yml`) runs on pushes to `main` and `develop` when files under `packages/design-system/src/` change. It requires the `NPM_TOKEN` secret to be configured in the repository.

---

## Scripts Reference

| Script                                        | Purpose                          |
| --------------------------------------------- | -------------------------------- |
| `scripts/release/publish-canary.mjs`          | Publish canary version           |
| `scripts/release/publish-stable.mjs`          | Publish stable version           |
| `scripts/release/pre-release-check.mjs`       | Run all quality gates            |
| `scripts/ci/bundle-size.mjs --budget`         | Bundle size budget enforcement   |
| `scripts/ci/semver-check.mjs`                 | Public API change detection      |
| `scripts/ci/deprecation-audit.mjs`            | Deprecation annotation scanner   |
