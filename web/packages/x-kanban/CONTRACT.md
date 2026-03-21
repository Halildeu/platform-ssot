# @mfe/x-kanban — API Contract v1

## Status: DRAFT | Date: 2026-03-21

## 1. Public API Surface

### Components
```tsx
KanbanBoard
  props: {
    columns: KanbanColumn[];
    cards: KanbanCard[];
    onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, index: number) => void;
    onCardClick?: (card: KanbanCard) => void;
    onColumnReorder?: (columnId: string, newIndex: number) => void;
    density?: 'compact' | 'comfortable' | 'spacious';
    editable?: boolean;
    loading?: boolean;
  }

KanbanColumn
  props: {
    column: KanbanColumnDef;
    cards: KanbanCard[];
    renderHeader?: (column: KanbanColumnDef, count: number) => ReactNode;
    collapsed?: boolean;
    onCollapse?: (columnId: string) => void;
  }

KanbanCard
  props: {
    card: KanbanCardDef;
    renderContent?: (card: KanbanCardDef) => ReactNode;
    draggable?: boolean;
    selected?: boolean;
    onClick?: (card: KanbanCardDef) => void;
  }

KanbanToolbar
  props: { search?: boolean; filter?: boolean; groupBy?: boolean; customActions?: ReactNode }

KanbanCardSlot
  props: { columnId: string; index: number; children: ReactNode }
  // Named slot for custom card placement within column
```

### Hooks
- `useKanban(config)` — returns board state, imperative methods (moveCard, addCard, removeCard)
- `useDragDrop()` — returns `DragDropEngine` abstraction + legacy handlers
  - HTML5 Drag and Drop API behind `DragDropEngine` abstraction
- `useCardDrag(cardId)` — returns drag state, handles, and preview for a single card
- `useColumnState(columnId)` — returns column metadata: card count, collapsed state, limit status

### Utilities
- `reorderCards(cards, fromIndex, toIndex)` — immutable reorder helper
- `moveCardBetweenColumns(columns, cardId, fromCol, toCol, index)` — cross-column move
- `validateWipLimit(column, limit)` — checks if column is at or over WIP limit

### Type Exports
- `KanbanBoardProps`, `KanbanColumnDef`, `KanbanCardDef`
- `KanbanCardSlotProps`, `KanbanToolbarProps`
- `KanbanApi` (imperative handle)
- `CardMoveEvent`, `ColumnReorderEvent`

### Library
- HTML5 Drag and Drop API (native browser) behind `DragDropEngine` interface

### Drag-Drop Architecture
- `DragDropEngine` interface abstracts all DnD operations (state, handlers, prop getters)
- `DragItem` / `DropTarget` — engine-agnostic drag/drop data types
- `getDragHandleProps(item)` / `getDropTargetProps(target)` — attach to DOM elements for any engine
- Legacy `DragDropHandlers` interface preserved for backward compatibility

## 2. Theme / Token Integration

### Consumed Tokens
- `--kanban-board-bg`, `--kanban-board-gap`
- `--kanban-column-bg`, `--kanban-column-border`, `--kanban-column-min-width`
- `--kanban-card-bg`, `--kanban-card-border`, `--kanban-card-shadow`, `--kanban-card-border-radius`
- `--kanban-card-drag-shadow`, `--kanban-card-drag-opacity`
- `--kanban-wip-limit-color` (column header badge when at limit)
- Typography: `--font-family-ui`, `--font-size-card-title`, `--font-size-column-header`

### Dark Mode
- Card and column backgrounds switch via `[data-theme="dark"]`
- Drag overlay shadow adjusted for dark backgrounds
- WIP limit indicator color adjusts for dark contrast

### Density Support
- `compact` — 200px column min-width, 8px card padding, smaller card font
- `comfortable` — 280px column min-width (default), 12px card padding
- `spacious` — 340px column min-width, 16px card padding, larger card content area

### Custom Theme Extension
- `themeOverrides` prop for partial token override
- Per-column `color` property for header accent
- Custom card styling via `cardClassName` callback

## 3. Access Control

### Granularity
- **Board-level**: entire board visibility and edit permissions
- **Card-level**: per-card move, edit, delete permissions
- **Column-level**: create-in-column permission (e.g., only managers can move to "Done")

### AccessControlledProps Integration
```tsx
<KanbanBoard
  accessControl={{
    resource: 'kanban.board',
    boardPermission: Permission;
    cardPermission: (card: KanbanCardDef) => {
      move: Permission; edit: Permission; delete: Permission;
    };
    columnPermission: (column: KanbanColumnDef) => {
      createIn: Permission; moveInto: Permission;
    };
  }}
/>
```

### Policy-Based Visibility States
- `full` — drag, edit, create, delete all enabled
- `readonly` — cards visible, click for details, no drag or mutation
- `disabled` — board rendered with overlay, no interaction
- `hidden` — board not rendered

## 4. SSR / Client Boundary

### Server-Renderable
- Column headers and layout grid
- Card content (static text)
- Toolbar layout
- Board skeleton with column placeholders

### Client-Only (`'use client'`)
- Drag-and-drop engine (HTML5 native)
- Card drag preview and drop animations
- Column collapse/expand interaction
- Toolbar search and filter interactions

### Hydration Strategy
- SSR renders column layout with cards as static list items
- DragDropEngine mounts on client, wraps cards with drag handles
- No layout shift: column widths fixed by density token

### Streaming SSR
- Column headers stream first
- Cards stream as data becomes available
- Empty columns render immediately with loading indicator

## 5. Data Model

### Input Data Shape
```typescript
interface KanbanColumnDef {
  id: string;
  title: string;
  limit?: number;           // WIP limit
  color?: string;            // column header accent
  metadata?: Record<string, unknown>;
}

interface KanbanCardDef {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  order: number;             // sort order within column
  assignee?: { id: string; name: string; avatar?: string };
  labels?: Array<{ text: string; color: string }>;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date | string;
  metadata?: Record<string, unknown>;
}

interface CardMoveEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  newIndex: number;
  timestamp: Date;
}
```

### Validation
- `columnId` on cards validated against provided columns array (dev mode warning)
- WIP limit violations emitted as warning events, not blocking
- `order` field used for sort; duplicates resolved by `id` tiebreaker

### State Management
- **Controlled**: `columns`, `cards` externally driven — consumer handles all mutations
- **Uncontrolled**: drag state, hover highlights, collapse state internal
- All mutations via callbacks (`onCardMove`, `onColumnReorder`) — board is a pure view by default

### Async Data Loading
- `loading` prop shows skeleton cards in each column
- Optimistic card move supported: move card in UI, revert on callback error
- Pagination per column via `onLoadMore(columnId)` callback

## 6. Accessibility

### WCAG Target
- **AA** minimum

### Keyboard Navigation
- `Tab` to focus board, then columns, then cards
- Arrow keys (left/right) to navigate between columns
- Arrow keys (up/down) to navigate between cards within a column
- `Space` to pick up a card for move, arrow keys to choose destination, `Space` to drop
- `Enter` to open card details
- `Escape` to cancel card move

### Screen Reader Announcements
- Board summary on focus: "Kanban board with 4 columns and 23 cards"
- Column context: "To Do column, 8 cards, WIP limit 10"
- Card context: "Task: Fix login bug, high priority, assigned to Jane, due March 25"
- Move announcements: "Card picked up from To Do", "Over In Progress column, position 3", "Card dropped in In Progress at position 3"
- `aria-live="assertive"` during drag operations

### Focus Management
- Focus follows card during keyboard move operation
- Focus returns to card after details popover closed
- Visible focus ring on columns, cards, and toolbar items

### ARIA Attributes
- `role="listbox"` on columns, `role="option"` on cards
- `aria-grabbed` and `aria-dropeffect` during drag
- `aria-label` on columns with count and limit
- `aria-describedby` for card metadata summary

## 7. Performance Budget

### Bundle Size
- **< 12 KB** gzipped (HTML5 DnD, no external DnD dependency)

### Render Targets
- **100 cards** across 5 columns: initial render < 100ms
- **Card drag start**: < 16ms (single frame)
- **Card drop + reorder**: < 50ms
- **Column collapse/expand**: < 50ms

### Memory Budget
- Board instance: < 2MB for 100 cards
- Drag overlay: single card clone, cleaned up on drop

### Lazy Loading
- Card detail popover loaded on first click
- Toolbar filter panel loaded on first open
- Pagination loader per column on scroll

## 8. Test & Docs Exit Criteria

### Tests
- **25 unit tests** — card reorder, cross-column move, WIP limit validation, column state
- **6 integration tests** — full board render, drag-and-drop flow, keyboard move, column collapse, search/filter
- **4 visual regression tests** — default board, dark mode, compact density, drag preview

### Contract Tests
- KanbanCardDef and KanbanColumnDef shape validation
- DragDropEngine interface contract verified

### Documentation
- API reference page with full props table
- **6 examples** — basic board, custom card render, WIP limits, column colors, theming, readonly mode
- **2 recipes** — project task board, sales pipeline workflow

---

## v2 Roadmap (Out of Scope for v1)

> v1 scope is frozen. Items below are tracked for v2 and do not affect v1 quality gates.

### @dnd-kit Migration
- Replace HTML5 Drag and Drop API with `@dnd-kit/core` engine + `@dnd-kit/sortable` for within-column reordering
- Enables keyboard-accessible drag-and-drop and touch support
- v2 bundle budget: < 25 KB gzipped (including @dnd-kit/core ~8KB + @dnd-kit/sortable ~4KB)
- @dnd-kit drag events contract tests
