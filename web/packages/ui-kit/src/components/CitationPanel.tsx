import React from 'react';
import { Badge, type BadgeTone } from './Badge';
import { Empty } from './Empty';
import { Text } from './Text';
import { resolveAccessState, withAccessGuard, type AccessControlledProps, type AccessLevel } from '../runtime/access-controller';

export type CitationKind = 'policy' | 'doc' | 'code' | 'log' | 'dataset';

export interface CitationPanelItem {
  id: string;
  title: React.ReactNode;
  excerpt: React.ReactNode;
  source: React.ReactNode;
  locator?: React.ReactNode;
  kind?: CitationKind;
  badges?: React.ReactNode[];
}

export interface CitationPanelProps extends AccessControlledProps {
  items: CitationPanelItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  compact?: boolean;
  activeCitationId?: string | null;
  emptyStateLabel?: React.ReactNode;
  onOpenCitation?: (id: string, item: CitationPanelItem) => void;
  className?: string;
}

const kindTone: Record<CitationKind, BadgeTone> = {
  policy: 'info',
  doc: 'default',
  code: 'success',
  log: 'warning',
  dataset: 'muted',
};

export const CitationPanel: React.FC<CitationPanelProps> = ({
  items,
  title = 'Citations',
  description = 'Kaynak seffafligi ve alinti parcasi tek panel yuzeyinde okunur.',
  compact = false,
  activeCitationId = null,
  emptyStateLabel = 'Kaynak bulunamadi.',
  onOpenCitation,
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
      data-component="citation-panel"
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
          <Empty description={typeof emptyStateLabel === 'string' ? emptyStateLabel : 'Kaynak bulunamadi.'} />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const selected = item.id === activeCitationId;
            const blocked = accessState.isDisabled || accessState.isReadonly;
            const body = (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {item.kind ? <Badge tone={kindTone[item.kind]}>{item.kind}</Badge> : null}
                  {item.locator ? <Badge tone="muted">{item.locator}</Badge> : null}
                  {item.badges?.map((badge, index) => (
                    <React.Fragment key={`${item.id}-badge-${index}`}>{badge}</React.Fragment>
                  ))}
                </div>
                <div>
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </Text>
                  <Text variant="secondary" className="mt-1 block text-sm leading-6">
                    {item.source}
                  </Text>
                </div>
                <div className={`rounded-2xl bg-surface-default px-4 py-3 ${compact ? 'text-sm' : 'text-sm leading-7'} text-text-primary`}>
                  {item.excerpt}
                </div>
              </div>
            );

            return onOpenCitation ? (
              <button
                key={item.id}
                type="button"
                className={`w-full rounded-[26px] border px-4 py-4 text-left transition ${selected ? 'border-action-primary-border bg-action-primary-soft' : 'border-border-subtle bg-surface-canvas hover:bg-surface-default'} ${blocked ? 'cursor-not-allowed opacity-70' : ''}`}
                onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
                  interactionState,
                  () => onOpenCitation(item.id, item),
                  accessState.isDisabled,
                )}
                aria-current={selected ? 'true' : undefined}
                title={accessReason}
              >
                {body}
              </button>
            ) : (
              <div
                key={item.id}
                className={`rounded-[26px] border px-4 py-4 ${selected ? 'border-action-primary-border bg-action-primary-soft' : 'border-border-subtle bg-surface-canvas'}`}
              >
                {body}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CitationPanel;
