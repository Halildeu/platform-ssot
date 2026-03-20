# @mfe/design-system Examples

These examples demonstrate how a **consumer** would use the `@mfe/design-system` package.
All imports use the public package entry point (`@mfe/design-system`) rather than
reaching into internal source paths. This mirrors how downstream applications should
integrate with the design system.

## Running

Import any example into Storybook or a test app:

```tsx
import { KitchenSink } from '@mfe/design-system/examples';

function App() {
  return <KitchenSink />;
}
```

## Examples

- **KitchenSink** -- Every major component (Button, Input, Select, Checkbox, Radio, Switch, Badge, Card, Dialog, Modal, Tooltip, Popover, Tabs, Accordion, Toast, EmptyState) rendered on a single page with all variants and states.

- **FormExample** -- Realistic form with controlled inputs, validation, error display, and submit handling. Covers Input, Textarea, Select, Checkbox, RadioGroup, and Switch in a registration form pattern.

- **DataGridExample** -- AG Grid integration via the `GridShell` wrapper with column definitions, custom cell renderers (Badge for status), CSV export, and density switching.

- **DarkModeExample** -- Theme switching using `ThemeProvider` and the `useTheme` hook. Toggles appearance (light/dark/high-contrast), density, radius, and elevation axes with live component preview.

- **AccessControlExample** -- Demonstrates the `access` prop system across four levels (`full`, `readonly`, `disabled`, `hidden`) with interactive controls and side-by-side comparison.

## Import convention

All components, providers, hooks, types, and utilities are imported from the root
`@mfe/design-system` package:

```tsx
import {
  Button,
  Input,
  Card,
  DesignSystemProvider,
  ThemeProvider,
  useTheme,
  GridShell,
} from "@mfe/design-system";
import type { AccessLevel, ThemeAppearance } from "@mfe/design-system";
```

For tree-shaking of heavier modules (e.g., AG Grid), you may also use deep imports:

```tsx
import { GridShell } from "@mfe/design-system/advanced/data-grid";
```
