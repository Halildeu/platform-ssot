/**
 * ChartErrorBoundary — React Error Boundary for chart crash recovery
 *
 * Catches rendering errors in chart components and shows ChartErrorState.
 * Includes retry mechanism that remounts the chart tree.
 *
 * @see chart-viz-engine-selection D-010 (error states)
 */
import React from "react";
import { ChartErrorState } from "./ChartErrorState";

export interface ChartErrorBoundaryProps {
  /** Chart content to wrap. */
  children: React.ReactNode;
  /** Height passed to error state. @default 300 */
  height?: number;
  /** Custom error message. */
  message?: string;
  /** Callback on error catch (for logging/telemetry). */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Additional class name for error state. */
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChartErrorBoundary extends React.Component<
  ChartErrorBoundaryProps,
  State
> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ChartErrorState
          height={this.props.height}
          message={this.props.message ?? "Chart rendering failed"}
          detail={this.state.error?.message}
          onRetry={this.handleRetry}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}
