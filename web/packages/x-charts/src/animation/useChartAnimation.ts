/**
 * useChartAnimation — ECharts animation config from ChartSpec
 *
 * Reads animation spec + reduced motion preference.
 * Returns an ECharts option fragment for animation settings.
 *
 * @see feature_execution_contract (P2 DoD #11, #12)
 */
import { useMemo } from "react";
import { useReducedMotion } from "../a11y/useReducedMotion";

export interface ChartAnimationConfig {
  enabled?: boolean;
  durationMs?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "spring";
  staggerMs?: number;
  updateTransitionMs?: number;
}

export interface AnimationOptionFragment {
  animation: boolean;
  animationDuration: number;
  animationEasing: string;
  animationDelay?: (idx: number) => number;
  animationDurationUpdate: number;
  animationEasingUpdate: string;
}

const EASING_MAP: Record<string, string> = {
  "linear": "linear",
  "ease-in": "cubicIn",
  "ease-out": "cubicOut",
  "ease-in-out": "cubicInOut",
  "spring": "elasticOut",
};

/**
 * Computes ECharts animation option fragment from ChartSpec animation config.
 * Respects prefers-reduced-motion automatically.
 */
export function useChartAnimation(
  config: ChartAnimationConfig = {},
): AnimationOptionFragment {
  const reducedMotion = useReducedMotion();

  return useMemo(() => {
    const {
      enabled = true,
      durationMs = 500,
      easing = "ease-out",
      staggerMs = 0,
      updateTransitionMs = 300,
    } = config;

    const shouldAnimate = enabled && !reducedMotion;
    const ecEasing = EASING_MAP[easing] ?? "cubicOut";

    const fragment: AnimationOptionFragment = {
      animation: shouldAnimate,
      animationDuration: shouldAnimate ? durationMs : 0,
      animationEasing: ecEasing,
      animationDurationUpdate: shouldAnimate ? updateTransitionMs : 0,
      animationEasingUpdate: ecEasing,
    };

    // Stagger: index-based delay for series items
    if (shouldAnimate && staggerMs > 0) {
      fragment.animationDelay = (idx: number) => idx * staggerMs;
    }

    return fragment;
  }, [config, reducedMotion]);
}
