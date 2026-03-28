# @mfe/x-scheduler — API Contract v1

## Status: DRAFT | Date: 2026-03-21

## 1. Public API Surface

### Components
```tsx
Scheduler
  props: {
    events: SchedulerEvent[];
    resources?: SchedulerResource[];
    view?: 'day' | 'week' | 'month';
    date?: Date;
    editable?: boolean;
    selectable?: boolean;
    density?: 'compact' | 'comfortable' | 'spacious';
    onEventClick?: (event: SchedulerEvent) => void;
    onEventDrop?: (event: SchedulerEvent, newStart: Date, newEnd: Date, newResourceId?: string) => void;
    onSlotSelect?: (start: Date, end: Date, resourceId?: string) => void;
    onViewChange?: (view: string) => void;
    onDateChange?: (date: Date) => void;
  }

SchedulerEvent
  props: { event: SchedulerEvent; renderContent?: (event: SchedulerEvent) => ReactNode }

SchedulerResource
  props: { resource: ResourceDef; renderHeader?: (resource: ResourceDef) => ReactNode }

SchedulerToolbar
  props: { showViewToggle?: boolean; showNavigation?: boolean; showToday?: boolean; customActions?: ReactNode }

DayView
  props: { date: Date; startHour?: number; endHour?: number; slotDuration?: number }

WeekView
  props: { date: Date; startHour?: number; endHour?: number; weekStartsOn?: 0 | 1 }

MonthView
  props: { date: Date; showMoreLimit?: number; weekStartsOn?: 0 | 1 }
```

### Hooks
- `useScheduler(config)` — returns scheduler API ref, current view state, navigation methods
- `useEventDrag(event)` — manages drag state, snap-to-grid, and drop validation
- `useTimeSlots(config)` — generates time slot grid for custom view rendering

### Utilities
- `createRecurrence(rule)` — expands RRULE-like pattern into event instances
- `detectConflicts(events)` — returns overlapping event pairs
- `snapToSlot(date, slotDuration)` — rounds date to nearest slot boundary

### Type Exports
- `SchedulerProps`, `SchedulerEvent`, `ResourceDef`
- `SchedulerView`, `SlotConfig`, `RecurrenceRule`
- `SchedulerApi` (imperative handle)
- `EventDragState`, `ConflictResult`

## 2. Theme / Token Integration

### Consumed Tokens
- `--scheduler-bg`, `--scheduler-slot-border`, `--scheduler-current-time-color`
- `--scheduler-event-bg`, `--scheduler-event-fg`, `--scheduler-event-border-radius`
- `--scheduler-header-bg`, `--scheduler-header-fg`
- `--scheduler-today-bg`, `--scheduler-weekend-bg`
- Typography: `--font-family-ui`, `--font-size-event`, `--font-size-time-label`
- Spacing: `--scheduler-slot-height-compact`, `--scheduler-slot-height-comfortable`, `--scheduler-slot-height-spacious`

### Dark Mode
- All slot backgrounds, event colors, and borders adapt via `[data-theme="dark"]`
- Current-time indicator color adjusts for dark contrast
- Event color palette uses dark-mode-optimized variants

### Density Support
- `compact` — 24px slot height, smaller event text, tighter padding
- `comfortable` — 40px slot height (default)
- `spacious` — 56px slot height, larger event cards, more whitespace

### Custom Theme Extension
- `themeOverrides` prop for partial token override
- Per-event color via `event.color` property
- Custom CSS classes via `eventClassName` callback

## 3. Access Control

### Granularity
- **Event-level CRUD permissions**: create, read, update, delete per event or event category
- **Resource-level**: visibility of resource lanes gated by permission
- **View-level**: restrict which views (day/week/month) are available

### AccessControlledProps Integration
```tsx
<Scheduler
  accessControl={{
    resource: 'scheduler.events',
    eventPermission: (event: SchedulerEvent) => {
      create: Permission; read: Permission; update: Permission; delete: Permission;
    };
    resourcePermission: (resource: ResourceDef) => Permission;
  }}
/>
```

### Policy-Based Visibility States
- `full` — drag, resize, create, delete all enabled
- `readonly` — events visible, tooltips active, no mutation
- `disabled` — events greyed out, no interaction
- `hidden` — event or resource lane removed from view

## 4. SSR / Client Boundary

### Server-Renderable
- Toolbar (date navigation, view toggle)
- Time slot grid skeleton with correct dimensions
- Month view static cell layout

### Client-Only (`'use client'`)
- Event positioning and overlap calculation
- Drag-and-drop interactions
- Current-time indicator (live updating)
- Resize handles
- Tooltip and popover interactions

### Hydration Strategy
- SSR renders the time grid shell with correct slot count and dimensions
- Events positioned on client hydration via absolute positioning calculation
- No layout shift: slot heights fixed by density token

### Streaming SSR
- Toolbar and grid skeleton stream first
- Events render on client after data is available

## 5. Data Model

### Input Data Shape
```typescript
interface SchedulerEvent {
  id: string;
  title: string;
  start: Date | string;    // ISO 8601 string auto-parsed
  end: Date | string;
  resourceId?: string;
  color?: string;
  allDay?: boolean;
  editable?: boolean;       // per-event override
  metadata?: Record<string, unknown>;
}

interface ResourceDef {
  id: string;
  title: string;
  avatar?: string;
  metadata?: Record<string, unknown>;
}

interface SlotConfig {
  startHour: number;        // 0-23
  endHour: number;          // 0-23
  slotDuration: number;     // minutes (15, 30, 60)
}
```

### Validation
- `start < end` enforced at runtime; warning in dev mode on violation
- `resourceId` validated against provided resources array
- Date string parsing via `Date` constructor with fallback warning

### State Management
- **Controlled**: `events`, `date`, `view` can be externally driven
- **Uncontrolled**: internal drag state, tooltip position, hover highlights
- `onEventDrop` and `onSlotSelect` are the primary mutation callbacks — consumer handles persistence

### Async Data Loading
- `loading` prop shows skeleton overlay on the event layer
- Date range change emits `onDateChange` for consumer to fetch relevant events
- Optimistic updates supported via controlled events array

## 6. Accessibility

### WCAG Target
- **AA** minimum

### Keyboard Navigation
- `Tab` to focus scheduler, then toolbar, then event grid
- Arrow keys to navigate between time slots (day/week) or days (month)
- `Enter` to open event details or create event in selected slot
- `Escape` to cancel drag or close popover
- `Space` to toggle event selection
- `Shift + Arrow` to extend selection range for new event creation

### Screen Reader Announcements
- View context announced on focus: "Week view, March 17-23, 2026"
- Time slot announced on navigation: "Tuesday, March 18, 10:00 AM to 10:30 AM"
- Event details announced: "Meeting with Team, 10:00 AM to 11:00 AM, Conference Room A"
- Drag result announced: "Event moved to Wednesday 2:00 PM"
- `aria-live="polite"` for view changes and event mutations

### Focus Management
- Focus preserved on view change (same relative time slot)
- Focus returns to trigger when closing event popover
- Visible focus ring on all interactive slots and events

### ARIA Attributes
- `role="grid"` on scheduler body, `role="row"` per time row, `role="gridcell"` per slot
- `aria-label` on events with full summary
- `aria-current="date"` on today marker
- `aria-selected` on selected time range

## 7. Performance Budget

### Bundle Size
- **< 40 KB** gzipped
- View components (Day/Week/Month) tree-shakeable independently
- Drag-and-drop logic lazy-loaded when `editable=true`

### Render Targets
- **500 events** (week view): initial render < 150ms
- **View switch**: < 100ms
- **Event drag**: < 16ms per frame (60fps)
- **Date navigation**: < 100ms

### Memory Budget
- Scheduler instance: < 4MB for 500 events across week view
- Only visible + buffer events held in memory for month view
- Event DOM recycling for long time ranges

### Lazy Loading
- Recurrence expansion loaded on demand
- Conflict detection loaded when multi-resource enabled
- Export/print functionality loaded on first use

## 8. Test & Docs Exit Criteria

### Tests
- **35 unit tests** — event positioning, overlap algorithm, recurrence expansion, conflict detection, time slot generation
- **8 integration tests** — full scheduler render per view, drag-and-drop flow, view switching, date navigation
- **5 visual regression tests** — day view, week view, month view, dark mode, multi-resource layout

### Contract Tests
- SchedulerEvent interface shape validated
- Date parsing edge cases (timezone, DST transitions)

### Documentation
- API reference page with full props table
- **8 examples** — basic day/week/month, multi-resource, drag-and-drop, custom event render, theming, readonly mode
- **3 recipes** — meeting room booking, team schedule, recurring events pattern
