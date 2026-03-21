# Semver and Deprecation Contract

> Status: **Final** | Last updated: 2026-03-21

---

## Semantic Versioning

All packages follow **strict semver** (`MAJOR.MINOR.PATCH`):

| Increment | Contains | Example |
|-----------|---------|---------|
| **Patch** (x.y.Z) | Bug fixes, security patches, documentation corrections | `2.3.1` -> `2.3.2` |
| **Minor** (x.Y.0) | New features, new components, deprecation notices | `2.3.2` -> `2.4.0` |
| **Major** (X.0.0) | Breaking changes, deprecated API removal, dependency major bumps | `2.4.0` -> `3.0.0` |

### Guarantees

- **Patch releases** never change public API surface or observable behavior
- **Minor releases** are always backward-compatible; new features are additive only
- **Major releases** are the only place breaking changes occur
- Pre-release versions (`-alpha`, `-beta`, `-rc`) do not carry stability guarantees

---

## Deprecation Process

Deprecation follows a 4-step lifecycle with a **minimum 6-month window** between deprecation and removal.

### Step 1: Mark as Deprecated (Minor Release)

- Add `@deprecated` JSDoc tag with migration guidance
- Emit `console.warn` in development mode on first usage
- Warning includes: what is deprecated, what to use instead, target removal version

```tsx
/**
 * @deprecated Since v2.4.0. Use `<DataGrid />` instead.
 * Will be removed in v3.0.0.
 */
export function LegacyTable(props: LegacyTableProps) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[design-system] LegacyTable is deprecated. ' +
      'Use DataGrid instead. See migration guide: [URL]'
    );
  }
  // ...
}
```

### Step 2: Document in Changelog

- Changelog entry under `### Deprecated` section
- Link to migration guide
- State the target major version for removal

```markdown
### Deprecated
- `LegacyTable` is deprecated in favor of `DataGrid`.
  Migration guide: docs/migration/legacy-table-to-data-grid.md
  Scheduled for removal in v3.0.0.
```

### Step 3: Provide Codemod (Where Possible)

- Automated codemods using `jscodeshift` for mechanical migrations
- Codemods cover: prop renames, component renames, import path changes
- Published as `@halyard/codemod` package
- Run via: `npx @halyard/codemod <transform-name> --path ./src`

### Step 4: Remove in Next Major

- Removal occurs **no earlier than 6 months** after the deprecation notice
- Removal only happens in a **major version** release
- The major release changelog lists all removals with migration references

---

## Breaking Change Categories

| Category | Example | Codemod Feasible |
|----------|---------|-----------------|
| **Prop rename** | `isOpen` -> `open` | Yes |
| **Prop removal** | Removing `legacy` prop | Partial |
| **Component removal** | Removing `LegacyTable` | Yes (replace import) |
| **Component rename** | `Tabs` -> `TabGroup` | Yes |
| **API change** | Hook return shape change | Partial |
| **Behavior change** | Default value change, event timing | No (manual review) |
| **CSS/styling change** | Class name or CSS variable rename | Partial |
| **Dependency bump** | AG Grid 34.x -> 35.x | No (vendor migration) |

---

## Migration Support

### Codemods

- Provided for all mechanical changes (renames, import paths, simple prop changes)
- Tested against the internal monorepo before release
- Dry-run mode available: `npx @halyard/codemod <transform> --dry`

### Migration Guides

- Published for every major release
- Step-by-step instructions with before/after code examples
- Organized by breaking change category
- Available at: `docs/migration/v{MAJOR}.md`

### Office Hours

- **Enterprise tier**: Dedicated migration planning session with engineering
- **Professional tier**: Group migration office hours (monthly during major transition)
- **Community**: Migration guide + GitHub Discussions

---

## Version Support Lifecycle

```
v2.0.0 ─── v2.1.0 ─── v2.2.0 ─── ... ─── v2.x (LTS) ───── EOL
                                              |
v3.0.0 ─── v3.1.0 ─── v3.2.0 ─── ...       |
  ^                                           |
  └── deprecated APIs removed                 |
      6+ months after deprecation             |
                                    12-month LTS window
```

- Current stable: full support (bugs + features + security)
- Previous major (LTS): security and critical patches only, 12-month window
- Older versions: no support, upgrade recommended
