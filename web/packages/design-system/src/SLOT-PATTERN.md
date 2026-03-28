# Slot / SlotProps Pattern

## What It Is

The slot pattern gives consumers fine-grained control over compound component
internals without breaking encapsulation. Each named "slot" corresponds to a
sub-element inside the component (root, label, icon, etc.). Consumers can:

1. **Override props** on any slot via `slotProps`.
2. **Swap the rendered element** for any slot via `slots`.

This is the same idea behind MUI's `slotProps`/`slots` API and Radix's `asChild`,
unified into a single consistent contract for this design system.

---

## Consumer Usage

```tsx
import { Button } from '@mfe/design-system';

<Button
  slots={{ root: 'a' }}                       // render as <a> instead of <button>
  slotProps={{
    root: { href: '/home', className: 'nav-link' },
    startIcon: { className: 'icon-lg' },
    label: { 'data-testid': 'btn-label' },
  }}
>
  Home
</Button>
```

### What Merges Automatically

| Prop        | Behaviour                                                  |
|-------------|------------------------------------------------------------|
| `className` | Concatenated: `"base icon-lg"` (component default + yours) |
| `style`     | Shallow-merged: your properties override defaults          |
| Everything else | Your value wins over the component default              |

---

## Component Author Guide

### 1. Define Slot Types

```tsx
import type { SlottableComponentProps } from '../internal/component-contract';

interface ButtonSlots {
  root: React.ElementType;
  startIcon: React.ElementType;
  label: React.ElementType;
}

interface ButtonSlotProps {
  root: React.ButtonHTMLAttributes<HTMLButtonElement>;
  startIcon: React.HTMLAttributes<HTMLSpanElement>;
  label: React.HTMLAttributes<HTMLSpanElement>;
}

interface ButtonProps extends SlottableComponentProps<ButtonSlots, ButtonSlotProps> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}
```

### 2. Resolve and Render Slots

```tsx
import { resolveSlotProps, renderSlot } from '../internal/slot-utils';

function Button({ children, slots, slotProps, variant = 'primary' }: ButtonProps) {
  const rootProps = resolveSlotProps(
    { className: `btn btn-${variant}`, type: 'button' as const },
    slotProps?.root,
  );

  const iconProps = resolveSlotProps(
    { className: 'btn-icon', 'aria-hidden': 'true' as const },
    slotProps?.startIcon,
  );

  return renderSlot('button', slots?.root, rootProps,
    <>
      {renderSlot('span', slots?.startIcon, iconProps)}
      {renderSlot('span', slots?.label,
        resolveSlotProps({ className: 'btn-label' }, slotProps?.label),
        children,
      )}
    </>
  );
}
```

---

## Utilities Reference

| Export             | Kind     | Purpose                                           |
|--------------------|----------|---------------------------------------------------|
| `mergeClassNames`  | function | Join class strings, filter falsy                   |
| `resolveSlotProps` | function | Merge default + consumer props (className/style aware) |
| `renderSlot`       | function | Create element with optional component override    |
| `SlotPropsMap`     | type     | Partial map of slot names to their HTML attributes |
| `SlotComponentMap` | type     | Partial map of slot names to ElementType overrides |
| `SlottableComponentProps` | interface | Extend this to add slots/slotProps to any component |

All runtime utilities live in `src/internal/slot-utils.ts`.
The contract interface lives in `src/internal/component-contract.ts`.

---

## Comparison with Other Libraries

| Aspect              | MUI                    | Radix              | This System                |
|---------------------|------------------------|---------------------|----------------------------|
| Prop override API   | `slotProps`            | per-part props      | `slotProps` (same as MUI)  |
| Component override  | `slots`                | `asChild`           | `slots` (same as MUI)     |
| Merge strategy      | shallow per prop       | n/a                 | className concat + style merge |
| Type safety         | generics               | discriminated       | generics + contract       |

---

## When to Use What

| Technique        | Best For                                                    |
|------------------|-------------------------------------------------------------|
| **slots/slotProps** | Customising internal sub-elements of a compound component |
| **children**     | Primary content projection                                  |
| **Render props** | When the consumer needs access to internal state            |
| **Composition**  | Building higher-level components from primitives            |

Use `slots` when the consumer wants to swap a sub-element's tag or component
(e.g., render a `<button>` as an `<a>`). Use `slotProps` when they only need to
add or override HTML attributes on an existing sub-element.
