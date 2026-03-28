# Versioning Strategy

> **Package:** `@mfe/design-system`
> **Scheme:** [Semantic Versioning 2.0.0](https://semver.org/)
> **Current version:** 1.0.0

---

## Version Increment Rules

### Patch (1.0.x)

A patch release contains only backward-compatible fixes that do not alter the public API surface.

- Bug fixes in component rendering or behavior
- Test improvements and new test coverage
- Performance optimizations with identical API
- Documentation corrections
- Internal refactors that do not change exported symbols
- Dependency updates (patch-level only)

### Minor (1.x.0)

A minor release adds functionality in a backward-compatible manner.

- New component added to `primitives/`, `components/`, or `patterns/`
- New optional prop added to an existing component
- New exported type or utility function
- New token value added to the token set
- New theme variant
- Deprecation announcements (old API still works)

### Major (x.0.0)

A major release contains breaking changes that require consumer action.

- Removed export (component, type, utility, token)
- Renamed prop without backward-compatible alias
- Changed default value of an existing prop
- Changed component behavior in a way that breaks existing usage
- Removed or renamed CSS custom property (design token)
- Dropped support for a React version

---

## Enforcement: `detect-breaking.mjs`

The CI script `scripts/ci/detect-breaking.mjs` enforces the contract:

1. On every PR, it scans the public API by traversing `src/index.ts` and all re-exported barrels.
2. It compares the current export list against `.export-baseline.json`.
3. **Removed exports** are flagged as breaking changes and the CI job fails.
4. **Added exports** are reported as non-breaking and the job passes.
5. To intentionally ship a breaking change, run:
   ```sh
   node scripts/ci/detect-breaking.mjs --update-baseline
   ```
   and include the baseline diff in the PR for review.

---

## Release Checklist

1. Determine version increment using the rules above.
2. Run `node scripts/ci/detect-breaking.mjs` to verify no accidental breaking changes.
3. Run `node scripts/ci/publish-gate.mjs` to confirm all critical component tests pass.
4. Update `CHANGELOG.md` with the new version section.
5. Bump version in `package.json`.
6. Tag the release: `git tag v<version>`.
