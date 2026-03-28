# Component Authoring Guide

Single authoring reference for creating new components in `@mfe/design-system`.

This guide is intentionally decision-first.
It does not replace:

- [Component Contract](./COMPONENT-CONTRACT.md) for API rules
- [Standards](../STANDARDS.md) for coding and styling conventions
- [Overlay Decisions](./OVERLAY-DECISIONS.md) for overlay-specific behavior
- [SSR / RSC Boundary](./SSR-RSC-BOUNDARY.md) for client/server rules

Use this document to answer one question first:

`What kind of component am I authoring?`

---

## 1. Start With a Profile

The scaffold is now profile-based.

```bash
node scripts/scaffold-component.mjs ComponentName --type primitive --profile interactive-access
node scripts/scaffold-component.mjs ComponentName --type component --profile composed
node scripts/scaffold-component.mjs --list-profiles
```

Profile definitions live in:

- [component-authoring.profiles.v1.json](./component-authoring.profiles.v1.json)
- [AUTHORING-REFERENCE-MAP.md](./AUTHORING-REFERENCE-MAP.md)

Defaults:

- `primitive` -> `interactive-access`
- `component` -> `composed`

If that default is wrong for the thing you are building, pass `--profile` explicitly.

Optional scaffold flags:

```bash
node scripts/scaffold-component.mjs ComponentName --type primitive --profile interactive-access --with-contract-test
node scripts/scaffold-component.mjs ComponentName --type component --profile composed --with-doc-stub
```

Every scaffolded component now carries machine-readable metadata in:

- `src/<bucket>/<component>/component.authoring.v1.json`
- `src/<bucket>/<component>/component.authoring.next-steps.md`

That metadata and checklist drive `check:component-completeness`.

---

## 2. Decision Tree

Use this order:

1. Is it display-only?
   Then use `display`.

2. Is it interactive and access-aware?
   Then use `interactive-access`.

3. Is it an input-like control with label / hint / error / field frame?
   Then use `field-shell`.

4. Is it a higher-level composed component built from primitives?
   Then use `composed`.

5. Is it a modal overlay?
   Then use `overlay-modal`.

6. Is it a non-modal overlay?
   Then use `overlay-nonmodal`.

---

## 3. Profile Matrix

| Profile | Use for | Access control | Field shell | Overlay engine | `forwardRef` |
|---|---|---:|---:|---:|---|
| `display` | Badge, Text, Divider, Spinner, Skeleton style surfaces | No | No | No | Optional |
| `interactive-access` | Button-like or clickable access-aware surfaces | Yes | No | No | Required |
| `field-shell` | Input-like controls with label/hint/error framing | Yes | Yes | No | Required |
| `composed` | Higher-level components built from primitives | Usually | No | No | Recommended |
| `overlay-modal` | Dialog/Modal-like overlays | No by default | No | Yes | Optional |
| `overlay-nonmodal` | Popover/Dropdown/Tooltip-like overlays | No by default | No | Yes | Optional |

Notes:

- `SearchInput` is not display-only. It is interactive, but currently access-light.
- `Select`, `Checkbox`, `Radio`, `Switch` are form controls, but not all of them use `FieldControlShell`.
- `FieldControlShell` is the right pattern for framed field-style controls such as `Input`, `Textarea`, `Combobox`, `DatePicker`, and `Slider`.

---

## 4. Import Rules

### Repo-internal component source

Within `src/`, relative imports into `internal/` are allowed when the component profile needs them.

Examples:

- `../../internal/access-controller`
- `../../internal/interaction-core`
- `../../internal/overlay-engine`

### Public consumer guidance

Do not teach consumers to import from repo-relative internal modules.

For consumers:

- prefer public package exports such as `@mfe/design-system/headless`
- treat `@mfe/design-system/unstable/*` as unstable

### Important nuance

`interaction-core` is acceptable for repo-internal authoring, but it is not a stable public API tier.

---

## 5. Access Control Rules

Apply access control only when the component is interactive or semantically gated.

Use:

```ts
import {
  resolveAccessState,
  shouldBlockInteraction,
  stateAttrs,
  guardAria,
  type AccessControlledProps,
} from "../../internal/interaction-core";
```

Rules:

- `display` profile does not need `AccessControlledProps`
- `interactive-access` and `field-shell` normally do
- `composed` may opt in when the composed surface is interactive

Preferred default for new access-aware components:

- `access="hidden"` -> `return null`

Allowed exception:

- use layout-preserving invisibility only when the component family explicitly needs it and the behavior is documented

`guardAria` always takes a single options object:

```tsx
{...guardAria({ access, disabled, loading })}
```

Not this:

```tsx
{...guardAria({}, { blocked })}
```

---

## 6. Field-Shell Rules

Use `FieldControlShell` only for field-style controls that need:

- label
- description
- hint
- error presentation
- framed control styling

Canonical examples:

- `Input`
- `Textarea`
- `Combobox`
- `DatePicker`
- `Slider`

Related helpers:

```ts
import {
  FieldControlShell,
  getFieldFrameClass,
  getFieldTone,
} from "../_shared/FieldControlPrimitives";
```

or from components:

```ts
import {
  FieldControlShell,
  getFieldFrameClass,
  getFieldTone,
} from "../../primitives/_shared/FieldControlPrimitives";
```

Do not force this pattern onto every form control.

---

## 7. Overlay Rules

Never apply all overlay hooks by default.

Instead, follow:

- [Overlay Decisions](./OVERLAY-DECISIONS.md)
- [Portal Behavior](./PORTAL-BEHAVIOR.md)

High-level defaults:

- `overlay-modal`
  - prefer native dialog semantics when appropriate
  - do not automatically add `useFocusTrap`
  - consider `useScrollLock`, `useEscapeKey`, `registerLayer`, `useFocusRestore`

- `overlay-nonmodal`
  - adopt only the hooks the interaction model actually needs
  - typical candidates: `useOutsideClick`, `useEscapeKey`, `registerLayer`

If you are authoring an overlay and you are unsure:

1. read `OVERLAY-DECISIONS.md`
2. inspect the closest live example
3. document any intentional deviation

---

## 8. Client / Server Boundary

Do not add `"use client"` blindly.

Rules:

- use it only when the authored source truly needs client-only behavior
- overlay profiles default to client mode
- most display and access-aware primitives do not need it at source level

Before choosing, check:

- [SSR / RSC Boundary](./SSR-RSC-BOUNDARY.md)
- [Server / Client Matrix](./SERVER-CLIENT-MATRIX.md)

The scaffold can still add `"use client"` for profiles that are client-only by default.
That is a baseline, not a commandment.

---

## 9. Story and Test Expectations

### Story baseline

Every scaffolded component gets a Storybook file.

Current title convention from scaffold:

- `Components/Primitives/<Name>`
- `Components/Components/<Name>`

That is a baseline, not historical truth for every existing file.

### Test baseline

Scaffold provides a baseline test suite.
Optional scaffold outputs:

- `--with-contract-test` -> adds `__tests__/<Name>.contract.test.tsx`
- `--with-doc-stub` -> adds `src/catalog/component-docs/entries/<Name>.doc.ts`

Second-wave authoring baseline also adds:

- `component.authoring.next-steps.md` -> local checklist for barrel/doc/API follow-up work

Depending on profile, extend it with:

- access control tests
- controlled/uncontrolled tests
- overlay open/close tests
- keyboard tests
- contract tests

Do not stop at the scaffold if the profile needs more coverage.

---

## 10. Canonical Local Dev Loop vs Release Gate

### Local authoring loop

Use these while building:

- `npm run build`
- `npm run docs:api`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run check:component-completeness`

Add as needed:

- `npm run test:visual`
- `node scripts/ci/consumer-smoke.mjs`

### Canonical release gate

The authoritative release check is:

- `node scripts/release/pre-release-check.mjs`

This is broader than the local authoring loop and includes:

- build
- tests
- perf benchmark
- bundle size
- semver check
- deprecation audit
- API reference
- pack dry-run
- consumer smoke
- visual regression
- TS warning budget
- DesignLab index
- publish dry-run

For authoring-specific enforcement, use:

- `npm run check:authoring`

`check:component-completeness` now verifies scaffold-managed components for:

- source, index, story, unit test
- optional contract test
- optional doc stub
- category barrel export
- Design Lab doc index registration when `docStub=true`
- API reference visibility in `docs/api/api-reference.json`
- presence of `component.authoring.next-steps.md`

---

## 11. Recommended Workflow

1. Pick a profile.
2. Scaffold with `--profile`.
3. Adjust the generated baseline to the nearest live family.
4. Add the component to the correct barrel.
5. Open `component.authoring.next-steps.md` and finish the follow-up checklist.
6. Expand tests to match the real interaction model.
7. If it belongs in Design Lab, add doc entry and manifest registration.
8. Run local checks.
9. Let canonical release gate validate the final result.

---

## 12. Golden References

Use the closest live component as the first reference, not random examples.

Recommended starting points:

- `display` -> `Badge`, `Text`, `Spinner`, `Skeleton`
- `interactive-access` -> `Button`, `IconButton`, `Tag`
- `field-shell` -> `Input`, `Textarea`, `Combobox`, `DatePicker`
- `composed` -> `ApprovalCheckpoint`, `RecommendationCard`, `NotificationPanel`
- `overlay-modal` -> `Dialog`, `Modal`, `Drawer`
- `overlay-nonmodal` -> `Popover`, `Dropdown`, `Tooltip`

For the canonical reference map, use:

- [AUTHORING-REFERENCE-MAP.md](./AUTHORING-REFERENCE-MAP.md)

If the generated scaffold and the live family differ, prefer the live family.

---

## 13. Scope of This Guide

This guide is the authoring entrypoint.

It answers:

- which profile to choose
- which helper families to reach for
- when access control applies
- when field shell applies
- when overlay hooks should or should not be used
- which checks are baseline vs canonical

It does not replace the contract docs.
It routes you to them.
