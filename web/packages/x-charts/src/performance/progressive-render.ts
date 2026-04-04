/**
 * Progressive Rendering — Render large datasets in chunks
 *
 * Splits data into batches and renders them over multiple frames
 * to avoid blocking the main thread. Uses requestIdleCallback
 * with requestAnimationFrame fallback.
 *
 * @see contract P6 DoD: "Progressive rendering for large datasets"
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface ProgressiveRenderOptions {
  /** Total data array */
  data: unknown[];
  /** Points per render batch. @default 5000 */
  batchSize?: number;
  /** Threshold below which all data renders immediately. @default 10000 */
  immediateThreshold?: number;
  /** Whether progressive rendering is enabled. @default true */
  enabled?: boolean;
}

export interface ProgressiveRenderState {
  /** Currently visible data (grows each batch) */
  visibleData: unknown[];
  /** Whether all data has been rendered */
  isComplete: boolean;
  /** Progress 0-1 */
  progress: number;
  /** Force complete (show all data immediately) */
  forceComplete: () => void;
}

const scheduleIdle = typeof requestIdleCallback !== 'undefined'
  ? requestIdleCallback
  : (cb: () => void) => setTimeout(cb, 1);

const cancelIdle = typeof cancelIdleCallback !== 'undefined'
  ? cancelIdleCallback
  : clearTimeout;

export function useProgressiveRender(options: ProgressiveRenderOptions): ProgressiveRenderState {
  const {
    data,
    batchSize = 5000,
    immediateThreshold = 10000,
    enabled = true,
  } = options;

  const [renderedCount, setRenderedCount] = useState(0);
  const idleRef = useRef<number>(0);
  const forcedRef = useRef(false);

  // Immediate render for small datasets
  const shouldProgressive = enabled && data.length > immediateThreshold;

  useEffect(() => {
    if (!shouldProgressive) {
      setRenderedCount(data.length);
      return;
    }

    setRenderedCount(batchSize);
    forcedRef.current = false;

    const scheduleNext = () => {
      idleRef.current = scheduleIdle(() => {
        setRenderedCount((prev) => {
          const next = Math.min(prev + batchSize, data.length);
          if (next < data.length) scheduleNext();
          return next;
        });
      }) as unknown as number;
    };

    scheduleNext();

    return () => {
      cancelIdle(idleRef.current);
    };
  }, [data.length, batchSize, shouldProgressive]);

  const forceComplete = useCallback(() => {
    cancelIdle(idleRef.current);
    forcedRef.current = true;
    setRenderedCount(data.length);
  }, [data.length]);

  const visibleData = shouldProgressive && !forcedRef.current
    ? data.slice(0, renderedCount)
    : data;

  return {
    visibleData,
    isComplete: renderedCount >= data.length,
    progress: data.length > 0 ? renderedCount / data.length : 1,
    forceComplete,
  };
}
