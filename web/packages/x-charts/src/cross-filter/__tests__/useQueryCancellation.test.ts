/**
 * Contract Test: useQueryCancellation
 *
 * Tests AbortController lifecycle and pending query tracking.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { CrossFilterProvider } from "../useCrossFilterStore";
import { useQueryCancellation } from "../useQueryCancellation";
import { createCrossFilterStore } from "../createCrossFilterStore";
import type { CrossFilterStoreApi } from "../createCrossFilterStore";

function createWrapper(store: CrossFilterStoreApi) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      CrossFilterProvider,
      { store },
      children,
    );
  };
}

describe("useQueryCancellation", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("getSignal returns an AbortSignal", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(() => useQueryCancellation(), {
      wrapper: createWrapper(store),
    });

    let signal: AbortSignal;
    act(() => {
      signal = result.current.getSignal();
    });
    expect(signal!).toBeDefined();
    expect(signal!.aborted).toBe(false);
  });

  it("cancel aborts the current signal", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(() => useQueryCancellation(), {
      wrapper: createWrapper(store),
    });

    let signal: AbortSignal;
    act(() => {
      signal = result.current.getSignal();
    });

    act(() => {
      result.current.cancel();
    });

    expect(signal!.aborted).toBe(true);
  });

  it("getSignal aborts previous signal on rapid re-call", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(() => useQueryCancellation(), {
      wrapper: createWrapper(store),
    });

    let signal1: AbortSignal;
    let signal2: AbortSignal;

    act(() => {
      signal1 = result.current.getSignal();
    });
    act(() => {
      signal2 = result.current.getSignal();
    });

    expect(signal1!.aborted).toBe(true);
    expect(signal2!.aborted).toBe(false);
  });

  it("cancel is safe to call multiple times", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(() => useQueryCancellation(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.getSignal();
    });

    // Should not throw
    act(() => {
      result.current.cancel();
      result.current.cancel();
      result.current.cancel();
    });
  });
});
