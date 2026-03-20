# Contributing to @mfe/design-system

## Getting Started

1. Clone the monorepo
2. `npm ci` from root
3. `cd packages/design-system`
4. `npm run start` — local dev server (port 3004)
5. `npx vitest --watch` — test watcher

## Component Structure

Every component follows this structure:

```
src/[primitives|components]/component-name/
├── index.ts                # Public API barrel export
├── ComponentName.tsx       # Main component
├── __tests__/
│   └── ComponentName.test.tsx
└── ComponentName.stories.tsx (optional)
```

**Naming conventions:**

| Artifact            | Convention | Example                                  |
| ------------------- | ---------- | ---------------------------------------- |
| Component file      | PascalCase | `FloatButton.tsx`                        |
| Barrel export       | `index.ts` | `src/components/float-button/index.ts`   |
| Tests directory     | `__tests__/` | `src/components/float-button/__tests__/` |
| Component directory | kebab-case | `src/components/float-button/`           |

## Creating a New Component

```bash
node scripts/scaffold-component.mjs MyComponent --type primitive
# or
node scripts/scaffold-component.mjs MyComponent --type component
```

This creates the full skeleton with types, tests, barrel export, and story file.

## Props Pattern

Every component's props interface must extend `AccessControlledProps`:

```ts
import {
  resolveAccessState,
  shouldBlockInteraction,
  stateAttrs,
  focusRingClass,
  guardAria,
  type AccessLevel,
} from "../../internal/interaction-core";

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Access level -- controls disabled/readonly state via access-controller */
  access?: AccessLevel;
  /** Tooltip/title text explaining access restriction */
  accessReason?: string;
}
```

## Styling Rules

- Use `cn()` from `../../utils/cn` (which wraps `clsx` + `tailwind-merge`)
- **Never** hardcode colors: no `bg-white`, `text-slate-700`, or inline hex values
- **Always** use CSS variable tokens with fallbacks:

```tsx
className="bg-[var(--surface-card,#fff)] text-[var(--text-primary,#1e293b)]"
```

Required CSS variable tokens are documented in `STANDARDS.md` section 2.

## Required Component Conventions

- `displayName` set immediately after definition: `MyComponent.displayName = "MyComponent";`
- `forwardRef` added if the component renders a focusable or measurable DOM element
- `"use client"` directive if the component uses browser APIs (hooks, DOM refs, etc.)
- Props documented with JSDoc comments
- Component and all public types re-exported from `src/[primitives|components]/index.ts`

## Test Requirements

Every component **must** have a test file in `__tests__/` with the following:

- [ ] `// @vitest-environment jsdom` pragma at the top of the file
- [ ] `expectNoA11yViolations(container)` -- axe-core a11y check
- [ ] `userEvent` over `fireEvent` -- realistic user interactions
- [ ] State attribute tests (`disabled`, `error`, `loading` where applicable)
- [ ] Access control tests (`access="hidden"`, `access="disabled"`)
- [ ] Keyboard interaction tests (`Tab`, `Enter`, `Escape`, `Arrow` keys)
- [ ] Focus ring class verification (`focusRingClass`)
- [ ] `ref` forwarding test (if using `forwardRef`)

### Test file structure

```tsx
// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyComponent } from "../MyComponent";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

afterEach(() => {
  cleanup();
});

describe("MyComponent -- render", () => {
  it("renders without crashing", () => { /* ... */ });
});

describe("MyComponent -- access control", () => {
  it('access="hidden" applies invisible class', () => { /* ... */ });
  it('access="disabled" disables interaction', () => { /* ... */ });
});

describe("MyComponent -- a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(<MyComponent />);
    await expectNoA11yViolations(container);
  });
});
```

## PR Checklist

- [ ] All existing tests pass (`npx vitest run`)
- [ ] New tests added for new functionality
- [ ] axe-core a11y test included
- [ ] `displayName` set on component
- [ ] `forwardRef` added if component renders interactive HTML element
- [ ] `"use client"` directive if component uses browser APIs
- [ ] Props documented with JSDoc comments
- [ ] API stability tier annotated (`@stable` / `@experimental` / `@deprecated`)
- [ ] No direct `document` or `window` access at module level
- [ ] All surfaces use CSS variable tokens, not hardcoded colors
- [ ] Component re-exported from the parent `index.ts` barrel
- [ ] Access control props (`access`, `accessReason`) supported

## Component Maturity Levels

| Level | Name       | Requirements                                                    |
| ----- | ---------- | --------------------------------------------------------------- |
| L0    | Exists     | Basic render, smoke test                                        |
| L1    | Props      | Props complete, basic tests, barrel export                      |
| L2    | Hardened   | a11y (axe), keyboard nav, state attrs, userEvent, access control |
| L3    | Production | forwardRef, "use client", density, slots, localeText            |
| L4    | Complete   | Full docs, visual regression, perf baseline, stories            |

## Deprecation Policy

See `DEPRECATION-POLICY.md` for the full timeline and migration path requirements.
Summary: deprecated APIs survive 2 minor releases and are removed in the next major.

## i18n

- All user-facing text defaults to Turkish
- Components with visible text accept a `localeText` prop for overrides
- See `STANDARDS.md` section 6 for details

## Further Reading

- `STANDARDS.md` -- full coding standards (styling, TypeScript, testing, a11y, i18n)
- `DEPRECATION-POLICY.md` -- deprecation timeline and prop renaming strategy
- `VERSIONING.md` -- versioning policy
