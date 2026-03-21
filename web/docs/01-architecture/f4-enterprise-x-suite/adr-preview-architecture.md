# ADR: Design Lab Preview Architecture

## Status

**Accepted** — 2025-03-21

## Decision

Port 3000 runtime-preview route is the canonical preview mechanism.
Port 3099 separate preview instance is deprecated.

## Context

X Suite packages (`@mfe/x-data-grid`, `@mfe/x-charts`, `@mfe/x-kanban`, etc.) cannot be imported into mfe-shell's webpack bundle due to Module Federation + AG Charts dependency conflicts. AG Charts registers global singletons that collide when loaded through multiple webpack containers.

Earlier attempts to run a standalone preview app on port 3099 created maintenance burden (separate webpack config, duplicate theme setup, divergent dependency versions) without solving the core conflict.

## Solution

### Local Preview (Design Lab inline stubs)

- 31 inline React stubs live inside the Design Lab `PlaygroundPreview` component
- Each stub renders a self-contained example with mock data
- Stubs import nothing from X Suite packages — they are pure JSX demonstrations
- Used during development for fast iteration on layout and props API

### Runtime Preview (iframe isolation)

- Route: `/admin/design-lab/runtime-preview?component=XDataGrid`
- Loaded via `<iframe>` inside the Design Lab preview panel
- The runtime-preview route bootstraps a minimal React root that dynamically imports the requested component
- Full AG Grid / AG Charts dependencies load only inside the iframe, avoiding Module Federation conflicts

### Shared Metadata

- Both preview modes share the same doc metadata (props table, description, tags)
- Quality tab and API tab are driven by the same JSON schema definitions
- Switching between local and runtime preview preserves all tab state

## Consequences

- **Positive**: Single source of truth for component documentation; no port 3099 to maintain
- **Positive**: AG Charts global singleton conflict is fully isolated inside iframe boundary
- **Positive**: Runtime preview tests the real component under real dependency versions
- **Negative**: Iframe introduces a small latency (~200ms) on first load vs inline stubs
- **Negative**: Cross-frame communication requires `postMessage` for theme sync

## Alternatives Considered

1. **Module Federation shared scope** — Attempted; AG Charts global registration makes this unreliable
2. **Standalone Storybook** — Adds a third tool; team prefers Design Lab as single environment
3. **Web Components wrapper** — Too much overhead for internal tooling use case
