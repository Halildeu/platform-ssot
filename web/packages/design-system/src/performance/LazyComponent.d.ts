import React, { ComponentType } from 'react';
export type LazyComponentProps = {
    /** Fallback UI shown while the component is loading. */
    fallback?: React.ReactNode;
    /** Fallback UI shown when the dynamic import fails. */
    errorFallback?: React.ReactNode;
    /** Optional CSS class applied to the loading skeleton wrapper. */
    className?: string;
    /** Minimum loading delay in ms to prevent layout flash. */
    minLoadTime?: number;
    /** Whether to retry the import on failure. @default false */
    retryOnError?: boolean;
    /** Callback fired when the lazy component finishes loading. */
    onLoad?: () => void;
};
/**
 * Creates a lazy-loadable version of any component with built-in
 * Suspense boundary, error boundary, and loading skeleton.
 *
 * @example
 * ```tsx
 * const LazyHeavyChart = createLazyComponent(
 *   () => import('./HeavyChart'),
 *   'LazyHeavyChart',
 * );
 *
 * <LazyHeavyChart data={data} fallback={<Spinner />} />
 * ```
 */
export declare function createLazyComponent<P extends Record<string, unknown>>(importFn: () => Promise<{
    default: ComponentType<P>;
}>, displayName?: string): React.FC<P & LazyComponentProps>;
/** Lazy AG Grid */
export declare const LazyAgGrid: React.FC<Record<string, unknown> & LazyComponentProps>;
/** Lazy Calendar */
export declare const LazyCalendar: React.FC<Record<string, unknown> & LazyComponentProps>;
/** Lazy Charts (BarChart) */
export declare const LazyCharts: React.FC<Record<string, unknown> & LazyComponentProps>;
/** Lazy ColorPicker */
export declare const LazyColorPicker: React.FC<Record<string, unknown> & LazyComponentProps>;
/** Lazy Transfer */
export declare const LazyTransfer: React.FC<Record<string, unknown> & LazyComponentProps>;
/** Lazy JsonViewer */
export declare const LazyJsonViewer: React.FC<Record<string, unknown> & LazyComponentProps>;
/** Lazy TreeTable */
export declare const LazyTreeTable: React.FC<Record<string, unknown> & LazyComponentProps>;
/** Type alias for LazyComponent ref. */
export type LazyComponentRef = React.Ref<HTMLElement>;
/** Type alias for LazyComponent element. */
export type LazyComponentElement = HTMLElement;
/** Type alias for LazyComponent cssproperties. */
export type LazyComponentCSSProperties = React.CSSProperties;
