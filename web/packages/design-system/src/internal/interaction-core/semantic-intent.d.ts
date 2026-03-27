import type React from "react";
/**
 * Semantic intent — what the user intended to do, regardless of
 * the input method (mouse click, keyboard, touch, etc.)
 */
export type SemanticIntent = "activate" | "toggle" | "open" | "close" | "select" | "clear" | "submit" | "navigate" | "expand" | "collapse" | "delete";
/**
 * Navigation direction for navigate intent.
 */
export type NavigationDirection = "next" | "prev" | "first" | "last";
/**
 * Resolved intent with additional context.
 */
export type ResolvedIntent = {
    intent: SemanticIntent;
    direction?: NavigationDirection;
    /** Original event that triggered this intent */
    source: "mouse" | "keyboard" | "touch" | "programmatic";
};
/**
 * Resolves a keyboard event to a semantic intent based on component role.
 *
 * @example
 * ```tsx
 * const handleKeyDown = (e: React.KeyboardEvent) => {
 *   const intent = resolveKeyboardIntent(e, "switch");
 *   if (intent?.intent === "toggle") {
 *     setChecked(!checked);
 *   }
 * };
 * ```
 */
export declare function resolveKeyboardIntent(event: React.KeyboardEvent | KeyboardEvent, componentRole: "button" | "switch" | "checkbox" | "radio" | "select" | "tabs" | "accordion" | "dialog" | "combobox" | "menu" | "slider"): ResolvedIntent | null;
/**
 * Resolves a click/pointer event to a semantic intent.
 * Simple — clicks always map to "activate" for buttons, "toggle" for toggles, etc.
 */
export declare function resolveClickIntent(componentRole: "button" | "switch" | "checkbox" | "radio" | "select" | "tabs" | "accordion" | "link"): ResolvedIntent;
