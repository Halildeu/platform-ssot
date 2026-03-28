export interface PagePattern {
    id: string;
    name: string;
    signals: RegExp[];
    expectedComponents: Array<{
        name: string;
        importance: 'required' | 'recommended' | 'optional';
        bundleKB: number;
    }>;
}
export interface CombinationRule {
    if: string;
    then: string;
    confidence: number;
    reason: string;
}
export declare const PAGE_PATTERNS: PagePattern[];
export declare const COMBINATION_RULES: CombinationRule[];
