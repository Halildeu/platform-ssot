# Migration Guide: v1 → v2

> **Package:** `@mfe/design-system`
> **Updated:** 2026-03-20

## Overview

This guide covers all deprecated prop renames in `@mfe/design-system` v2.0.0.
All deprecated aliases **still work** in v2.x with dev-mode `console.warn` warnings.
They will be **removed in v3.0.0**.

---

## Size Props

| Component | Deprecated | Standard | Values |
|-----------|-----------|----------|--------|
| Input | `inputSize` | `size` | `sm` / `md` / `lg` |
| Select | `selectSize` | `size` | `sm` / `md` / `lg` |
| Switch | `switchSize` | `size` | `sm` / `md` / `lg` |
| Checkbox | `checkboxSize` | `size` | `sm` / `md` / `lg` |
| Radio | `radioSize` | `size` | `sm` / `md` / `lg` |
| SearchInput | `searchSize` | `size` | `sm` / `md` / `lg` |

### Before / After

```tsx
// Before (deprecated — warns in dev)
<Input inputSize="sm" />
<Select selectSize="lg" />
<Switch switchSize="md" />
<Checkbox checkboxSize="lg" />
<Radio radioSize="sm" />
<SearchInput searchSize="md" />

// After (standard)
<Input size="sm" />
<Select size="lg" />
<Switch size="md" />
<Checkbox size="lg" />
<Radio size="sm" />
<SearchInput size="md" />
```

---

## Variant Props

| Component | Deprecated | Standard | Values |
|-----------|-----------|----------|--------|
| Badge | `tone` | `variant` | `default` / `primary` / `success` / `warning` / `error` / `danger` / `info` / `muted` |
| Tag | `tone` | `variant` | `default` / `primary` / `success` / `warning` / `error` / `info` / `danger` |
| Alert | `severity` | `variant` | `info` / `success` / `warning` / `error` |
| LinkInline | `tone` | `variant` | `primary` / `secondary` |
| Segmented | `appearance` | `variant` | `default` / `outline` / `ghost` |
| Modal | `surface` | `variant` | `base` / `confirm` / `destructive` / `audit` |

### Before / After

```tsx
// Badge: tone → variant
<Badge tone="info">New</Badge>        // deprecated
<Badge variant="info">New</Badge>     // standard

// Tag: tone → variant
<Tag tone="success">Active</Tag>      // deprecated
<Tag variant="success">Active</Tag>   // standard

// Alert: severity → variant
<Alert severity="warning">Check this</Alert>    // deprecated
<Alert variant="warning">Check this</Alert>     // standard

// LinkInline: tone → variant
<LinkInline tone="primary" href="/about">About</LinkInline>    // deprecated
<LinkInline variant="primary" href="/about">About</LinkInline> // standard

// Segmented: appearance → variant
<Segmented appearance="outline" items={items} />    // deprecated
<Segmented variant="outline" items={items} />       // standard

// Modal: surface → variant
<Modal surface="destructive" open onClose={fn} title="Delete">   // deprecated
<Modal variant="destructive" open onClose={fn} title="Delete">   // standard
```

---

## Error Props

| Component | Deprecated | Standard | Notes |
|-----------|-----------|----------|-------|
| Input | `invalid` | `error` | `error` accepts `ReactNode` (boolean or message) |
| Textarea | `invalid` | `error` | `error` accepts `ReactNode` (boolean or message) |
| Select | `invalid` | `error` | `error` accepts `boolean \| string` |
| Combobox | `invalid` | `error` | Both accepted; prefer `error` |
| DatePicker | `invalid` | `error` | Both accepted; prefer `error` |
| Slider | `invalid` | `error` | Both accepted; prefer `error` |

### Before / After

```tsx
// Before
<Input invalid />
<Textarea invalid />
<Select invalid />

// After — boolean usage
<Input error />
<Textarea error />
<Select error />

// After — with message (Input, Textarea, Combobox, DatePicker, Slider)
<Input error="This field is required" />
<Textarea error="Too short" />
```

---

## Tabs & Pagination Props

| Component | Deprecated | Standard | Notes |
|-----------|-----------|----------|-------|
| Tabs | `activeTabId` | `activeKey` | Controlled tab selection |
| Tabs | `onValueChange` | `onChange` | Tab change callback |
| Pagination | `page` | `current` | Current page number |
| Pagination | `onPageChange` | `onChange` | Page change callback |
| Pagination | `totalItems` | `total` | Total item count |

### Before / After

```tsx
// Tabs
<Tabs activeTabId="tab1" onValueChange={(key) => setKey(key)}>   // deprecated
<Tabs activeKey="tab1" onChange={(key) => setKey(key)}>           // standard

// Pagination
<Pagination totalItems={100} page={1} onPageChange={setPage} />  // deprecated
<Pagination total={100} current={1} onChange={setPage} />         // standard
```

---

## Access Control

Components that support user interaction integrate the `resolveAccessState` pattern via `AccessControlledProps`:

```tsx
interface AccessControlledProps {
  access?: "full" | "readonly" | "disabled" | "hidden";
  accessReason?: string;
}
```

### Supported Components

Button, IconButton, Input, Textarea, Select, Switch, Checkbox, Radio, Tag, LinkInline, Popover, Combobox, DatePicker, Slider.

### Before / After

```tsx
// Before — manual disabled/hidden logic
{canEdit ? <Input value={val} onChange={fn} /> : <Input value={val} disabled />}

// After — declarative access control
<Input
  value={val}
  onChange={fn}
  access={canEdit ? "full" : "readonly"}
  accessReason="You do not have edit permissions"
/>

// Hidden — component does not render
<Button access="hidden">Delete</Button>  // renders nothing

// Disabled with tooltip reason
<Button access="disabled" accessReason="Approval required first">
  Submit
</Button>
```

---

## Composability (New in v2)

The `asChild` prop uses the Slot pattern to merge component styling onto a custom child element. This enables routing library integration and semantic HTML without wrapper elements.

### Supported Components

Button, IconButton, Badge, Tag, Card, Text, Alert, Tooltip, LinkInline.

### Before / After

```tsx
// Before — wrapper div, extra DOM node
<Link href="/dashboard">
  <Button>Go to Dashboard</Button>
</Link>

// After — single <a> element with Button styles
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

// Badge as a link
<Badge asChild variant="info">
  <a href="/status">Active</a>
</Badge>

// Card as an article
<Card asChild variant="outlined">
  <article>
    <h3>Card Title</h3>
    <p>Card content rendered as semantic article.</p>
  </article>
</Card>

// Text with custom element
<Text asChild size="lg" variant="muted">
  <label htmlFor="name">Full Name</label>
</Text>
```

---

## Server Entry (New in v2)

Import `@mfe/design-system/server` in React Server Components (RSC) to avoid creating a client boundary. This entry point exports only server-safe code: tokens, theme constants, icons, and pure utilities.

```tsx
// app/layout.tsx (server component)
import { cn, lightTheme, darkTheme } from "@mfe/design-system/server";
import { tokenSetToCss } from "@mfe/design-system/server";

export default function RootLayout({ children }) {
  const cssVars = tokenSetToCss(lightTheme);
  return (
    <html>
      <head>
        <style>{cssVars}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### What is available from `/server`

| Export | Type |
|--------|------|
| `lightTheme`, `darkTheme` | Theme token sets |
| `DEFAULT_THEME_AXES`, `THEME_ATTRIBUTE_MAP` | Theme constants |
| `getThemeContract`, `resolveThemeModeKey` | Pure functions |
| `tokenSetToCss` | Tokens to CSS variables |
| `tokenSetToGridTheme` | Tokens to AG Grid theme |
| `tokenSetToChartColors` | Tokens to chart palette |
| `cn` | Class name utility |
| All icons | SVG components |
| All tokens | `@mfe/design-system/tokens` re-exports |

### What is NOT available from `/server`

Interactive components (Button, Input, etc.), providers, hooks, and anything that touches `document`, `window`, or `localStorage`.

---

## Codemod

Automated migration for all deprecated prop renames. Run from the consuming project root.

### Using sed (quick one-liners)

```bash
# Size props
find src -name '*.tsx' -exec sed -i '' 's/inputSize=/size=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/selectSize=/size=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/switchSize=/size=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/checkboxSize=/size=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/radioSize=/size=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/searchSize=/size=/g' {} +

# Variant props
find src -name '*.tsx' -exec sed -i '' 's/\btone=/variant=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/\bseverity=/variant=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/\bappearance=/variant=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/\bsurface=/variant=/g' {} +

# Error props
find src -name '*.tsx' -exec sed -i '' 's/\binvalid\b/error/g' {} +

# Tabs
find src -name '*.tsx' -exec sed -i '' 's/activeTabId=/activeKey=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/onValueChange=/onChange=/g' {} +

# Pagination
find src -name '*.tsx' -exec sed -i '' 's/totalItems=/total=/g' {} +
find src -name '*.tsx' -exec sed -i '' 's/onPageChange=/onChange=/g' {} +
# Note: `page=` → `current=` needs manual review to avoid false positives
```

### Using jscodeshift (precise AST transforms)

```bash
# If the design-system ships a codemod (planned):
npx jscodeshift -t node_modules/@mfe/design-system/codemods/v2-prop-renames.ts \
  --extensions=tsx,ts \
  src/
```

### Verification

After running codemods, check for remaining deprecated usage:

```bash
# Should return zero matches when migration is complete
grep -rn 'inputSize\|selectSize\|switchSize\|checkboxSize\|radioSize\|searchSize' src/
grep -rn 'tone=\|severity=\|surface=' src/ --include='*.tsx'
grep -rn 'invalid' src/ --include='*.tsx'  # review manually — may have non-prop uses
```

---

## Quick Reference

| Deprecated | Standard | Components |
|-----------|----------|------------|
| `inputSize` | `size` | Input |
| `selectSize` | `size` | Select |
| `switchSize` | `size` | Switch |
| `checkboxSize` | `size` | Checkbox |
| `radioSize` | `size` | Radio |
| `searchSize` | `size` | SearchInput |
| `tone` | `variant` | Badge, Tag, LinkInline |
| `severity` | `variant` | Alert |
| `appearance` | `variant` | Segmented |
| `surface` | `variant` | Modal |
| `invalid` | `error` | Input, Textarea, Select, Combobox, DatePicker, Slider |
| `activeTabId` | `activeKey` | Tabs |
| `onValueChange` | `onChange` | Tabs |
| `page` | `current` | Pagination |
| `onPageChange` | `onChange` | Pagination |
| `totalItems` | `total` | Pagination |
