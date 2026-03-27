import type React from "react";
import type { AccessLevel } from "../access-controller";
export type EventGuardOptions = {
    /** Access level from access-controller */
    access?: AccessLevel;
    /** Externally disabled */
    disabled?: boolean;
    /** Loading state — blocks interaction */
    loading?: boolean;
    /** If true, allow event but mark as readonly (no state change) */
    allowReadonlyFocus?: boolean;
};
export type EventGuardResult = {
    /** Should the event be completely blocked? */
    blocked: boolean;
    /** Is the component in a readonly state? */
    readonly: boolean;
    /** Is the component disabled? */
    disabled: boolean;
    /** Is the component loading? */
    loading: boolean;
    /** Reason for blocking (for debugging / aria) */
    reason?: "disabled" | "readonly" | "hidden" | "loading";
};
/**
 * Evaluates whether an event should be blocked based on component state.
 *
 * @example
 * ```ts
 * const guard = evaluateGuard({ access: "readonly", disabled: false });
 * if (guard.blocked) return;
 * ```
 */
export declare function evaluateGuard(options: EventGuardOptions): EventGuardResult;
/**
 * Creates a guarded event handler that blocks events when interaction
 * is not allowed. Replaces `withAccessGuard` with a more ergonomic API.
 *
 * @example
 * ```tsx
 * const handleClick = guardEvent(
 *   { access, disabled, loading },
 *   (e) => { doSomething(); }
 * );
 * <button onClick={handleClick} />
 * ```
 */
export declare function guardEvent<E extends React.SyntheticEvent = React.SyntheticEvent>(options: EventGuardOptions, handler?: (event: E) => void): (event: E) => void;
/**
 * Computes interaction CSS classes based on guard state.
 * Provides consistent cursor and opacity styling.
 *
 * @example
 * ```tsx
 * <label className={cn("...", guardStyles({ access, disabled }))}>
 * ```
 */
export declare function guardStyles(options: EventGuardOptions): string;
/**
 * Returns ARIA attributes appropriate for the guard state.
 *
 * @example
 * ```tsx
 * <input {...guardAria({ access: "readonly" })} />
 * // → { "aria-disabled": undefined, "aria-readonly": true }
 * ```
 */
export declare function guardAria(options: EventGuardOptions): Record<string, boolean | undefined>;
