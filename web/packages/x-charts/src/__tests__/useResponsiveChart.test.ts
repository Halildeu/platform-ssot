// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useResponsiveBreakpoint,
  useResponsiveChartConfig,
  type Breakpoint,
} from '../useResponsiveChart';

/* ------------------------------------------------------------------ */
/*  ResizeObserver mock                                                */
/* ------------------------------------------------------------------ */

type ResizeCallback = (entries: Array<{ contentRect: { width: number; height: number } }>) => void;

let resizeCallback: ResizeCallback | null = null;
let observedElement: HTMLElement | null = null;

const mockObserve = vi.fn((el: HTMLElement) => {
  observedElement = el;
});
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
  observedElement = null;
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
    height: 400,
    top: 0,
    left: 0,
    bottom: 400,
    right: width,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return { current: el };
}

/* ------------------------------------------------------------------ */
/*  useResponsiveBreakpoint                                            */
/* ------------------------------------------------------------------ */

describe('useResponsiveBreakpoint', () => {
  it('returns "mobile" for containers < 480px', () => {
    const ref = createMockContainer(320);
    const { result } = renderHook(() => useResponsiveBreakpoint(ref));
    expect(result.current).toBe('mobile');
  });

  it('returns "tablet" for containers 480-1024px', () => {
    const ref = createMockContainer(768);
    const { result } = renderHook(() => useResponsiveBreakpoint(ref));
    expect(result.current).toBe('tablet');
  });

  it('returns "desktop" for containers > 1024px', () => {
    const ref = createMockContainer(1280);
    const { result } = renderHook(() => useResponsiveBreakpoint(ref));
    expect(result.current).toBe('desktop');
  });

  it('updates breakpoint on resize', () => {
    const ref = createMockContainer(1280);
    const { result } = renderHook(() => useResponsiveBreakpoint(ref));
    expect(result.current).toBe('desktop');

    // Simulate resize to mobile
    act(() => {
      resizeCallback?.([{ contentRect: { width: 320, height: 400 } }]);
    });
    expect(result.current).toBe('mobile');
  });

  it('observes the container element', () => {
    const ref = createMockContainer(1024);
    renderHook(() => useResponsiveBreakpoint(ref));
    expect(mockObserve).toHaveBeenCalledWith(ref.current);
  });

  it('disconnects observer on unmount', () => {
    const ref = createMockContainer(1024);
    const { unmount } = renderHook(() => useResponsiveBreakpoint(ref));
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('handles null ref gracefully', () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    const { result } = renderHook(() => useResponsiveBreakpoint(ref));
    // Falls back to default ('desktop')
    expect(result.current).toBe('desktop');
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('returns "tablet" at boundary 480px', () => {
    const ref = createMockContainer(480);
    const { result } = renderHook(() => useResponsiveBreakpoint(ref));
    expect(result.current).toBe('tablet');
  });

  it('returns "tablet" at boundary 1024px', () => {
    const ref = createMockContainer(1024);
    const { result } = renderHook(() => useResponsiveBreakpoint(ref));
    expect(result.current).toBe('tablet');
  });
});

/* ------------------------------------------------------------------ */
/*  useResponsiveChartConfig                                           */
/* ------------------------------------------------------------------ */

describe('useResponsiveChartConfig', () => {
  it('returns compact config for mobile', () => {
    const config = useResponsiveChartConfig('mobile');
    expect(config.fontSize).toBe(10);
    expect(config.showLegend).toBe(false);
    expect(config.legendPosition).toBe('none');
    expect(config.padding.top).toBe(8);
  });

  it('returns medium config for tablet', () => {
    const config = useResponsiveChartConfig('tablet');
    expect(config.fontSize).toBe(12);
    expect(config.showLegend).toBe(true);
    expect(config.legendPosition).toBe('bottom');
  });

  it('returns full config for desktop', () => {
    const config = useResponsiveChartConfig('desktop');
    expect(config.fontSize).toBe(14);
    expect(config.showLegend).toBe(true);
    expect(config.legendPosition).toBe('right');
    expect(config.elementScale).toBe(1);
    expect(config.tickDensity).toBe(1);
  });

  it('covers all breakpoints', () => {
    const breakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop'];
    for (const bp of breakpoints) {
      const config = useResponsiveChartConfig(bp);
      expect(config).toBeDefined();
      expect(config.fontSize).toBeGreaterThan(0);
    }
  });
});
