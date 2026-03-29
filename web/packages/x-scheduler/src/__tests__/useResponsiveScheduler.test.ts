// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResponsiveScheduler } from '../useResponsiveScheduler';

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
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
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

describe('useResponsiveScheduler', () => {
  it('returns agenda view for mobile (< 480px)', () => {
    const ref = createMockContainer(375);
    const { result } = renderHook(() => useResponsiveScheduler(ref));

    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.recommendedView).toBe('agenda');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('returns day view for tablet (480-1024px)', () => {
    const ref = createMockContainer(768);
    const { result } = renderHook(() => useResponsiveScheduler(ref));

    expect(result.current.breakpoint).toBe('tablet');
    expect(result.current.recommendedView).toBe('day');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('returns week view for desktop (> 1024px)', () => {
    const ref = createMockContainer(1440);
    const { result } = renderHook(() => useResponsiveScheduler(ref));

    expect(result.current.breakpoint).toBe('desktop');
    expect(result.current.recommendedView).toBe('week');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('transitions from desktop to mobile on resize', () => {
    const ref = createMockContainer(1440);
    const { result } = renderHook(() => useResponsiveScheduler(ref));
    expect(result.current.isDesktop).toBe(true);

    act(() => {
      resizeCallback?.([{ contentRect: { width: 320, height: 600 } }]);
    });

    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.recommendedView).toBe('agenda');
    expect(result.current.isMobile).toBe(true);
  });

  it('handles null ref', () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    const { result } = renderHook(() => useResponsiveScheduler(ref));
    // Falls back to desktop default
    expect(result.current.breakpoint).toBe('desktop');
    expect(result.current.recommendedView).toBe('week');
  });

  it('disconnects observer on unmount', () => {
    const ref = createMockContainer(1024);
    const { unmount } = renderHook(() => useResponsiveScheduler(ref));
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
