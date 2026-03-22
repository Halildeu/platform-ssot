import { useState, useCallback, useRef, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Touch-optimized drag-drop for mobile                               */
/*                                                                     */
/*  Supports:                                                          */
/*  - Long press to initiate drag (configurable, default 300ms)        */
/*  - Touch move with visual feedback                                  */
/*  - Drop zone indicators                                             */
/*  - Scroll during drag (edge detection)                              */
/*  - Cancel on multi-touch                                            */
/* ------------------------------------------------------------------ */

export interface TouchDragDropOptions {
  onMove: (cardId: string, fromColumn: string, toColumn: string, position: number) => void;
  /** Milliseconds to hold before drag starts. Default: 300 */
  longPressMs?: number;
  /** Scroll speed in px/frame when dragging near edges. Default: 8 */
  edgeScrollSpeed?: number;
  /** Distance from edge (px) that triggers auto-scroll. Default: 60 */
  edgeScrollThreshold?: number;
}

export interface TouchDragDropState {
  /** Card currently being dragged */
  draggedCardId: string | null;
  /** Source column of the dragged card */
  sourceColumn: string | null;
  /** Current touch position (for rendering ghost) */
  touchPosition: { x: number; y: number } | null;
  /** Whether a long-press is in progress (not yet activated) */
  isPressing: boolean;
  /** Whether drag is active (long press completed) */
  isDragging: boolean;
}

export interface UseTouchDragDropReturn extends TouchDragDropState {
  /** Attach these handlers to each draggable card element */
  getTouchHandlers: (cardId: string, columnId: string) => {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
  };
  /** Cancel the current drag */
  cancelDrag: () => void;
}

export function useTouchDragDrop(
  options: TouchDragDropOptions,
): UseTouchDragDropReturn {
  const {
    onMove,
    longPressMs = 300,
    edgeScrollSpeed = 8,
    edgeScrollThreshold = 60,
  } = options;

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollAnimFrame = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const cardIdRef = useRef<string | null>(null);
  const columnIdRef = useRef<string | null>(null);

  const clearTimers = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (scrollAnimFrame.current) {
      cancelAnimationFrame(scrollAnimFrame.current);
      scrollAnimFrame.current = null;
    }
  }, []);

  const cancelDrag = useCallback(() => {
    clearTimers();
    setDraggedCardId(null);
    setSourceColumn(null);
    setTouchPosition(null);
    setIsPressing(false);
    setIsDragging(false);
    cardIdRef.current = null;
    columnIdRef.current = null;
  }, [clearTimers]);

  // Auto-scroll when dragging near container edges
  const autoScroll = useCallback(
    (clientX: number, clientY: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      let dx = 0;
      let dy = 0;

      if (clientX - rect.left < edgeScrollThreshold) dx = -edgeScrollSpeed;
      else if (rect.right - clientX < edgeScrollThreshold) dx = edgeScrollSpeed;

      if (clientY - rect.top < edgeScrollThreshold) dy = -edgeScrollSpeed;
      else if (rect.bottom - clientY < edgeScrollThreshold) dy = edgeScrollSpeed;

      if (dx !== 0 || dy !== 0) {
        container.scrollBy(dx, dy);
        scrollAnimFrame.current = requestAnimationFrame(() =>
          autoScroll(clientX, clientY),
        );
      }
    },
    [edgeScrollSpeed, edgeScrollThreshold],
  );

  const getTouchHandlers = useCallback(
    (cardId: string, columnId: string) => ({
      onTouchStart: (e: React.TouchEvent) => {
        // Cancel on multi-touch
        if (e.touches.length > 1) {
          cancelDrag();
          return;
        }

        const touch = e.touches[0];
        cardIdRef.current = cardId;
        columnIdRef.current = columnId;
        setIsPressing(true);
        setTouchPosition({ x: touch.clientX, y: touch.clientY });

        // Find nearest scrollable parent for auto-scroll
        let el: HTMLElement | null = e.currentTarget as HTMLElement;
        while (el) {
          const style = window.getComputedStyle(el);
          if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
            scrollContainerRef.current = el;
            break;
          }
          el = el.parentElement;
        }

        longPressTimer.current = setTimeout(() => {
          setDraggedCardId(cardId);
          setSourceColumn(columnId);
          setIsDragging(true);
          setIsPressing(false);
        }, longPressMs);
      },

      onTouchMove: (e: React.TouchEvent) => {
        // Cancel on multi-touch
        if (e.touches.length > 1) {
          cancelDrag();
          return;
        }

        const touch = e.touches[0];
        setTouchPosition({ x: touch.clientX, y: touch.clientY });

        // If still in long-press phase, cancel if finger moves too far
        if (!isDragging && isPressing) {
          const startPos = touchPosition;
          if (startPos) {
            const dx = Math.abs(touch.clientX - startPos.x);
            const dy = Math.abs(touch.clientY - startPos.y);
            if (dx > 10 || dy > 10) {
              // Finger moved too far -- treat as scroll, not drag
              cancelDrag();
              return;
            }
          }
        }

        if (isDragging) {
          e.preventDefault(); // Prevent scroll while dragging
          autoScroll(touch.clientX, touch.clientY);
        }
      },

      onTouchEnd: (_e: React.TouchEvent) => {
        clearTimers();

        if (isDragging && draggedCardId && sourceColumn) {
          // Determine drop target based on touch position
          // In a real implementation, this would use elementFromPoint
          // to find the column and position under the touch.
          // For now, we call onMove with the source column (no-op move)
          // -- consumers should override with hit-testing logic.
          const pos = touchPosition;
          if (pos) {
            const dropEl = document.elementFromPoint(pos.x, pos.y);
            const columnEl = dropEl?.closest('[data-kanban-column]');
            const targetColumnId = columnEl?.getAttribute('data-kanban-column') ?? sourceColumn;
            const cardEls = columnEl?.querySelectorAll('[data-kanban-card]') ?? [];
            let dropIndex = cardEls.length;

            cardEls.forEach((el, i) => {
              const rect = el.getBoundingClientRect();
              if (pos.y < rect.top + rect.height / 2) {
                dropIndex = Math.min(dropIndex, i);
              }
            });

            onMove(draggedCardId, sourceColumn, targetColumnId, dropIndex);
          }
        }

        cancelDrag();
      },

      onTouchCancel: (_e: React.TouchEvent) => {
        cancelDrag();
      },
    }),
    [
      cancelDrag,
      clearTimers,
      isDragging,
      isPressing,
      draggedCardId,
      sourceColumn,
      touchPosition,
      longPressMs,
      autoScroll,
      onMove,
    ],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    draggedCardId,
    sourceColumn,
    touchPosition,
    isPressing,
    isDragging,
    getTouchHandlers,
    cancelDrag,
  };
}
