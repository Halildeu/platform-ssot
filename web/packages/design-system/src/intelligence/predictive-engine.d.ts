export interface PredictionResult {
    component: string;
    confidence: number;
    reason: string;
    category: 'missing' | 'recommended' | 'optional';
    bundleImpactKB: number;
    importStatement: string;
}
export interface PredictionReport {
    detectedPattern: {
        id: string;
        name: string;
        confidence: number;
    } | null;
    existingComponents: string[];
    predictions: PredictionResult[];
    totalBundleImpactKB: number;
}
/**
 * Extract component names from import statements and JSX usage.
 */
export declare function extractComponents(code: string): string[];
/**
 * Predict missing components based on source code analysis.
 *
 * 1. Extracts existing component imports and JSX usage.
 * 2. Detects the page pattern (dashboard, CRUD, form, etc.).
 * 3. Identifies missing expected components from the pattern.
 * 4. Applies combination rules for additional suggestions.
 * 5. Sorts by confidence * importance weight.
 */
export declare function predictComponents(code: string): PredictionReport;
