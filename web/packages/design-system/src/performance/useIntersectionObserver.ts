import React, { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export interface UseIntersectionObserverResult {
  /** Whether the element is currently visible */
  isVisible: boolean;
  /** Whether the element has ever been visible (sticky true) */
  hasBeenVisible: boolean;
}

/**
 * Renders content only when it enters the viewport.
 * Wraps IntersectionObserver with React lifecycle.
 *
 * @example
 * ```tsx
 * function HeavySection() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { isVisible, hasBeenVisible } = useIntersectionObserver(ref);
 *
 *   return (
 *     <div ref={ref}>
 *       {hasBeenVisible && <ExpensiveChart />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit,
): UseIntersectionObserverResult {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fall back gracefully if IntersectionObserver is unavailable
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setHasBeenVisible(true);
      },
      options,
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options?.root, options?.rootMargin, options?.threshold]);

  return { isVisible, hasBeenVisible };
}

/* ------------------------------------------------------------------ */
/*  Component wrapper                                                  */
/* ------------------------------------------------------------------ */

export interface RenderWhenVisibleProps {
  children: React.ReactNode;
  /** Fallback rendered before the element becomes visible */
  fallback?: React.ReactNode;
  /** IntersectionObserver rootMargin (e.g. "200px") */
  rootMargin?: string;
  /** Optional CSS class for the sentinel wrapper */
  className?: string;
}

/**
 * Component wrapper that renders children only when visible.
 *
 * @example
 * ```tsx
 * <RenderWhenVisible fallback={<Skeleton />} rootMargin="100px">
 *   <HeavyDataGrid />
 * </RenderWhenVisible>
 * ```
 */
export const RenderWhenVisible: React.FC<RenderWhenVisibleProps> = ({
  children,
  fallback = null,
  rootMargin,
  className,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { hasBeenVisible } = useIntersectionObserver(
    sentinelRef as React.RefObject<HTMLElement>,
    { rootMargin },
  );

  return React.createElement(
    'div',
    {
      ref: sentinelRef,
      className,
      'data-component': 'render-when-visible',
    },
    hasBeenVisible ? children : fallback,
  );
};

RenderWhenVisible.displayName = 'RenderWhenVisible';
