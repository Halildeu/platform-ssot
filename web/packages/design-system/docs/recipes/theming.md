# Theming Recipes

> Override tokens, create brand themes, set up dark mode, and integrate with AG Grid.

For the full token reference and CSS variable list, see [THEMING-GUIDE.md](../THEMING-GUIDE.md).

---

## Override tokens with CSS

The simplest way to customize is overriding CSS custom properties at the `:root` level or on a scoped container:

```css
/* Global brand overrides */
:root {
  --action-primary: #c2410c;
  --action-primary-hover: #9a3412;
  --action-primary-active: #7c2d12;
  --focus-ring: #c2410c;
}
```

Scoped override for a specific section:

```css
.brand-section {
  --surface-default: #fdfcfb;
  --surface-canvas: #f5f0eb;
  --action-primary: #c2410c;
}
```

```tsx
<div className="brand-section">
  <Button variant="primary">Branded Button</Button>
  {/* Button uses --action-primary: #c2410c */}
</div>
```

---

## Create a brand theme

Define a full `SemanticTokenSet` and apply it programmatically:

```ts
// themes/acme-theme.ts
import type { SemanticTokenSet } from "@mfe/design-system";

export const acmeLight: SemanticTokenSet = {
  surfaceDefault: "#ffffff",
  surfaceCanvas: "#faf8f5",
  surfaceMuted: "#f0ece6",
  surfaceRaised: "#ffffff",

  textPrimary: "#1c1917",
  textSecondary: "#78716c",
  textDisabled: "#d6d3d1",
  textInverse: "#ffffff",

  borderDefault: "#d6d3d1",
  borderSubtle: "#e7e5e4",
  borderStrong: "#a8a29e",

  actionPrimary: "#ea580c",
  actionPrimaryHover: "#c2410c",
  actionPrimaryActive: "#9a3412",
  actionSecondary: "#f0ece6",

  stateSuccessBg: "#f0fdf4",
  stateSuccessText: "#15803d",
  stateWarningBg: "#fffbeb",
  stateWarningText: "#b45309",
  stateErrorBg: "#fef2f2",
  stateErrorText: "#b91c1c",
  stateInfoBg: "#eff6ff",
  stateInfoText: "#1d4ed8",

  focusRing: "#ea580c",
};
```

Apply at runtime:

```tsx
"use client";

import { applyTokenSet } from "@mfe/design-system";
import { acmeLight } from "@/themes/acme-theme";
import { useEffect } from "react";

export function AcmeThemeLoader() {
  useEffect(() => {
    applyTokenSet(acmeLight);
  }, []);
  return null;
}
```

Or generate static CSS:

```ts
import { tokenSetToCss } from "@mfe/design-system";
import { acmeLight } from "./themes/acme-theme";

// Output: ":root { --surface-default: #ffffff; ... }"
const css = tokenSetToCss(acmeLight);
```

---

## Dark mode setup

### Using DesignSystemProvider

```tsx
"use client";

import { DesignSystemProvider } from "@mfe/design-system";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemProvider defaultTheme={{ appearance: "light" }} locale="en">
      {children}
    </DesignSystemProvider>
  );
}
```

### Toggle with useTheme

```tsx
"use client";

import { useTheme } from "@mfe/design-system";

export function DarkModeToggle() {
  const { axes, setAppearance } = useTheme();
  const isDark = axes.appearance === "dark";

  return (
    <button onClick={() => setAppearance(isDark ? "light" : "dark")}>
      {isDark ? "Switch to light" : "Switch to dark"}
    </button>
  );
}
```

### Respect system preference

```tsx
"use client";

import { useEffect } from "react";
import { setAppearance } from "@mfe/design-system";

export function SystemThemeSync() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setAppearance(mq.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) =>
      setAppearance(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return null;
}
```

Theme state persists to `localStorage` (key: `themeAxes`), so the user's preference survives page reloads.

---

## AG Grid theme integration

Use `tokenSetToGridTheme` to map design system tokens to AG Grid's theming API:

```tsx
"use client";

import { AgGridReact } from "ag-grid-react";
import {
  tokenSetToGridTheme,
  lightTheme,
  darkTheme,
  useTheme,
} from "@mfe/design-system";

export function DataGrid({ rowData, columnDefs }) {
  const { axes } = useTheme();
  const tokens = axes.appearance === "dark" ? darkTheme : lightTheme;
  const gridTheme = tokenSetToGridTheme(tokens);

  return (
    <div
      className="ag-theme-alpine"
      style={{
        "--ag-header-background-color": gridTheme.headerBackgroundColor,
        "--ag-background-color": gridTheme.backgroundColor,
        "--ag-foreground-color": gridTheme.foregroundColor,
        "--ag-border-color": gridTheme.borderColor,
        "--ag-row-hover-color": gridTheme.rowHoverColor,
        "--ag-selected-row-background-color": gridTheme.selectedRowBackgroundColor,
        "--ag-odd-row-background-color": gridTheme.oddRowBackgroundColor,
        "--ag-font-size": gridTheme.fontSize,
        "--ag-header-font-size": gridTheme.headerFontSize,
        height: 500,
      } as React.CSSProperties}
    >
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
}
```

The grid theme updates automatically when the user switches between light and dark mode because `useTheme` triggers a re-render.

---

## Related Docs

- [THEMING-GUIDE.md](../THEMING-GUIDE.md) -- Full token reference and CSS variable list
- [TOKEN-PIPELINE.md](../TOKEN-PIPELINE.md) -- How tokens are built and validated in CI
- [nextjs.md](./nextjs.md) -- Next.js App Router provider setup
