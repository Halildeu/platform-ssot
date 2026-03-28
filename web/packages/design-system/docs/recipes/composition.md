# Composition Patterns

> How to use `asChild`, `Slot`, `slots`/`slotProps`, and the polymorphic `as` prop.

---

## Render Button as a link

### Using `asChild` (recommended)

`asChild` renders via the `Slot` primitive, merging Button's styles and event handlers onto the child element.

```tsx
import { Button } from "@mfe/design-system";

// Native anchor
<Button asChild variant="primary">
  <a href="/dashboard">Go to Dashboard</a>
</Button>
// Renders: <a href="/dashboard" class="btn-primary ...">Go to Dashboard</a>

// Next.js Link
import Link from "next/link";

<Button asChild variant="outline">
  <Link href="/settings">Settings</Link>
</Button>
```

### Using the `as` prop (polymorphic)

```tsx
import { Button } from "@mfe/design-system";
import Link from "next/link";

<Button as="a" href="/dashboard" variant="primary">
  Go to Dashboard
</Button>

<Button as={Link} href="/settings" variant="outline">
  Settings
</Button>
```

**When to use which:**

| Pattern | Best for |
|---------|----------|
| `asChild` | Full control over the child element; works with any component |
| `as` prop | Quick element swap when you do not need to pass children with their own props |

---

## Render Badge as a custom element

```tsx
import { Badge } from "@mfe/design-system";

// Render Badge as a link
<Badge asChild status="success">
  <a href="/orders/active">3 active</a>
</Badge>

// Render Badge inside a button for interactive tags
<Badge asChild status="info">
  <button onClick={() => applyFilter("new")}>New</button>
</Badge>
```

---

## Override compound component internals with slots/slotProps

Components that expose named slots let you swap sub-elements and forward props to specific internal parts without breaking encapsulation.

### Swap the root element

```tsx
import { Button } from "@mfe/design-system";

<Button
  slots={{ root: "a" }}
  slotProps={{ root: { href: "/home", className: "nav-link" } }}
>
  Home
</Button>
// Renders: <a href="/home" class="btn-primary nav-link ...">Home</a>
```

### Forward props to internal slots

```tsx
<Button
  variant="secondary"
  slotProps={{
    root: { "data-testid": "save-btn" },
    startIcon: { className: "text-green-600" },
    label: { "data-testid": "save-label" },
  }}
  leftIcon={<CheckIcon />}
>
  Save
</Button>
```

### className merge behavior

| Prop | Strategy |
|------|----------|
| `className` | **Concatenated** -- component default + consumer value (never replaced) |
| `style` | **Shallow merged** -- consumer properties override defaults |
| Event handlers | **Composed** -- parent fires first, child fires if not `preventDefault`ed |
| Everything else | **Consumer wins** |

---

## Full composition example

```tsx
import { Button } from "@mfe/design-system";
import Link from "next/link";

// Navigation bar with design-system buttons rendered as Next.js Links
function NavBar() {
  return (
    <nav className="flex gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <Link href="/reports">Reports</Link>
      </Button>
      <Button asChild variant="primary" size="sm">
        <Link href="/new-order">New Order</Link>
      </Button>
    </nav>
  );
}
```

---

## Related Docs

- [SLOT-PATTERN.md](../SLOT-PATTERN.md) -- Full slot/slotProps API reference and utility functions
- [COMPONENT-CONTRACT.md](../COMPONENT-CONTRACT.md) -- Base component contract including `SlottableComponentProps`
