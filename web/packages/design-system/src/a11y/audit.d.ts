import type { A11yAuditResult, A11yComponentReport, A11yRule } from './types';
declare const rules: A11yRule[];
/**
 * Run all audit rules against a DOM element subtree.
 */
export declare function auditElement(element: HTMLElement): A11yAuditResult;
/**
 * Generate a full accessibility report for a named component.
 * Combines DOM audit, keyboard navigation testing, and recommendations.
 */
export declare function auditComponent(componentName: string, element: HTMLElement): A11yComponentReport;
/**
 * Get all registered audit rules.
 */
export declare function getAuditRules(): readonly A11yRule[];
export { rules as _rules };
