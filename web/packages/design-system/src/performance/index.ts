/* ------------------------------------------------------------------ */
/*  Performance utilities — lazy loading, virtualisation, analysis     */
/* ------------------------------------------------------------------ */

/* Lazy loading */
export { createLazyComponent } from './LazyComponent';
export type { LazyComponentProps } from './LazyComponent';
export {
  LazyAgGrid,
  LazyCalendar,
  LazyCharts,
  LazyColorPicker,
  LazyTransfer,
  LazyJsonViewer,
  LazyTreeTable,
} from './LazyComponent';

/* Virtualised list */
export { VirtualList } from './VirtualList';
export type { VirtualListProps } from './VirtualList';

/* Deferred rendering */
export { useDeferredRender } from './useDeferredRender';

/* Intersection observer / render-when-visible */
export { useIntersectionObserver, RenderWhenVisible } from './useIntersectionObserver';
export type {
  UseIntersectionObserverResult,
  RenderWhenVisibleProps,
} from './useIntersectionObserver';

/* Bundle analysis */
export { getComponentSizes, getBundleReport } from './BundleAnalyzer';
export type {
  ComponentSizeInfo,
  ComponentSizeCategory,
  BundleReport,
} from './BundleAnalyzer';
