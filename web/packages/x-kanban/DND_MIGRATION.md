# DnD Engine Migration

## Current State
- Primary engine: @dnd-kit/core + @dnd-kit/sortable
- Legacy fallback: useDragDrop.ts (HTML5 DnD API)

## Migration Plan
1. @dnd-kit installed and configured
2. createDndKitEngine.ts provides core drag-drop logic
3. useDragDrop.ts deprecated -- consumers should use useKanban() directly
4. Remove HTML5 DnD fallback in v1.0

## API Mapping
| HTML5 DnD | @dnd-kit |
|-----------|----------|
| onDragStart | useDndMonitor({ onDragStart }) |
| onDragOver | DragOverlay + useDndMonitor({ onDragOver }) |
| onDrop | useDndMonitor({ onDragEnd }) |
| draggable | useDraggable() |
| droppable | useDroppable() |

## Consumer Migration Guide

### Before (HTML5 legacy)
```tsx
const { handlers, draggedCardId } = useDragDrop();
```

### After (@dnd-kit)
```tsx
const { columns, cards, moveCard } = useKanban({ ... });
// KanbanBoard automatically uses @dnd-kit when available
```

Consumers using `useKanban()` + `<KanbanBoard>` require no changes --
the board auto-selects @dnd-kit when the packages are installed.
Only direct `useDragDrop()` callers need to migrate.
