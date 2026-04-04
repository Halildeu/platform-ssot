/**
 * Auto-Granularity — Zoom → Aggregate Level Change
 *
 * Automatically adjusts data aggregation level based on the visible
 * data range (zoom level). Prevents over-rendering when zoomed out
 * and provides detail when zoomed in.
 *
 * Granularity levels (time-series):
 *   - minute: < 4 hours visible
 *   - hour:   4h–48h visible
 *   - day:    2d–60d visible
 *   - week:   60d–365d visible
 *   - month:  > 365d visible
 *
 * @see contract P3-D DoD: "Auto-granularity (zoom → aggregate level change)"
 */

import { useMemo, useState, useCallback } from 'react';

export type GranularityLevel = 'minute' | 'hour' | 'day' | 'week' | 'month';

export interface AutoGranularityOptions {
  /** Total data time range in milliseconds */
  totalRangeMs: number;
  /** Current zoom start percentage (0-100). @default 0 */
  zoomStart?: number;
  /** Current zoom end percentage (0-100). @default 100 */
  zoomEnd?: number;
  /** Custom thresholds (override defaults) */
  thresholds?: Partial<Record<GranularityLevel, number>>;
}

const MS_HOUR = 3_600_000;
const MS_DAY = 86_400_000;

const DEFAULT_THRESHOLDS: Record<GranularityLevel, number> = {
  minute: 4 * MS_HOUR,
  hour: 48 * MS_HOUR,
  day: 60 * MS_DAY,
  week: 365 * MS_DAY,
  month: Infinity,
};

/**
 * Determine granularity from visible range in milliseconds.
 */
export function resolveGranularity(
  visibleMs: number,
  thresholds: Record<GranularityLevel, number> = DEFAULT_THRESHOLDS,
): GranularityLevel {
  if (visibleMs <= thresholds.minute) return 'minute';
  if (visibleMs <= thresholds.hour) return 'hour';
  if (visibleMs <= thresholds.day) return 'day';
  if (visibleMs <= thresholds.week) return 'week';
  return 'month';
}

/**
 * React hook that tracks zoom state and returns the current granularity level.
 *
 * Usage:
 * ```tsx
 * const { granularity, onDataZoom } = useAutoGranularity({ totalRangeMs });
 * // Pass onDataZoom to ECharts datazoom event
 * ```
 */
export function useAutoGranularity(options: AutoGranularityOptions) {
  const { totalRangeMs, thresholds: customThresholds } = options;
  const [zoomStart, setZoomStart] = useState(options.zoomStart ?? 0);
  const [zoomEnd, setZoomEnd] = useState(options.zoomEnd ?? 100);

  const mergedThresholds = useMemo(
    () => ({ ...DEFAULT_THRESHOLDS, ...customThresholds }),
    [customThresholds],
  );

  const visibleMs = useMemo(
    () => totalRangeMs * ((zoomEnd - zoomStart) / 100),
    [totalRangeMs, zoomStart, zoomEnd],
  );

  const granularity = useMemo(
    () => resolveGranularity(visibleMs, mergedThresholds),
    [visibleMs, mergedThresholds],
  );

  const onDataZoom = useCallback(
    (params: { start?: number; end?: number }) => {
      if (params.start !== undefined) setZoomStart(params.start);
      if (params.end !== undefined) setZoomEnd(params.end);
    },
    [],
  );

  return { granularity, visibleMs, zoomStart, zoomEnd, onDataZoom };
}
