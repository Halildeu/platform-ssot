# Slot / SlotProps Pattern

## Overview

The slot pattern provides fine-grained control over compound component internals without breaking encapsulation. Inspired by MUI's `slots`/`slotProps` API, each named "slot" maps to a sub-element inside a component (root, label, icon, etc.).

Two props control customization:

- **`slots`** -- swap the rendered element/component for a named slot
- **`slotProps`** -- forward additional HTML attributes to a named slot

## API

### `slots`

Override which element or component renders for a given slot.

```tsx
<Button slots={{ root: 'a' }}>Home</Button>
// renders <a> instead of <button>

<Button slots={{ root: NextLink }}>Dashboard</Button>
// renders a Next.js Link
```

### `slotProps`

Forward props (className, style, data-* attributes, event handlers, etc.) to any slot.

```tsx
<Button
  slotProps={{
    root: { href: '/home', className: 'nav-link' },
    startIcon: { className: 'icon-lg' },
    label: { 'data-testid': 'btn-label' },
  }}
>
  Home
</Button>
```

## Merge Behavior

| Prop | Strategy |
|------|----------|
| `className` | **Concatenated** -- component default + consumer value. Never replaced. |
| `style` | **Shallow merged** -- consumer properties override defaults. |
| Everything else | **Consumer wins** -- consumer value replaces the default. |

```tsx
// Component default className: "btn btn-primary"
// Consumer slotProps.root.className: "my-custom"
// Result: "btn btn-primary my-custom"
```

## Utilities (`src/internal/slot-utils.ts`)

| Export | Kind | Purpose |
|--------|------|---------|
| `mergeClassNames(...classes)` | function | Join class strings, filter falsy values |
| `resolveSlotProps(defaults, slotProps)` | function | Merge default + consumer props with className/style awareness |
| `renderSlot(default, override, props, children)` | function | Create element with optional component override |
| `SlotPropsMap<T>` | type | `Partial` map of slot names to their HTML attributes |
| `SlotComponentMap<T>` | type | `Partial` map of slot names to `React.ElementType` overrides |

## Integration with Component Contract

Extend `SlottableComponentProps` from `src/internal/component-contract.ts` to add `slots`/`slotProps` to any component:

```tsx
import type { SlottableComponentProps } from '../internal/component-contract';

interface CardSlots {
  root: React.ElementType;
  header: React.ElementType;
  body: React.ElementType;
}

interface CardSlotProps {
  root: React.HTMLAttributes<HTMLDivElement>;
  header: React.HTMLAttributes<HTMLDivElement>;
  body: React.HTMLAttributes<HTMLDivElement>;
}

interface CardProps extends SlottableComponentProps<CardSlots, CardSlotProps> {
  title: string;
  children: React.ReactNode;
}
```

## Full Example: Custom Button

### Define types

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

### Resolve and render

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

### Consumer usage

```tsx
<Button
  slots={{ root: 'a' }}
  slotProps={{
    root: { href: '/dashboard', className: 'nav-link' },
    startIcon: { className: 'icon-lg' },
  }}
>
  Dashboard
</Button>
```

## When to Use

| Technique | Best for |
|-----------|----------|
| `slots` / `slotProps` | Customizing internal sub-elements of a compound component |
| `children` | Primary content projection |
| Render props | When the consumer needs access to internal state |
| Composition | Building higher-level components from primitives |
