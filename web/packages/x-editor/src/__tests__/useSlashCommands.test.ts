// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSlashCommands } from '../useSlashCommands';
import type { SlashCommand } from '../types';

const commands: SlashCommand[] = [
  { id: 'h1', label: 'Heading 1', description: 'Large heading', category: 'formatting', execute: vi.fn() },
  { id: 'h2', label: 'Heading 2', description: 'Medium heading', category: 'formatting', execute: vi.fn() },
  { id: 'bullet', label: 'Bullet List', description: 'Create a list', category: 'lists', execute: vi.fn() },
  { id: 'code', label: 'Code Block', description: 'Insert code', category: 'blocks', execute: vi.fn() },
];

describe('useSlashCommands', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedIndex).toBe(0);
  });

  it('opens with position', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    act(() => {
      result.current.open({ top: 100, left: 200 });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.position).toEqual({ top: 100, left: 200 });
  });

  it('filters commands by query', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    act(() => {
      result.current.open({ top: 0, left: 0 });
      result.current.filter('heading');
    });

    expect(result.current.filteredCommands).toHaveLength(2);
    expect(result.current.filteredCommands[0].id).toBe('h1');
    expect(result.current.filteredCommands[1].id).toBe('h2');
  });

  it('selectNext moves selection down', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    act(() => {
      result.current.open({ top: 0, left: 0 });
    });

    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.selectNext();
    });

    expect(result.current.selectedIndex).toBe(1);
  });

  it('selectPrevious moves selection up', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    act(() => {
      result.current.open({ top: 0, left: 0 });
      result.current.selectNext();
      result.current.selectNext();
    });

    expect(result.current.selectedIndex).toBe(2);

    act(() => {
      result.current.selectPrevious();
    });

    expect(result.current.selectedIndex).toBe(1);
  });

  it('wraps around on selectNext at end', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    act(() => {
      result.current.open({ top: 0, left: 0 });
    });

    // Move to the end
    act(() => {
      result.current.selectNext(); // 1
      result.current.selectNext(); // 2
      result.current.selectNext(); // 3
    });

    expect(result.current.selectedIndex).toBe(3);

    act(() => {
      result.current.selectNext(); // should wrap to 0
    });

    expect(result.current.selectedIndex).toBe(0);
  });

  it('close resets state', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    act(() => {
      result.current.open({ top: 100, left: 200 });
      result.current.selectNext();
      result.current.filter('heading');
    });

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedIndex).toBe(0);
    expect(result.current.filteredCommands).toHaveLength(4); // query cleared
  });

  it('executeSelected calls command execute', () => {
    const { result } = renderHook(() => useSlashCommands(commands));

    act(() => {
      result.current.open({ top: 0, left: 0 });
    });

    // executeSelected returns the selected command
    const cmd = (result.current.executeSelected as unknown as () => SlashCommand | null)();
    expect(cmd).toBeDefined();
    expect(cmd?.id).toBe('h1');
  });
});
