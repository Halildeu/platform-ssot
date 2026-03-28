# Deprecation Policy

> **Package:** `@mfe/design-system`
> **Effective from:** v1.0.0

---

## Timeline

| Phase | Duration | What happens |
|-------|----------|-------------|
| **Announced** | Current minor release | `@deprecated` JSDoc tag added to the symbol. A `console.warn` fires once per session in development mode. The prop/component continues to work exactly as before. |
| **Deprecated** | 2 subsequent minor releases | The warning remains. Documentation marks the API as deprecated and links to the replacement. |
| **Removed** | Next major release | The symbol is deleted from the public API. `detect-breaking.mjs` will flag it as a breaking change. |

Example: a prop deprecated in v1.4.0 keeps working through v1.5.x and v1.6.x and is removed in v2.0.0.

---

## How to Mark a Deprecation

1. **JSDoc tag** -- add `@deprecated` with a migration hint:

   ```ts
   /** @deprecated Use `size` instead. Will be removed in the next major version. */
   selectSize?: SelectSize;
   ```

2. **Runtime warning** -- emit a one-time `console.warn` in development:

   ```ts
   if (process.env.NODE_ENV !== 'production' && selectSize !== undefined) {
     console.warn(
       '[@mfe/design-system] Select: `selectSize` is deprecated. Use `size` instead.'
     );
   }
   ```

3. **Changelog entry** -- record the deprecation in `CHANGELOG.md` under the "Deprecated" section.

---

## Migration Path Requirement

Every deprecation **must** have a documented replacement before it ships:

- The `@deprecated` JSDoc tag must state the replacement.
- If the migration is non-trivial, a code example must appear in the changelog or migration guide.
- Codemods are recommended for prop renames affecting more than 5 consumer call sites.

---

## Breaking Change Policy

Breaking changes are **only** permitted in major version bumps.

- `detect-breaking.mjs` compares the current public export surface against `.export-baseline.json`.
- Any removed or renamed export causes CI to fail.
- To proceed, the developer must run `node scripts/ci/detect-breaking.mjs --update-baseline` and justify the change in the PR description.

---

## Prop Renaming Strategy

When a prop is renamed (e.g., `selectSize` to `size`):

1. **v1.x (current minor):** Accept both the old and new prop. The old prop is marked `@deprecated`. If both are supplied, the new prop wins.
2. **v1.x+1, v1.x+2:** Both props continue to work. The runtime warning fires for the old prop.
3. **v2.0.0:** The old prop is removed. Only the new prop is accepted.

```ts
// Example implementation pattern
const resolvedSize = size ?? selectSize ?? 'md';
if (process.env.NODE_ENV !== 'production' && selectSize !== undefined) {
  console.warn('[@mfe/design-system] Select: `selectSize` is deprecated. Use `size` instead.');
}
```
