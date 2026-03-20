import React from "react";
import { Badge, type BadgeVariant } from "../../primitives/badge/Badge";
import { Button } from "../../primitives/button/Button";
import { Text } from "../../primitives/text/Text";
import { Descriptions } from "../descriptions";
import { List, type ListItem } from "../list";
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from "../../internal/access-controller";

export type ApprovalCheckpointStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "blocked";
export type ApprovalCheckpointItemStatus =
  | "todo"
  | "ready"
  | "approved"
  | "blocked";

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

const statusTone: Record<ApprovalCheckpointStatus, BadgeVariant> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  blocked: "muted",
};

const statusLabel: Record<ApprovalCheckpointStatus, string> = {
  pending: "Beklemede",
  approved: "Onaylandi",
  rejected: "Reddedildi",
  blocked: "Engellendi",
};

const stepTone: Record<ApprovalCheckpointItemStatus, ListItem["tone"]> = {
  todo: "default",
  ready: "info",
  approved: "success",
  blocked: "warning",
};

const stepBadgeLabel: Record<ApprovalCheckpointItemStatus, string> = {
  todo: "Yapilacak",
  ready: "Hazir",
  approved: "Onaylandi",
  blocked: "Engellendi",
};

const approvalCheckpointSurfaceClassName =
  "relative overflow-hidden rounded-[32px] border border-[var(--border-subtle)]/80 bg-[var(--surface-card,rgba(255,255,255,0.98))] p-5 shadow-[0_24px_52px_-36px_var(--shadow-color,rgba(15,23,42,0.28))] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-7 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--border-subtle)]/40 before:to-transparent";

export const ApprovalCheckpoint: React.FC<ApprovalCheckpointProps> = ({
  title,
  summary,
  status = "pending",
  checkpointLabel = "Onay kapisi",
  approverLabel = "Insan inceleme kurulu",
  dueLabel = "Yayindan once",
  evidenceItems = [],
  steps = [],
  citations = [],
  primaryActionLabel = "Onayla",
  secondaryActionLabel = "Inceleme talep et",
  onPrimaryAction,
  onSecondaryAction,
  footerNote,
  badges = [],
  className = "",
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const interactionState: AccessLevel = accessState.isDisabled
    ? "disabled"
    : accessState.isReadonly
      ? "readonly"
      : accessState.state;

  const stepItems: ListItem[] = steps.map((item) => ({
    key: item.key,
    title: item.label,
    description: item.helper,
    meta: item.owner,
    badges: [stepBadgeLabel[item.status ?? "todo"]],
    tone: stepTone[item.status ?? "todo"],
  }));

  return (
    <article
      className={`${approvalCheckpointSurfaceClassName} ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="approval-checkpoint"
      data-surface-appearance="premium"
      data-status={status}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{checkpointLabel}</Badge>
            <Badge variant={statusTone[status]}>{statusLabel[status]}</Badge>
            {badges.map((badge, index) => (
              <React.Fragment key={`approval-badge-${index}`}>
                {badge}
              </React.Fragment>
            ))}
          </div>
          <div>
            <Text as="h2" size="xl" weight="semibold" className="tracking-[-0.03em]">
              {title}
            </Text>
            <Text
              variant="secondary"
              className="mt-2 block leading-7 break-words"
            >
              {summary}
            </Text>
          </div>
        </div>
      </div>

      <Descriptions
        title="Kontrol noktasi"
        description="Human review, evidence set ve release deadline ayni primitive ile gorunur."
        density="compact"
        columns={1}
        items={[
          {
            key: "approver",
            label: "Onaylayan",
            value: approverLabel,
            tone: status === "approved" ? "success" : "info",
          },
          {
            key: "due",
            label: "Vade",
            value: dueLabel,
            tone: status === "blocked" ? "warning" : "default",
          },
          {
            key: "evidence",
            label: "Kanit",
            value: `${evidenceItems.length}`,
            helper: evidenceItems.length
              ? evidenceItems.join(", ")
              : "Kanit baglantisi yok",
            tone: evidenceItems.length ? "success" : "warning",
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
        <div className="mt-4 flex flex-wrap gap-2 rounded-[24px] border border-[var(--border-subtle)]/70 bg-[var(--surface-card,rgba(255,255,255,0.6))] p-3 shadow-[0_16px_30px_-28px_var(--shadow-color,rgba(15,23,42,0.14))] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm">
          {citations.map((citation) => (
            <Badge key={citation} variant="muted">
              {citation}
            </Badge>
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
            access={accessState.isReadonly ? "readonly" : access}
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
            access={accessState.isReadonly ? "readonly" : access}
            title={accessReason}
          >
            {secondaryActionLabel}
          </Button>
        </div>
        {footerNote ? (
          <Text variant="secondary">{footerNote}</Text>
        ) : null}
      </div>
    </article>
  );
};

ApprovalCheckpoint.displayName = 'ApprovalCheckpoint';

export default ApprovalCheckpoint;
