import type { A11yViolation } from './types';
/**
 * Generate prioritized recommendations from a list of violations.
 * Returns deduplicated, severity-ordered recommendations.
 */
export declare function getRecommendations(violations: A11yViolation[]): string[];
/**
 * Get a component-specific accessibility checklist.
 * Returns a generic checklist for unknown component types.
 */
export declare function getComponentA11yChecklist(componentType: string): string[];
/**
 * Get all supported component types for checklists.
 */
export declare function getSupportedChecklistTypes(): string[];
