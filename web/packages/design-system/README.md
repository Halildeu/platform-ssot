# @mfe/design-system

Enterprise-grade React component library with built-in access control, theming, and AG Grid integration.

## Features

- 90+ components — Primitives, composed components, patterns, and AG Grid wrappers
- Access control — Four-level access system (full/readonly/disabled/hidden) with ARIA semantics
- Token-based theming — CSS variable tokens with dark mode, density, and runtime switching
- Accessible — axe-core tested, keyboard navigable, WCAG compliant
- Tree-shakeable — ESM + CJS dual output, optimized bundle
- RSC-ready — `"use client"` barrel directive, SSR-safe imports

## Installation

```bash
npm install @mfe/design-system
```

### Peer Dependencies

```bash
npm install react react-dom
```

Optional peer dependencies (used by async data components if present):

```bash
npm install @mfe/shared-http @mfe/shared-types
```

## Quick Start

```tsx
import { Button, Input, Select } from '@mfe/design-system';

function App() {
  return (
    <div>
      <Input label="Name" placeholder="Enter your name" />
      <Select label="Role" options={[{ value: 'admin', label: 'Admin' }]} />
      <Button variant="primary" onClick={handleSubmit}>Save</Button>
    </div>
  );
}
```

## Provider Setup

```tsx
import { DesignSystemProvider } from '@mfe/design-system';

function App({ children }) {
  return (
    <DesignSystemProvider>
      {children}
    </DesignSystemProvider>
  );
}
```

The `DesignSystemProvider` composes `ThemeProvider`, `LocaleProvider`, and `DirectionProvider` into a single wrapper.

## Components

### Primitives

Core building blocks with zero internal cross-dependencies.

**Layout:** Stack, HStack, VStack, Card, CardHeader, CardBody, CardFooter, Divider
**Typography:** Text
**Buttons:** Button, IconButton
**Form Controls:** Input, Textarea, Select, Switch, Checkbox, Radio, RadioGroup
**Links:** LinkInline
**Data Display:** Badge, Tag, Avatar
**Feedback:** Spinner, Skeleton, Alert
**Overlays:** Dialog, Modal, Tooltip, Popover, Dropdown

### Composed Components

Multi-primitive compositions, still domain-agnostic.

**Navigation:** Tabs, Breadcrumb, Pagination, Steps, Timeline, MenuBar, NavigationRail, AnchorToc
**Disclosure:** Accordion
**Form:** FormField, SearchInput, Combobox, Cascader, DatePicker, TimePicker, ColorPicker, Slider, Rating, Upload, Mentions
**Feedback:** ToastProvider/useToast, EmptyState, EmptyErrorLoading
**Selection:** Segmented
**Menus:** ContextMenu, CommandPalette
**Data Display:** Descriptions, TableSimple, List, Transfer, Tree, TreeTable, JsonViewer
**Charts:** BarChart, LineChart, PieChart, AreaChart
**Misc:** Calendar, Carousel, FloatButton, AvatarGroup, Watermark, QRCode, NotificationDrawer, TourCoachmarks, SearchFilterListing, DetailSectionTabs
**AI / Domain:** ConfidenceBadge, PromptComposer, RecommendationCard, ApprovalCheckpoint, ApprovalReview, AIGuidedAuthoring, CitationPanel, AIActionAuditTimeline, AILayoutBuilder, AdaptiveForm, SmartDashboard

### Patterns

Page-region components for common layout structures.

PageHeader, FormDrawer, DetailDrawer, FilterBar, MasterDetail, PageLayout, SummaryStrip, EntitySummaryBlock, DetailSummary, ReportFilterPanel

### Advanced (AG Grid)

Enterprise data grid components built on AG Grid v34.3.1.

EntityGridTemplate, GridShell, GridToolbar, AgGridServer, VariantIntegration, TablePagination

```tsx
// AG Grid setup runs automatically on first import
import { EntityGridTemplate } from '@mfe/design-system';

// Or use the deep import for explicit setup control
import '@mfe/design-system/advanced/data-grid/setup';
```

## Access Control

Every component supports the `access` and `accessReason` props:

```tsx
<Button access="full">Save</Button>
<Input access="readonly" accessReason="No edit permission" />
<Select access="disabled" accessReason="Complete step 1 first" />
<Button access="hidden">Admin Only</Button>
```

Access levels: `full` | `readonly` | `disabled` | `hidden`

## Theming

```tsx
import { ThemeProvider } from '@mfe/design-system';

<ThemeProvider appearance="dark" density="compact">
  {children}
</ThemeProvider>
```

All surfaces use CSS variable tokens. No hardcoded colors in any component.

## Tree-Shaking

The package declares `sideEffects: false` for all modules except `advanced/data-grid/setup`. Import only what you use:

```ts
// Barrel import — tree-shaking strips unused components
import { Input, Button } from '@mfe/design-system';

// Deep imports also work
import { Input } from '@mfe/design-system/primitives/input';
import { FormField } from '@mfe/design-system/components/form-field';
```

## TypeScript

Built with TypeScript 5.4+. All components export their prop types:

```ts
import type { InputProps, ButtonProps, SelectProps } from '@mfe/design-system';
```

## Framework Support

| Framework | Version | Status |
|-----------|---------|--------|
| React | >=18.0 | Supported |
| Next.js (App Router) | 13+ | Supported |
| Next.js (Pages Router) | 12+ | Supported |
| Vite | 4+ | Supported |
| Webpack | 5+ | Supported |
| Create React App | 5+ | Supported |

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

## Documentation

- [Compatibility Matrix](./docs/COMPATIBILITY.md)
- [Do/Don't Guidelines](./docs/DO-DONT-GUIDELINES.md)
- [Accessibility Notes](./docs/ACCESSIBILITY-NOTES.md)
- [Migration Guide](./docs/MIGRATION-NOTES.md)
- [API Stability Tiers](./docs/API-STABILITY-TIERS.md)
- [Usage Recipes](./docs/USAGE-RECIPES.md)
- [Contributing](./CONTRIBUTING.md)

## License

MIT
