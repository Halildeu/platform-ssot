import React from "react";
import { type ApprovalCheckpointProps } from "../approval-checkpoint/ApprovalCheckpoint";
import { type CitationPanelItem } from "../citation-panel/CitationPanel";
import { type AIActionAuditTimelineItem } from "../ai-action-audit-timeline/AIActionAuditTimeline";
import { type AccessControlledProps } from "../../internal/access-controller";
/**
 * ApprovalReview combines a human checkpoint, citation evidence, and audit trail
 * into a single review surface for AI-generated actions.
 * @example
 * ```tsx
 * <ApprovalReview />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/approval-review)

 */
export interface ApprovalReviewProps extends AccessControlledProps {
    /** Section heading. @default "Approval review" */
    title?: React.ReactNode;
    /** Explanatory text below the title. */
    description?: React.ReactNode;
    /** Props forwarded to the ApprovalCheckpoint sub-component. */
    checkpoint: ApprovalCheckpointProps;
    /** Citation items displayed in the evidence panel. */
    citations: CitationPanelItem[];
    /** Audit trail entries for the AI action timeline. */
    auditItems: AIActionAuditTimelineItem[];
    /** Controlled active citation ID. */
    selectedCitationId?: string | null;
    /** Initial citation ID for uncontrolled mode. */
    defaultSelectedCitationId?: string | null;
    /** Callback when a citation is selected. */
    onCitationSelect?: (citationId: string, item: CitationPanelItem) => void;
    /** Controlled active audit item ID. */
    selectedAuditId?: string | null;
    /** Initial audit item ID for uncontrolled mode. */
    defaultSelectedAuditId?: string | null;
    /** Callback when an audit item is selected. */
    onAuditSelect?: (auditId: string, item: AIActionAuditTimelineItem) => void;
    /** Additional CSS class name. */
    className?: string;
}
export declare const ApprovalReview: React.ForwardRefExoticComponent<ApprovalReviewProps & React.RefAttributes<HTMLElement>>;
export default ApprovalReview;
/** Type alias for ApprovalReview ref. */
export type ApprovalReviewRef = React.Ref<HTMLElement>;
/** Type alias for ApprovalReview element. */
export type ApprovalReviewElement = HTMLElement;
/** Type alias for ApprovalReview cssproperties. */
export type ApprovalReviewCSSProperties = React.CSSProperties;
