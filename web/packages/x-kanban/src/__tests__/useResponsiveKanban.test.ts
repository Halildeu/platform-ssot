// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResponsiveKanban } from '../useResponsiveKanban';

/* ------------------------------------------------------------------ */
/*  ResizeObserver mock                                                */
/* ------------------------------------------------------------------ */

type ResizeCallback = (entries: Array<{ contentRect: { width: number; height: number } }>) => void;

let resizeCallback: ResizeCallback | null = null;

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockResizeObserver {
  constructor(cb: ResizeCallback) {
    resizeCallback = cb;
  }
  observe = mockObserve;
  unobserve = vi.fn();
  disconnect = mockDisconnect;
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  resizeCallback = null;
  mockObserve.mockClear();
  mockDisconnect.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function createMockContainer(width: number): React.RefObject<HTMLElement> {
  const el = document.createElement('div');
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    width,
    height: 800,
    top: 0,
    left: 0,
    bottom: 800,
    right: width,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return { current: el };
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('useResponsiveKanban', () => {
  it('returns 1 visible column for mobile (< 480px)', () => {
    const ref = createMockContainer(375);
    const { result } = renderHook(() => useResponsiveKanban(ref));

    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.visibleColumns).toBe(1);
    expect(result.current.isMobile).toBe(true);
  });

  it('returns 2 visible columns for tablet (480-1024px)', () => {
    const ref = createMockContainer(768);
    const { result } = renderHook(() => useResponsiveKanban(ref));

    expect(result.current.breakpoint).toBe('tablet');
    expect(result.current.visibleColumns).toBe(2);
    expect(result.current.isMobile).toBe(false);
  });

  it('shows all columns on desktop', () => {
    const ref = createMockContainer(1440);
    const { result } = renderHook(() =>
      useResponsiveKanban(ref, { totalColumns: 5 }),
    );

    expect(result.current.breakpoint).toBe('desktop');
    expect(result.current.visibleColumns).toBe(5);
    expect(result.current.isMobile).toBe(false);
  });

  it('caps visible columns at totalColumns for tablet', () => {
    const ref = createMockContainer(768);
    const { result } = renderHook(() =>
      useResponsiveKanban(ref, { totalColumns: 1 }),
    );

    // tablet default is 2, but only 1 column exists
    expect(result.current.visibleColumns).toBe(1);
  });

  it('returns a reasonable columnWidth', () => {
    const ref = createMockContainer(768);
    const { result } = renderHook(() => useResponsiveKanban(ref));

    expect(result.current.columnWidth).toBeGreaterThanOrEqual(200);
    expect(result.current.columnWidth).toBeLessThanOrEqual(768);
  });

  it('columnWidth respects minimum of 200px', () => {
    const ref = createMockContainer(300);
    const { result } = renderHook(() => useResponsiveKanban(ref));

    expect(result.current.columnWidth).toBeGreaterThanOrEqual(200);
  });

  it('updates on resize from desktop to mobile', () => {
    const ref = createMockContainer(1440);
    const { result } = renderHook(() =>
      useResponsiveKanban(ref, { totalColumns: 5 }),
    );
    expect(result.current.visibleColumns).toBe(5);

    act(() => {
      resizeCallback?.([{ contentRect: { width: 375, height: 800 } }]);
    });

    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.visibleColumns).toBe(1);
    expect(result.current.isMobile).toBe(true);
  });

  it('handles null ref', () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    const { result } = renderHook(() => useResponsiveKanban(ref));
    // Falls back to desktop default
    expect(result.current.breakpoint).toBe('desktop');
  });

  it('disconnects observer on unmount', () => {
    const ref = createMockContainer(1024);
    const { unmount } = renderHook(() => useResponsiveKanban(ref));
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
