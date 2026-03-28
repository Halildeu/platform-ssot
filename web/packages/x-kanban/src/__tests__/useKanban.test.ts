import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useKanban } from '../useKanban';
import type { KanbanColumn, KanbanCard } from '../types';

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

const cards: KanbanCard[] = [
  { id: 'c1', columnId: 'todo', title: 'Card 1' },
  { id: 'c2', columnId: 'todo', title: 'Card 2' },
  { id: 'c3', columnId: 'doing', title: 'Card 3' },
];

describe('useKanban', () => {
  it('initializes with columns and cards', () => {
    const { result } = renderHook(() => useKanban(columns, cards));

    expect(result.current.columns).toHaveLength(3);
    expect(result.current.cards).toHaveLength(3);
    expect(result.current.columns[0].title).toBe('To Do');
  });

  it('moveCard moves card between columns', () => {
    const { result } = renderHook(() => useKanban(columns, cards));

    act(() => {
      result.current.moveCard({
        cardId: 'c1',
        fromColumnId: 'todo',
        toColumnId: 'doing',
        toIndex: 0,
      });
    });

    const movedCard = result.current.cards.find((c) => c.id === 'c1');
    expect(movedCard?.columnId).toBe('doing');
  });

  it('addCard adds card to column', () => {
    const { result } = renderHook(() => useKanban(columns, cards));

    act(() => {
      result.current.addCard({
        id: 'c4',
        columnId: 'done',
        title: 'Card 4',
      });
    });

    expect(result.current.cards).toHaveLength(4);
    const newCard = result.current.cards.find((c) => c.id === 'c4');
    expect(newCard?.columnId).toBe('done');
  });

  it('removeCard removes card', () => {
    const { result } = renderHook(() => useKanban(columns, cards));

    act(() => {
      result.current.removeCard('c1');
    });

    expect(result.current.cards).toHaveLength(2);
    expect(result.current.cards.find((c) => c.id === 'c1')).toBeUndefined();
  });

  it('addColumn adds new column', () => {
    const { result } = renderHook(() => useKanban(columns, cards));

    act(() => {
      result.current.addColumn({ id: 'review', title: 'Review' });
    });

    expect(result.current.columns).toHaveLength(4);
    expect(result.current.columns[3].title).toBe('Review');
  });

  it('removeColumn removes column', () => {
    const { result } = renderHook(() => useKanban(columns, cards));

    act(() => {
      result.current.removeColumn('doing');
    });

    expect(result.current.columns).toHaveLength(2);
    expect(result.current.columns.find((c) => c.id === 'doing')).toBeUndefined();
    // Cards in removed column are also removed
    expect(result.current.cards.find((c) => c.columnId === 'doing')).toBeUndefined();
  });
});
