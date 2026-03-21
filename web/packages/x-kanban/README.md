# @corp/x-kanban

Drag-and-drop Kanban board for task management, workflow visualization, and project tracking. Built with dnd-kit and design-system theming.

## Installation

```bash
pnpm add @corp/x-kanban
```

Peer dependencies:

```bash
pnpm add @corp/design-system @dnd-kit/core @dnd-kit/sortable
```

## Quick Start

```tsx
import { KanbanBoard } from '@corp/x-kanban';

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const cards = [
  { id: '1', columnId: 'todo', title: 'Design landing page', assignee: 'Alice' },
  { id: '2', columnId: 'in-progress', title: 'Build API endpoints', assignee: 'Bob' },
  { id: '3', columnId: 'done', title: 'Set up CI/CD', assignee: 'Charlie' },
];

export function TaskBoard() {
  return (
    <KanbanBoard
      columns={columns}
      cards={cards}
      onCardMove={(cardId, fromColumn, toColumn) => {
        console.log(`Moved ${cardId} from ${fromColumn} to ${toColumn}`);
      }}
    />
  );
}
```

## With Swimlanes and Metrics

```tsx
import { KanbanBoard, KanbanSwimlane, KanbanMetrics } from '@corp/x-kanban';

export function ProjectBoard() {
  return (
    <KanbanBoard columns={columns} cards={cards} onCardMove={handleMove}>
      <KanbanSwimlane groupBy="priority" labels={{ high: 'High', medium: 'Medium', low: 'Low' }} />
      <KanbanMetrics
        showCardCount
        showCycleTime
        showThroughput
      />
    </KanbanBoard>
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `KanbanBoard` | Core board with drag-and-drop columns and cards |
| `KanbanSwimlane` | Horizontal grouping within columns |
| `KanbanMetrics` | Column-level metrics (card count, cycle time, throughput) |
| `KanbanCard` | Customizable card component (override via render prop) |
| `KanbanColumnHeader` | Customizable column header |

## API Reference

Full props documentation: [/api/x-kanban](/api/x-kanban)

## License

Private -- internal use only.
