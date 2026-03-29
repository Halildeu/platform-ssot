// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMentions } from '../useMentions';
import type { MentionItem } from '../types';

const mockItems: MentionItem[] = [
  { id: 'u1', label: 'Alice', type: 'user' },
  { id: 'u2', label: 'Bob', type: 'user' },
  { id: 'u3', label: 'Charlie', type: 'user' },
];

describe('useMentions', () => {
  it('starts closed', () => {
    const fetchItems = vi.fn(() => []);
    const { result } = renderHook(() => useMentions(fetchItems));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.items).toHaveLength(0);
    expect(result.current.selectedIndex).toBe(0);
  });

  it('opens with position', () => {
    const fetchItems = vi.fn(() => []);
    const { result } = renderHook(() => useMentions(fetchItems));

    act(() => {
      result.current.open({ top: 50, left: 100 });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.position).toEqual({ top: 50, left: 100 });
  });

  it('search calls fetchItems', () => {
    const fetchItems = vi.fn(() => mockItems);
    const { result } = renderHook(() => useMentions(fetchItems));

    act(() => {
      result.current.open({ top: 0, left: 0 });
      result.current.search('Ali');
    });

    expect(fetchItems).toHaveBeenCalledWith('Ali');
    expect(result.current.items).toHaveLength(3);
  });

  it('selectNext/selectPrevious navigate', () => {
    const fetchItems = vi.fn(() => mockItems);
    const { result } = renderHook(() => useMentions(fetchItems));

    act(() => {
      result.current.open({ top: 0, left: 0 });
      result.current.search('');
    });

    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.selectNext();
    });

    expect(result.current.selectedIndex).toBe(1);

    act(() => {
      result.current.selectPrevious();
    });

    expect(result.current.selectedIndex).toBe(0);
  });

  it('getSelected returns correct item', () => {
    const fetchItems = vi.fn(() => mockItems);
    const { result } = renderHook(() => useMentions(fetchItems));

    act(() => {
      result.current.open({ top: 0, left: 0 });
      result.current.search('');
    });

    expect(result.current.getSelected()?.label).toBe('Alice');

    act(() => {
      result.current.selectNext();
    });

    expect(result.current.getSelected()?.label).toBe('Bob');
  });

  it('close resets state', () => {
    const fetchItems = vi.fn(() => mockItems);
    const { result } = renderHook(() => useMentions(fetchItems));

    act(() => {
      result.current.open({ top: 50, left: 100 });
      result.current.search('test');
    });

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.items).toHaveLength(0);
    expect(result.current.selectedIndex).toBe(0);
    expect(result.current.loading).toBe(false);
  });
});
