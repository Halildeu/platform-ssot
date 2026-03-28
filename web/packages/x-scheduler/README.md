# @corp/x-scheduler

Calendar and scheduling component for event management, resource booking, and timeline visualization. Supports day, week, month, agenda, and resource views.

## Installation

```bash
pnpm add @corp/x-scheduler
```

Peer dependencies:

```bash
pnpm add @corp/design-system date-fns
```

## Quick Start

```tsx
import { Scheduler } from '@corp/x-scheduler';

const events = [
  {
    id: '1',
    title: 'Team Standup',
    start: new Date('2026-03-21T09:00:00'),
    end: new Date('2026-03-21T09:30:00'),
    color: 'primary',
  },
  {
    id: '2',
    title: 'Sprint Review',
    start: new Date('2026-03-21T14:00:00'),
    end: new Date('2026-03-21T15:00:00'),
    color: 'secondary',
  },
];

export function TeamCalendar() {
  return (
    <Scheduler
      events={events}
      defaultView="week"
      onEventClick={(event) => console.log('Clicked:', event.title)}
      onSlotClick={(start, end) => console.log('New event:', start, end)}
    />
  );
}
```

## Resource Booking

```tsx
import { Scheduler, ResourceView } from '@corp/x-scheduler';

const resources = [
  { id: 'room-a', name: 'Conference Room A', type: 'room' },
  { id: 'room-b', name: 'Conference Room B', type: 'room' },
  { id: 'projector', name: 'Projector', type: 'equipment' },
];

export function RoomBooking() {
  return (
    <Scheduler events={bookings} defaultView="resource">
      <ResourceView
        resources={resources}
        groupBy="type"
        slotDuration={30}
      />
    </Scheduler>
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `Scheduler` | Core calendar with day / week / month views |
| `AgendaView` | Flat list of upcoming events |
| `ResourceView` | Resource-based scheduling (rooms, people, equipment) |
| `TimelineView` | Horizontal Gantt-style timeline |

## Hooks

| Hook | Description |
|------|-------------|
| `useRecurrence` | Generate recurring event instances (daily, weekly, monthly) |
| `useEventDrag` | Programmatic control over drag-to-reschedule |

## API Reference

Full props documentation: [/api/x-scheduler](/api/x-scheduler)

## License

Private -- internal use only.
