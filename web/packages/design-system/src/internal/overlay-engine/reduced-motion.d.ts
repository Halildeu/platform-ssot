/**
 * Returns true if the user prefers reduced motion.
 * Works in SSR (returns false on server).
 */
export declare function prefersReducedMotion(): boolean;
/**
 * Hook that reactively tracks the user's reduced motion preference.
 *
 * @example
 * ```tsx
 * function AnimatedPanel({ children }) {
 *   const reducedMotion = useReducedMotion();
 *   return (
 *     <div className={reducedMotion ? "transition-none" : "transition-all duration-300"}>
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useReducedMotion(): boolean;
/**
 * Returns a Tailwind className that disables transitions when
 * reduced motion is preferred. Can be used as a static class.
 */
export declare const REDUCED_MOTION_CLASS = "motion-reduce:transition-none motion-reduce:animate-none";
/**
 * Returns appropriate transition duration based on motion preference.
 *
 * @example
 * ```ts
 * const duration = motionDuration(300); // 300ms normally, 0ms with reduced motion
 * ```
 */
export declare function motionDuration(ms: number): number;
