import React, {
  Suspense,
  lazy,
  ComponentType,
  Component,
  ReactNode,
  ErrorInfo,
} from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Error Boundary (internal)                                          */
/* ------------------------------------------------------------------ */

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class LazyErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[LazyComponent] Failed to load:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" data-component="lazy-error">
          Component failed to load.
        </div>
      );
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  Default loading skeleton                                           */
/* ------------------------------------------------------------------ */

const DefaultSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    data-component="lazy-skeleton"
    className={className}
    style={{
      minHeight: 48,
      background: 'var(--ds-color-surface-secondary)',
      borderRadius: 'var(--ds-radius-md)',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}
    aria-busy="true"
    aria-label="Loading..."
  />
);

/* ------------------------------------------------------------------ */
/*  createLazyComponent                                                */
/* ------------------------------------------------------------------ */

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
export function createLazyComponent<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  displayName?: string,
): React.FC<P & LazyComponentProps> {
  const LazyInner = lazy(importFn);

  const Wrapper: React.FC<P & LazyComponentProps> = ({
    fallback,
    errorFallback,
    className,
    ...rest
  }) => (
    <LazyErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback ?? <DefaultSkeleton className={className} />}>
        {/* Cast needed because rest spreading loses generic type after destructuring */}
        {React.createElement(LazyInner as unknown as ComponentType<P>, rest as unknown as P)}
      </Suspense>
    </LazyErrorBoundary>
  );

  Wrapper.displayName = displayName ?? 'LazyComponent';
  return Wrapper;
}

/* ------------------------------------------------------------------ */
/*  Pre-built lazy versions of heavy components                        */
/* ------------------------------------------------------------------ */

/** Lazy AG Grid */
export const LazyAgGrid = createLazyComponent(
  () => import('../advanced/data-grid').then((m) => ({ default: m.EntityGridTemplate as unknown as ComponentType<Record<string, unknown>> })) as Promise<{ default: ComponentType<Record<string, unknown>> }>,
  'LazyAgGrid',
);

/** Lazy Calendar */
export const LazyCalendar = createLazyComponent(
  () => import('../components/calendar').then((m) => ({ default: m.Calendar as ComponentType<Record<string, unknown>> })) as Promise<{ default: ComponentType<Record<string, unknown>> }>,
  'LazyCalendar',
);

/** Lazy Charts (BarChart) */
export const LazyCharts = createLazyComponent(
  () => import('../components/charts').then((m) => ({ default: m.BarChart as unknown as ComponentType<Record<string, unknown>> })) as Promise<{ default: ComponentType<Record<string, unknown>> }>,
  'LazyCharts',
);

/** Lazy ColorPicker */
export const LazyColorPicker = createLazyComponent(
  () => import('../components/color-picker').then((m) => ({ default: m.ColorPicker as ComponentType<Record<string, unknown>> })) as Promise<{ default: ComponentType<Record<string, unknown>> }>,
  'LazyColorPicker',
);

/** Lazy Transfer */
export const LazyTransfer = createLazyComponent(
  () => import('../components/transfer').then((m) => ({ default: m.Transfer as unknown as ComponentType<Record<string, unknown>> })) as Promise<{ default: ComponentType<Record<string, unknown>> }>,
  'LazyTransfer',
);

/** Lazy JsonViewer */
export const LazyJsonViewer = createLazyComponent(
  () => import('../components/json-viewer').then((m) => ({ default: m.JsonViewer as unknown as ComponentType<Record<string, unknown>> })) as Promise<{ default: ComponentType<Record<string, unknown>> }>,
  'LazyJsonViewer',
);

/** Lazy TreeTable */
export const LazyTreeTable = createLazyComponent(
  () => import('../components/tree-table').then((m) => ({ default: m.TreeTable as unknown as ComponentType<Record<string, unknown>> })) as Promise<{ default: ComponentType<Record<string, unknown>> }>,
  'LazyTreeTable',
);

/** Type alias for LazyComponent ref. */
export type LazyComponentRef = React.Ref<HTMLElement>;
/** Type alias for LazyComponent element. */
export type LazyComponentElement = HTMLElement;
/** Type alias for LazyComponent cssproperties. */
export type LazyComponentCSSProperties = React.CSSProperties;
