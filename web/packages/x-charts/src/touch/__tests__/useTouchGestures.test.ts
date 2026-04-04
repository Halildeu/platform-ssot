/**
 * Contract Test: useTouchGestures
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTouchGestures } from "../useTouchGestures";

function makeTouchEvent(
  touches: Array<{ clientX: number; clientY: number }>,
  changedTouches?: Array<{ clientX: number; clientY: number }>,
): React.TouchEvent {
  return {
    touches: touches as unknown as React.TouchList,
    changedTouches: (changedTouches ?? touches) as unknown as React.TouchList,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.TouchEvent;
}

describe("useTouchGestures", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts with clean state", () => {
    const { result } = renderHook(() => useTouchGestures());
    expect(result.current.state.isPinching).toBe(false);
    expect(result.current.state.isLongPressing).toBe(false);
    expect(result.current.state.longPressPosition).toBeNull();
  });

  it("detects pinch zoom start with two fingers", () => {
    const onZoomChange = vi.fn();
    const { result } = renderHook(() =>
      useTouchGestures({ onZoomChange, zoomLevel: 1 }),
    );

    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 },
        ]),
      );
    });

    expect(result.current.state.isPinching).toBe(true);
  });

  it("computes pinch zoom scale", () => {
    const onZoomChange = vi.fn();
    const { result } = renderHook(() =>
      useTouchGestures({ onZoomChange, zoomLevel: 1 }),
    );

    // Start pinch
    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 },
        ]),
      );
    });

    // Move fingers apart (zoom in)
    act(() => {
      result.current.handlers.onTouchMove(
        makeTouchEvent([
          { clientX: 50, clientY: 100 },
          { clientX: 250, clientY: 100 },
        ]),
      );
    });

    expect(onZoomChange).toHaveBeenCalled();
    const newZoom = onZoomChange.mock.calls[0][0];
    expect(newZoom).toBeGreaterThan(1);
  });

  it("triggers long-press after delay", () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() =>
      useTouchGestures({ onLongPress, longPressMs: 500 }),
    );

    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([{ clientX: 150, clientY: 200 }]),
      );
    });

    // Before delay
    expect(result.current.state.isLongPressing).toBe(false);

    // After delay
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.state.isLongPressing).toBe(true);
    expect(onLongPress).toHaveBeenCalledWith({ x: 150, y: 200 });
  });

  it("cancels long-press on finger move", () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() =>
      useTouchGestures({ onLongPress, longPressMs: 500 }),
    );

    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([{ clientX: 150, clientY: 200 }]),
      );
    });

    // Move finger beyond threshold
    act(() => {
      result.current.handlers.onTouchMove(
        makeTouchEvent([{ clientX: 200, clientY: 250 }]),
      );
    });

    act(() => vi.advanceTimersByTime(500));

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it("detects swipe left", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useTouchGestures({ onSwipe }));

    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([{ clientX: 200, clientY: 100 }]),
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd(
        makeTouchEvent(
          [],
          [{ clientX: 100, clientY: 100 }],
        ),
      );
    });

    expect(onSwipe).toHaveBeenCalledWith("left");
  });

  it("detects swipe right", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useTouchGestures({ onSwipe }));

    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([{ clientX: 100, clientY: 100 }]),
      );
    });

    act(() => {
      result.current.handlers.onTouchEnd(
        makeTouchEvent(
          [],
          [{ clientX: 250, clientY: 100 }],
        ),
      );
    });

    expect(onSwipe).toHaveBeenCalledWith("right");
  });

  it("respects zoom bounds", () => {
    const onZoomChange = vi.fn();
    const { result } = renderHook(() =>
      useTouchGestures({ onZoomChange, zoomLevel: 9, maxZoom: 10 }),
    );

    // Start pinch
    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 },
        ]),
      );
    });

    // Extreme zoom-in attempt
    act(() => {
      result.current.handlers.onTouchMove(
        makeTouchEvent([
          { clientX: 0, clientY: 100 },
          { clientX: 500, clientY: 100 },
        ]),
      );
    });

    if (onZoomChange.mock.calls.length > 0) {
      expect(onZoomChange.mock.calls[0][0]).toBeLessThanOrEqual(10);
    }
  });

  it("touchCancel cleans up state", () => {
    const { result } = renderHook(() => useTouchGestures());

    act(() => {
      result.current.handlers.onTouchStart(
        makeTouchEvent([
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 },
        ]),
      );
    });

    expect(result.current.state.isPinching).toBe(true);

    act(() => {
      result.current.handlers.onTouchCancel();
    });

    expect(result.current.state.isPinching).toBe(false);
  });
});
