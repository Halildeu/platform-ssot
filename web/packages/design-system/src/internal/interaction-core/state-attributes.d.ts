import type { AccessLevel } from "../access-controller";
export type ComponentState = "checked" | "unchecked" | "open" | "closed" | "active" | "inactive" | "expanded" | "collapsed" | "indeterminate";
export type ComponentStatus = "idle" | "error" | "warning" | "success" | "loading";
export type StateAttributeOptions = {
    /** Access level — maps to data-access */
    access?: AccessLevel;
    /** Component state — maps to data-state */
    state?: ComponentState;
    /** Validation/feedback status — maps to data-status */
    status?: ComponentStatus;
    /** Loading flag — maps to data-loading boolean */
    loading?: boolean;
    /** Disabled flag — maps to data-disabled boolean */
    disabled?: boolean;
    /** Readonly flag — maps to data-readonly boolean */
    readonly?: boolean;
    /** Error flag — maps to data-error boolean. Accepts any truthy value (boolean, string, ReactNode). */
    error?: boolean | string | unknown;
    /** Component name for debugging — maps to data-component */
    component?: string;
};
export type StateAttributes = Record<string, string | boolean | undefined>;
/**
 * Generates standardized data-* attributes for a component.
 *
 * @example
 * ```tsx
 * <input {...stateAttrs({ access: "readonly", state: "checked", disabled: false })} />
 * // → data-access="readonly" data-state="checked"
 * ```
 */
export declare function stateAttrs(options: StateAttributeOptions): StateAttributes;
/**
 * CSS selector builder for data attributes.
 * Useful for building selectors in Tailwind or CSS-in-JS.
 *
 * @example
 * ```ts
 * stateSelector({ access: "disabled" }) // → '[data-access="disabled"]'
 * stateSelector({ loading: true })      // → '[data-loading]'
 * ```
 */
export declare function stateSelector(options: Partial<Pick<StateAttributeOptions, "access" | "state" | "status" | "disabled" | "readonly" | "loading" | "error">>): string;
