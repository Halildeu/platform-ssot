/**
 * useTouchGestures — Pinch zoom, swipe, and long-press for mobile charts
 *
 * Returns touch event handlers to spread on a chart container div.
 * Desktop-safe: handlers are no-ops when touch is not supported.
 *
 * @see feature_execution_contract (P2 DoD #14, #15)
 */
import { useRef, useCallback, useState } from "react";

export interface TouchGestureOptions {
  /** Enable pinch-to-zoom. @default true */
  enablePinchZoom?: boolean;
  /** Enable swipe navigation. @default true */
  enableSwipe?: boolean;
  /** Long-press duration in ms. @default 500 */
  longPressMs?: number;
  /** Current zoom level (for pinch scaling). */
  zoomLevel?: number;
  /** Zoom callback (from useChartInteractions). */
  onZoomChange?: (newZoom: number) => void;
  /** Swipe callback. */
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  /** Long-press callback with position. */
  onLongPress?: (position: { x: number; y: number }) => void;
  /** Long-press end callback. */
  onLongPressEnd?: () => void;
  /** Min/max zoom bounds. */
  minZoom?: number;
  maxZoom?: number;
}

export interface TouchGestureState {
  /** Whether a pinch gesture is active. */
  isPinching: boolean;
  /** Whether a long-press is active. */
  isLongPressing: boolean;
  /** Long-press position (null when not pressing). */
  longPressPosition: { x: number; y: number } | null;
}

export interface TouchGestureHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: (e: React.TouchEvent) => void;
}

export interface UseTouchGesturesReturn {
  state: TouchGestureState;
  handlers: TouchGestureHandlers;
}

function getTouchDistance(touches: React.TouchList): number {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

const SWIPE_THRESHOLD = 50;
const MOVE_CANCEL_THRESHOLD = 10;

export function useTouchGestures(
  options: TouchGestureOptions = {},
): UseTouchGesturesReturn {
  const {
    enablePinchZoom = true,
    enableSwipe = true,
    longPressMs = 500,
    zoomLevel = 1,
    onZoomChange,
    onSwipe,
    onLongPress,
    onLongPressEnd,
    minZoom = 1,
    maxZoom = 10,
  } = options;

  const [isPinching, setIsPinching] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressPosition, setLongPressPosition] = useState<{ x: number; y: number } | null>(null);

  const initialDistanceRef = useRef(0);
  const initialZoomRef = useRef(zoomLevel);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const cancelLongPress = useCallback(() => {
    clearTimeout(longPressTimerRef.current);
    if (isLongPressing) {
      setIsLongPressing(false);
      setLongPressPosition(null);
      onLongPressEnd?.();
    }
  }, [isLongPressing, onLongPressEnd]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;

      // Pinch zoom (two fingers)
      if (touches.length === 2 && enablePinchZoom) {
        setIsPinching(true);
        initialDistanceRef.current = getTouchDistance(touches);
        initialZoomRef.current = zoomLevel;
        cancelLongPress();
        return;
      }

      // Single touch: start long-press timer + record for swipe
      if (touches.length === 1) {
        const touch = touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };

        longPressTimerRef.current = setTimeout(() => {
          const pos = { x: touch.clientX, y: touch.clientY };
          setIsLongPressing(true);
          setLongPressPosition(pos);
          onLongPress?.(pos);
        }, longPressMs);
      }
    },
    [enablePinchZoom, zoomLevel, longPressMs, onLongPress, cancelLongPress],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;

      // Pinch zoom update
      if (touches.length === 2 && isPinching && enablePinchZoom) {
        const currentDistance = getTouchDistance(touches);
        if (initialDistanceRef.current > 0) {
          const scale = currentDistance / initialDistanceRef.current;
          const newZoom = Math.min(maxZoom, Math.max(minZoom, initialZoomRef.current * scale));
          onZoomChange?.(newZoom);
        }
        return;
      }

      // Cancel long-press if finger moved too far
      if (touches.length === 1 && touchStartRef.current) {
        const dx = touches[0].clientX - touchStartRef.current.x;
        const dy = touches[0].clientY - touchStartRef.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > MOVE_CANCEL_THRESHOLD) {
          cancelLongPress();
        }
      }
    },
    [isPinching, enablePinchZoom, maxZoom, minZoom, onZoomChange, cancelLongPress],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // End pinch
      if (isPinching && e.touches.length < 2) {
        setIsPinching(false);
        return;
      }

      cancelLongPress();

      // Detect swipe
      if (enableSwipe && touchStartRef.current && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;
        const elapsed = Date.now() - touchStartRef.current.time;

        if (elapsed < 300) {
          if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            onSwipe?.(dx > 0 ? "right" : "left");
          } else if (Math.abs(dy) > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
            onSwipe?.(dy > 0 ? "down" : "up");
          }
        }
      }

      touchStartRef.current = null;
    },
    [isPinching, enableSwipe, onSwipe, cancelLongPress],
  );

  const onTouchCancel = useCallback(() => {
    setIsPinching(false);
    cancelLongPress();
    touchStartRef.current = null;
  }, [cancelLongPress]);

  return {
    state: { isPinching, isLongPressing, longPressPosition },
    handlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel },
  };
}
