# Server / Client Support Matrix

> Generated: 2026-03-20 | Package: `@mfe/design-system`

This document classifies every export category by server/client compatibility and provides guidance for Next.js App Router consumers.

**Related docs:**
- [SSR-RSC-BOUNDARY.md](./SSR-RSC-BOUNDARY.md) -- architecture decision record
- [CLIENT-ONLY-COMPONENTS.md](./CLIENT-ONLY-COMPONENTS.md) -- detailed browser API audit

---

## Entry Points

| Entry Point | Import Path | Contains `"use client"` | Safe in RSC |
|---|---|:-:|:-:|
| Default barrel | `@mfe/design-system` | Yes | No (creates client boundary) |
| Server | `@mfe/design-system/server` | No | Yes |
| Tokens | `@mfe/design-system/tokens` | No | Yes |
| Icons | `@mfe/design-system/icons` | No | Yes |

---

## Support Matrix

### Server-Safe Exports (`@mfe/design-system/server`)

These exports have zero browser API usage and no `"use client"` directive. They can be imported directly in React Server Components.

| Export | Category | Import Path | Notes |
|---|---|---|---|
| All design tokens (`colors`, `spacing`, `radius`, `typography`, `motion`, `zIndex`) | Tokens | `@mfe/design-system/server` | Pure data objects, zero runtime |
| `lightTheme`, `darkTheme` | Theme constants | `@mfe/design-system/server` | Static theme definitions |
| `DEFAULT_THEME_AXES`, `THEME_ATTRIBUTE_MAP` | Theme constants | `@mfe/design-system/server` | Pure config objects |
| `getThemeContract`, `resolveThemeModeKey` | Theme contract | `@mfe/design-system/server` | Pure functions, lazy JSON load with fallback |
| `tokenSetToCss` | Theme adapter | `@mfe/design-system/server` | Pure mapping function |
| `tokenSetToGridTheme` | Theme adapter | `@mfe/design-system/server` | Pure mapping function |
| `tokenSetToChartColors` | Theme adapter | `@mfe/design-system/server` | Pure mapping function |
| All icons | Icons | `@mfe/design-system/server` | SVG components, server-renderable |
| `cn()` | Utility | `@mfe/design-system/server` | Pure function (clsx + tailwind-merge) |
| Theme type exports (`ThemeAppearance`, `ThemeDensity`, etc.) | Types | `@mfe/design-system/server` | TypeScript types only |

### Client-Only: Presentational Components (use hooks but no browser APIs)

These components use React hooks (`useState`, `useCallback`, `useMemo`, `useId`, `forwardRef`) which require `"use client"` in RSC contexts, but they have no direct browser API dependency.

| Export | Category | Why Client-Only |
|---|---|---|
| **Button**, **IconButton** | Primitive | `forwardRef` |
| **Text** | Primitive | `forwardRef` |
| **Card** | Primitive | `forwardRef` |
| **LinkInline** | Primitive | `forwardRef` |
| **Stack / HStack / VStack** | Primitive | `forwardRef` |
| **Checkbox** | Primitive | `forwardRef` + `useId` |
| **Radio** | Primitive | `forwardRef` + `useId` |
| **Select** | Primitive | `forwardRef` |
| **Switch** | Primitive | `forwardRef` + `useId` |
| **Accordion** | Component | `useState` |
| **Tabs** | Component | `useState` |
| **Pagination** | Component | `useState` |
| **Transfer** | Component | `useState` |
| **Tree** | Component | `useState` |
| **TreeTable** | Component | `useState` |
| **JsonViewer** | Component | `useState` |
| **FilterBar** | Pattern | `useState` |
| **SearchInput** | Component | `forwardRef` |
| **AvatarGroup** | Component | `forwardRef` |

### Client-Only: Pure Presentational (no hooks, no browser APIs)

These could theoretically be RSCs but are currently only exported via the `"use client"` barrel.

| Export | Category | Notes |
|---|---|---|
| **Alert** | Primitive | Pure presentational |
| **Avatar** | Primitive | Pure presentational |
| **Badge** | Primitive | Pure presentational |
| **Divider** | Primitive | Pure presentational |
| **Skeleton** | Primitive | Pure presentational |
| **Spinner** | Primitive | Pure presentational |
| **Tag** | Primitive | Pure presentational |
| **Breadcrumb** | Component | Pure presentational |
| **Descriptions** | Component | Pure presentational |
| **EmptyState** | Component | Pure presentational |
| **EmptyErrorLoading** | Component | Conditional rendering |
| **FormField** | Component | Label/error wrapper |
| **List** | Component | Pure presentational |
| **Steps** | Component | Pure presentational |
| **TableSimple** | Component | Pure presentational |
| **Timeline** | Component | Pure presentational |
| **ConfidenceBadge** | Component | Pure presentational |
| **CitationPanel** | Component | Pure presentational |
| **RecommendationCard** | Component | Pure presentational |
| **ApprovalCheckpoint** | Component | Pure presentational |
| **ApprovalReview** | Component | Pure presentational |
| **AIActionAuditTimeline** | Component | Pure presentational |
| **PageHeader** | Pattern | Pure presentational |
| **PageLayout** | Pattern | Pure presentational |
| **DetailSummary** | Pattern | Pure presentational |
| **EntitySummaryBlock** | Pattern | Pure presentational |
| **SummaryStrip** | Pattern | Pure presentational |

> **Future optimization:** These components are candidates for promotion to the `server` entry point in Phase 3 of the RSC migration (see [SSR-RSC-BOUNDARY.md](./SSR-RSC-BOUNDARY.md)).

### Client-Only: Interactive Components (browser APIs required)

These components use browser APIs inside effects, handlers, or callbacks. They must always run on the client.

| Export | Category | Browser APIs Used |
|---|---|---|
| **Input** | Primitive | DOM `.focus()` via `useRef` |
| **Textarea** | Primitive | DOM `.focus()` via `useRef` |
| **Dialog** | Primitive | `.showModal()` / `.close()` native dialog API |
| **Modal** | Primitive | `createPortal`, `document.body`, scroll-lock |
| **Popover** | Primitive | `createPortal`, `window.addEventListener`, `rAF` |
| **Dropdown** | Primitive | `document.addEventListener` (outside-click) |
| **Tooltip** | Primitive | Timer-based show/hide, focus tracking |
| **MenuBar** | Component | `ResizeObserver`, `matchMedia`, `rAF` |
| **Combobox** | Component | `createPortal`, positioning, scroll/resize listeners |
| **CommandPalette** | Component | Global keyboard shortcut listener |
| **ContextMenu** | Component | Outside-click, viewport measurement |
| **Cascader** | Component | Outside-click detection |
| **Carousel** | Component | `setInterval` auto-play |
| **FloatButton** | Component | Escape key listener |
| **Mentions** | Component | `rAF`, DOM measurement |
| **Watermark** | Component | `MutationObserver`, canvas API |
| **TourCoachmarks** | Component | Escape key listener |
| **Toast** | Component | `setTimeout` auto-dismiss |
| **Calendar** | Component | Focus management |
| **ColorPicker** | Component | Interactive color selection |
| **Segmented** | Component | DOM measurement |
| **Slider** | Component | Slider track interaction |
| **DatePicker** | Component | Calendar popup, focus management |
| **TimePicker** | Component | Time input interaction |
| **NavigationRail** | Component | Focus management |
| **Rating** | Component | Star interaction |
| **Upload** | Component | File input click trigger |
| **AdaptiveForm** | Component | Form DOM, validation |
| **AILayoutBuilder** | Component | Drag-and-drop state |
| **QRCode** | Component | Canvas API in `useEffect` |

### Client-Only: Composed Patterns (browser APIs via dependencies)

| Export | Category | Browser APIs Used |
|---|---|---|
| **DetailDrawer** | Pattern | Escape key listener, panel ref |
| **FormDrawer** | Pattern | Escape key listener, panel ref |
| **MasterDetail** | Pattern | Layout composition (transitive) |

### Client-Only: Advanced (AG Grid, Charts)

| Export | Category | Browser APIs Used |
|---|---|---|
| **GridShell** | DataGrid | AG Grid API, `useImperativeHandle` |
| **TablePagination** | DataGrid | Grid API ref |
| **EntityGridTemplate** | DataGrid | Grid shell ref |
| **VariantIntegration** | DataGrid | Applied variant tracking |
| **DatasourceModeAdapter** | DataGrid | Datasource ref |
| **BarChart** | Charts | AG Charts (canvas rendering) |
| **LineChart** | Charts | AG Charts (canvas rendering) |
| **AreaChart** | Charts | AG Charts (canvas rendering) |
| **PieChart** | Charts | AG Charts (canvas rendering) |

### Client-Only: Providers

| Export | Category | Why Client-Only |
|---|---|---|
| **ThemeProvider** | Provider | `window.localStorage`, `document.documentElement` |
| **DesignSystemProvider** | Provider | Composes ThemeProvider |
| **DirectionProvider** | Provider | React context (hooks) |
| **LocaleProvider** | Provider | React context (hooks) |
| **PortalProvider** | Provider | Portal DOM management |

### Client-Only: Performance Utilities

| Export | Category | Browser APIs Used |
|---|---|---|
| **VirtualList** | Performance | Scroll position tracking, virtualization |
| **useDeferredRender** | Performance | `requestAnimationFrame` |
| **useIntersectionObserver** / **RenderWhenVisible** | Performance | `IntersectionObserver` |
| **LazyComponent** | Performance | `React.lazy` (client-only) |

### Client-Only: A11y & Lib

| Export | Category | Browser APIs Used |
|---|---|---|
| **a11y/audit** | Accessibility | `querySelectorAll`, `getComputedStyle` |
| **FocusTrap** | Accessibility | `document.activeElement`, keyboard listeners |
| **AriaLiveRegion** | Accessibility | DOM insertion |
| **grid-variants API** | Lib | `window.localStorage`, `window.location` (guarded) |

---

## Decision Tree

```
Is your component rendered on the server (RSC / no "use client")?
|
+-- YES --> Import from @mfe/design-system/server
|   |
|   +-- Need design tokens (colors, spacing, radius, etc.)?
|   |   --> import { colors, spacing } from '@mfe/design-system/server'
|   |
|   +-- Need theme constants or contract?
|   |   --> import { lightTheme, getThemeContract } from '@mfe/design-system/server'
|   |
|   +-- Need theme adapters (CSS vars, grid theme, chart colors)?
|   |   --> import { tokenSetToCss, tokenSetToGridTheme } from '@mfe/design-system/server'
|   |
|   +-- Need icons?
|   |   --> import { IconCheck, IconAlert } from '@mfe/design-system/server'
|   |
|   +-- Need cn() utility?
|   |   --> import { cn } from '@mfe/design-system/server'
|   |
|   +-- Need a UI component (Button, Input, Modal, etc.)?
|       --> You CANNOT import UI components in a server component.
|           Wrap the component usage in a "use client" file (see examples below).
|
+-- NO (client component with "use client") --> Import from @mfe/design-system
    |
    +-- All exports available (tokens, theme, icons, components, patterns, advanced)
```

---

## Usage Examples

### 1. Next.js App Router -- Server Component (RSC page)

```tsx
// app/dashboard/page.tsx  (Server Component -- no "use client")

import { colors, spacing, cn } from '@mfe/design-system/server';
import { lightTheme, getThemeContract } from '@mfe/design-system/server';
import { IconDashboard } from '@mfe/design-system/server';

export default function DashboardPage() {
  const contract = getThemeContract('light');

  return (
    <main className={cn('p-6', 'bg-white')}>
      <h1 style={{ color: colors.neutral[900] }}>
        <IconDashboard className="inline mr-2" />
        Dashboard
      </h1>
      {/* Static content rendered on the server */}
    </main>
  );
}
```

### 2. Next.js App Router -- Client Component

```tsx
// components/theme-switcher.tsx
"use client";

import { Button, Select, ThemeProvider } from '@mfe/design-system';

export function ThemeSwitcher() {
  return (
    <ThemeProvider>
      <Select
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        onChange={(value) => { /* switch theme */ }}
      />
      <Button variant="primary">Apply</Button>
    </ThemeProvider>
  );
}
```

### 3. Mixed Pattern -- Server Layout with Client Islands

```tsx
// app/layout.tsx  (Server Component)

import { cn } from '@mfe/design-system/server';
import { IconLogo } from '@mfe/design-system/server';
import { ThemeSwitcher } from '@/components/theme-switcher';  // "use client" component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={cn('min-h-screen', 'bg-gray-50')}>
        <header className="flex items-center justify-between p-4 border-b">
          <IconLogo className="h-8 w-8" />
          {/* Client island for interactive theme switching */}
          <ThemeSwitcher />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### 4. Server Component with Data Grid (Client Island)

```tsx
// app/entities/page.tsx  (Server Component)

import { cn, colors } from '@mfe/design-system/server';
import { tokenSetToGridTheme } from '@mfe/design-system/server';
import { EntityGrid } from './entity-grid'; // "use client" wrapper

// Compute grid theme on the server
const gridTheme = tokenSetToGridTheme({ appearance: 'light' });

export default async function EntitiesPage() {
  const data = await fetchEntities(); // server-side data fetching

  return (
    <div className={cn('p-6')}>
      <h1 style={{ color: colors.neutral[900] }}>Entities</h1>
      {/* Pass server-computed theme + data to client island */}
      <EntityGrid data={data} theme={gridTheme} />
    </div>
  );
}
```

```tsx
// app/entities/entity-grid.tsx
"use client";

import { GridShell } from '@mfe/design-system';

export function EntityGrid({ data, theme }: { data: any[]; theme: any }) {
  return <GridShell rowData={data} theme={theme} columnDefs={[/* ... */]} />;
}
```

---

## CI Verification

The server entry point is verified by the SSR smoke test at `src/__tests__/ssr-smoke.test.ts`:

- **Import safety:** Confirms `@mfe/design-system/server` is importable in a DOM-free Node.js environment without errors.
- **No "use client" leak:** Verifies the server entry module does not contain a `"use client"` directive, ensuring it never creates a client boundary.
- **No browser API symbols:** Checks that the resolved server module does not reference `window`, `document`, `localStorage`, `sessionStorage`, or `navigator` as top-level identifiers, preventing accidental client-only code from leaking into the server entry.

Run with:

```bash
cd packages/design-system && npm test -- --run src/__tests__/ssr-smoke.test.ts
```
