import React, { Component, ErrorInfo, ReactNode } from 'react';
import { type AccessControlledProps } from '../../internal/access-controller';
export type ErrorBoundaryFallback = ReactNode | ((error: Error, reset: () => void) => ReactNode);
export interface ErrorBoundaryProps extends AccessControlledProps {
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
/**
 * Error boundary component that catches JavaScript errors in child components.
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *   <App />
 * </ErrorBoundary>
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/error-boundary)
 */
declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static displayName: string;
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private reset;
    render(): import("react/jsx-runtime").JSX.Element | null;
}
export { ErrorBoundary };
/**
 * ForwardRef wrapper for ErrorBoundary that enables ref forwarding.
 * Use the class-based `ErrorBoundary` export directly when ref forwarding is not needed.
 */
declare const ErrorBoundaryWithRef: React.ForwardRefExoticComponent<ErrorBoundaryProps & React.RefAttributes<ErrorBoundary>>;
export { ErrorBoundaryWithRef };
/** Alias for ErrorBoundaryProps for external consumers. */
export type ErrorBoundaryComponentProps = ErrorBoundaryProps;
/** Alias for ErrorBoundaryFallback for external consumers. */
export type ErrorBoundaryFallbackType = ErrorBoundaryFallback;
