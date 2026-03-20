import React from "react";
import {
  ApprovalCheckpoint,
  type ApprovalCheckpointProps,
} from "../approval-checkpoint/ApprovalCheckpoint";
import {
  CitationPanel,
  type CitationPanelItem,
} from "../citation-panel/CitationPanel";
import {
  AIActionAuditTimeline,
  type AIActionAuditTimelineItem,
} from "../ai-action-audit-timeline/AIActionAuditTimeline";
import { Text } from "../../primitives/text/Text";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";

export interface ApprovalReviewProps extends AccessControlledProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  checkpoint: ApprovalCheckpointProps;
  citations: CitationPanelItem[];
  auditItems: AIActionAuditTimelineItem[];
  selectedCitationId?: string | null;
  defaultSelectedCitationId?: string | null;
  onCitationSelect?: (citationId: string, item: CitationPanelItem) => void;
  selectedAuditId?: string | null;
  defaultSelectedAuditId?: string | null;
  onAuditSelect?: (
    auditId: string,
    item: AIActionAuditTimelineItem,
  ) => void;
  className?: string;
}

const approvalReviewSurfaceClassName =
  "relative overflow-hidden rounded-[32px] border border-[var(--border-subtle)]/80 bg-[var(--surface-card,rgba(255,255,255,0.98))] p-5 shadow-[0_24px_52px_-36px_var(--shadow-color,rgba(15,23,42,0.28))] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-7 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--border-subtle)]/40 before:to-transparent";

export const ApprovalReview: React.FC<ApprovalReviewProps> = ({
  title = "Approval review",
  description = "Human checkpoint, source evidence ve audit izleri ayni review recipe altinda gorunur.",
  checkpoint,
  citations,
  auditItems,
  selectedCitationId,
  defaultSelectedCitationId = null,
  onCitationSelect,
  selectedAuditId,
  defaultSelectedAuditId = null,
  onAuditSelect,
  className = "",
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [internalCitationId, setInternalCitationId] = React.useState<
    string | null
  >(defaultSelectedCitationId);
  const [internalAuditId, setInternalAuditId] = React.useState<string | null>(
    defaultSelectedAuditId,
  );

  if (accessState.isHidden) {
    return null;
  }

  const currentCitationId = selectedCitationId ?? internalCitationId;
  const currentAuditId = selectedAuditId ?? internalAuditId;

  return (
    <section
      className={`${approvalReviewSurfaceClassName} ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="approval-review"
      data-surface-appearance="premium"
      title={accessReason}
    >
      <Text
        as="div"
        className="text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
      >
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))" }}>
        <ApprovalCheckpoint className="min-w-0"
          {...checkpoint}
          access={access}
          accessReason={accessReason}
        />
        <CitationPanel
          className="min-w-0"
          items={citations}
          activeCitationId={currentCitationId}
          onOpenCitation={(citationId, item) => {
            if (selectedCitationId === undefined) {
              setInternalCitationId(citationId);
            }
            onCitationSelect?.(citationId, item);
          }}
          access={access}
          accessReason={accessReason}
        />
      </div>

      <div className="mt-4">
        <AIActionAuditTimeline
          items={auditItems}
          selectedId={currentAuditId}
          onSelectItem={(auditId, item) => {
            if (selectedAuditId === undefined) {
              setInternalAuditId(auditId);
            }
            onAuditSelect?.(auditId, item);
          }}
          access={access}
          accessReason={accessReason}
        />
      </div>
    </section>
  );
};

ApprovalReview.displayName = 'ApprovalReview';

export default ApprovalReview;
