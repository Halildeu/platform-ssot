# Client-Only Components

Components that require `"use client"` directive for Next.js App Router compatibility.

> Generated: 2026-03-20 | Scope: `src/primitives/`, `src/components/`, `src/advanced/`, `src/internal/`, `src/patterns/`, `src/providers/`, `src/performance/`, `src/lib/`, `src/theme/`, `src/a11y/`

---

## Module-Level Browser API (SSR-Unsafe)

These access browser APIs at **module evaluation time** -- importing the module in an SSR context would crash or produce incorrect behavior.

| Component / Module | File | API | Risk |
|---|---|---|---|
| `resolveOverlayPosition` | `internal/OverlayPositioning.ts` | `window.innerWidth`, `window.innerHeight` | Called as a plain function (not in a hook/effect). Any module that imports and calls this at top-level will crash in SSR. Currently only called from within useEffect/useLayoutEffect in consuming components, but the function body itself has no guard. |
| `lockScroll` / `unlockScroll` | `internal/overlay-engine/scroll-lock.ts` | `document.body`, `window.innerWidth`, `document.documentElement` | Exported functions with no `typeof document` guard. Direct calls outside useEffect would crash in SSR. |
| `applyTokenSet` (default param) | `theme/adapters/ui-adapter.ts` | `document.documentElement` as default parameter value | Default parameter `element: HTMLElement = document.documentElement` evaluates `document` at call time. Safe if never called on server, but the default triggers if called without args in SSR. |
| `prefersReducedMotion` | `internal/overlay-engine/reduced-motion.ts` | `window.matchMedia` | Has `typeof window` guard -- SSR-safe. Returns `false` on server. Not a crash risk. |
| `FETCH_BASE_URL` (module const) | `lib/grid-variants/variants.api.ts` | `window.location.origin` | Module-level const with `typeof window` guard -- SSR-safe (falls back to `'http://localhost'`). |
| `getRoot` helper | `theme/core/theme-controller.ts` | `document.documentElement` | Has `typeof document` guard -- SSR-safe. |
| `loadStoredAxes` | `theme/core/theme-controller.ts` | `window.localStorage` | Has `typeof window` guard -- SSR-safe. |
| `a11y audit rules` | `a11y/audit.ts` | `querySelectorAll`, `window.getComputedStyle` | All usage is inside functions that receive a DOM `root` parameter. SSR-safe as long as not called on server. |

**Truly unsafe (no guard):** `OverlayPositioning.ts`, `scroll-lock.ts` (`lockScroll`/`unlockScroll`), `ui-adapter.ts` (`applyTokenSet` default param).

---

## Effect/Handler Browser API (Needs "use client")

These components use browser APIs inside `useEffect`, `useLayoutEffect`, event handlers, or callbacks. They are SSR-safe at evaluation time but require `"use client"` for React Server Components.

### Primitives

| Component | File | API | Why Client-Only |
|---|---|---|---|
| Popover | `primitives/popover/Popover.tsx` | `createPortal`, `window.addEventListener` (resize/scroll), `window.requestAnimationFrame`, `window.setTimeout`, `useLayoutEffect` | Positioning logic, event listeners, rAF in useLayoutEffect |
| Modal | `primitives/modal/Modal.tsx` | `ReactDOM.createPortal`, `document.body`, `useScrollLock` (imports scroll-lock) | Portal rendering, scroll lock |
| Dialog | `primitives/dialog/Dialog.tsx` | `useRef` with `.showModal()` / `.close()` DOM methods | Native dialog element imperative API in useEffect |
| Dropdown | `primitives/dropdown/Dropdown.tsx` | `document.addEventListener` (mousedown) | Outside-click detection in useEffect |
| Tooltip | `primitives/tooltip/Tooltip.tsx` | `useRef` with timers, DOM focus management | Timer-based show/hide, focus tracking |
| Input | `primitives/input/Input.tsx` | `useRef` with DOM `.focus()` | Imperative focus in useEffect |
| Textarea | `primitives/input/Textarea.tsx` | `useRef` with DOM `.focus()` | Imperative focus in useEffect |

### Components

| Component | File | API | Why Client-Only |
|---|---|---|---|
| MenuBar | `components/menu-bar/MenuBar.tsx` | `window.addEventListener` (resize), `window.requestAnimationFrame`, `window.matchMedia`, `ResizeObserver`, `useLayoutEffect` | Responsive layout measurement, media query listener |
| Combobox | `components/combobox/Combobox.tsx` | `createPortal`, `window.addEventListener` (resize/scroll), `window.innerHeight/innerWidth`, `requestAnimationFrame`, `useLayoutEffect` | Portal, positioning, scroll/resize listeners |
| CommandPalette | `components/command-palette/CommandPalette.tsx` | `window.addEventListener` (keydown) | Global keyboard shortcut listener |
| ContextMenu | `components/context-menu/ContextMenu.tsx` | `document.addEventListener` (mousedown, keydown), `window.innerWidth/innerHeight` | Outside-click, viewport measurement |
| AnchorToc | `components/anchor-toc/AnchorToc.tsx` | `window.location.hash`, `window.addEventListener` (hashchange), `window.history.replaceState` | URL hash reading/writing, hash change events |
| Cascader | `components/cascader/Cascader.tsx` | `document.addEventListener` (mousedown) | Outside-click detection |
| Carousel | `components/carousel/Carousel.tsx` | `setInterval` / `clearInterval` via refs | Auto-play timer |
| FloatButton | `components/float-button/FloatButton.tsx` | `document.addEventListener` (keydown) | Escape key listener |
| Mentions | `components/mentions/Mentions.tsx` | `requestAnimationFrame`, `useRef` with DOM manipulation | Caret position, DOM measurement |
| Watermark | `components/watermark/Watermark.tsx` | `MutationObserver`, canvas API | Anti-tamper observer, canvas watermark generation |
| TourCoachmarks | `components/tour-coachmarks/TourCoachmarks.tsx` | `window.addEventListener` (keydown) | Escape key listener |
| Toast | `components/toast/Toast.tsx` | `setTimeout` / `clearTimeout` via refs | Auto-dismiss timer |
| Calendar | `components/calendar/Calendar.tsx` | `useRef` with DOM focus management | Keyboard navigation, focus control |
| ColorPicker | `components/color-picker/ColorPicker.tsx` | `useRef` with DOM | Interactive color selection |
| Segmented | `components/segmented/Segmented.tsx` | `useRef` with DOM measurement | Indicator position measurement |
| Slider | `components/slider/Slider.tsx` | `useRef` with DOM | Slider track interaction |
| DatePicker | `components/date-picker/DatePicker.tsx` | `useRef` with DOM | Calendar popup, focus management |
| TimePicker | `components/time-picker/TimePicker.tsx` | `useRef` with DOM | Time input interaction |
| NavigationRail | `components/navigation-rail/NavigationRail.tsx` | `useRef` with DOM | Focus management |
| Rating | `components/rating/Rating.tsx` | `useRef` with DOM | Star interaction |
| Upload | `components/upload/Upload.tsx` | `useRef` with file input DOM | File input click trigger |
| AdaptiveForm | `components/adaptive-form/AdaptiveForm.tsx` | `useRef` with form DOM | Form submission, validation |
| AILayoutBuilder | `components/ai-layout-builder/AILayoutBuilder.tsx` | `useRef` with drag tracking | Drag-and-drop state |

### Patterns

| Component | File | API | Why Client-Only |
|---|---|---|---|
| DetailDrawer | `patterns/detail-drawer/DetailDrawer.tsx` | `document.addEventListener` (keydown), `useRef` | Escape key listener, panel ref |
| FormDrawer | `patterns/form-drawer/FormDrawer.tsx` | `document.addEventListener` (keydown), `useRef` | Escape key listener, panel ref |

### Advanced

| Component | File | API | Why Client-Only |
|---|---|---|---|
| GridShell | `advanced/data-grid/GridShell.tsx` | `useRef`, `useImperativeHandle` | AG Grid API ref management |
| TablePagination | `advanced/data-grid/TablePagination.tsx` | `useRef` | Grid API ref |
| EntityGridTemplate | `advanced/data-grid/EntityGridTemplate.tsx` | `useRef` | Grid shell ref |
| VariantIntegration | `advanced/data-grid/VariantIntegration.tsx` | `useRef` | Applied variant tracking |
| DatasourceModeAdapter | `advanced/data-grid/DatasourceModeAdapter.ts` | `useRef` | Datasource ref |

### Providers

| Component | File | API | Why Client-Only |
|---|---|---|---|
| ThemeProvider | `providers/ThemeProvider.tsx` | `window.localStorage`, `document.documentElement` | Theme persistence and DOM attribute application (guarded with `typeof window/document`) |

### Performance Utilities

| Component | File | API | Why Client-Only |
|---|---|---|---|
| VirtualList | `performance/VirtualList.tsx` | `useRef` with scroll container DOM | Scroll position tracking, virtualization |
| useDeferredRender | `performance/useDeferredRender.ts` | `requestAnimationFrame` | Defers render past first paint |
| useIntersectionObserver / RenderWhenVisible | `performance/useIntersectionObserver.ts` | `IntersectionObserver` | Lazy rendering based on visibility |

---

## Server-Safe Components

Components with **zero browser API usage** that could theoretically render on the server as RSCs (no hooks, no refs, no DOM access).

| Component | Notes |
|---|---|
| Alert | `primitives/alert/Alert.tsx` -- Pure presentational |
| Avatar | `primitives/avatar/Avatar.tsx` -- Pure presentational |
| Badge | `primitives/badge/Badge.tsx` -- Pure presentational |
| Button | `primitives/button/Button.tsx` -- Uses forwardRef but no browser APIs |
| Card | `primitives/card/Card.tsx` -- Uses forwardRef but no browser APIs |
| Checkbox | `primitives/checkbox/Checkbox.tsx` -- Uses forwardRef + useId (React, not browser) |
| Divider | `primitives/divider/Divider.tsx` -- Pure presentational |
| IconButton | `primitives/icon-button/IconButton.tsx` -- Uses forwardRef but no browser APIs |
| LinkInline | `primitives/link-inline/LinkInline.tsx` -- Uses forwardRef but no browser APIs |
| Radio | `primitives/radio/Radio.tsx` -- Uses forwardRef + useId |
| Select | `primitives/select/Select.tsx` -- Uses forwardRef but no browser APIs |
| Skeleton | `primitives/skeleton/Skeleton.tsx` -- Pure presentational |
| Spinner | `primitives/spinner/Spinner.tsx` -- Pure presentational |
| Stack / HStack / VStack | `primitives/stack/Stack.tsx` -- Uses forwardRef, layout only |
| Switch | `primitives/switch/Switch.tsx` -- Uses forwardRef + useId |
| Tag | `primitives/tag/Tag.tsx` -- Pure presentational |
| Text | `primitives/text/Text.tsx` -- Uses forwardRef, text rendering only |
| Accordion | `components/accordion/Accordion.tsx` -- State via useState only |
| Breadcrumb | `components/breadcrumb/Breadcrumb.tsx` -- Pure presentational |
| Descriptions | `components/descriptions/Descriptions.tsx` -- Pure presentational |
| EmptyState | `components/empty-state/EmptyState.tsx` -- Pure presentational |
| EmptyErrorLoading | `components/empty-error-loading/EmptyErrorLoading.tsx` -- Conditional rendering |
| FormField | `components/form-field/FormField.tsx` -- Label/error wrapper |
| List | `components/list/List.tsx` -- Pure presentational |
| Pagination | `components/pagination/Pagination.tsx` -- State via useState only |
| Steps | `components/steps/Steps.tsx` -- Pure presentational |
| Tabs | `components/tabs/Tabs.tsx` -- State via useState only |
| TableSimple | `components/table-simple/TableSimple.tsx` -- Pure presentational |
| Timeline | `components/timeline/Timeline.tsx` -- Pure presentational |
| Transfer | `components/transfer/Transfer.tsx` -- State via useState only |
| Tree | `components/tree/Tree.tsx` -- State via useState only |
| TreeTable | `components/tree-table/TreeTable.tsx` -- State via useState only |
| JsonViewer | `components/json-viewer/JsonViewer.tsx` -- State via useState only |
| QRCode | `components/qr-code/QRCode.tsx` -- Canvas generation but uses forwardRef; note: canvas API is browser-only but used in useEffect |
| ConfidenceBadge | `components/confidence-badge/ConfidenceBadge.tsx` -- Pure presentational |
| CitationPanel | `components/citation-panel/CitationPanel.tsx` -- Pure presentational |
| RecommendationCard | `components/recommendation-card/RecommendationCard.tsx` -- Pure presentational |
| ApprovalCheckpoint | `components/approval-checkpoint/ApprovalCheckpoint.tsx` -- Pure presentational |
| ApprovalReview | `components/approval-review/ApprovalReview.tsx` -- Pure presentational |
| AIActionAuditTimeline | `components/ai-action-audit-timeline/AIActionAuditTimeline.tsx` -- Pure presentational |
| AIGuidedAuthoring | `components/ai-guided-authoring/AIGuidedAuthoring.tsx` -- State via useState only |
| SearchFilterListing | `components/search-filter-listing/SearchFilterListing.tsx` -- State via useState only |
| SmartDashboard | `components/smart-dashboard/SmartDashboard.tsx` -- State via useState only |
| PromptComposer | `components/prompt-composer/PromptComposer.tsx` -- State via useState only |
| AvatarGroup | `components/avatar-group/AvatarGroup.tsx` -- Uses forwardRef, layout only |
| ThemePresetGallery | `components/theme-preset/ThemePresetGallery.tsx` -- Pure presentational |
| ThemePresetCompare | `components/theme-preset/ThemePresetCompare.tsx` -- Pure presentational |
| ThemePreviewCard | `components/theme-preview-card/ThemePreviewCard.tsx` -- Pure presentational |
| DetailSectionTabs | `components/detail-section-tabs/DetailSectionTabs.tsx` -- Composition wrapper |
| SearchInput | `components/search-input/SearchInput.tsx` -- Uses forwardRef, no browser API |
| PageHeader | `patterns/page-header/PageHeader.tsx` -- Pure presentational |
| PageLayout | `patterns/page-layout/PageLayout.tsx` -- Pure presentational |
| DetailSummary | `patterns/detail-summary/DetailSummary.tsx` -- Pure presentational |
| EntitySummaryBlock | `patterns/entity-summary-block/EntitySummaryBlock.tsx` -- Pure presentational |
| SummaryStrip | `patterns/summary-strip/SummaryStrip.tsx` -- Pure presentational |
| FilterBar | `patterns/filter-bar/FilterBar.tsx` -- State via useState only |
| MasterDetail | `patterns/master-detail/MasterDetail.tsx` -- Layout composition |
| ReportFilterPanel | `patterns/report-filter-panel/ReportFilterPanel.tsx` -- State via useState only |
| DesignSystemProvider | `providers/DesignSystemProvider.tsx` -- Context provider composition |
| DirectionProvider | `providers/DirectionProvider.tsx` -- Context provider |
| LocaleProvider | `providers/LocaleProvider.tsx` -- Context provider |
| LazyComponent | `performance/LazyComponent.tsx` -- React.lazy wrapper |
| BundleAnalyzer | `performance/BundleAnalyzer.ts` -- Static analysis utility |

**Note:** Components using `useState`, `useCallback`, `useMemo`, or `useId` still need `"use client"` in RSC context because they use React hooks. The "server-safe" designation means they have no _browser_ API dependency. In practice, for Next.js App Router, any component using React hooks must be marked as a client component. Truly server-renderable components are those that are purely presentational (no hooks at all): Alert, Avatar, Badge, Divider, Skeleton, Spinner, Tag, Breadcrumb, EmptyState, Steps, Timeline, etc.

---

## Internal Hooks (Browser API Usage)

| Hook | File | API |
|---|---|---|
| `useFocusTrap` | `internal/overlay-engine/focus-trap.tsx` | `document.activeElement`, `document.addEventListener` (keydown), `querySelectorAll` |
| `useOutsideClick` | `internal/overlay-engine/outside-click.ts` | `document.addEventListener` (mousedown, touchstart) |
| `useEscapeKey` | `internal/overlay-engine/outside-click.ts` | `document.addEventListener` (keydown) |
| `useScrollLock` | `internal/overlay-engine/scroll-lock.ts` | `document.body`, `window.innerWidth` (via `lockScroll`/`unlockScroll`) |
| `usePortal` (overlay-engine) | `internal/overlay-engine/usePortal.tsx` | `document.body`, `document.createElement`, `createPortal` |
| `usePortal` (portal.tsx) | `internal/overlay-engine/portal.tsx` | `document.body`, `document.createElement`, `ReactDOM.createPortal` |
| `useReducedMotion` | `internal/overlay-engine/reduced-motion.ts` | `window.matchMedia` |
| `useRovingTabindex` | `internal/overlay-engine/roving-tabindex.tsx` | None (pure React state) -- Server-safe |
| `useAnnounce` | `internal/overlay-engine/aria-live.tsx` | None (pure callback) -- Server-safe |
| `useDeferredRender` | `performance/useDeferredRender.ts` | `requestAnimationFrame` |
| `useIntersectionObserver` | `performance/useIntersectionObserver.ts` | `IntersectionObserver` |
| `usePaginationState` | `advanced/data-grid/usePaginationState.ts` | None -- Server-safe |
| `SectionTabs` (internal) | `internal/SectionTabs.tsx` | `window.innerWidth`, `window.addEventListener` (resize) |
| `MenuSurface` (internal) | `internal/MenuSurface.tsx` | `createPortal`, `document.body`, `window.addEventListener` (resize, scroll, mousedown, keydown), `window.requestAnimationFrame`, `useLayoutEffect` |
| `OverlaySurface` (internal) | `internal/OverlaySurface.tsx` | `createPortal`, `document.body`, `window.addEventListener` (keydown) |

---

## Library / Theme Modules (Browser API Usage)

| Module | File | API | Context |
|---|---|---|---|
| `variants.api` | `lib/grid-variants/variants.api.ts` | `window.localStorage`, `window.location.origin` | Grid variant persistence. Has `typeof window` guards. |
| `theme-controller` | `theme/core/theme-controller.ts` | `window.localStorage`, `document.documentElement` | Theme axis persistence + DOM application. Has `typeof` guards. |
| `ui-adapter` | `theme/adapters/ui-adapter.ts` | `document.documentElement` (as default param) | Token-to-CSS-var application. Default param is unguarded. |
| `a11y/audit` | `a11y/audit.ts` | `querySelectorAll`, `window.getComputedStyle` | DOM audit functions. Only callable with DOM elements. |
