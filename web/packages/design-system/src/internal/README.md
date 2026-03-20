# Unstable Modules

> **UNSTABLE** -- These modules are NOT covered by semver guarantees.
> They may change or be removed in any minor/patch release.

## Import Convention

These modules are exposed via the `./unstable/*` subpath, **not** `./internal/*`.
This makes the contract explicit at the import site:

```ts
// Consumers explicitly opt into unstable API
import { useFocusTrap } from '@mfe/design-system/unstable/overlay-engine';
import { Keys } from '@mfe/design-system/unstable/interaction-core';
```

A `console.warn` fires on first import in development mode as an additional signal.

## Modules

### interaction-core
Low-level keyboard navigation, focus management, and roving tabindex primitives.
Used internally by Tabs, Accordion, MenuBar, CommandPalette.

### overlay-engine
Positioning, scroll-lock, and portal management for overlay components.
Used internally by Modal, Dialog, Drawer, Popover, Tooltip, Dropdown.

## Stability Contract

- These modules follow the **unstable** stability tier (see docs/API-STABILITY-TIERS.md)
- Breaking changes are allowed in minor versions without deprecation
- Use `@mfe/design-system/headless` for the stable public headless API
- The source files remain in `src/internal/` but are exported under `./unstable/*`
