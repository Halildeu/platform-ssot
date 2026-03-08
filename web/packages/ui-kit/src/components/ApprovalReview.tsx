import React from 'react';
import {
  ApprovalCheckpoint,
  type ApprovalCheckpointProps,
} from './ApprovalCheckpoint';
import {
  CitationPanel,
  type CitationPanelItem,
} from './CitationPanel';
import {
  AIActionAuditTimeline,
  type AIActionAuditTimelineItem,
} from './AIActionAuditTimeline';
import { Text } from './Text';
import { resolveAccessState, type AccessControlledProps } from '../runtime/access-controller';

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
  onAuditSelect?: (auditId: string, item: AIActionAuditTimelineItem) => void;
  className?: string;
}

export const ApprovalReview: React.FC<ApprovalReviewProps> = ({
  title = 'Approval review',
  description = 'Human checkpoint, source evidence ve audit izleri ayni review recipe altinda gorunur.',
  checkpoint,
  citations,
  auditItems,
  selectedCitationId,
  defaultSelectedCitationId = null,
  onCitationSelect,
  selectedAuditId,
  defaultSelectedAuditId = null,
  onAuditSelect,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [internalCitationId, setInternalCitationId] = React.useState<string | null>(defaultSelectedCitationId);
  const [internalAuditId, setInternalAuditId] = React.useState<string | null>(defaultSelectedAuditId);

  if (accessState.isHidden) {
    return null;
  }

  const currentCitationId = selectedCitationId ?? internalCitationId;
  const currentAuditId = selectedAuditId ?? internalAuditId;

  return (
    <section
      className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="approval-review"
      title={accessReason}
    >
      <Text as="div" className="text-base font-semibold text-text-primary">
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ApprovalCheckpoint {...checkpoint} access={access} accessReason={accessReason} />
        <CitationPanel
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

export default ApprovalReview;
