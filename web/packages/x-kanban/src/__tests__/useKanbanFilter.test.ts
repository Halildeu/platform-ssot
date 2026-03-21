import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useKanbanFilter } from '../useKanbanFilter';
import type { KanbanCard } from '../types';

const cards: KanbanCard[] = [
  { id: 'c1', columnId: 'todo', title: 'Fix login bug', priority: 'high', tags: ['bug', 'auth'] },
  { id: 'c2', columnId: 'todo', title: 'Add dashboard', priority: 'medium', tags: ['feature'] },
  { id: 'c3', columnId: 'doing', title: 'Update docs', priority: 'low', tags: ['docs'] },
  { id: 'c4', columnId: 'done', title: 'Fix auth token', priority: 'high', tags: ['bug', 'auth'] },
];

describe('useKanbanFilter', () => {
  it('filters cards by equals operator', () => {
    const { result } = renderHook(() => useKanbanFilter(cards));

    act(() => {
      result.current.addFilter({ field: 'priority', operator: 'equals', value: 'high' });
    });

    expect(result.current.filteredCards).toHaveLength(2);
    expect(result.current.filteredCards.every((c) => c.priority === 'high')).toBe(true);
  });

  it('filters cards by contains operator', () => {
    const { result } = renderHook(() => useKanbanFilter(cards));

    act(() => {
      result.current.addFilter({ field: 'title', operator: 'contains', value: 'Fix' });
    });

    expect(result.current.filteredCards).toHaveLength(2);
    expect(result.current.filteredCards.every((c) => c.title.includes('Fix'))).toBe(true);
  });

  it('filters cards by in operator', () => {
    const { result } = renderHook(() => useKanbanFilter(cards));

    act(() => {
      result.current.addFilter({ field: 'priority', operator: 'in', value: ['high', 'low'] });
    });

    expect(result.current.filteredCards).toHaveLength(3);
  });

  it('addFilter adds a filter', () => {
    const { result } = renderHook(() => useKanbanFilter(cards));

    expect(result.current.filters).toHaveLength(0);

    act(() => {
      result.current.addFilter({ field: 'priority', operator: 'equals', value: 'high' });
    });

    expect(result.current.filters).toHaveLength(1);
    expect(result.current.filters[0].field).toBe('priority');
  });

  it('removeFilter removes a filter', () => {
    const { result } = renderHook(() => useKanbanFilter(cards));

    act(() => {
      result.current.addFilter({ field: 'priority', operator: 'equals', value: 'high' });
      result.current.addFilter({ field: 'columnId', operator: 'equals', value: 'todo' });
    });

    expect(result.current.filters).toHaveLength(2);

    act(() => {
      result.current.removeFilter('priority');
    });

    expect(result.current.filters).toHaveLength(1);
    expect(result.current.filters[0].field).toBe('columnId');
  });

  it('clearFilters clears all', () => {
    const { result } = renderHook(() => useKanbanFilter(cards));

    act(() => {
      result.current.addFilter({ field: 'priority', operator: 'equals', value: 'high' });
      result.current.addFilter({ field: 'columnId', operator: 'equals', value: 'todo' });
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toHaveLength(0);
    expect(result.current.filteredCards).toHaveLength(4);
  });

  it('filteredCards reflects active filters', () => {
    const { result } = renderHook(() => useKanbanFilter(cards));

    // No filters = all cards
    expect(result.current.filteredCards).toHaveLength(4);

    // Add priority filter
    act(() => {
      result.current.addFilter({ field: 'priority', operator: 'equals', value: 'high' });
    });
    expect(result.current.filteredCards).toHaveLength(2);

    // Add column filter (stacks with priority)
    act(() => {
      result.current.addFilter({ field: 'columnId', operator: 'equals', value: 'todo' });
    });
    // Only c1: priority=high AND columnId=todo
    expect(result.current.filteredCards).toHaveLength(1);
    expect(result.current.filteredCards[0].id).toBe('c1');
  });
});
