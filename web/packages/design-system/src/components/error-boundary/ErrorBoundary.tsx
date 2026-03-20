import React, { Component, ErrorInfo, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ErrorBoundaryFallback =
  | ReactNode
  | ((error: Error, reset: () => void) => ReactNode);

export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Static fallback element, or render function receiving (error, reset) */
  fallback?: ErrorBoundaryFallback;
  /** Callback fired when an error is caught — use for logging / reporting */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Additional CSS class merged onto the wrapper */
  className?: string;
  /** data-component attribute override */
  'data-component'?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/* ------------------------------------------------------------------ */
/*  Default fallback                                                   */
/* ------------------------------------------------------------------ */

const DefaultFallback: React.FC<{ error: Error; onReset: () => void }> = ({
  error,
  onReset,
}) => (
  <div
    role="alert"
    style={{
      padding: '24px',
      border: '1px solid var(--border-default)',
      borderRadius: '8px',
      background: 'var(--surface-default)',
      color: 'var(--text-primary)',
      textAlign: 'center',
    }}
  >
    <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Something went wrong</p>
    <p style={{ margin: '0 0 16px', fontSize: '0.875rem', opacity: 0.7 }}>
      {error.message}
    </p>
    <button
      type="button"
      onClick={onReset}
      style={{
        padding: '6px 16px',
        borderRadius: '6px',
        border: '1px solid var(--border-default)',
        background: 'var(--surface-default)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '0.875rem',
      }}
    >
      Try again
    </button>
  </div>
);

/* ------------------------------------------------------------------ */
/*  ErrorBoundary                                                      */
/* ------------------------------------------------------------------ */

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary';
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  render() {
    const {
      children,
      fallback,
      className,
      'data-component': dataComponent = 'error-boundary',
    } = this.props;
    const { error } = this.state;

    if (error) {
      const fallbackContent =
        typeof fallback === 'function'
          ? fallback(error, this.reset)
          : fallback ?? <DefaultFallback error={error} onReset={this.reset} />;

      return (
        <div className={className} data-component={dataComponent}>
          {fallbackContent}
        </div>
      );
    }

    return (
      <div className={className} data-component={dataComponent}>
        {children}
      </div>
    );
  }
}

export { ErrorBoundary };
