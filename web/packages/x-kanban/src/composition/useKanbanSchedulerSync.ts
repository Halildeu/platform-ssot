import { useState, useCallback } from 'react';
import type { KanbanCard } from '../types';

/* ------------------------------------------------------------------ */
/*  Kanban <-> Scheduler Sync Composition Hook                        */
/*  Bidirectional sync between kanban cards and calendar events.       */
/* ------------------------------------------------------------------ */

export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  allDay?: boolean;
  editable?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UseKanbanSchedulerSyncOptions {
  /** Default duration in minutes when converting a card to an event */
  defaultDurationMinutes?: number;
  /** Map kanban priority to event color */
  priorityColorMap?: Record<string, string>;
}

export interface UseKanbanSchedulerSyncReturn {
  /** Convert kanban cards to scheduler events */
  toSchedulerEvents: (cards: KanbanCard[]) => SchedulerEvent[];
  /** Convert scheduler events to kanban cards */
  toKanbanCards: (events: SchedulerEvent[], defaultColumnId: string) => KanbanCard[];
  /** Handle card move in kanban (syncs to scheduler) */
  onCardMove: (cardId: string, newColumnId: string) => void;
  /** Handle event move in scheduler (syncs to kanban) */
  onEventMove: (eventId: string, newStart: Date, newEnd: Date) => void;
  /** Current sync state for external consumers */
  cardMoves: Map<string, string>;
  eventMoves: Map<string, { start: Date; end: Date }>;
}

const DEFAULT_DURATION_MINUTES = 60;

const DEFAULT_PRIORITY_COLORS: Record<string, string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  critical: '#9c27b0',
};

/**
 * Bidirectional sync between a Kanban board and a Scheduler.
 *
 * ```tsx
 * const { toSchedulerEvents, toKanbanCards, onCardMove, onEventMove } =
 *   useKanbanSchedulerSync({ defaultDurationMinutes: 30 });
 * ```
 */
export function useKanbanSchedulerSync(
  options: UseKanbanSchedulerSyncOptions = {},
): UseKanbanSchedulerSyncReturn {
  const {
    defaultDurationMinutes = DEFAULT_DURATION_MINUTES,
    priorityColorMap = DEFAULT_PRIORITY_COLORS,
  } = options;

  // Track moves for sync
  const [cardMoves, setCardMoves] = useState<Map<string, string>>(new Map());
  const [eventMoves, setEventMoves] = useState<Map<string, { start: Date; end: Date }>>(
    new Map(),
  );

  const toSchedulerEvents = useCallback(
    (cards: KanbanCard[]): SchedulerEvent[] =>
      cards.map((card) => {
        const start = card.dueDate ? new Date(card.dueDate) : new Date();
        const end = new Date(start.getTime() + defaultDurationMinutes * 60 * 1000);
        return {
          id: card.id,
          title: card.title,
          start,
          end,
          color: card.priority ? priorityColorMap[card.priority] : undefined,
          metadata: {
            ...card.metadata,
            columnId: card.columnId,
            assignee: card.assignee,
            tags: card.tags,
          },
        };
      }),
    [defaultDurationMinutes, priorityColorMap],
  );

  const toKanbanCards = useCallback(
    (events: SchedulerEvent[], defaultColumnId: string): KanbanCard[] =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        columnId: (event.metadata?.columnId as string) ?? defaultColumnId,
        description: `${event.start.toLocaleString()} - ${event.end.toLocaleString()}`,
        dueDate: event.start,
        assignee: event.metadata?.assignee as string | undefined,
        tags: event.metadata?.tags as string[] | undefined,
        metadata: event.metadata,
      })),
    [],
  );

  const onCardMove = useCallback((cardId: string, newColumnId: string) => {
    setCardMoves((prev) => {
      const next = new Map(prev);
      next.set(cardId, newColumnId);
      return next;
    });
  }, []);

  const onEventMove = useCallback((eventId: string, newStart: Date, newEnd: Date) => {
    setEventMoves((prev) => {
      const next = new Map(prev);
      next.set(eventId, { start: newStart, end: newEnd });
      return next;
    });
  }, []);

  return {
    toSchedulerEvents,
    toKanbanCards,
    onCardMove,
    onEventMove,
    cardMoves,
    eventMoves,
  };
}
