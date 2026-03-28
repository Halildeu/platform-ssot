import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKanbanSchedulerSync } from '../composition/useKanbanSchedulerSync';
import type { KanbanCard } from '../types';

const sampleCards: KanbanCard[] = [
  {
    id: 'c1',
    columnId: 'todo',
    title: 'Implement feature',
    priority: 'high',
    dueDate: new Date('2026-04-01T10:00:00'),
    assignee: 'alice',
    tags: ['frontend'],
  },
  {
    id: 'c2',
    columnId: 'doing',
    title: 'Write tests',
    priority: 'medium',
    dueDate: new Date('2026-04-02T14:00:00'),
  },
];

describe('useKanbanSchedulerSync', () => {
  it('converts kanban cards to scheduler events', () => {
    const { result } = renderHook(() => useKanbanSchedulerSync());
    const events = result.current.toSchedulerEvents(sampleCards);

    expect(events).toHaveLength(2);
    expect(events[0].id).toBe('c1');
    expect(events[0].title).toBe('Implement feature');
    expect(events[0].start).toEqual(new Date('2026-04-01T10:00:00'));
    // Default 60 min duration
    expect(events[0].end.getTime() - events[0].start.getTime()).toBe(60 * 60 * 1000);
    // High priority -> red
    expect(events[0].color).toBe('var(--state-danger-text)');
  });

  it('converts scheduler events to kanban cards', () => {
    const { result } = renderHook(() => useKanbanSchedulerSync());
    const events = result.current.toSchedulerEvents(sampleCards);
    const cards = result.current.toKanbanCards(events, 'backlog');

    expect(cards).toHaveLength(2);
    expect(cards[0].id).toBe('c1');
    // Preserves columnId from metadata
    expect(cards[0].columnId).toBe('todo');
  });

  it('uses defaultColumnId when no metadata.columnId', () => {
    const { result } = renderHook(() => useKanbanSchedulerSync());
    const events = [
      { id: 'e1', title: 'Meeting', start: new Date(), end: new Date(), metadata: {} },
    ];
    const cards = result.current.toKanbanCards(events, 'inbox');
    expect(cards[0].columnId).toBe('inbox');
  });

  it('respects custom duration', () => {
    const { result } = renderHook(() =>
      useKanbanSchedulerSync({ defaultDurationMinutes: 30 }),
    );
    const events = result.current.toSchedulerEvents(sampleCards);
    expect(events[0].end.getTime() - events[0].start.getTime()).toBe(30 * 60 * 1000);
  });

  it('tracks card moves', () => {
    const { result } = renderHook(() => useKanbanSchedulerSync());

    act(() => result.current.onCardMove('c1', 'done'));

    expect(result.current.cardMoves.get('c1')).toBe('done');
  });

  it('tracks event moves', () => {
    const { result } = renderHook(() => useKanbanSchedulerSync());
    const newStart = new Date('2026-05-01');
    const newEnd = new Date('2026-05-01T01:00:00');

    act(() => result.current.onEventMove('e1', newStart, newEnd));

    expect(result.current.eventMoves.get('e1')).toEqual({
      start: newStart,
      end: newEnd,
    });
  });
});
