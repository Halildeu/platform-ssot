// Type stubs for optional @dnd-kit peer dependencies
// These allow compilation without @dnd-kit installed
declare module '@dnd-kit/core' {
  export const DndContext: any;
  export const DragOverlay: any;
  export const closestCorners: any;
  export const KeyboardSensor: any;
  export const PointerSensor: any;
  export const TouchSensor: any;
  export const useSensor: any;
  export const useSensors: any;
  export const useDroppable: any;
  export type DragStartEvent = any;
  export type DragOverEvent = any;
  export type DragEndEvent = any;
}

declare module '@dnd-kit/sortable' {
  export const SortableContext: any;
  export const useSortable: any;
  export const verticalListSortingStrategy: any;
  export const sortableKeyboardCoordinates: any;
  export const arrayMove: any;
}

declare module '@dnd-kit/utilities' {
  export const CSS: { Transform: { toString: (transform: any) => string } };
}
