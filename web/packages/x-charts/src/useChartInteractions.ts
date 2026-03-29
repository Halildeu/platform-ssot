import { useState, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartInteractionState {
  /** Current zoom level (1 = no zoom). */
  zoomLevel: number;
  /** Zoom in by one step. */
  zoomIn: () => void;
  /** Zoom out by one step. */
  zoomOut: () => void;
  /** Reset zoom to 1. */
  resetZoom: () => void;

  /** Whether the user is currently panning. */
  isPanning: boolean;
  /** Current pan offset in pixels. */
  panOffset: { x: number; y: number };

  /** Currently-selected brush range (data-space indices), or null. */
  brushRange: { start: number; end: number } | null;
  /** Whether a brush drag is in progress. */
  isBrushing: boolean;
  /** Clear the current brush selection. */
  clearBrush: () => void;

  /** Crosshair position in container-relative pixels, or null. */
  crosshairPosition: { x: number; y: number } | null;
}

export interface ChartInteractionOptions {
  /** Enable mouse-wheel zoom. @default false */
  enableZoom?: boolean;
  /** Enable click-drag pan (only active when zoomed). @default false */
  enablePan?: boolean;
  /** Enable click-drag brush selection. @default false */
  enableBrush?: boolean;
  /** Enable crosshair position tracking. @default false */
  enableCrosshair?: boolean;
  /** Minimum zoom level. @default 1 */
  minZoom?: number;
  /** Maximum zoom level. @default 10 */
  maxZoom?: number;
  /** Zoom step multiplier per wheel tick. @default 0.1 */
  zoomStep?: number;
  /** Called when a brush selection completes. */
  onBrushEnd?: (range: { start: number; end: number }) => void;
}

export interface ChartInteractionHandlers {
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Provides zoom, pan, brush-select, and crosshair interaction state
 * for a chart container div. All features are opt-in and work without
 * any charting library dependency.
 *
 * @returns `[state, handlers]` — spread `handlers` onto the container element.
 */
export function useChartInteractions(
  options: ChartInteractionOptions = {},
): [ChartInteractionState, ChartInteractionHandlers] {
  const {
    enableZoom = false,
    enablePan = false,
    enableBrush = false,
    enableCrosshair = false,
    minZoom = 1,
    maxZoom = 10,
    zoomStep = 0.1,
    onBrushEnd,
  } = options;

  /* ---- zoom ---- */
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = useCallback(() => {
    setZoomLevel((z) => clamp(z + zoomStep * z, minZoom, maxZoom));
  }, [minZoom, maxZoom, zoomStep]);

  const zoomOut = useCallback(() => {
    setZoomLevel((z) => clamp(z - zoomStep * z, minZoom, maxZoom));
  }, [minZoom, maxZoom, zoomStep]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  /* ---- pan ---- */
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const panStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  /* ---- brush ---- */
  const [brushRange, setBrushRange] = useState<{ start: number; end: number } | null>(null);
  const [isBrushing, setIsBrushing] = useState(false);
  const brushStart = useRef<number | null>(null);

  const clearBrush = useCallback(() => {
    setBrushRange(null);
    setIsBrushing(false);
    brushStart.current = null;
  }, []);

  /* ---- crosshair ---- */
  const [crosshairPosition, setCrosshairPosition] = useState<{ x: number; y: number } | null>(null);

  /* ---- stash onBrushEnd in ref so handler closures stay stable ---- */
  const onBrushEndRef = useRef(onBrushEnd);
  useEffect(() => {
    onBrushEndRef.current = onBrushEnd;
  }, [onBrushEnd]);

  /* ---- event handlers ---- */

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!enableZoom) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      setZoomLevel((z) => {
        const next = clamp(z + delta * z, minZoom, maxZoom);
        // Reset pan if fully zoomed out
        if (next <= 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    },
    [enableZoom, minZoom, maxZoom, zoomStep],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const _y = e.clientY - rect.top;

      // Brush takes priority when zoom is at 1 or brush is explicitly enabled and pan is not
      if (enableBrush && (!enablePan || zoomLevel <= 1)) {
        setIsBrushing(true);
        brushStart.current = x;
        setBrushRange(null);
        return;
      }

      // Pan when zoomed in
      if (enablePan && zoomLevel > 1) {
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY, ox: panOffset.x, oy: panOffset.y };
      }
    },
    [enableBrush, enablePan, zoomLevel, panOffset],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Crosshair
      if (enableCrosshair) {
        setCrosshairPosition({ x, y });
      }

      // Brushing
      if (isBrushing && brushStart.current !== null) {
        const start = Math.min(brushStart.current, x);
        const end = Math.max(brushStart.current, x);
        setBrushRange({ start, end });
        return;
      }

      // Panning
      if (isPanning && panStart.current) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setPanOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
      }
    },
    [enableCrosshair, isBrushing, isPanning],
  );

  const onMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      if (isBrushing && brushRange) {
        setIsBrushing(false);
        onBrushEndRef.current?.(brushRange);
      }
      brushStart.current = null;

      if (isPanning) {
        setIsPanning(false);
        panStart.current = null;
      }
    },
    [isBrushing, isPanning, brushRange],
  );

  const onMouseLeave = useCallback(
    (_e: React.MouseEvent) => {
      if (enableCrosshair) setCrosshairPosition(null);
      if (isBrushing) {
        setIsBrushing(false);
        brushStart.current = null;
      }
      if (isPanning) {
        setIsPanning(false);
        panStart.current = null;
      }
    },
    [enableCrosshair, isBrushing, isPanning],
  );

  /* ---- assemble return ---- */

  const state: ChartInteractionState = {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    isPanning,
    panOffset,
    brushRange,
    isBrushing,
    clearBrush,
    crosshairPosition,
  };

  const handlers: ChartInteractionHandlers = {
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  };

  return [state, handlers];
}

export default useChartInteractions;
