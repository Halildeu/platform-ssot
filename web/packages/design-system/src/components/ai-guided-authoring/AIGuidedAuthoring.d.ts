import React from "react";
import { type ConfidenceLevel } from "../confidence-badge/ConfidenceBadge";
import { type CommandPaletteItem } from "../command-palette";
import { type PromptComposerProps } from "../prompt-composer/PromptComposer";
import { type RecommendationCardProps } from "../recommendation-card/RecommendationCard";
import { type AccessControlledProps } from "../../internal/access-controller";
export type { CommandPaletteItem };
export interface AIGuidedAuthoringRecommendation extends Omit<RecommendationCardProps, "onPrimaryAction" | "onSecondaryAction"> {
    id: string;
}
/**
 * AIGuidedAuthoring orchestrates a prompt composer, recommendation stack,
 * confidence badge, and command palette into a unified authoring workflow.
 * @example
 * ```tsx
 * <AIGuidedAuthoring />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/a-i-guided-authoring)

 */
export interface AIGuidedAuthoringProps extends AccessControlledProps {
    /** Section heading. @default "AI guided authoring" */
    title?: React.ReactNode;
    /** Explanatory text below the title. */
    description?: React.ReactNode;
    /** Props forwarded to the embedded PromptComposer. */
    promptComposerProps?: Partial<PromptComposerProps>;
    /** List of recommendation cards to display alongside the composer. */
    recommendations?: AIGuidedAuthoringRecommendation[];
    /** Items available in the command palette. */
    commandItems?: CommandPaletteItem[];
    /** Overall confidence level indicator. @default "medium" */
    confidenceLevel?: ConfidenceLevel;
    /** Numeric confidence score (0-100). */
    confidenceScore?: number;
    /** Number of sources contributing to the confidence. */
    sourceCount?: number;
    /** Label above the confidence badge. */
    confidenceLabel?: React.ReactNode;
    /** Controlled open state for the command palette. */
    paletteOpen?: boolean;
    /** Initial palette open state for uncontrolled mode. @default false */
    defaultPaletteOpen?: boolean;
    /** Callback fired when the palette open state changes. */
    onPaletteOpenChange?: (open: boolean) => void;
    /** Callback fired when a recommendation's primary action is triggered. */
    onApplyRecommendation?: (id: string, item: AIGuidedAuthoringRecommendation) => void;
    /** Callback fired when a recommendation's secondary action is triggered. */
    onReviewRecommendation?: (id: string, item: AIGuidedAuthoringRecommendation) => void;
    /** Additional CSS class name. */
    className?: string;
}
/**
 * AI-guided authoring wizard that provides step-by-step content creation
 * with intelligent suggestions, recommendation cards and command palette integration.
 */
export declare const AIGuidedAuthoring: React.ForwardRefExoticComponent<AIGuidedAuthoringProps & React.RefAttributes<HTMLElement>>;
export default AIGuidedAuthoring;
