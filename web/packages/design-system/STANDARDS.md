# UI Library Standards

Coding standards for the `@mfe/design-system` package and any consumers (e.g. Design Lab showcase).

For new component authoring flow and profile selection, use:

- [docs/COMPONENT-AUTHORING.md](./docs/COMPONENT-AUTHORING.md)

---

## 1. Component Structure Standards

### File naming

| Artifact | Convention | Example |
|---|---|---|
| Component file | PascalCase | `FloatButton.tsx` |
| Barrel export | `index.ts` | `src/components/float-button/index.ts` |
| Tests directory | `__tests__/` | `src/components/float-button/__tests__/` |
| Component directory | kebab-case | `src/components/float-button/` |

### Props interface pattern

Every component's props interface must extend `AccessControlledProps`:

```ts
import { type AccessControlledProps } from "../../internal/access-controller";

export interface FloatButtonProps extends AccessControlledProps {
  icon?: React.ReactNode;
  label?: string;
  // ...
}
```

### displayName requirement

Every exported component must set `displayName` immediately after its definition:

```ts
FloatButton.displayName = "FloatButton";
```

### forwardRef usage

Components that render a focusable or measurable DOM element must use `React.forwardRef`:

```ts
export const FloatButton = React.forwardRef<HTMLDivElement, FloatButtonProps>(
  (props, ref) => {
    // ...
  },
);
```

### Default exports

Each component directory must have an `index.ts` barrel that re-exports the component and its types:

```ts
// index.ts
export { FloatButton, type FloatButtonProps } from "./FloatButton";
```

All public components and types must also be re-exported from `src/components/index.ts`.

---

## 2. Styling Standards

### NEVER use hardcoded colors

The following patterns are **prohibited**:

```tsx
// BAD
className="bg-white text-slate-700"
style={{ color: "#334155" }}
```

### ALWAYS use CSS variables with fallbacks

```tsx
// GOOD
className="bg-[var(--surface-card,#fff)] text-[var(--text-primary,#1e293b)]"
```

### Required CSS variables

All components must use the following design tokens (with appropriate fallbacks):

| Token | Purpose | Example fallback |
|---|---|---|
| `--surface-card` | Card/panel backgrounds | `#fff` or `rgba(255,255,255,0.96)` |
| `--surface-muted` | Muted/secondary surfaces | `#f8fafc` |
| `--surface-hover` | Hover state backgrounds | `rgba(0,0,0,0.04)` |
| `--text-primary` | Primary text color | `#1e293b` |
| `--text-secondary` | Secondary/muted text | `#64748b` |
| `--border-subtle` | Subtle borders | `rgba(0,0,0,0.08)` |
| `--shadow-color` | Box shadow color | `rgba(15,23,42,0.12)` |
| `--action-primary-bg` | Primary action backgrounds | `#3b82f6` |
| `--action-primary-text` | Primary action text | `#fff` |

### Dark mode testing checklist

Before merging any component change, verify:

- [ ] All surfaces use CSS variable tokens, not hardcoded colors
- [ ] Text is legible on both light and dark backgrounds
- [ ] Borders and shadows adapt via `--border-subtle` and `--shadow-color`
- [ ] Hover and focus states are visible in both modes
- [ ] Badge and status tones remain distinguishable

---

## 3. TypeScript Standards

### Strict mode compliance

All packages compile with `"strict": true`. No exceptions.

### No `any` types

Use `unknown` with type guards instead of `any`:

```ts
// BAD
function parse(data: any) { return data.name; }

// GOOD
function parse(data: unknown): string {
  if (typeof data === "object" && data !== null && "name" in data) {
    return String((data as { name: unknown }).name);
  }
  throw new Error("Invalid data");
}
```

### Type assertion pattern

When a double assertion is necessary (e.g. cross-package type boundaries), use the `as unknown as TargetType` pattern:

```ts
// BAD  -- will fail when source and target share a name but differ structurally
value as TargetType;

// GOOD
value as unknown as TargetType;
```

A common case is the **cross-package `ReactNode` mismatch** between `@types/react@18` (design-system) and `@types/react@19` (mfe-shell). React 19 adds `bigint` to `ReactNode`, making the two structurally incompatible. At the boundary, cast with `as string` (if the value is always a string) or `as any` with an eslint-disable comment:

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- cross-package ReactNode compat
{content as any}
```

### Export all prop interfaces and types

Every public type must be exported from the component file and re-exported through the barrel:

```ts
export interface MenuBarRouteInput { /* ... */ }
export type FloatButtonSize = "sm" | "md" | "lg";
```

### No duplicate object keys

Object literals must never have duplicate keys (TS1117). This is especially important in i18n translation dictionaries where keys are added incrementally. Duplicates silently shadow earlier values and cause TypeScript errors.

---

## 4. Testing Standards

### Minimum test coverage

Every component must have a test file in `__tests__/` covering:

| Category | Description |
|---|---|
| **Render** | Component renders without crashing; smoke test |
| **Props** | Key prop variations produce correct output |
| **Access control** | `access="hidden"` hides the component; `access="disabled"` disables interactions |
| **Accessibility** | ARIA attributes are present and correct; keyboard navigation works |
| **Edge cases** | Empty/undefined props, boundary values, overflow content |

### Testing library patterns

Use `@testing-library/react` and `vitest`:

```ts
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FloatButton } from "../FloatButton";

describe("FloatButton", () => {
  it("renders trigger button", () => {
    render(<FloatButton icon={<span>+</span>} />);
    expect(screen.getByTestId("float-button-trigger")).toBeInTheDocument();
  });
});
```

### vitest-environment pragma

Every test file must include the jsdom pragma at the top:

```ts
// @vitest-environment jsdom
```

---

## 5. Accessibility Standards

### Required ARIA attributes by component type

| Component type | Required attributes |
|---|---|
| Button | `aria-label` (when icon-only), `aria-disabled`, `aria-expanded` (if toggle) |
| Menu / Dropdown | `aria-haspopup`, `aria-expanded`, `role="menu"`, `role="menuitem"` |
| Navigation | `aria-label` on `<nav>`, `aria-current="page"` on active item |
| Dialog / Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Form input | `aria-invalid`, `aria-describedby` (for error messages), `aria-required` |
| Tab | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` |

### Keyboard navigation requirements

- All interactive elements must be reachable via `Tab`
- Menus and lists must support `Arrow` key navigation
- `Escape` must close overlays, dropdowns, and dialogs
- `Enter` and `Space` must activate buttons and menu items
- Focus must be trapped inside modal dialogs
- Focus must return to the trigger element when an overlay closes

### Screen reader testing checklist

- [ ] Component announces its role and label
- [ ] State changes (expanded, selected, disabled) are announced
- [ ] Error messages are linked via `aria-describedby`
- [ ] Dynamic content updates use `aria-live` regions where appropriate
- [ ] Decorative icons use `aria-hidden="true"`

---

## 6. i18n Standards

### Turkish by default

All user-facing text in the design system and Design Lab is written in Turkish as the primary locale:

```ts
const designlab = {
  "designlab.workspace.components": "Bilesenler",
  "designlab.workspace.recipes": "Receteler",
};
```

### localeText prop pattern

Components that render user-visible text must accept a `localeText` prop for customization:

```ts
export interface PaginationProps extends AccessControlledProps {
  localeText?: {
    next?: string;
    previous?: string;
    page?: string;
  };
}
```

Default values should use the Turkish locale. Consumers override via `localeText` for other languages.

### Translation file hygiene

- Each locale has its own `designlab.ts` file under `packages/i18n-dicts/src/locales/<lang>/`
- Non-Turkish locales (e.g. `de`, `es`) spread the English base and override specific keys
- **Never introduce duplicate keys** in translation objects -- duplicates cause TS1117 errors and silently shadow earlier translations
- When adding new keys, verify no duplicate exists (search the file first)
