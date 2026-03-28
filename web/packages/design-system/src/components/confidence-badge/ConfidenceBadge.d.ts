import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type ConfidenceLevel = "low" | "medium" | "high" | "very-high";
/** Props for the ConfidenceBadge component.
 * @example
 * ```tsx
 * <ConfidenceBadge />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/confidence-badge)
 */
export interface ConfidenceBadgeProps extends AccessControlledProps {
    /** Confidence tier determining the badge tone. */
    level?: ConfidenceLevel;
    /** Numeric confidence score (0-100). */
    score?: number;
    /** Number of sources backing the confidence. */
    sourceCount?: number;
    /** Whether to render in compact mode with fewer details. */
    compact?: boolean;
    /** Whether to display the numeric score. */
    showScore?: boolean;
    /** Custom label overriding the default level text. */
    label?: React.ReactNode;
    /** Additional CSS class name. */
    className?: string;
}
/** Badge displaying AI confidence level with optional numeric score and source count. */
export declare const ConfidenceBadge: React.ForwardRefExoticComponent<ConfidenceBadgeProps & React.RefAttributes<HTMLSpanElement>>;
export default ConfidenceBadge;
