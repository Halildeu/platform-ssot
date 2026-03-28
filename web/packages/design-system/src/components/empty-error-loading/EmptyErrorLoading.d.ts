import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type EmptyErrorLoadingMode = "empty" | "error" | "loading";
/** Props for the EmptyErrorLoading component.
 * @example
 * ```tsx
 * <EmptyErrorLoading />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/empty-error-loading)
 */
export interface EmptyErrorLoadingProps extends AccessControlledProps {
    /** Current display mode: empty, error, or loading. */
    mode: EmptyErrorLoadingMode;
    /** Heading text displayed above the feedback area. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Message shown when mode is error. */
    errorLabel?: React.ReactNode;
    /** Label for the retry button in error state. */
    retryLabel?: string;
    /** Callback fired when the retry button is clicked. */
    onRetry?: () => void;
    /** Accessible label for the loading spinner. */
    loadingLabel?: string;
    /** Whether to show skeleton placeholders during loading. */
    showSkeleton?: boolean;
    /** Additional CSS class name. */
    className?: string;
}
/** Tri-state feedback component that renders empty, error, or loading state with consistent styling. */
export declare const EmptyErrorLoading: React.ForwardRefExoticComponent<EmptyErrorLoadingProps & React.RefAttributes<HTMLElement>>;
export default EmptyErrorLoading;
