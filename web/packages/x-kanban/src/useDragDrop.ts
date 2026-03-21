import { useState, useCallback, useMemo, type DragEvent } from 'react';
import type { KanbanCard } from './types';

/* ------------------------------------------------------------------ */
/*  DragDropEngine — engine-agnostic drag-and-drop abstraction         */
/*                                                                     */
/*  Current: HTML5 Drag and Drop API behind DragDropEngine interface   */
/*  Planned: @dnd-kit integration for keyboard accessibility + touch   */
/* ------------------------------------------------------------------ */

export interface DragItem {
  id: string;
  type: 'card';
  sourceColumnId: string;
  index: number;
  data: KanbanCard;
}

export interface DropTarget {
  columnId: string;
  index: number;
}

export interface DragDropEngine {
  // State
  isDragging: boolean;
  dragItem: DragItem | null;
  dropTarget: DropTarget | null;

  // Handlers (engine-agnostic)
  onDragStart: (item: DragItem) => void;
  onDragOver: (target: DropTarget) => void;
  onDragEnd: () => void;
  onDrop: (target: DropTarget) => void;

  // HTML5 bindings — attach to DOM elements
  getDragHandleProps: (item: DragItem) => React.HTMLAttributes<HTMLElement>;
  getDropTargetProps: (target: DropTarget) => React.HTMLAttributes<HTMLElement>;
}

/* ------------------------------------------------------------------ */
/*  HTML5 DnD engine — wraps native drag events behind DragDropEngine  */
/* ------------------------------------------------------------------ */

function createHTML5DragDropEngine(
  onStateChange: () => void,
): {
  engine: DragDropEngine;
  /** Internal mutators used by the hook's state management */
  _setDragItem: (item: DragItem | null) => void;
  _setDropTarget: (target: DropTarget | null) => void;
  _getState: () => { dragItem: DragItem | null; dropTarget: DropTarget | null };
} {
  let dragItem: DragItem | null = null;
  let dropTarget: DropTarget | null = null;

  const engine: DragDropEngine = {
    get isDragging() {
      return dragItem !== null;
    },
    get dragItem() {
      return dragItem;
    },
    get dropTarget() {
      return dropTarget;
    },

    onDragStart: (item: DragItem) => {
      dragItem = item;
      onStateChange();
    },

    onDragOver: (target: DropTarget) => {
      dropTarget = target;
      onStateChange();
    },

    onDragEnd: () => {
      dragItem = null;
      dropTarget = null;
      onStateChange();
    },

    onDrop: (_target: DropTarget) => {
      dropTarget = null;
      onStateChange();
    },

    getDragHandleProps: (item: DragItem): React.HTMLAttributes<HTMLElement> => ({
      draggable: true,
      onDragStart: (e: DragEvent<HTMLElement>) => {
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
        engine.onDragStart(item);
      },
      onDragEnd: () => {
        engine.onDragEnd();
      },
    }),

    getDropTargetProps: (target: DropTarget): React.HTMLAttributes<HTMLElement> => ({
      onDragOver: (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        engine.onDragOver(target);
      },
      onDragEnter: (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
      },
      onDragLeave: (e: DragEvent<HTMLElement>) => {
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        const currentTarget = e.currentTarget as HTMLElement;
        if (relatedTarget && currentTarget.contains(relatedTarget)) return;
        // Only clear if we're leaving this specific target
        if (dropTarget?.columnId === target.columnId) {
          dropTarget = null;
          onStateChange();
        }
      },
      onDrop: (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        engine.onDrop(target);
      },
    }),
  };

  return {
    engine,
    _setDragItem: (item) => { dragItem = item; },
    _setDropTarget: (t) => { dropTarget = t; },
    _getState: () => ({ dragItem, dropTarget }),
  };
}

/* Future: @dnd-kit implementation
 * function createDndKitEngine(...): DragDropEngine {
 *   // Uses @dnd-kit/core DndContext and useSortable
 *   // Provides keyboard sensor, touch sensor, and pointer sensor
 *   // Returns the same DragDropEngine interface
 * }
 */

/* ------------------------------------------------------------------ */
/*  Legacy interface — kept for backward compatibility                 */
/* ------------------------------------------------------------------ */

export interface DragDropState {
  draggedCardId: string | null;
  dragOverColumnId: string | null;
  dragOverIndex: number;
}

export interface DragDropHandlers {
  onDragStart: (e: DragEvent<HTMLElement>, cardId: string, columnId: string) => void;
  onDragOver: (e: DragEvent<HTMLElement>, columnId: string, index: number) => void;
  onDragEnter: (e: DragEvent<HTMLElement>, columnId: string) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>, columnId: string) => void;
  onDragEnd: (e: DragEvent<HTMLElement>) => void;
}

export interface UseDragDropReturn extends DragDropState {
  handlers: DragDropHandlers;
  sourceColumnId: string | null;
  /** New engine-agnostic API — prefer this over legacy handlers */
  engine: DragDropEngine;
}

/* ------------------------------------------------------------------ */
/*  useDragDrop hook                                                   */
/* ------------------------------------------------------------------ */

export function useDragDrop(): UseDragDropReturn {
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number>(0);
  // Force re-render when engine state changes
  const [, setTick] = useState(0);

  const engineRef = useMemo(
    () => createHTML5DragDropEngine(() => setTick((t) => t + 1)),
    [],
  );

  const engine = engineRef.engine;

  // --- Legacy handlers that also drive the engine ---

  const onDragStart = useCallback(
    (e: DragEvent<HTMLElement>, cardId: string, columnId: string) => {
      e.dataTransfer.setData('text/plain', cardId);
      e.dataTransfer.effectAllowed = 'move';
      setDraggedCardId(cardId);
      setSourceColumnId(columnId);
      engine.onDragStart({
        id: cardId,
        type: 'card',
        sourceColumnId: columnId,
        index: 0,
        data: { id: cardId, columnId, title: '' } as KanbanCard,
      });
    },
    [engine],
  );

  const onDragOver = useCallback(
    (e: DragEvent<HTMLElement>, columnId: string, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumnId(columnId);
      setDragOverIndex(index);
      engine.onDragOver({ columnId, index });
    },
    [engine],
  );

  const onDragEnter = useCallback(
    (e: DragEvent<HTMLElement>, columnId: string) => {
      e.preventDefault();
      setDragOverColumnId(columnId);
    },
    [],
  );

  const onDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    if (relatedTarget && currentTarget.contains(relatedTarget)) return;
    setDragOverColumnId(null);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLElement>, _columnId: string) => {
      e.preventDefault();
      setDragOverColumnId(null);
      engine.onDrop({ columnId: _columnId, index: dragOverIndex });
    },
    [engine, dragOverIndex],
  );

  const onDragEnd = useCallback(
    (_e: DragEvent<HTMLElement>) => {
      setDraggedCardId(null);
      setSourceColumnId(null);
      setDragOverColumnId(null);
      setDragOverIndex(0);
      engine.onDragEnd();
    },
    [engine],
  );

  return {
    draggedCardId,
    dragOverColumnId,
    dragOverIndex,
    sourceColumnId,
    handlers: {
      onDragStart,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
      onDragEnd,
    },
    engine,
  };
}
