/**
 * Inline ECharts Renderer for Design System Charts
 *
 * Lightweight hook that manages ECharts instance lifecycle.
 * Avoids circular dependency with @mfe/x-charts by importing
 * echarts directly (peerDep of design-system).
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart, LineChart, PieChart, ScatterChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  CanvasRenderer,
]);

type EChartsInstance = ReturnType<typeof echarts.init>;

export interface InlineEChartsOptions {
  option: Record<string, unknown>;
  theme?: Record<string, unknown>;
  onClick?: (params: unknown) => void;
}

export function useInlineECharts(options: InlineEChartsOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<EChartsInstance | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { option, theme, onClick } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const instance = echarts.init(el, theme, { renderer: 'canvas' });
    instanceRef.current = instance;
    setIsReady(true);

    if (onClick) instance.on('click', onClick);

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => instance.resize())
      : null;
    observer?.observe(el);

    return () => {
      observer?.disconnect();
      if (onClick) instance.off('click', onClick);
      instance.dispose();
      instanceRef.current = null;
      setIsReady(false);
    };
  }, [theme]);

  useEffect(() => {
    if (!instanceRef.current || !option || Object.keys(option).length === 0) return;
    instanceRef.current.setOption(option, { notMerge: false });
  }, [option]);

  const resize = useCallback(() => instanceRef.current?.resize(), []);

  return { containerRef, isReady, resize };
}

/** Build a minimal light theme from CSS vars. */
export function buildLightTheme(): Record<string, unknown> {
  const get = (v: string, fb: string) => {
    if (typeof document === 'undefined') return fb;
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fb;
  };
  return {
    color: [get('--action-primary', '#3b82f6'), get('--state-success-text', '#22c55e'), get('--state-warning-text', '#f59e0b'), get('--state-error-text', '#ef4444'), get('--state-info-text', '#06b6d4'), get('--action-secondary', '#8b5cf6'), '#ec4899', '#14b8a6'],
    backgroundColor: 'transparent',
    textStyle: { fontFamily: get('--font-family-sans', 'Inter, system-ui, sans-serif'), color: get('--text-primary', '#1a1a2e') },
  };
}
