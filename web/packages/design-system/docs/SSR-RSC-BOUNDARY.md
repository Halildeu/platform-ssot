# SSR / RSC Boundary Decision

> Generated: 2026-03-20 | Based on analysis of all source files in `src/`

---

## Karar: Barrel `"use client"` directive (with future per-component migration path)

### Rationale

Based on the component audit in [CLIENT-ONLY-COMPONENTS.md](./CLIENT-ONLY-COMPONENTS.md):

- **~35+ components** use browser APIs (DOM, window, document, createPortal, observers, requestAnimationFrame) inside effects/handlers and require `"use client"`.
- **~35+ components** are technically server-safe (no browser APIs), but the majority of these still use React hooks (`useState`, `useCallback`, `useMemo`, `useId`), which also require `"use client"` in Next.js App Router.
- **Only ~15 components** are truly hook-free presentational components (Alert, Avatar, Badge, Divider, Skeleton, Spinner, Tag, Breadcrumb, EmptyState, Steps, Timeline, Descriptions, etc.) that could be genuine RSCs.
- The internal overlay engine (`MenuSurface`, `OverlaySurface`, portal hooks, focus-trap, scroll-lock, outside-click) is deeply client-only and is imported transitively by many components.
- **No files currently have `"use client"` directives.**

Given that the vast majority of exported components require client-side execution (either for browser APIs or React hooks), a **barrel-level `"use client"`** in `src/index.ts` is the pragmatic first step. The ~15 truly presentational components represent a small fraction and can be split out later if tree-shaking becomes a priority.

### "use client" Strategy

| Approach | Pros | Cons |
|---|---|---|
| **Barrel `"use client"` on `src/index.ts`** | Single change, immediately unblocks App Router adoption, no risk of missing a boundary | All components become client bundles, even purely presentational ones |
| Per-component `"use client"` | Optimal tree-shaking, server components stay server-only | High effort (~70+ files), easy to miss a file, ongoing maintenance burden |
| **Hybrid** (recommended long-term) | Best of both: barrel for now, progressively extract server-safe exports | Requires two entry points eventually |

### Recommendation

**Phase 1 (immediate):** Add `"use client"` to `src/index.ts`. This is a single-line change that makes the entire design system compatible with Next.js App Router without breaking any existing consumer.

**Phase 2 (future optimization):** Create a separate `src/server.ts` entry point that re-exports the ~15 truly presentational components without `"use client"`. Consumers in RSC contexts can import from `@design-system/server` for optimal bundle splitting.

**Phase 3 (long-term):** Migrate to per-component `"use client"` directives. Each component file that uses hooks or browser APIs gets its own directive. Remove the barrel directive. This requires careful auditing but yields the best tree-shaking.

### SSR Safety Fixes Needed

Before any strategy, these module-level issues should be addressed:

1. **`internal/OverlayPositioning.ts`** -- `resolveOverlayPosition` reads `window.innerWidth`/`innerHeight` without a guard. Add `typeof window` check or accept viewport dimensions as parameters.
2. **`internal/overlay-engine/scroll-lock.ts`** -- `lockScroll()`/`unlockScroll()` access `document.body` without guard. Add `typeof document` check.
3. **`theme/adapters/ui-adapter.ts`** -- `applyTokenSet` has `document.documentElement` as a default parameter. Change to `element?: HTMLElement` with a runtime fallback.

---

## forwardRef Applicability List

### Components that NEED ref forwarding

Interactive elements that consumers might need to imperatively focus, measure, or attach to.

| Component | Needs Ref | Has forwardRef | Gap |
|---|:-:|:-:|:-:|
| Button | yes | yes | -- |
| IconButton | yes | yes | -- |
| Input | yes | yes | -- |
| Textarea | yes | yes | -- |
| Select | yes | yes | -- |
| Checkbox | yes | yes | -- |
| Radio | yes | yes | -- |
| Switch | yes | yes | -- |
| Slider | yes | yes | -- |
| SearchInput | yes | yes | -- |
| Combobox | yes | yes | -- |
| Cascader | yes | yes | -- |
| DatePicker | yes | yes | -- |
| TimePicker | yes | yes | -- |
| ColorPicker | yes | yes | -- |
| Upload | yes | yes | -- |
| Mentions | yes | yes | -- |
| Rating | yes | yes | -- |
| LinkInline | yes | yes | -- |
| Card | yes | yes | -- |
| Popover | no (container, not focusable) | no | -- |
| Dropdown | no (uses internal ref) | no | -- |
| Tooltip | no (wraps children) | no | -- |
| Modal | no (dialog element) | no | -- |
| Dialog | no (dialog element) | no | -- |
| MenuBar | yes | yes | -- |
| NavigationRail | yes | yes | -- |
| AnchorToc | yes | yes | -- |
| Carousel | yes | yes | -- |
| FloatButton | yes | yes | -- |
| Calendar | yes | yes | -- |
| Segmented | yes | yes | -- |
| Watermark | yes | yes | -- |
| QRCode | yes | yes | -- |
| AvatarGroup | yes | yes | -- |
| Text | yes | yes | -- |
| Stack / HStack / VStack | yes | yes | -- |
| GridShell | yes | yes | -- |
| BarChart | yes | yes | -- |
| LineChart | yes | yes | -- |
| AreaChart | yes | yes | -- |
| PieChart | yes | yes | -- |

### Components that DON'T need ref (layout, container, display-only)

| Component | Why No Ref Needed |
|---|---|
| Alert | Display-only notification banner |
| Avatar | Static image/initials display |
| Badge | Static label/count display |
| Divider | Visual separator |
| Skeleton | Loading placeholder |
| Spinner | Loading indicator |
| Tag | Static label |
| Accordion | Container with internal state |
| Breadcrumb | Navigation display |
| Descriptions | Key-value display |
| EmptyState | Placeholder display |
| EmptyErrorLoading | Conditional state display |
| FormField | Label/error wrapper |
| List | Static list rendering |
| Pagination | Navigation control (uses buttons internally) |
| Steps | Progress display |
| Tabs | Container with internal state |
| TableSimple | Static table rendering |
| Timeline | Event display |
| Transfer | Dual-list with internal state |
| Tree | Hierarchical display |
| TreeTable | Hierarchical table |
| Toast | Notification (managed via context) |
| CommandPalette | Overlay (managed via keyboard shortcut) |
| ContextMenu | Overlay (managed via right-click) |
| TourCoachmarks | Overlay guide |
| JsonViewer | Data display |
| ConfidenceBadge | Display-only |
| CitationPanel | Display-only |
| RecommendationCard | Display-only |
| ApprovalCheckpoint | Display-only |
| ApprovalReview | Display-only |
| AIActionAuditTimeline | Display-only |
| DetailDrawer | Overlay pattern |
| FormDrawer | Overlay pattern |
| FilterBar | Filter container |
| MasterDetail | Layout pattern |
| PageHeader | Layout pattern |
| PageLayout | Layout pattern |
| DetailSummary | Display pattern |
| EntitySummaryBlock | Display pattern |
| SummaryStrip | Display pattern |
| ReportFilterPanel | Filter pattern |
| ThemeProvider | Context provider |
| DesignSystemProvider | Context provider |
| DirectionProvider | Context provider |
| LocaleProvider | Context provider |
| PortalProvider | Context provider |
| AriaLiveRegion | Accessibility utility (invisible) |
| FocusTrap | Accessibility utility (wraps children) |
| LazyComponent | Performance utility |
| VirtualList | Performance utility (has internal scroll ref) |
| RenderWhenVisible | Performance utility |

### forwardRef Summary

- **40 components** currently use `forwardRef` -- all interactive elements that need it already have it.
- **0 gaps** identified: every component that semantically needs ref forwarding already implements it.
- All `forwardRef` components have proper `displayName` set (verified via existing visual-quality tests).
