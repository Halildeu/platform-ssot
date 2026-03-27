import type { KeyboardNavTest, A11yComponentType } from './types';
/**
 * Get the expected keyboard navigation contract for a component type.
 * Returns an empty array for unknown component types.
 */
export declare function getKeyboardContract(componentType: string): KeyboardNavTest[];
/**
 * Test keyboard navigation on a live DOM element against a contract.
 *
 * This utility dispatches keyboard events and checks for expected DOM
 * mutations. In a jsdom environment, many checks rely on structural
 * heuristics since full layout/focus behavior isn't available.
 */
export declare function testKeyboardNavigation(element: HTMLElement, contract: KeyboardNavTest[]): KeyboardNavTest[];
/**
 * Get all supported component types.
 */
export declare function getSupportedComponentTypes(): A11yComponentType[];
/**
 * Check whether a component type has a keyboard contract defined.
 */
export declare function hasKeyboardContract(componentType: string): boolean;
