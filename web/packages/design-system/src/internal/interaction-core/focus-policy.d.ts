/**
 * Focus strategy determines how a component handles focus visibility.
 *
 * - "ring" — Standard focus ring (default for buttons, inputs)
 * - "outline" — Thin outline (for compact controls)
 * - "inset" — Inset focus indicator (for filled components)
 * - "none" — No visible focus (only for non-interactive decorative elements)
 */
export type FocusStrategy = "ring" | "outline" | "inset" | "none";
/**
 * Returns the appropriate Tailwind focus ring classes for a given strategy.
 *
 * @example
 * ```tsx
 * <button className={cn("...", focusRingClass("ring"))}>
 *   Click me
 * </button>
 * ```
 */
export declare function focusRingClass(strategy?: FocusStrategy): string;
/**
 * Returns focus ring classes with a custom color override.
 *
 * @example
 * ```tsx
 * <button className={cn("...", focusRingClassWithColor("ring", "var(--state-error-text)"))}>
 *   Delete
 * </button>
 * ```
 */
export declare function focusRingClassWithColor(strategy: FocusStrategy, color: string): string;
/**
 * Determines the recommended focus strategy for a component type.
 */
export declare function defaultFocusStrategy(componentType: "button" | "input" | "toggle" | "link" | "card" | "tab" | "menu-item"): FocusStrategy;
/**
 * Focus trap sentinel value. Components that implement focus trapping
 * should use this to mark the component as a focus boundary.
 */
export declare const FOCUS_TRAP_ATTR: "data-focus-trap";
/**
 * Returns true if the current interaction mode is keyboard-driven.
 * Uses the :focus-visible heuristic.
 */
export declare function isKeyboardInteraction(): boolean;
