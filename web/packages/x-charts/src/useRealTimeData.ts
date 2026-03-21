import { useState, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RealTimeDataOptions<T> {
  /** Maximum number of data points to retain (circular buffer). @default 500 */
  maxPoints?: number;
  /** If set, auto-advance a "tick" at this interval (ms) — useful for demos / heartbeat. */
  interval?: number;
  /** Called each time a new point is added. */
  onNewPoint?: (point: T) => void;
}

export interface RealTimeDataState<T> {
  /** Current buffered data. */
  data: T[];
  /** Append a single point (evicts oldest if over maxPoints). */
  addPoint: (point: T) => void;
  /** Append many points at once. */
  addPoints: (points: T[]) => void;
  /** Clear all data. */
  clear: () => void;
  /** Whether the stream is paused. */
  isPaused: boolean;
  /** Pause: stops accepting new points and pauses the auto-interval. */
  pause: () => void;
  /** Resume: accepts points again and restarts the auto-interval. */
  resume: () => void;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Manages a capped circular buffer of data points suitable for
 * real-time / streaming chart visualisations.
 *
 * Works standalone — no charting library dependency.
 */
export function useRealTimeData<T>(
  options: RealTimeDataOptions<T> = {},
): RealTimeDataState<T> {
  const { maxPoints = 500, onNewPoint } = options;

  // Store the buffer in a ref for O(1) push; mirror to state for re-renders
  const bufferRef = useRef<T[]>([]);
  const [data, setData] = useState<T[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(false);

  // Keep callback ref stable
  const onNewPointRef = useRef(onNewPoint);
  onNewPointRef.current = onNewPoint;

  const maxRef = useRef(maxPoints);
  maxRef.current = maxPoints;

  const flush = useCallback(() => {
    setData([...bufferRef.current]);
  }, []);

  const addPoint = useCallback(
    (point: T) => {
      if (pausedRef.current) return;

      const buf = bufferRef.current;
      buf.push(point);

      // Evict oldest when over capacity
      if (buf.length > maxRef.current) {
        const excess = buf.length - maxRef.current;
        bufferRef.current = buf.slice(excess);
      }

      onNewPointRef.current?.(point);
      flush();
    },
    [flush],
  );

  const addPoints = useCallback(
    (points: T[]) => {
      if (pausedRef.current || points.length === 0) return;

      const buf = bufferRef.current;
      buf.push(...points);

      if (buf.length > maxRef.current) {
        const excess = buf.length - maxRef.current;
        bufferRef.current = buf.slice(excess);
      }

      // Fire callback for the last point only (perf)
      onNewPointRef.current?.(points[points.length - 1]);
      flush();
    },
    [flush],
  );

  const clear = useCallback(() => {
    bufferRef.current = [];
    setData([]);
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    setIsPaused(false);
  }, []);

  return { data, addPoint, addPoints, clear, isPaused, pause, resume };
}

export default useRealTimeData;
