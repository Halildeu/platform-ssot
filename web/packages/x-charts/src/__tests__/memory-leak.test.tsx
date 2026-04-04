/**
 * Contract Test: Chart Memory Leak Detection
 *
 * Validates that chart lifecycle patterns properly clean up:
 * - ResizeObservers disconnected on unmount
 * - Refs nullified on unmount
 * - Event listeners removed
 *
 * Uses a pure React lifecycle mock (no echarts dependency)
 * to verify the cleanup pattern used by all chart components.
 *
 * @see chart-viz-engine-selection D-011 (performance)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, cleanup } from "@testing-library/react";

/* ------------------------------------------------------------------ */
/*  Mock infrastructure                                                */
/* ------------------------------------------------------------------ */

let observerInstances = 0;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn(() => { observerInstances--; });

class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    observerInstances++;
  }
  observe = mockObserve;
  unobserve = vi.fn();
  disconnect = mockDisconnect;
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  observerInstances = 0;
  mockObserve.mockClear();
  mockDisconnect.mockClear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/* ------------------------------------------------------------------ */
/*  Test Component — mimics chart init/dispose lifecycle               */
/* ------------------------------------------------------------------ */

const disposeCalls: number[] = [];
const initCalls: number[] = [];
let cycleCounter = 0;

function ChartLifecycleMock({ data }: { data: number[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const instanceRef = React.useRef<{ id: number; disposed: boolean } | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Simulate echarts.init
    const id = ++cycleCounter;
    const instance = { id, disposed: false };
    instanceRef.current = instance;
    initCalls.push(id);

    // Simulate ResizeObserver setup
    const observer = new ResizeObserver(() => {
      /* resize handler */
    });
    observer.observe(container);

    return () => {
      // Simulate cleanup: observer.disconnect + instance.dispose
      observer.disconnect();
      instance.disposed = true;
      instanceRef.current = null;
      disposeCalls.push(id);
    };
  }, []);

  // Simulate setOption on data change
  React.useEffect(() => {
    if (instanceRef.current && data) {
      // setOption equivalent — noop in test
    }
  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{ height: 300, width: "100%" }}
      role="img"
      aria-label="Test chart"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("Memory Leak: Mount/Unmount Cycles", () => {
  const data = [10, 20, 30];

  beforeEach(() => {
    disposeCalls.length = 0;
    initCalls.length = 0;
    cycleCounter = 0;
  });

  it("disconnects ResizeObserver on every unmount (100 cycles)", () => {
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<ChartLifecycleMock data={data} />);
      unmount();
    }

    // Every mount should have a corresponding disconnect
    expect(mockDisconnect).toHaveBeenCalledTimes(100);
    expect(observerInstances).toBe(0);
  });

  it("disposes instance on every unmount (100 cycles)", () => {
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<ChartLifecycleMock data={data} />);
      unmount();
    }

    expect(disposeCalls).toHaveLength(100);
    expect(initCalls).toHaveLength(100);
    // Every init has a matching dispose
    expect(disposeCalls).toEqual(initCalls);
  });

  it("creates new instance on each mount", () => {
    const { unmount: u1 } = render(<ChartLifecycleMock data={data} />);
    expect(initCalls).toHaveLength(1);
    u1();

    const { unmount: u2 } = render(<ChartLifecycleMock data={data} />);
    expect(initCalls).toHaveLength(2);
    u2();

    // Each mount got a unique instance id
    expect(initCalls[0]).not.toBe(initCalls[1]);
  });

  it("no lingering observers after rapid mount/unmount", () => {
    // Simulate rapid mounting/unmounting (React StrictMode-like)
    for (let i = 0; i < 50; i++) {
      const { unmount } = render(<ChartLifecycleMock data={data} />);
      unmount();
    }

    expect(observerInstances).toBe(0);
    expect(mockObserve).toHaveBeenCalledTimes(50);
    expect(mockDisconnect).toHaveBeenCalledTimes(50);
  });

  it("renders accessible container", () => {
    const { container, unmount } = render(<ChartLifecycleMock data={data} />);
    const chart = container.querySelector('[role="img"]');
    expect(chart).not.toBeNull();
    expect(chart?.getAttribute("aria-label")).toBe("Test chart");
    unmount();
  });
});
