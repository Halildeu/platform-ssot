import React from "react";
import { Badge, type BadgeVariant } from "../../primitives/badge/Badge";
import { Text } from "../../primitives/text/Text";
import { EmptyState as Empty } from "../empty-state";
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from "../../internal/access-controller";

export type AIActionAuditActor = "ai" | "human" | "system";
export type AIActionAuditStatus =
  | "drafted"
  | "approved"
  | "executed"
  | "rejected"
  | "observed";

export interface AIActionAuditTimelineItem {
  id: string;
  actor: AIActionAuditActor;
  title: React.ReactNode;
  timestamp: React.ReactNode;
  summary?: React.ReactNode;
  status?: AIActionAuditStatus;
  badges?: React.ReactNode[];
}

export interface AIActionAuditTimelineProps extends AccessControlledProps {
  items: AIActionAuditTimelineItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  selectedId?: string | null;
  onSelectItem?: (id: string, item: AIActionAuditTimelineItem) => void;
  compact?: boolean;
  emptyStateLabel?: React.ReactNode;
  className?: string;
}

const actorTone: Record<AIActionAuditActor, BadgeVariant> = {
  ai: "info",
  human: "success",
  system: "muted",
};

const statusTone: Record<AIActionAuditStatus, BadgeVariant> = {
  drafted: "info",
  approved: "success",
  executed: "success",
  rejected: "danger",
  observed: "warning",
};

const auditTimelineSurfaceClassName =
  "relative overflow-hidden rounded-[32px] border border-[var(--border-subtle)]/80 bg-[var(--surface-card)] p-5 shadow-[0_24px_52px_-36px_var(--shadow-color)] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-7 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--surface-card)] before:to-transparent";

export const AIActionAuditTimeline: React.FC<AIActionAuditTimelineProps> = ({
  items,
  title = "Denetim zaman cizelgesi",
  description = "AI aksiyonlari ve insan onayi kronolojik iz olarak ayni timeline primitive ile gorunur.",
  selectedId = null,
  onSelectItem,
  compact = false,
  emptyStateLabel = "Timeline kaydi bulunamadi.",
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

  return (
    <section
      className={`${auditTimelineSurfaceClassName} ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="ai-action-audit-timeline"
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

      {items.length === 0 ? (
        <div className="mt-4 rounded-[24px] border border-[var(--border-subtle)]/70 bg-[var(--surface-card)] p-4 shadow-[0_18px_32px_-28px_var(--shadow-color)] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm">
          <Empty
            description={
              typeof emptyStateLabel === "string"
                ? emptyStateLabel
                : "Timeline kaydi bulunamadi."
            }
          />
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item, index) => {
            const selected = item.id === selectedId;
            const content = (
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center pt-1">
                  <span
                    className={`inline-flex h-3 w-3 rounded-full shadow-[0_0_0_4px_var(--surface-card)] ${selected ? "bg-[var(--accent-primary)]" : "bg-[var(--border-default)]"}`}
                  />
                  {index < items.length - 1 ? (
                    <span
                      className={`mt-2 h-full min-h-10 w-px ${selected ? "bg-[linear-gradient(180deg,var(--accent-primary-muted),var(--border-subtle-muted))]" : "bg-[linear-gradient(180deg,var(--border-subtle-muted),var(--border-subtle-muted))]"}`}
                    />
                  ) : null}
                </div>
                <div
                  className={`min-w-0 flex-1 overflow-hidden rounded-[24px] border px-4 py-4 ${selected ? "border-action-primary-border/70 bg-[var(--surface-card-alt)] shadow-[0_20px_36px_-28px_var(--shadow-color)] ring-1 ring-[var(--border-subtle)]/20" : "border-[var(--border-subtle)]/75 bg-[var(--surface-card-alt)] shadow-[0_16px_30px_-28px_var(--shadow-color)] ring-1 ring-[var(--border-subtle)]/20"} backdrop-blur-sm`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={actorTone[item.actor]}>{item.actor}</Badge>
                    {item.status ? (
                      <Badge variant={statusTone[item.status]}>
                        {item.status}
                      </Badge>
                    ) : null}
                    {item.badges?.map((badge, badgeIndex) => (
                      <React.Fragment key={`${item.id}-badge-${badgeIndex}`}>
                        {badge}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Text
                        as="div"
                        className="text-sm font-semibold text-[var(--text-primary)]"
                      >
                        {item.title}
                      </Text>
                      {item.summary ? (
                        <Text
                          variant="secondary"
                          className={`mt-1 block ${compact ? "text-sm" : "text-sm leading-6"}`}
                        >
                          {item.summary}
                        </Text>
                      ) : null}
                    </div>
                    <Text
                      variant="muted"
                      className="max-w-full truncate rounded-full border border-[var(--border-subtle)]/70 bg-[var(--surface-card)] px-2.5 py-1 text-xs font-medium uppercase tracking-[0.16em] shadow-[0_12px_24px_-24px_var(--shadow-color)] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm"
                    >
                      {item.timestamp}
                    </Text>
                  </div>
                </div>
              </div>
            );

            return (
              <li
                key={item.id}
                className={
                  selected
                    ? "rounded-[28px] bg-action-primary-soft/40 p-2"
                    : ""
                }
              >
                {onSelectItem ? (
                  <button
                    type="button"
                    className={`w-full text-left ${accessState.isDisabled || accessState.isReadonly ? "cursor-not-allowed opacity-80" : ""}`}
                    onClick={withAccessGuard<
                      React.MouseEvent<HTMLButtonElement>
                    >(
                      interactionState,
                      () => onSelectItem(item.id, item),
                      accessState.isDisabled,
                    )}
                    aria-current={selected ? "true" : undefined}
                    title={accessReason}
                  >
                    {content}
                  </button>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

AIActionAuditTimeline.displayName = 'AIActionAuditTimeline';

export default AIActionAuditTimeline;
