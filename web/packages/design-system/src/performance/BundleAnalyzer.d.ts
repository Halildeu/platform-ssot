export type ComponentSizeCategory = 'lightweight' | 'medium' | 'heavy';
export type ComponentSizeInfo = {
    /** Component or module name */
    name: string;
    /** Estimated gzipped kilobytes */
    estimatedKB: number;
    /** Size classification */
    category: ComponentSizeCategory;
    /** Whether we recommend lazy-loading this component */
    lazyRecommended: boolean;
    /** Notable third-party dependencies */
    dependencies: string[];
};
export type BundleReport = {
    totalComponents: number;
    lightweightCount: number;
    mediumCount: number;
    heavyCount: number;
    lazyRecommendedCount: number;
    estimatedTotalKB: number;
};
/**
 * Returns size estimates and lazy-loading recommendations for all
 * registered design system components.
 */
export declare function getComponentSizes(): ComponentSizeInfo[];
/**
 * Returns an aggregate bundle report summarising component size
 * distribution and lazy-loading opportunities.
 */
export declare function getBundleReport(): BundleReport;
