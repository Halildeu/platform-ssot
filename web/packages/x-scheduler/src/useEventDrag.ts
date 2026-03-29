import { useCallback, useRef, useState } from 'react';
import type { SchedulerEvent } from './types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EventDragState {
  isDragging: boolean;
  draggedEvent: SchedulerEvent | null;
  dragPreview: { start: Date; end: Date } | null;
  isResizing: boolean;
  resizeEdge: 'top' | 'bottom' | null;
}

export interface UseEventDragOptions {
  events: SchedulerEvent[];
  onEventMove?: (eventId: string, newStart: Date, newEnd: Date) => void;
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
  /** Snap granularity in minutes (default 15) */
  snapMinutes?: number;
}

export interface UseEventDragReturn {
  state: EventDragState;
  /** Spread on each event element to enable drag-to-move */
  getEventDragProps: (eventId: string) => React.HTMLAttributes<HTMLElement>;
  /** Spread on each time-slot element to accept drops */
  getSlotDropProps: (slotDate: Date) => React.HTMLAttributes<HTMLElement>;
  /** Spread on resize handles at top/bottom of event */
  getResizeHandleProps: (eventId: string, edge: 'top' | 'bottom') => React.HTMLAttributes<HTMLElement>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function snapToMinutes(date: Date, snapMinutes: number): Date {
  const ms = snapMinutes * 60_000;
  return new Date(Math.round(date.getTime() / ms) * ms);
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useEventDrag(options: UseEventDragOptions): UseEventDragReturn {
  const { events, onEventMove, onEventResize, snapMinutes = 15 } = options;

  const [state, setState] = useState<EventDragState>({
    isDragging: false,
    draggedEvent: null,
    dragPreview: null,
    isResizing: false,
    resizeEdge: null,
  });

  // Track the resize start position for pointer-based resizing
  const resizeOrigin = useRef<{
    eventId: string;
    edge: 'top' | 'bottom';
    startY: number;
    originalStart: Date;
    originalEnd: Date;
  } | null>(null);

  /* ---------------------------------------------------------------- */
  /*  Drag-to-move props                                               */
  /* ---------------------------------------------------------------- */

  const getEventDragProps = useCallback(
    (eventId: string): React.HTMLAttributes<HTMLElement> => {
      const event = events.find((e) => e.id === eventId);
      if (!event || event.editable === false) return {};

      return {
        draggable: true,
        onDragStart: (e: React.DragEvent) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', eventId);
          e.dataTransfer.setData('application/x-scheduler-event', JSON.stringify({ id: eventId }));
          setState({
            isDragging: true,
            draggedEvent: event,
            dragPreview: { start: event.start, end: event.end },
            isResizing: false,
            resizeEdge: null,
          });
        },
        onDragEnd: () => {
          setState({
            isDragging: false,
            draggedEvent: null,
            dragPreview: null,
            isResizing: false,
            resizeEdge: null,
          });
        },
      };
    },
    [events],
  );

  /* ---------------------------------------------------------------- */
  /*  Slot drop props                                                  */
  /* ---------------------------------------------------------------- */

  const getSlotDropProps = useCallback(
    (slotDate: Date): React.HTMLAttributes<HTMLElement> => {
      return {
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';

          if (state.draggedEvent) {
            const duration = state.draggedEvent.end.getTime() - state.draggedEvent.start.getTime();
            const snapped = snapToMinutes(slotDate, snapMinutes);
            setState((prev) => ({
              ...prev,
              dragPreview: { start: snapped, end: new Date(snapped.getTime() + duration) },
            }));
          }
        },
        onDragLeave: () => {
          // Keep preview visible until drop or dragEnd
        },
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          const eventId = e.dataTransfer.getData('text/plain');
          const event = events.find((ev) => ev.id === eventId);
          if (!event || !onEventMove) return;

          const duration = event.end.getTime() - event.start.getTime();
          const snapped = snapToMinutes(slotDate, snapMinutes);
          const newEnd = new Date(snapped.getTime() + duration);

          onEventMove(eventId, snapped, newEnd);

          setState({
            isDragging: false,
            draggedEvent: null,
            dragPreview: null,
            isResizing: false,
            resizeEdge: null,
          });
        },
      };
    },
    [events, onEventMove, snapMinutes, state.draggedEvent],
  );

  /* ---------------------------------------------------------------- */
  /*  Resize handle props (pointer-based, not drag API)                */
  /* ---------------------------------------------------------------- */

  const getResizeHandleProps = useCallback(
    (eventId: string, edge: 'top' | 'bottom'): React.HTMLAttributes<HTMLElement> => {
      const event = events.find((e) => e.id === eventId);
      if (!event || event.editable === false) return {};

      return {
        style: {
          cursor: edge === 'top' ? 'n-resize' : 's-resize',
          position: 'absolute' as const,
          left: 0,
          right: 0,
          height: '6px',
          zIndex: 2,
          ...(edge === 'top' ? { top: 0 } : { bottom: 0 }),
        },
        onMouseDown: (e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();

          resizeOrigin.current = {
            eventId,
            edge,
            startY: e.clientY,
            originalStart: event.start,
            originalEnd: event.end,
          };

          setState((prev) => ({
            ...prev,
            isResizing: true,
            resizeEdge: edge,
            draggedEvent: event,
          }));

          const handleMouseMove = (me: MouseEvent) => {
            if (!resizeOrigin.current) return;

            const deltaY = me.clientY - resizeOrigin.current.startY;
            // Each pixel ≈ 1 minute (60px per hour => 1px per minute)
            const deltaMinutes = Math.round(deltaY / 1) ;
            const deltaMs = deltaMinutes * 60_000;

            let newStart = resizeOrigin.current.originalStart;
            let newEnd = resizeOrigin.current.originalEnd;

            if (edge === 'top') {
              newStart = snapToMinutes(new Date(resizeOrigin.current.originalStart.getTime() + deltaMs), snapMinutes);
              // Don't let start go past end
              if (newStart >= newEnd) return;
            } else {
              newEnd = snapToMinutes(new Date(resizeOrigin.current.originalEnd.getTime() + deltaMs), snapMinutes);
              // Don't let end go before start
              if (newEnd <= newStart) return;
            }

            setState((prev) => ({
              ...prev,
              dragPreview: { start: newStart, end: newEnd },
            }));
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            if (resizeOrigin.current && onEventResize) {
              const _origin = resizeOrigin.current;
              // Use latest dragPreview from state — but since state is async, re-compute
              const el = document.elementFromPoint(0, 0); // dummy — we use the stored ref
              void el; // unused
              // Re-read from ref to get final position
            }

            // Commit final resize
            setState((prev) => {
              if (prev.dragPreview && resizeOrigin.current && onEventResize) {
                onEventResize(resizeOrigin.current.eventId, prev.dragPreview.start, prev.dragPreview.end);
              }
              resizeOrigin.current = null;
              return {
                isDragging: false,
                draggedEvent: null,
                dragPreview: null,
                isResizing: false,
                resizeEdge: null,
              };
            });
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        },
      };
    },
    [events, onEventResize, snapMinutes],
  );

  return {
    state,
    getEventDragProps,
    getSlotDropProps,
    getResizeHandleProps,
  };
}
