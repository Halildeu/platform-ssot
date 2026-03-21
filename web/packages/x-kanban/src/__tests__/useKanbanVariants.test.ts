import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKanbanVariants, type BoardState } from '../useKanbanVariants';

const STORAGE_KEY = 'x-kanban-variants';

const sampleState: BoardState = {
  columns: [
    { id: 'todo', title: 'To Do', wipLimit: 5 },
    { id: 'doing', title: 'In Progress', wipLimit: 3 },
    { id: 'done', title: 'Done' },
  ],
  filters: [{ field: 'assignee', operator: 'equals', value: 'alice' }],
  sortBy: 'priority',
  sortDirection: 'desc',
};

describe('useKanbanVariants', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty variants', () => {
    const { result } = renderHook(() => useKanbanVariants('sprint-board'));
    expect(result.current.variants).toHaveLength(0);
    expect(result.current.activeVariant).toBeNull();
  });

  it('saveVariant persists and activates', () => {
    const { result } = renderHook(() => useKanbanVariants('sprint-board'));

    act(() => {
      result.current.saveVariant('Sprint 1 View', sampleState);
    });

    expect(result.current.variants).toHaveLength(1);
    expect(result.current.activeVariant?.name).toBe('Sprint 1 View');
    expect(result.current.activeVariant?.state).toEqual(sampleState);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored['sprint-board']).toHaveLength(1);
  });

  it('loadVariant activates an existing variant', () => {
    const { result } = renderHook(() => useKanbanVariants('board'));

    let v1Id: string;
    act(() => {
      v1Id = result.current.saveVariant('V1', sampleState).id;
    });
    act(() => {
      result.current.saveVariant('V2', { ...sampleState, sortBy: 'title' });
    });

    act(() => result.current.loadVariant(v1Id!));
    expect(result.current.activeVariant?.name).toBe('V1');
  });

  it('deleteVariant removes and clears active', () => {
    const { result } = renderHook(() => useKanbanVariants('board'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('Temp', sampleState).id;
    });
    act(() => result.current.deleteVariant(id!));

    expect(result.current.variants).toHaveLength(0);
    expect(result.current.activeVariant).toBeNull();
  });

  it('setDefault marks one variant as default', () => {
    const { result } = renderHook(() => useKanbanVariants('board'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('Default View', sampleState).id;
    });
    act(() => result.current.setDefault(id!));

    expect(result.current.variants[0].isDefault).toBe(true);
  });

  it('updateVariant patches state', () => {
    const { result } = renderHook(() => useKanbanVariants('board'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('Updatable', sampleState).id;
    });
    act(() =>
      result.current.updateVariant(id!, { swimlanesEnabled: true }),
    );

    const updated = result.current.variants.find((v) => v.id === id!);
    expect(updated?.state.swimlanesEnabled).toBe(true);
    expect(updated?.state.columns).toEqual(sampleState.columns); // unchanged
  });

  it('loads default variant on init from localStorage', () => {
    const variant = {
      id: 'pre-1',
      name: 'Saved',
      boardId: 'persisted',
      state: sampleState,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ persisted: [variant] }));

    const { result } = renderHook(() => useKanbanVariants('persisted'));
    expect(result.current.activeVariant?.id).toBe('pre-1');
  });
});
