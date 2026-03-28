# API Reference Automation

## Overview

API reference pages are auto-generated from `.doc.ts` entries so that documentation stays in sync with source code. There is no manual authoring of props tables or type signatures.

## Data Flow

```
.doc.ts file (per component)
        |
        v
designLabComponentDocEntries[]   <-- collected at build time
        |
        v
scripts/generate-api-docs.ts     <-- build script
        |
        v
docs/content/api/{package}/{component}.mdx   <-- generated MDX
        |
        v
Nextra renders as /api/{package}/{component}
```

## Source: .doc.ts Entry Shape

Each component declares a `.doc.ts` file co-located with its source. The file exports a `ComponentDocEntry` object:

```ts
// Button.doc.ts
import type { ComponentDocEntry } from '@corp/design-system/doc-types';

export const doc: ComponentDocEntry = {
  indexItem: {
    displayName: 'Button',
    packageName: '@corp/design-system',
    importStatement: "import { Button } from '@corp/design-system';",
    category: 'inputs',
    tags: ['action', 'submit', 'click'],
  },
  apiItem: {
    props: { /* typed prop definitions */ },
    variantAxes: { size: ['sm', 'md', 'lg'], variant: ['solid', 'outline', 'ghost'] },
    stateModel: { /* optional finite state machine */ },
    previewStates: { /* named preview configurations */ },
  },
  qualityChecklist: {
    hasTests: true,
    hasStorybook: true,
    hasA11yAudit: true,
    hasDocEntry: true,
    hasTypeExports: true,
  },
};
```

## Per-Component API Page (Generated)

Each generated MDX page contains the following sections, all derived from the doc entry:

### 1. Header

- Component name (`indexItem.displayName`)
- Package badge (`indexItem.packageName`)
- Quality score badge (computed from `qualityChecklist`)

### 2. Import Statement

```mdx
<ImportBlock statement={doc.indexItem.importStatement} />
```

### 3. Props Table

Auto-generated from `apiItem.props`. Each row shows:

| Column | Source |
|--------|--------|
| Prop name | key of `props` object |
| Type | `props[key].type` (rendered as TS type) |
| Default | `props[key].defaultValue` |
| Required | `props[key].required` |
| Description | `props[key].description` |

### 4. Variant Axes

Grid of visual previews for each axis in `apiItem.variantAxes`. For `size: ['sm', 'md', 'lg']`, renders the component at each size side by side.

### 5. State Model

If `apiItem.stateModel` is defined, renders a state diagram (Mermaid) showing states and transitions.

### 6. Preview States

Code examples derived from `apiItem.previewStates`. Each named state becomes a tabbed example:

```mdx
<PreviewTabs states={doc.apiItem.previewStates} defaultProps={DEFAULT_PROPS} />
```

### 7. Quality Score

Computed from `qualityChecklist`:

| Badge | Criteria |
|-------|----------|
| tests | `hasTests === true` |
| storybook | `hasStorybook === true` |
| a11y | `hasA11yAudit === true` |
| docs | `hasDocEntry === true` |
| types | `hasTypeExports === true` |

Score = count of true / total checks, displayed as percentage and color badge.

## Build Script: `generate-api-docs.ts`

```
Usage: tsx scripts/generate-api-docs.ts [--watch] [--package <name>]

Flags:
  --watch       Re-generate on .doc.ts file changes
  --package     Generate only for a specific package (e.g., x-data-grid)
```

### Algorithm

1. Glob all `**/*.doc.ts` files across packages
2. Import each and validate against `ComponentDocEntry` schema
3. Group by package name
4. For each component, render MDX template with interpolated data
5. Write to `docs/content/api/{package}/{component}.mdx`
6. Generate `docs/content/api/_meta.json` for Nextra sidebar ordering

### Incremental Builds

- File hash comparison skips unchanged components
- `--watch` mode uses chokidar to re-generate only modified entries
- CI runs full generation; local dev uses watch mode

## Custom MDX Components

The generated MDX relies on these custom components (defined in `docs/components/`):

| Component | Purpose |
|-----------|---------|
| `<ImportBlock>` | Copyable import statement |
| `<PropsTable>` | Sortable, filterable props table |
| `<VariantGrid>` | Visual grid of variant combinations |
| `<StateDiagram>` | Mermaid-rendered state machine |
| `<PreviewTabs>` | Tabbed live code examples |
| `<QualityBadge>` | Color-coded quality score |

## CI Integration

The `docs:generate` step runs in CI before the Nextra build:

```yaml
- name: Generate API docs
  run: pnpm tsx scripts/generate-api-docs.ts

- name: Build docs site
  run: pnpm --filter docs build
```

If any `.doc.ts` entry fails validation, the build fails with a clear error message pointing to the invalid entry.
