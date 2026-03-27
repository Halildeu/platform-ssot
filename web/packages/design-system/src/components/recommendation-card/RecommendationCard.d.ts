import React from "react";
import { type ConfidenceLevel } from "../confidence-badge/ConfidenceBadge";
import { type AccessControlledProps } from "../../internal/access-controller";
export type RecommendationCardTone = "info" | "success" | "warning";
/**
 * RecommendationCard displays an AI-generated recommendation with confidence scoring,
 * rationale, citation badges, and primary/secondary action buttons.
 * @example
 * ```tsx
 * <RecommendationCard />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/recommendation-card)

 */
export interface RecommendationCardProps extends AccessControlledProps {
    /** Recommendation heading. */
    title: React.ReactNode;
    /** Brief summary of the recommendation. */
    summary: React.ReactNode;
    /** Category label shown as a badge (e.g. "Recommendation"). */
    recommendationType?: React.ReactNode;
    /** List of reasons supporting the recommendation. */
    rationale?: string[];
    /** Source citation labels shown as muted badges. */
    citations?: string[];
    /** AI confidence level indicator. @default "medium" */
    confidenceLevel?: ConfidenceLevel;
    /** Numeric confidence score (0-100). */
    confidenceScore?: number;
    /** Number of sources used for the recommendation. */
    sourceCount?: number;
    /** Label for the primary action button. @default "Apply" */
    primaryActionLabel?: string;
    /** Label for the secondary action button. @default "Review" */
    secondaryActionLabel?: string;
    /** Callback fired when the primary action is clicked. */
    onPrimaryAction?: () => void;
    /** Callback fired when the secondary action is clicked. */
    onSecondaryAction?: () => void;
    /** Semantic tone affecting the card's accent color. @default "info" */
    tone?: RecommendationCardTone;
    /** Use compact layout for the confidence badge. @default false */
    compact?: boolean;
    /** Additional badge elements rendered beside the type badge. */
    badges?: React.ReactNode[];
    /** Optional footer note below the action buttons. */
    footerNote?: React.ReactNode;
    /** Additional CSS class name. */
    className?: string;
}
export declare const RecommendationCard: React.ForwardRefExoticComponent<RecommendationCardProps & React.RefAttributes<HTMLElement>>;
export default RecommendationCard;
