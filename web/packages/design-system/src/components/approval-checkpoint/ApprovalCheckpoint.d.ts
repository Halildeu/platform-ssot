import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type ApprovalCheckpointStatus = "pending" | "approved" | "rejected" | "blocked";
export type ApprovalCheckpointItemStatus = "todo" | "ready" | "approved" | "blocked";
export interface ApprovalCheckpointItem {
    key: React.Key;
    label: React.ReactNode;
    helper?: React.ReactNode;
    owner?: React.ReactNode;
    status?: ApprovalCheckpointItemStatus;
}
/** Props for the ApprovalCheckpoint component.
 * @example
 * ```tsx
 * <ApprovalCheckpoint />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/approval-checkpoint)
 */
export interface ApprovalCheckpointProps extends AccessControlledProps {
    /** Heading text for the checkpoint card. */
    title: React.ReactNode;
    /** Summary description of the approval context. */
    summary: React.ReactNode;
    /** Current approval status. */
    status?: ApprovalCheckpointStatus;
    /** Label displayed on the checkpoint badge. */
    checkpointLabel?: React.ReactNode;
    /** Label identifying the approver or review board. */
    approverLabel?: React.ReactNode;
    /** Due-date or deadline label. */
    dueLabel?: React.ReactNode;
    /** List of evidence item descriptions. */
    evidenceItems?: string[];
    /** Checklist steps within the checkpoint. */
    steps?: ApprovalCheckpointItem[];
    /** Citation labels rendered as badges. */
    citations?: string[];
    /** Label for the primary action button. */
    primaryActionLabel?: string;
    /** Label for the secondary action button. */
    secondaryActionLabel?: string;
    /** Callback fired when the primary action is triggered. */
    onPrimaryAction?: () => void;
    /** Callback fired when the secondary action is triggered. */
    onSecondaryAction?: () => void;
    /** Footer note displayed below actions. */
    footerNote?: React.ReactNode;
    /** Additional badges rendered in the header. */
    badges?: React.ReactNode[];
    /** Additional CSS class name. */
    className?: string;
}
/** Approval gate card displaying status, checklist steps, evidence, and approve/reject actions. */
export declare const ApprovalCheckpoint: React.ForwardRefExoticComponent<ApprovalCheckpointProps & React.RefAttributes<HTMLElement>>;
export default ApprovalCheckpoint;
