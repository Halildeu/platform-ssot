// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useWipPolicy } from '../useWipPolicy';
import type { KanbanColumn, KanbanCard } from '../types';

describe('useWipPolicy', () => {
  it('isOverLimit returns true when over WIP limit', () => {
    const columns: KanbanColumn[] = [
      { id: 'col-1', title: 'Doing', limit: 2 },
    ];
    const cards: KanbanCard[] = [
      { id: 'c1', columnId: 'col-1', title: 'Card 1' },
      { id: 'c2', columnId: 'col-1', title: 'Card 2' },
      { id: 'c3', columnId: 'col-1', title: 'Card 3' },
    ];

    const { result } = renderHook(() => useWipPolicy(columns, cards));

    expect(result.current.isOverLimit('col-1')).toBe(true);
  });

  it('isOverLimit returns false when under limit', () => {
    const columns: KanbanColumn[] = [
      { id: 'col-1', title: 'Doing', limit: 5 },
    ];
    const cards: KanbanCard[] = [
      { id: 'c1', columnId: 'col-1', title: 'Card 1' },
      { id: 'c2', columnId: 'col-1', title: 'Card 2' },
    ];

    const { result } = renderHook(() => useWipPolicy(columns, cards));

    expect(result.current.isOverLimit('col-1')).toBe(false);
  });

  it('getUtilization returns correct percentage', () => {
    const columns: KanbanColumn[] = [
      { id: 'col-1', title: 'Doing', limit: 4 },
    ];
    const cards: KanbanCard[] = [
      { id: 'c1', columnId: 'col-1', title: 'Card 1' },
      { id: 'c2', columnId: 'col-1', title: 'Card 2' },
    ];

    const { result } = renderHook(() => useWipPolicy(columns, cards));

    const util = result.current.getUtilization('col-1');
    expect(util.current).toBe(2);
    expect(util.limit).toBe(4);
    expect(util.percentage).toBe(50);
  });

  it('canAcceptCard rejects when over limit', () => {
    const columns: KanbanColumn[] = [
      { id: 'col-1', title: 'Doing', limit: 2 },
    ];
    const cards: KanbanCard[] = [
      { id: 'c1', columnId: 'col-1', title: 'Card 1' },
      { id: 'c2', columnId: 'col-1', title: 'Card 2' },
    ];

    const { result } = renderHook(() => useWipPolicy(columns, cards));

    const check = result.current.canAcceptCard('col-1', {
      id: 'c3',
      columnId: 'other',
      title: 'Card 3',
    });
    expect(check.allowed).toBe(false);
    expect(check.reason).toBeDefined();
  });

  it('canAcceptCard checks allowedCardTypes', () => {
    const columns: KanbanColumn[] = [
      {
        id: 'col-1',
        title: 'Bugs Only',
        policy: { allowedCardTypes: ['bug'] },
      },
    ];
    const cards: KanbanCard[] = [];

    const { result } = renderHook(() => useWipPolicy(columns, cards));

    const rejected = result.current.canAcceptCard('col-1', {
      id: 'c1',
      columnId: 'other',
      title: 'Feature',
      type: 'feature',
    });
    expect(rejected.allowed).toBe(false);
    expect(rejected.reason).toContain('feature');

    const accepted = result.current.canAcceptCard('col-1', {
      id: 'c2',
      columnId: 'other',
      title: 'Bug Fix',
      type: 'bug',
    });
    expect(accepted.allowed).toBe(true);
  });

  it('violations lists all over-limit columns', () => {
    const columns: KanbanColumn[] = [
      { id: 'col-1', title: 'A', limit: 1 },
      { id: 'col-2', title: 'B', limit: 3 },
      { id: 'col-3', title: 'C', limit: 2 },
    ];
    const cards: KanbanCard[] = [
      { id: 'c1', columnId: 'col-1', title: 'Card 1' },
      { id: 'c2', columnId: 'col-1', title: 'Card 2' },
      { id: 'c3', columnId: 'col-2', title: 'Card 3' },
      { id: 'c4', columnId: 'col-3', title: 'Card 4' },
      { id: 'c5', columnId: 'col-3', title: 'Card 5' },
      { id: 'c6', columnId: 'col-3', title: 'Card 6' },
    ];

    const { result } = renderHook(() => useWipPolicy(columns, cards));

    // col-1 has 2/1, col-3 has 3/2 -> 2 violations
    expect(result.current.violations).toHaveLength(2);
    const violationIds = result.current.violations.map((v) => v.columnId);
    expect(violationIds).toContain('col-1');
    expect(violationIds).toContain('col-3');
  });
});
