# Playground Approach

## Overview

The design system uses a dual-preview architecture: **Design Lab** serves as the primary interactive playground during development, while the **docs site** embeds lightweight Sandpack playgrounds for public-facing documentation.

## Design Lab (Primary Playground)

Design Lab is the internal tool where component authors and consumers interact with components in a live environment.

### How It Works

1. Every component with a `.doc.ts` entry appears in Design Lab automatically
2. The sidebar lists all registered components, grouped by package
3. Selecting a component renders it using `previewStates` from its doc entry
4. Controls are auto-generated from `apiItem.props` and `apiItem.variantAxes`

### Preview Rendering

```
ComponentDocEntry
        |
        +-- previewStates     -> Named state tabs (default, loading, error, empty)
        +-- variantAxes       -> Axis controls (size, variant, color)
        +-- props             -> Auto-generated prop controls (knobs)
        +-- DEFAULT_PROPS     -> Initial render configuration
        |
        v
  Design Lab Canvas
  (renders component with selected state + axis values + prop overrides)
```

### Key Features

| Feature | Description |
|---------|-------------|
| State tabs | Switch between named preview states (default, loading, error, empty, etc.) |
| Variant axes | Toggle through size, color, variant combinations |
| Prop knobs | Edit any prop value via auto-generated controls |
| Responsive preview | Resize canvas to mobile / tablet / desktop breakpoints |
| Dark mode toggle | Preview component in light and dark themes |
| Accessibility panel | Live ARIA tree + contrast checker |
| Code view | See the JSX for the current configuration |
| Quality checklist | View enterprise-ready status per component |

### Relationship to .doc.ts

Design Lab reads doc entries at runtime (dev server) and at build time (static catalog). The same `ComponentDocEntry` that drives API reference generation also drives the playground UI. This ensures a single source of truth.

## Docs Site Playground (Sandpack)

The public docs site at `/components/{name}` includes an embedded playground powered by Sandpack.

### Why Sandpack

- Runs entirely in the browser (no server needed)
- Supports TypeScript out of the box
- Editable code with live preview
- Can load the design system as a dependency

### How It Works

1. `generate-api-docs.ts` produces an MDX file with a `<Playground>` component
2. The `<Playground>` component wraps Sandpack with pre-configured dependencies
3. Initial code is derived from `previewStates.default` + `DEFAULT_PROPS`
4. Users can edit the code and see changes in real time

### Sandpack Configuration

```tsx
<Playground
  template="react-ts"
  dependencies={{
    '@corp/design-system': 'latest',
    '@corp/x-data-grid': 'latest',  // if needed
  }}
  files={{
    '/App.tsx': initialCodeFromDocEntry,
  }}
  theme="auto"  // respects docs site dark mode
/>
```

## Dual-Preview Architecture

```
                    .doc.ts (single source of truth)
                         |
            +------------+------------+
            |                         |
      Design Lab                 Docs Site
   (internal, rich)         (public, lightweight)
            |                         |
   - Full prop knobs          - Sandpack editor
   - All preview states       - Default state only
   - Variant axis grid        - Key variants shown
   - Quality checklist        - Quality badge
   - A11y panel               - A11y notes (static)
   - Dev-only features        - Public-facing
```

### When to Use Which

| Scenario | Use |
|----------|-----|
| Building a new component | Design Lab |
| QA-ing variant combinations | Design Lab |
| Checking accessibility | Design Lab |
| Consumer exploring components | Docs site |
| Sharing a code example | Docs site playground |
| Reviewing enterprise readiness | Design Lab |

## Future: Connected Playground

A planned enhancement connects Design Lab previews directly into the docs site via an iframe bridge:

1. Docs site embeds Design Lab preview in a sandboxed iframe
2. Props are synchronized via `postMessage`
3. This gives docs consumers the full Design Lab experience without maintaining two rendering paths

This is planned but not yet implemented. Sandpack remains the docs-site playground for now.
