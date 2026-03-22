// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

/* ------------------------------------------------------------------ */
/*  Imports under test                                                 */
/* ------------------------------------------------------------------ */

import { createLazyComponent } from '../LazyComponent';
import { VirtualList, VirtualListProps } from '../VirtualList';
import { useDeferredRender } from '../useDeferredRender';
import {
  useIntersectionObserver,
  RenderWhenVisible,
} from '../useIntersectionObserver';
import {
  getComponentSizes,
  getBundleReport,
  ComponentSizeInfo,
  BundleReport,
} from '../BundleAnalyzer';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/* ================================================================== */
/*  VirtualList                                                        */
/* ================================================================== */

describe('VirtualList', () => {
  const makeItems = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: i, label: `Item ${i}` }));

  const defaultRender = (
    item: { id: number; label: string },
    index: number,
    style: React.CSSProperties,
  ) => (
    <div style={style} data-testid={`item-${index}`}>
      {item.label}
    </div>
  );

  it('renders only visible items plus overscan', () => {
    const items = makeItems(100);
    // itemHeight=40, containerHeight=200 => 5 visible + 5 overscan below = 10
    render(
      <VirtualList
        items={items}
        itemHeight={40}
        containerHeight={200}
        renderItem={defaultRender}
        overscan={5}
      />,
    );

    // Items 0-9 should be rendered (5 visible + 5 overscan)
    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId(`item-${i}`)).toBeInTheDocument();
    }
    // Item 10 should NOT be rendered
    expect(screen.queryByTestId('item-10')).not.toBeInTheDocument();
  });

  it('does not render items far outside viewport', () => {
    const items = makeItems(1000);
    render(
      <VirtualList
        items={items}
        itemHeight={50}
        containerHeight={300}
        renderItem={defaultRender}
        overscan={3}
      />,
    );

    // Item 50 should NOT be in DOM
    expect(screen.queryByTestId('item-50')).not.toBeInTheDocument();
  });

  it('uses role="listbox" with aria-label', () => {
    render(
      <VirtualList
        items={makeItems(10)}
        itemHeight={40}
        containerHeight={200}
        renderItem={defaultRender}
        aria-label="My list"
      />,
    );
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-label', 'My list');
  });

  it('renders role="option" for each visible item', () => {
    render(
      <VirtualList
        items={makeItems(5)}
        itemHeight={40}
        containerHeight={400}
        renderItem={defaultRender}
        overscan={0}
      />,
    );
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(5);
  });

  it('applies data-component attribute', () => {
    const { container } = render(
      <VirtualList
        items={makeItems(3)}
        itemHeight={40}
        containerHeight={200}
        renderItem={defaultRender}
      />,
    );
    expect(
      container.querySelector('[data-component="virtual-list"]'),
    ).toBeInTheDocument();
  });

  it('handles variable item heights', () => {
    const items = makeItems(20);
    const variableHeight = (index: number) => (index % 2 === 0 ? 40 : 60);

    render(
      <VirtualList
        items={items}
        itemHeight={variableHeight}
        containerHeight={200}
        renderItem={defaultRender}
        overscan={2}
      />,
    );

    // Should render at least a few items
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    const { container } = render(
      <VirtualList
        items={[]}
        itemHeight={40}
        containerHeight={200}
        renderItem={defaultRender}
      />,
    );
    const listbox = container.querySelector('[data-component="virtual-list"]');
    expect(listbox).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('calls onEndReached when scrolled to bottom', () => {
    const onEndReached = vi.fn();
    const items = makeItems(100);

    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        containerHeight={200}
        renderItem={defaultRender}
        onEndReached={onEndReached}
        endReachedThreshold={100}
      />,
    );

    const scrollable = container.querySelector(
      '[data-component="virtual-list"]',
    )!;

    // Mock scroll properties
    Object.defineProperty(scrollable, 'scrollHeight', { value: 4000 });
    Object.defineProperty(scrollable, 'clientHeight', { value: 200 });

    // Scroll near bottom
    fireEvent.scroll(scrollable, {
      target: { scrollTop: 3750 },
    });

    expect(onEndReached).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard ArrowDown navigation', () => {
    const items = makeItems(10);
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        containerHeight={400}
        renderItem={defaultRender}
        overscan={0}
      />,
    );

    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });

    // After two ArrowDown presses, index 1 should be focused (aria-selected)
    const options = screen.getAllByRole('option');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('handles keyboard ArrowUp navigation', () => {
    const items = makeItems(10);
    render(
      <VirtualList
        items={items}
        itemHeight={40}
        containerHeight={400}
        renderItem={defaultRender}
        overscan={0}
      />,
    );

    const listbox = screen.getByRole('listbox');
    // Press down twice, then up once -> should be at index 0
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    fireEvent.keyDown(listbox, { key: 'ArrowUp' });

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('does not go below index 0 on ArrowUp', () => {
    render(
      <VirtualList
        items={makeItems(5)}
        itemHeight={40}
        containerHeight={200}
        renderItem={defaultRender}
        overscan={0}
      />,
    );

    const listbox = screen.getByRole('listbox');
    // ArrowUp from initial state (-1) should clamp to 0
    fireEvent.keyDown(listbox, { key: 'ArrowUp' });

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('sets container height via style', () => {
    const { container } = render(
      <VirtualList
        items={makeItems(5)}
        itemHeight={40}
        containerHeight={300}
        renderItem={defaultRender}
      />,
    );

    const el = container.querySelector(
      '[data-component="virtual-list"]',
    ) as HTMLElement;
    expect(el.style.height).toBe('300px');
  });
});

/* ================================================================== */
/*  createLazyComponent                                                */
/* ================================================================== */

describe('createLazyComponent', () => {
  it('shows fallback then resolves the component', async () => {
    const Greeting: React.FC<{ name: string }> = ({ name }) => (
      <div>Hello {name}</div>
    );

    const LazyGreeting = createLazyComponent<{ name: string }>(
      () => Promise.resolve({ default: Greeting }),
      'LazyGreeting',
    );

    render(
      <LazyGreeting
        name="World"
        fallback={<div data-testid="loader">Loading...</div>}
      />,
    );

    // Fallback should show initially
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Component should render after promise resolves
    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  it('shows default skeleton when no fallback is provided', async () => {
    const Comp: React.FC = () => <div>Loaded</div>;
    const LazyComp = createLazyComponent(
      () => Promise.resolve({ default: Comp as any }),
    );

    const { container } = render(<LazyComp />);

    // Default skeleton should have data-component attribute
    const skeleton = container.querySelector('[data-component="lazy-skeleton"]');
    expect(skeleton).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
  });

  it('shows error fallback when import fails', async () => {
    const LazyBroken = createLazyComponent(
      () => Promise.reject(new Error('chunk failed')),
      'LazyBroken',
    );

    // Suppress console.error from error boundary
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <LazyBroken
        errorFallback={<div data-testid="err">Oops</div>}
        fallback={<div>Loading</div>}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('err')).toBeInTheDocument();
    });

    spy.mockRestore();
  });

  it('shows default error UI when no errorFallback provided', async () => {
    const LazyBroken = createLazyComponent(
      () => Promise.reject(new Error('fail')),
    );

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<LazyBroken fallback={<div>Loading</div>} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText('Component failed to load.'),
      ).toBeInTheDocument();
    });

    spy.mockRestore();
  });

  it('sets displayName on the wrapper', () => {
    const Comp: React.FC = () => <div />;
    const Lazy = createLazyComponent(
      () => Promise.resolve({ default: Comp as any }),
      'MyLazy',
    );
    expect(Lazy.displayName).toBe('MyLazy');
  });
});

/* ================================================================== */
/*  useDeferredRender                                                  */
/* ================================================================== */

describe('useDeferredRender', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false on initial render', () => {
    let value: boolean | undefined;
    const Probe: React.FC = () => {
      value = useDeferredRender();
      return null;
    };
    render(<Probe />);
    // Before rAF fires, should be false
    expect(value).toBe(false);
  });

  it('returns true after rAF', async () => {
    let value: boolean | undefined;
    const Probe: React.FC = () => {
      value = useDeferredRender();
      return <div>{value ? 'ready' : 'waiting'}</div>;
    };

    // Use real timers for this test since rAF mock is tricky
    vi.useRealTimers();
    render(<Probe />);

    await waitFor(() => {
      expect(value).toBe(true);
    });
  });

  it('respects delay parameter', async () => {
    let value: boolean | undefined;
    const Probe: React.FC = () => {
      value = useDeferredRender(100);
      return null;
    };

    vi.useRealTimers();
    render(<Probe />);
    expect(value).toBe(false);

    await waitFor(
      () => {
        expect(value).toBe(true);
      },
      { timeout: 500 },
    );
  });
});

/* ================================================================== */
/*  useIntersectionObserver & RenderWhenVisible                        */
/* ================================================================== */

describe('useIntersectionObserver', () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    // Use a real class so `new IntersectionObserver(...)` works with Vite 8 Rolldown
    (globalThis as any).IntersectionObserver = class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
    };
  });

  afterEach(() => {
    delete (globalThis as any).IntersectionObserver;
  });

  it('returns isVisible=false initially', () => {
    let result: { isVisible: boolean; hasBeenVisible: boolean } | undefined;
    const Probe: React.FC = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      result = useIntersectionObserver(ref);
      return <div ref={ref} />;
    };
    render(<Probe />);
    expect(result!.isVisible).toBe(false);
    expect(result!.hasBeenVisible).toBe(false);
  });

  it('sets isVisible=true when intersection fires', () => {
    let result: { isVisible: boolean; hasBeenVisible: boolean } | undefined;
    const Probe: React.FC = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      result = useIntersectionObserver(ref);
      return <div ref={ref} />;
    };
    render(<Probe />);

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(result!.isVisible).toBe(true);
    expect(result!.hasBeenVisible).toBe(true);
  });

  it('hasBeenVisible stays true after leaving viewport', () => {
    let result: { isVisible: boolean; hasBeenVisible: boolean } | undefined;
    const Probe: React.FC = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      result = useIntersectionObserver(ref);
      return <div ref={ref} />;
    };
    render(<Probe />);

    // Enter viewport
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    // Leave viewport
    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(result!.isVisible).toBe(false);
    expect(result!.hasBeenVisible).toBe(true);
  });

  it('disconnects observer on unmount', () => {
    const Probe: React.FC = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      useIntersectionObserver(ref);
      return <div ref={ref} />;
    };
    const { unmount } = render(<Probe />);
    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });
});

describe('RenderWhenVisible', () => {
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    (globalThis as any).IntersectionObserver = class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
    };
  });

  afterEach(() => {
    delete (globalThis as any).IntersectionObserver;
  });

  it('renders fallback before element is visible', () => {
    render(
      <RenderWhenVisible fallback={<div data-testid="fb">Loading</div>}>
        <div data-testid="content">Heavy content</div>
      </RenderWhenVisible>,
    );
    expect(screen.getByTestId('fb')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('renders children after element becomes visible', () => {
    render(
      <RenderWhenVisible fallback={<div data-testid="fb">Loading</div>}>
        <div data-testid="content">Heavy content</div>
      </RenderWhenVisible>,
    );

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('fb')).not.toBeInTheDocument();
  });

  it('keeps children rendered after leaving viewport', () => {
    render(
      <RenderWhenVisible>
        <div data-testid="content">Sticky</div>
      </RenderWhenVisible>,
    );

    // Enter
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    // Leave
    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    // Should still be there (hasBeenVisible is sticky)
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies data-component attribute', () => {
    const { container } = render(
      <RenderWhenVisible>
        <div>Child</div>
      </RenderWhenVisible>,
    );
    expect(
      container.querySelector('[data-component="render-when-visible"]'),
    ).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  BundleAnalyzer                                                     */
/* ================================================================== */

describe('BundleAnalyzer', () => {
  describe('getComponentSizes', () => {
    it('returns a non-empty array', () => {
      const sizes = getComponentSizes();
      expect(sizes.length).toBeGreaterThan(0);
    });

    it('every entry has required fields', () => {
      const sizes = getComponentSizes();
      for (const entry of sizes) {
        expect(entry.name).toBeTruthy();
        expect(typeof entry.estimatedKB).toBe('number');
        expect(entry.estimatedKB).toBeGreaterThan(0);
        expect(['lightweight', 'medium', 'heavy']).toContain(entry.category);
        expect(typeof entry.lazyRecommended).toBe('boolean');
        expect(Array.isArray(entry.dependencies)).toBe(true);
      }
    });

    it('returns a copy (not the same reference)', () => {
      const a = getComponentSizes();
      const b = getComponentSizes();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });

    it('heavy components are recommended for lazy loading', () => {
      const sizes = getComponentSizes();
      const heavy = sizes.filter((s) => s.category === 'heavy');
      expect(heavy.length).toBeGreaterThan(0);
      for (const h of heavy) {
        expect(h.lazyRecommended).toBe(true);
      }
    });

    it('AG Grid has ag-grid dependencies listed', () => {
      const sizes = getComponentSizes();
      const agGrid = sizes.find((s) => s.name.includes('AG Grid'));
      expect(agGrid).toBeDefined();
      expect(agGrid!.dependencies).toContain('ag-grid-community');
    });
  });

  describe('getBundleReport', () => {
    it('returns correct structure', () => {
      const report = getBundleReport();
      expect(typeof report.totalComponents).toBe('number');
      expect(typeof report.lightweightCount).toBe('number');
      expect(typeof report.mediumCount).toBe('number');
      expect(typeof report.heavyCount).toBe('number');
      expect(typeof report.lazyRecommendedCount).toBe('number');
      expect(typeof report.estimatedTotalKB).toBe('number');
    });

    it('counts sum to total', () => {
      const report = getBundleReport();
      expect(
        report.lightweightCount + report.mediumCount + report.heavyCount,
      ).toBe(report.totalComponents);
    });

    it('has positive estimated total KB', () => {
      const report = getBundleReport();
      expect(report.estimatedTotalKB).toBeGreaterThan(0);
    });

    it('lazyRecommendedCount matches filtered sizes', () => {
      const report = getBundleReport();
      const sizes = getComponentSizes();
      const lazyCount = sizes.filter((s) => s.lazyRecommended).length;
      expect(report.lazyRecommendedCount).toBe(lazyCount);
    });
  });
});
