export { KanbanBoard } from './KanbanBoard';
export type { KanbanBoardProps } from './KanbanBoard';

export { KanbanColumn } from './KanbanColumn';
export type { KanbanColumnProps } from './KanbanColumn';

export { KanbanCard } from './KanbanCard';
export type { KanbanCardProps } from './KanbanCard';

export { KanbanToolbar } from './KanbanToolbar';
export type { KanbanToolbarProps } from './KanbanToolbar';

export { KanbanSwimlane } from './KanbanSwimlane';
export type { KanbanSwimlaneProps } from './KanbanSwimlane';

export { KanbanCardDetail } from './KanbanCardDetail';
export type { KanbanCardDetailProps } from './KanbanCardDetail';

export { KanbanMetrics } from './KanbanMetrics';
export type { KanbanMetricsProps } from './KanbanMetrics';

export { useKanban } from './useKanban';
export type { UseKanbanReturn } from './useKanban';

export { useDragDrop } from './useDragDrop';
export type {
  DragDropState,
  DragDropHandlers,
  UseDragDropReturn,
  DragDropEngine,
  DragItem,
  DropTarget,
} from './useDragDrop';

export {
  hasDndKit,
  useDndKitKanban,
  useSortableCard,
  useDroppableColumn,
} from './createDndKitEngine';
export type {
  DndKitKanbanOptions,
  DndKitKanbanReturn,
  SortableCardReturn,
  DroppableColumnReturn,
} from './createDndKitEngine';

export { useKanbanFilter } from './useKanbanFilter';
export type { UseKanbanFilterReturn } from './useKanbanFilter';

export { useWipPolicy } from './useWipPolicy';
export type { WipUtilization, WipViolation, UseWipPolicyReturn } from './useWipPolicy';

export type {
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
  DragResult,
  Swimlane,
  ColumnPolicy,
  KanbanFilter,
  CardTemplate,
} from './types';

/* Wave 3 — Cross-package composition */
export { useKanbanSchedulerSync } from './composition/useKanbanSchedulerSync';
export type {
  SchedulerEvent as KanbanSchedulerEvent,
  UseKanbanSchedulerSyncOptions,
  UseKanbanSchedulerSyncReturn,
} from './composition/useKanbanSchedulerSync';

/* Wave 3 — Variant system */
export { useKanbanVariants } from './useKanbanVariants';
export type {
  BoardState,
  BoardVariant,
  UseKanbanVariantsReturn,
} from './useKanbanVariants';
