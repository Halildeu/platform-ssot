import React from 'react';
import { Badge, type BadgeTone } from './Badge';
import { Button } from './Button';
import { Descriptions } from './Descriptions';
import { List, type ListItem } from './List';
import { Text } from './Text';
import { resolveAccessState, withAccessGuard, type AccessControlledProps, type AccessLevel } from '../runtime/access-controller';

export type ApprovalCheckpointStatus = 'pending' | 'approved' | 'rejected' | 'blocked';
export type ApprovalCheckpointItemStatus = 'todo' | 'ready' | 'approved' | 'blocked';

export interface ApprovalCheckpointItem {
  key: React.Key;
  label: React.ReactNode;
  helper?: React.ReactNode;
  owner?: React.ReactNode;
  status?: ApprovalCheckpointItemStatus;
}

export interface ApprovalCheckpointProps extends AccessControlledProps {
  title: React.ReactNode;
  summary: React.ReactNode;
  status?: ApprovalCheckpointStatus;
  checkpointLabel?: React.ReactNode;
  approverLabel?: React.ReactNode;
  dueLabel?: React.ReactNode;
  evidenceItems?: string[];
  steps?: ApprovalCheckpointItem[];
  citations?: string[];
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  footerNote?: React.ReactNode;
  badges?: React.ReactNode[];
  className?: string;
}

const statusTone: Record<ApprovalCheckpointStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  blocked: 'muted',
};

const statusLabel: Record<ApprovalCheckpointStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  blocked: 'Blocked',
};

const stepTone: Record<ApprovalCheckpointItemStatus, ListItem['tone']> = {
  todo: 'default',
  ready: 'info',
  approved: 'success',
  blocked: 'warning',
};

const stepBadge: Record<ApprovalCheckpointItemStatus, string> = {
  todo: 'Todo',
  ready: 'Ready',
  approved: 'Approved',
  blocked: 'Blocked',
};

export const ApprovalCheckpoint: React.FC<ApprovalCheckpointProps> = ({
  title,
  summary,
  status = 'pending',
  checkpointLabel = 'Approval checkpoint',
  approverLabel = 'Human review board',
  dueLabel = 'Before publish',
  evidenceItems = [],
  steps = [],
  citations = [],
  primaryActionLabel = 'Approve',
  secondaryActionLabel = 'Request review',
  onPrimaryAction,
  onSecondaryAction,
  footerNote,
  badges = [],
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const interactionState: AccessLevel = accessState.isDisabled
    ? 'disabled'
    : accessState.isReadonly
      ? 'readonly'
      : accessState.state;

  const stepItems: ListItem[] = steps.map((item) => ({
    key: item.key,
    title: item.label,
    description: item.helper,
    meta: item.owner,
    badges: [stepBadge[item.status ?? 'todo']],
    tone: stepTone[item.status ?? 'todo'],
  }));

  return (
    <article
      className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-status={status}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{checkpointLabel}</Badge>
            <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
            {badges.map((badge, index) => (
              <React.Fragment key={`approval-badge-${index}`}>{badge}</React.Fragment>
            ))}
          </div>
          <div>
            <Text preset="title">{title}</Text>
            <Text variant="secondary" className="mt-2 block leading-7">
              {summary}
            </Text>
          </div>
        </div>
      </div>

      <Descriptions
        title="Checkpoint contract"
        description="Human review, evidence set ve release deadline ayni primitive ile gorunur."
        density="compact"
        columns={3}
        items={[
          {
            key: 'approver',
            label: 'Approver',
            value: approverLabel,
            tone: status === 'approved' ? 'success' : 'info',
          },
          {
            key: 'due',
            label: 'Due',
            value: dueLabel,
            tone: status === 'blocked' ? 'warning' : 'default',
          },
          {
            key: 'evidence',
            label: 'Evidence',
            value: `${evidenceItems.length}`,
            helper: evidenceItems.length ? evidenceItems.join(', ') : 'No evidence linked',
            tone: evidenceItems.length ? 'success' : 'warning',
          },
        ]}
      />

      {stepItems.length > 0 ? (
        <div className="mt-4">
          <List
            title="Checklist"
            description="Approval karari once checklist maddeleriyle desteklenir."
            items={stepItems}
            density="compact"
          />
        </div>
      ) : null}

      {citations.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {citations.map((citation) => (
            <Badge key={citation} tone="muted">{citation}</Badge>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
              interactionState,
              () => onPrimaryAction?.(),
              accessState.isDisabled,
            )}
            access={accessState.isReadonly ? 'readonly' : access}
            title={accessReason}
          >
            {primaryActionLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
              interactionState,
              () => onSecondaryAction?.(),
              accessState.isDisabled,
            )}
            access={accessState.isReadonly ? 'readonly' : access}
            title={accessReason}
          >
            {secondaryActionLabel}
          </Button>
        </div>
        {footerNote ? <Text variant="secondary">{footerNote}</Text> : null}
      </div>
    </article>
  );
};

export default ApprovalCheckpoint;
