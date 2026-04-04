/**
 * Contract Test: useChartAnimation
 */
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useChartAnimation } from "../useChartAnimation";

// Mock useReducedMotion
vi.mock("../../a11y/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

const { useReducedMotion } = await import("../../a11y/useReducedMotion");

describe("useChartAnimation", () => {
  it("returns animation enabled by default", () => {
    const { result } = renderHook(() => useChartAnimation());
    expect(result.current.animation).toBe(true);
    expect(result.current.animationDuration).toBe(500);
    expect(result.current.animationEasing).toBe("cubicOut");
  });

  it("maps easing values correctly", () => {
    const cases: [string, string][] = [
      ["linear", "linear"],
      ["ease-in", "cubicIn"],
      ["ease-out", "cubicOut"],
      ["ease-in-out", "cubicInOut"],
      ["spring", "elasticOut"],
    ];
    for (const [input, expected] of cases) {
      const { result } = renderHook(() =>
        useChartAnimation({ easing: input as "linear" }),
      );
      expect(result.current.animationEasing).toBe(expected);
    }
  });

  it("applies custom duration", () => {
    const { result } = renderHook(() =>
      useChartAnimation({ durationMs: 800 }),
    );
    expect(result.current.animationDuration).toBe(800);
  });

  it("generates stagger delay function", () => {
    const { result } = renderHook(() =>
      useChartAnimation({ staggerMs: 50 }),
    );
    expect(result.current.animationDelay).toBeDefined();
    expect(result.current.animationDelay!(0)).toBe(0);
    expect(result.current.animationDelay!(3)).toBe(150);
  });

  it("no stagger when staggerMs=0", () => {
    const { result } = renderHook(() => useChartAnimation({ staggerMs: 0 }));
    expect(result.current.animationDelay).toBeUndefined();
  });

  it("disables everything when enabled=false", () => {
    const { result } = renderHook(() =>
      useChartAnimation({ enabled: false }),
    );
    expect(result.current.animation).toBe(false);
    expect(result.current.animationDuration).toBe(0);
  });

  it("disables when reduced motion is preferred", () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { result } = renderHook(() => useChartAnimation());
    expect(result.current.animation).toBe(false);
    expect(result.current.animationDuration).toBe(0);
    expect(result.current.animationDelay).toBeUndefined();

    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  it("update transition uses separate duration", () => {
    const { result } = renderHook(() =>
      useChartAnimation({ updateTransitionMs: 200 }),
    );
    expect(result.current.animationDurationUpdate).toBe(200);
  });
});
