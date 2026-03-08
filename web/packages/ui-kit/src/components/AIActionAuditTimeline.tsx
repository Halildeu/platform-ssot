import React from 'react';
import { Badge, type BadgeTone } from './Badge';
import { Empty } from './Empty';
import { Text } from './Text';
import { resolveAccessState, withAccessGuard, type AccessControlledProps, type AccessLevel } from '../runtime/access-controller';

export type AIActionAuditActor = 'ai' | 'human' | 'system';
export type AIActionAuditStatus = 'drafted' | 'approved' | 'executed' | 'rejected' | 'observed';

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

const actorTone: Record<AIActionAuditActor, BadgeTone> = {
  ai: 'info',
  human: 'success',
  system: 'muted',
};

const statusTone: Record<AIActionAuditStatus, BadgeTone> = {
  drafted: 'info',
  approved: 'success',
  executed: 'success',
  rejected: 'danger',
  observed: 'warning',
};

export const AIActionAuditTimeline: React.FC<AIActionAuditTimelineProps> = ({
  items,
  title = 'Audit timeline',
  description = 'AI aksiyonlari ve insan onayi kronolojik iz olarak ayni timeline primitive ile gorunur.',
  selectedId = null,
  onSelectItem,
  compact = false,
  emptyStateLabel = 'Timeline kaydi bulunamadi.',
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

  return (
    <section
      className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="ai-action-audit-timeline"
      title={accessReason}
    >
      <Text as="div" className="text-base font-semibold text-text-primary">
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      {items.length === 0 ? (
        <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
          <Empty description={typeof emptyStateLabel === 'string' ? emptyStateLabel : 'Timeline kaydi bulunamadi.'} />
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item, index) => {
            const selected = item.id === selectedId;
            const content = (
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center pt-1">
                  <span className={`inline-flex h-3 w-3 rounded-full ${selected ? 'bg-[var(--accent-primary)]' : 'bg-border-default'}`} />
                  {index < items.length - 1 ? <span className="mt-2 h-full min-h-10 w-px bg-border-subtle" /> : null}
                </div>
                <div className="min-w-0 flex-1 rounded-[24px] border border-border-subtle bg-surface-canvas px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={actorTone[item.actor]}>{item.actor}</Badge>
                    {item.status ? <Badge tone={statusTone[item.status]}>{item.status}</Badge> : null}
                    {item.badges?.map((badge, badgeIndex) => (
                      <React.Fragment key={`${item.id}-badge-${badgeIndex}`}>{badge}</React.Fragment>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Text as="div" className="text-sm font-semibold text-text-primary">
                        {item.title}
                      </Text>
                      {item.summary ? (
                        <Text variant="secondary" className={`mt-1 block ${compact ? 'text-sm' : 'text-sm leading-6'}`}>
                          {item.summary}
                        </Text>
                      ) : null}
                    </div>
                    <Text variant="muted" className="shrink-0 text-xs font-medium uppercase tracking-[0.16em]">
                      {item.timestamp}
                    </Text>
                  </div>
                </div>
              </div>
            );

            return (
              <li key={item.id} className={selected ? 'rounded-[28px] bg-action-primary-soft/50 p-2' : ''}>
                {onSelectItem ? (
                  <button
                    type="button"
                    className={`w-full text-left ${accessState.isDisabled || accessState.isReadonly ? 'cursor-not-allowed opacity-80' : ''}`}
                    onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
                      interactionState,
                      () => onSelectItem(item.id, item),
                      accessState.isDisabled,
                    )}
                    aria-current={selected ? 'true' : undefined}
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

export default AIActionAuditTimeline;
