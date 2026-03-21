import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChartInteractions } from "../useChartInteractions";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Synthesise a minimal React.WheelEvent for the hook handler. */
function fakeWheel(deltaY: number): React.WheelEvent {
  return {
    deltaY,
    preventDefault: vi.fn(),
  } as unknown as React.WheelEvent;
}

function fakeMouseEvent(
  x: number,
  y: number,
  rectLeft = 0,
  rectTop = 0,
): React.MouseEvent {
  return {
    clientX: x + rectLeft,
    clientY: y + rectTop,
    currentTarget: {
      getBoundingClientRect: () => ({ left: rectLeft, top: rectTop }),
    },
  } as unknown as React.MouseEvent;
}

/* ================================================================== */
/*  Tests                                                              */
/* ================================================================== */

describe("useChartInteractions", () => {
  /* ---- default state ---- */

  it("returns sensible defaults when no options are provided", () => {
    const { result } = renderHook(() => useChartInteractions());
    const [state] = result.current;

    expect(state.zoomLevel).toBe(1);
    expect(state.isPanning).toBe(false);
    expect(state.panOffset).toEqual({ x: 0, y: 0 });
    expect(state.brushRange).toBeNull();
    expect(state.isBrushing).toBe(false);
    expect(state.crosshairPosition).toBeNull();
  });

  /* ---- zoom ---- */

  describe("zoom", () => {
    it("zoomIn increases zoom level", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableZoom: true }),
      );

      act(() => result.current[0].zoomIn());
      expect(result.current[0].zoomLevel).toBeGreaterThan(1);
    });

    it("zoomOut decreases zoom level but not below minZoom", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableZoom: true, minZoom: 1 }),
      );

      // Zoom in first
      act(() => result.current[0].zoomIn());
      act(() => result.current[0].zoomIn());
      const after2 = result.current[0].zoomLevel;

      act(() => result.current[0].zoomOut());
      expect(result.current[0].zoomLevel).toBeLessThan(after2);

      // Hammer zoom out — should clamp at 1
      for (let i = 0; i < 20; i++) act(() => result.current[0].zoomOut());
      expect(result.current[0].zoomLevel).toBeGreaterThanOrEqual(1);
    });

    it("resetZoom resets to 1 and clears pan", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableZoom: true }),
      );

      act(() => result.current[0].zoomIn());
      act(() => result.current[0].zoomIn());
      expect(result.current[0].zoomLevel).toBeGreaterThan(1);

      act(() => result.current[0].resetZoom());
      expect(result.current[0].zoomLevel).toBe(1);
      expect(result.current[0].panOffset).toEqual({ x: 0, y: 0 });
    });

    it("mouse wheel zooms when enableZoom is true", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableZoom: true }),
      );

      // Scroll up → zoom in
      act(() => result.current[1].onWheel(fakeWheel(-100)));
      expect(result.current[0].zoomLevel).toBeGreaterThan(1);

      // Scroll down → zoom out
      const prev = result.current[0].zoomLevel;
      act(() => result.current[1].onWheel(fakeWheel(100)));
      expect(result.current[0].zoomLevel).toBeLessThan(prev);
    });

    it("mouse wheel does nothing when enableZoom is false", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableZoom: false }),
      );

      act(() => result.current[1].onWheel(fakeWheel(-100)));
      expect(result.current[0].zoomLevel).toBe(1);
    });

    it("zoom respects maxZoom", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableZoom: true, maxZoom: 2 }),
      );

      for (let i = 0; i < 50; i++) act(() => result.current[0].zoomIn());
      expect(result.current[0].zoomLevel).toBeLessThanOrEqual(2);
    });
  });

  /* ---- brush ---- */

  describe("brush", () => {
    it("brush drag sets brushRange", () => {
      const onBrushEnd = vi.fn();
      const { result } = renderHook(() =>
        useChartInteractions({ enableBrush: true, onBrushEnd }),
      );

      // mousedown at x=50
      act(() => result.current[1].onMouseDown(fakeMouseEvent(50, 10)));
      expect(result.current[0].isBrushing).toBe(true);

      // mousemove to x=200
      act(() => result.current[1].onMouseMove(fakeMouseEvent(200, 10)));
      expect(result.current[0].brushRange).toEqual({ start: 50, end: 200 });

      // mouseup
      act(() => result.current[1].onMouseUp(fakeMouseEvent(200, 10)));
      expect(result.current[0].isBrushing).toBe(false);
      expect(onBrushEnd).toHaveBeenCalledWith({ start: 50, end: 200 });
    });

    it("clearBrush resets brush state", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableBrush: true }),
      );

      act(() => result.current[1].onMouseDown(fakeMouseEvent(10, 10)));
      act(() => result.current[1].onMouseMove(fakeMouseEvent(100, 10)));
      act(() => result.current[1].onMouseUp(fakeMouseEvent(100, 10)));
      expect(result.current[0].brushRange).not.toBeNull();

      act(() => result.current[0].clearBrush());
      expect(result.current[0].brushRange).toBeNull();
      expect(result.current[0].isBrushing).toBe(false);
    });
  });

  /* ---- crosshair ---- */

  describe("crosshair", () => {
    it("tracks mouse position when enableCrosshair is true", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableCrosshair: true }),
      );

      act(() => result.current[1].onMouseMove(fakeMouseEvent(123, 45)));
      expect(result.current[0].crosshairPosition).toEqual({ x: 123, y: 45 });
    });

    it("clears crosshair on mouse leave", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableCrosshair: true }),
      );

      act(() => result.current[1].onMouseMove(fakeMouseEvent(10, 10)));
      expect(result.current[0].crosshairPosition).not.toBeNull();

      act(() => result.current[1].onMouseLeave(fakeMouseEvent(0, 0)));
      expect(result.current[0].crosshairPosition).toBeNull();
    });

    it("does not track when enableCrosshair is false", () => {
      const { result } = renderHook(() =>
        useChartInteractions({ enableCrosshair: false }),
      );

      act(() => result.current[1].onMouseMove(fakeMouseEvent(50, 50)));
      expect(result.current[0].crosshairPosition).toBeNull();
    });
  });

  /* ---- handlers shape ---- */

  it("returns all expected handler functions", () => {
    const { result } = renderHook(() => useChartInteractions());
    const [, handlers] = result.current;

    expect(typeof handlers.onWheel).toBe("function");
    expect(typeof handlers.onMouseDown).toBe("function");
    expect(typeof handlers.onMouseMove).toBe("function");
    expect(typeof handlers.onMouseUp).toBe("function");
    expect(typeof handlers.onMouseLeave).toBe("function");
  });
});
