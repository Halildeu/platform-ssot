import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type AIActionAuditActor = "ai" | "human" | "system";
export type AIActionAuditStatus = "drafted" | "approved" | "executed" | "rejected" | "observed";
export interface AIActionAuditTimelineItem {
    id: string;
    actor: AIActionAuditActor;
    title: React.ReactNode;
    timestamp: React.ReactNode;
    summary?: React.ReactNode;
    status?: AIActionAuditStatus;
    badges?: React.ReactNode[];
}
/** Props for the AIActionAuditTimeline component.
 * @example
 * ```tsx
 * <AIActionAuditTimeline />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/a-i-action-audit-timeline)
 */
export interface AIActionAuditTimelineProps extends AccessControlledProps {
    /** Timeline entries to render. */
    items: AIActionAuditTimelineItem[];
    /** Heading text above the timeline. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** ID of the currently selected timeline entry. */
    selectedId?: string | null;
    /** Callback fired when a timeline entry is selected. */
    onSelectItem?: (id: string, item: AIActionAuditTimelineItem) => void;
    /** Whether to use a compact layout. */
    compact?: boolean;
    /** Label shown when the timeline is empty. */
    emptyStateLabel?: React.ReactNode;
    /** Additional CSS class name. */
    className?: string;
}
/** Chronological timeline of AI-initiated actions with actor, status, and audit trail details. */
export declare const AIActionAuditTimeline: React.ForwardRefExoticComponent<AIActionAuditTimelineProps & React.RefAttributes<HTMLDivElement>>;
export default AIActionAuditTimeline;
