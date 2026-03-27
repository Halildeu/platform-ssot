import React from 'react';
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
export declare function useIntersectionObserver(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit): UseIntersectionObserverResult;
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
export declare const RenderWhenVisible: React.FC<RenderWhenVisibleProps>;
