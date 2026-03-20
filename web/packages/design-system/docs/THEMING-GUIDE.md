# Theming Guide

> Token consumption, CSS variables reference, theme customization, and debugging.

---

## Token Consumption

Design system components use **semantic CSS custom properties** (variables) that automatically adapt to light/dark mode. Prefer semantic tokens over raw palette values so your UI stays consistent across themes.

### Using tokens in custom components

**Plain CSS:**

```css
.my-card {
  background-color: var(--surface-raised);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.my-card:hover {
  border-color: var(--border-strong);
}
```

**Tailwind arbitrary values:**

```tsx
<div className="bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-lg">
  <h3 className="text-[var(--text-primary)]">Card title</h3>
  <p className="text-[var(--text-secondary)]">Description text</p>
</div>
```

**Inline styles (escape hatch):**

```tsx
<div style={{ backgroundColor: "var(--surface-default)", color: "var(--text-primary)" }}>
  Content
</div>
```

### Dark mode: how tokens switch automatically

Tokens resolve to different values based on the `data-appearance` attribute on `<html>`. When `ThemeProvider` (or `setAppearance("dark")`) updates the appearance axis, the theme controller sets `data-appearance="dark"` and `data-mode="dark"` on the document root. The generated `theme.css` uses attribute selectors to swap token values:

```css
/* Simplified example from generated theme.css */
:root, [data-appearance="light"] {
  --surface-default: #ffffff;
  --text-primary: #111827;
}

[data-appearance="dark"] {
  --surface-default: #1f2937;
  --text-primary: #f9fafb;
}
```

No code changes needed in your components -- the same `var(--surface-default)` resolves correctly in both modes.

---

## CSS Variables Reference

### Surfaces

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--surface-default` | `#ffffff` | `#1f2937` | Default card/container background |
| `--surface-canvas` | `#f9fafb` | `#111827` | Page-level background |
| `--surface-muted` | `#f3f4f6` | `#374151` | Subtle background (table headers, hover rows) |
| `--surface-raised` | `#ffffff` | `#374151` | Elevated surfaces (modals, popovers, tooltips) |

### Text

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--text-primary` | `#111827` | `#f9fafb` | Body text, headings |
| `--text-secondary` | `#6b7280` | `#9ca3af` | Labels, descriptions, secondary info |
| `--text-disabled` | `#d1d5db` | `#4b5563` | Disabled control text |
| `--text-inverse` | `#ffffff` | `#111827` | Text on primary-colored backgrounds |

### Borders

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--border-default` | `#d1d5db` | `#4b5563` | Standard borders |
| `--border-subtle` | `#e5e7eb` | `#374151` | Dividers, grid lines |
| `--border-strong` | `#9ca3af` | `#6b7280` | Focused/hovered borders |

### Actions

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--action-primary` | `#2563eb` | `#3b82f6` | Primary button/link fill |
| `--action-primary-hover` | `#1d4ed8` | `#60a5fa` | Primary hover state |
| `--action-primary-active` | `#1e40af` | `#93c5fd` | Primary pressed state |
| `--action-secondary` | `#f3f4f6` | `#374151` | Secondary button fill |

### Feedback States

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--state-success-bg` | `#f0fdf4` | `#052e16` | Success banner background |
| `--state-success-text` | `#15803d` | `#22c55e` | Success text/icon color |
| `--state-warning-bg` | `#fffbeb` | `#451a03` | Warning banner background |
| `--state-warning-text` | `#b45309` | `#f59e0b` | Warning text/icon color |
| `--state-error-bg` | `#fef2f2` | `#450a0a` | Error banner background |
| `--state-error-text` | `#b91c1c` | `#ef4444` | Error text/icon color |
| `--state-info-bg` | `#eff6ff` | `#172554` | Info banner background |
| `--state-info-text` | `#1d4ed8` | `#3b82f6` | Info text/icon color |

### Focus

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--focus-ring` | `#3b82f6` | `#60a5fa` | Focus ring outline color |

### Other Token Categories

**Spacing** -- 4px grid: `0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 112, 128px`

**Border Radius** -- `none (0)`, `sm (4px)`, `md (8px)`, `lg (12px)`, `xl (16px)`, `2xl (20px)`, `3xl (24px)`, `full (9999px)`

**Elevation (box-shadow)** -- `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`

**Typography** -- Font families: `sans` (Inter), `mono` (JetBrains Mono). Sizes: `xs` through `4xl`. Weights: `normal (400)`, `medium (500)`, `semibold (600)`, `bold (700)`.

**Motion** -- Durations: `instant (0ms)`, `fast (100ms)`, `normal (200ms)`, `slow (300ms)`, `slower (500ms)`. Easings: `default`, `in`, `out`, `inOut`, `spring`.

**Z-index layers** -- `base (0)`, `dropdown (1000)`, `sticky (1100)`, `fixed (1200)`, `backdrop (1300)`, `modal (1400)`, `popover (1500)`, `tooltip (1600)`, `toast (1700)`, `commandPalette (1800)`.

**Opacity** -- `disabled (0.5)`, `readonly (0.7)`, `hover (0.8)`, `active (0.9)`, `placeholder (0.5)`, `overlay (0.6)`.

---

## Theme Customization

### Theme axes

The theme system supports multiple axes beyond light/dark:

| Axis | Values | Default |
|------|--------|---------|
| `appearance` | `"light"`, `"dark"`, `"high-contrast"` | `"light"` |
| `density` | `"comfortable"`, `"compact"` | `"comfortable"` |
| `radius` | `"rounded"`, `"sharp"` | `"rounded"` |
| `elevation` | `"raised"`, `"flat"` | `"raised"` |
| `motion` | `"standard"`, `"reduced"` | `"standard"` |
| `contrastRatio` | `"standard"`, `"aa"`, `"aaa"` | `"standard"` |

Each axis is applied as a `data-*` attribute on `<html>` (e.g., `data-appearance="dark"`, `data-density="compact"`).

### Creating a custom theme

Override the semantic token set by providing new color values:

```ts
import type { SemanticTokenSet } from "@mfe/design-system";

export const brandTheme: SemanticTokenSet = {
  surfaceDefault: "#fdfcfb",
  surfaceCanvas: "#f5f0eb",
  surfaceMuted: "#ede5db",
  surfaceRaised: "#ffffff",

  textPrimary: "#1a1a1a",
  textSecondary: "#666666",
  textDisabled: "#b3b3b3",
  textInverse: "#ffffff",

  borderDefault: "#d4c8b8",
  borderSubtle: "#e8dfd3",
  borderStrong: "#b8a998",

  actionPrimary: "#c2410c",  // brand orange
  actionPrimaryHover: "#9a3412",
  actionPrimaryActive: "#7c2d12",
  actionSecondary: "#ede5db",

  stateSuccessBg: "#f0fdf4",
  stateSuccessText: "#15803d",
  stateWarningBg: "#fffbeb",
  stateWarningText: "#b45309",
  stateErrorBg: "#fef2f2",
  stateErrorText: "#b91c1c",
  stateInfoBg: "#eff6ff",
  stateInfoText: "#1d4ed8",

  focusRing: "#c2410c",
};
```

Apply it at runtime using the UI adapter:

```ts
import { applyTokenSet } from "@mfe/design-system";
import { brandTheme } from "./brand-theme";

// Apply to <html>
applyTokenSet(brandTheme);

// Or scope to a container
applyTokenSet(brandTheme, document.getElementById("brand-section")!);
```

Or generate CSS for static inclusion:

```ts
import { tokenSetToCss } from "@mfe/design-system";
import { brandTheme } from "./brand-theme";

const css = tokenSetToCss(brandTheme, '[data-theme="brand"]');
// Inject via <style> tag or write to a CSS file
```

### Theme adapter usage

**AG Grid** -- convert tokens to AG Grid theme params:

```ts
import { tokenSetToGridTheme, lightTheme } from "@mfe/design-system";

const gridTheme = tokenSetToGridTheme(lightTheme);
// Use in AG Grid: { headerBackgroundColor, foregroundColor, borderColor, ... }
```

**Charts** -- convert tokens to chart color config:

```ts
import { tokenSetToChartColors, lightTheme } from "@mfe/design-system";

const chartColors = tokenSetToChartColors(lightTheme);
// { primaryColor, backgroundColor, textColor, gridColor, series: [...] }
```

### Runtime theme switching

Use the imperative theme controller or the React hook:

```ts
// Imperative (outside React)
import {
  setAppearance,
  setDensity,
  updateThemeAxes,
  subscribeThemeAxes,
} from "@mfe/design-system";

setAppearance("dark");
setDensity("compact");

// Batch multiple axis changes
updateThemeAxes({ appearance: "dark", density: "compact", radius: "sharp" });

// Subscribe to changes
const unsubscribe = subscribeThemeAxes((axes) => {
  console.log("Theme changed:", axes.appearance, axes.density);
});
```

```tsx
// React hook
import { useTheme } from "@mfe/design-system";

function ThemeControls() {
  const { axes, setAppearance, setDensity } = useTheme();

  return (
    <div>
      <button onClick={() => setAppearance(axes.appearance === "dark" ? "light" : "dark")}>
        Toggle dark mode
      </button>
      <button onClick={() => setDensity(axes.density === "compact" ? "comfortable" : "compact")}>
        Toggle density
      </button>
    </div>
  );
}
```

The theme controller automatically persists axes to `localStorage` under key `themeAxes` and restores on page load.

---

## Theme Debugging

### Inspecting active tokens in DevTools

1. Open DevTools > Elements panel.
2. Select the `<html>` element. Check:
   - `data-appearance` -- current appearance (`light` / `dark`)
   - `data-mode` -- derived mode (`light` / `dark`)
   - `data-density`, `data-radius`, `data-elevation`, `data-motion`, `data-contrast-ratio`
   - `data-theme` -- resolved theme mode key
3. In the Styles panel, look at `:root` (or the `html` selector) to see all `--surface-*`, `--text-*`, `--border-*`, `--action-*`, `--state-*` variables and their computed values.
4. Click on any element and check its computed styles -- token references like `var(--text-primary)` resolve to the current theme's value.

### Verifying dark mode compliance

1. Toggle to dark mode: run `setAppearance("dark")` in the console (import is at `@mfe/design-system`).
2. Or via DevTools: on the `<html>` element, edit `data-appearance` from `light` to `dark`.
3. Verify all custom variables update. Check contrast ratios using DevTools' color picker (click the color swatch next to a `color` or `background-color` property).
4. Look for hardcoded colors that do not use `var(--*)` -- these will not adapt and indicate a compliance issue.

### Quick console checks

```js
// Read current theme axes
getComputedStyle(document.documentElement).getPropertyValue('--surface-default');

// Check all data attributes
document.documentElement.dataset;
// { appearance: "light", mode: "light", density: "comfortable", ... }
```

---

## Related Docs

- [TOKEN-PIPELINE.md](./TOKEN-PIPELINE.md) -- How tokens are built and validated in CI
- [recipes/theming.md](./recipes/theming.md) -- Task-based theming recipes
- [recipes/nextjs.md](./recipes/nextjs.md) -- Next.js App Router integration with ThemeProvider
