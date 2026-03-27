export declare const Keys: {
    readonly Enter: "Enter";
    readonly Space: " ";
    readonly Escape: "Escape";
    readonly ArrowUp: "ArrowUp";
    readonly ArrowDown: "ArrowDown";
    readonly ArrowLeft: "ArrowLeft";
    readonly ArrowRight: "ArrowRight";
    readonly Tab: "Tab";
    readonly Home: "Home";
    readonly End: "End";
    readonly PageUp: "PageUp";
    readonly PageDown: "PageDown";
    readonly Backspace: "Backspace";
    readonly Delete: "Delete";
};
export type KeyConstant = (typeof Keys)[keyof typeof Keys];
export type KeyboardAction = "activate" | "toggle" | "dismiss" | "navigate-next" | "navigate-prev" | "navigate-first" | "navigate-last" | "select" | "clear" | "delete" | "expand" | "collapse" | "submit";
export type KeyBinding = {
    key: KeyConstant | KeyConstant[];
    action: KeyboardAction;
    description: string;
    /** If true, modifier key (Ctrl/Cmd) is required */
    withModifier?: boolean;
    /** If true, Shift is required */
    withShift?: boolean;
};
export type ComponentKeyboardContract = {
    component: string;
    role: string;
    bindings: KeyBinding[];
};
/**
 * Centralized keyboard contract registry.
 * Each entry defines the expected keyboard behavior per WAI-ARIA APG.
 */
export declare const KEYBOARD_CONTRACTS: Record<string, ComponentKeyboardContract>;
/**
 * Creates a keyboard event handler from a contract.
 * Maps key presses to semantic actions.
 *
 * @example
 * ```tsx
 * const handleKeyDown = createKeyHandler("switch", {
 *   toggle: () => setChecked(!checked),
 * });
 * <input onKeyDown={handleKeyDown} />
 * ```
 */
export declare function createKeyHandler(contractKey: keyof typeof KEYBOARD_CONTRACTS, handlers: Partial<Record<KeyboardAction, (event: KeyboardEvent | React.KeyboardEvent) => void>>): (event: KeyboardEvent | React.KeyboardEvent) => void;
/**
 * Returns a human-readable description of a component's keyboard contract.
 * Useful for documentation and a11y panels.
 */
export declare function describeKeyboardContract(contractKey: keyof typeof KEYBOARD_CONTRACTS): string[];
import type React from "react";
