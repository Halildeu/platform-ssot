// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRovingTabindex } from '../roving-tabindex';

afterEach(() => {
  cleanup();
});

function TestToolbar({ itemCount = 4, direction = 'horizontal' as const, loop = true, disabledIndices, onActiveChange }: {
  itemCount?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  disabledIndices?: Set<number>;
  onActiveChange?: (index: number) => void;
}) {
  const roving = useRovingTabindex({ itemCount, direction, loop, disabledIndices, onActiveChange });
  return (
    <div role="toolbar" aria-label="Test toolbar">
      {Array.from({ length: itemCount }, (_, i) => (
        <button key={i} {...roving.getItemProps(i)} data-testid={`item-${i}`}>
          Item {i}
        </button>
      ))}
    </div>
  );
}

describe('useRovingTabindex', () => {
  it('first item has tabIndex=0, others have tabIndex=-1', () => {
    render(<TestToolbar />);
    expect(screen.getByTestId('item-0')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('item-1')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByTestId('item-2')).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight moves focus to next item', () => {
    render(<TestToolbar />);
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowRight' });
    expect(screen.getByTestId('item-1')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('item-0')).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowLeft moves focus to previous item', () => {
    render(<TestToolbar />);
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByTestId('item-1'), { key: 'ArrowLeft' });
    expect(screen.getByTestId('item-0')).toHaveAttribute('tabindex', '0');
  });

  it('wraps around with loop=true', () => {
    render(<TestToolbar itemCount={3} loop={true} />);
    // Move to last item
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByTestId('item-1'), { key: 'ArrowRight' });
    // Wrap around
    fireEvent.keyDown(screen.getByTestId('item-2'), { key: 'ArrowRight' });
    expect(screen.getByTestId('item-0')).toHaveAttribute('tabindex', '0');
  });

  it('does not wrap with loop=false', () => {
    render(<TestToolbar itemCount={3} loop={false} />);
    // Move to last
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByTestId('item-1'), { key: 'ArrowRight' });
    // Try to go past last
    fireEvent.keyDown(screen.getByTestId('item-2'), { key: 'ArrowRight' });
    expect(screen.getByTestId('item-2')).toHaveAttribute('tabindex', '0');
  });

  it('Home key moves to first item', () => {
    render(<TestToolbar />);
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByTestId('item-1'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByTestId('item-2'), { key: 'Home' });
    expect(screen.getByTestId('item-0')).toHaveAttribute('tabindex', '0');
  });

  it('End key moves to last item', () => {
    render(<TestToolbar />);
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'End' });
    expect(screen.getByTestId('item-3')).toHaveAttribute('tabindex', '0');
  });

  it('vertical direction responds to ArrowDown/ArrowUp', () => {
    render(<TestToolbar direction="vertical" />);
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowDown' });
    expect(screen.getByTestId('item-1')).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(screen.getByTestId('item-1'), { key: 'ArrowUp' });
    expect(screen.getByTestId('item-0')).toHaveAttribute('tabindex', '0');
  });

  it('calls onActiveChange when index changes', () => {
    const handler = vi.fn();
    render(<TestToolbar onActiveChange={handler} />);
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowRight' });
    expect(handler).toHaveBeenCalledWith(1);
  });

  it('skips disabled indices', () => {
    render(<TestToolbar disabledIndices={new Set([1])} />);
    fireEvent.keyDown(screen.getByTestId('item-0'), { key: 'ArrowRight' });
    expect(screen.getByTestId('item-2')).toHaveAttribute('tabindex', '0');
  });

  it('active item gets data-roving-active attribute', () => {
    render(<TestToolbar />);
    expect(screen.getByTestId('item-0')).toHaveAttribute('data-roving-active');
    expect(screen.getByTestId('item-1')).not.toHaveAttribute('data-roving-active');
  });

  it('focus handler updates active index', () => {
    render(<TestToolbar />);
    fireEvent.focus(screen.getByTestId('item-2'));
    expect(screen.getByTestId('item-2')).toHaveAttribute('tabindex', '0');
  });
});
