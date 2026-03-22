'use client';
/* ------------------------------------------------------------------ */
/*  AnimatePresence — tracks child mount/unmount for exit animations   */
/*                                                                     */
/*  Keeps children mounted during their exit animation. When a child   */
/*  is removed from the tree, AnimatePresence delays actual unmount    */
/*  until the animation duration elapses.                              */
/* ------------------------------------------------------------------ */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../internal/overlay-engine/reduced-motion';

export interface AnimatePresenceProps {
  /** Exit animation duration in ms. */
  exitDuration?: number;
  /** Called when all exiting children have finished. */
  onExitComplete?: () => void;
  children: React.ReactNode;
}

/**
 * Tracks child presence and delays unmount for exit animations.
 *
 * Wrap dynamic children (conditional renders, lists) with AnimatePresence
 * so they can animate out before removal.
 *
 * @example
 * ```tsx
 * <AnimatePresence exitDuration={200}>
 *   {isVisible && <FadePanel key="panel" />}
 * </AnimatePresence>
 * ```
 */
export function AnimatePresence({
  exitDuration = 150,
  onExitComplete,
  children,
}: AnimatePresenceProps) {
  const reducedMotion = useReducedMotion();
  const effectiveDuration = reducedMotion ? 0 : exitDuration;

  // Track which keys are currently in the DOM (including exiting)
  const [presentChildren, setPresentChildren] = useState<React.ReactNode>(children);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const currentKeys = new Set<string>();
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.key != null) {
        currentKeys.add(String(child.key));
      }
    });

    const prevKeys = new Set<string>();
    React.Children.forEach(presentChildren, (child) => {
      if (React.isValidElement(child) && child.key != null) {
        prevKeys.add(String(child.key));
      }
    });

    // Find removed children
    const removed = new Set<string>();
    for (const key of prevKeys) {
      if (!currentKeys.has(key)) {
        removed.add(key);
      }
    }

    if (removed.size === 0) {
      // No removals — update immediately
      setPresentChildren(children);
      return;
    }

    // Keep removed children mounted during exit
    // After duration, remove them
    cleanup();
    timerRef.current = setTimeout(() => {
      setPresentChildren(children);
      onExitComplete?.();
    }, effectiveDuration);

    return cleanup;
  }, [children]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{presentChildren}</>;
}

AnimatePresence.displayName = 'AnimatePresence';
