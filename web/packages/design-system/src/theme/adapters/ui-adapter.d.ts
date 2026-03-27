import type { SemanticTokenSet } from "../../tokens/semantic";
/**
 * Generates a CSS string from a semantic token set.
 *
 * @example
 * const css = tokenSetToCss(lightTheme);
 * // ":root { --surface-default: #ffffff; ... }"
 */
export declare function tokenSetToCss(tokens: SemanticTokenSet, selector?: string): string;
/**
 * Applies a token set directly to an element's inline styles.
 */
export declare function applyTokenSet(tokens: SemanticTokenSet, element?: HTMLElement): void;
