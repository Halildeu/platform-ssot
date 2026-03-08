import React from 'react';
import {
  resolveAccessState,
  shouldBlockInteraction,
  type AccessControlledProps,
} from '../runtime/access-controller';
import { Badge, type BadgeTone } from './Badge';
import { Empty } from './Empty';
import { Skeleton } from './Skeleton';
import { Text } from './Text';

export type ListDensity = 'comfortable' | 'compact';
export type ListTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

export type ListItem = {
  key: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  badges?: Array<React.ReactNode | string>;
  tone?: ListTone;
  disabled?: boolean;
};

export interface ListProps extends AccessControlledProps {
  items: ListItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  density?: ListDensity;
  bordered?: boolean;
  emptyStateLabel?: React.ReactNode;
  loading?: boolean;
  selectedKey?: React.Key | null;
  onItemSelect?: (key: React.Key) => void;
  fullWidth?: boolean;
}

const densityClass: Record<ListDensity, string> = {
  comfortable: 'px-4 py-4',
  compact: 'px-4 py-3',
};

const toneClass: Record<ListTone, string> = {
  default: 'border-border-subtle bg-surface-default',
  info: 'border-state-info-border bg-surface-panel',
  success: 'border-state-success-border bg-surface-panel',
  warning: 'border-state-warning-border bg-surface-panel',
  danger: 'border-state-danger-border bg-surface-panel',
};

const badgeToneMap: Record<ListTone, BadgeTone> = {
  default: 'default',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export const List: React.FC<ListProps> = ({
  items,
  title,
  description,
  density = 'comfortable',
  bordered = true,
  emptyStateLabel = 'Liste için kayıt bulunamadı.',
  loading = false,
  selectedKey = null,
  onItemSelect,
  fullWidth = true,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);

  if (accessState.isHidden) {
    return null;
  }

  const showEmpty = !loading && items.length === 0;

  return (
    <section
      className={fullWidth ? 'w-full' : undefined}
      data-access-state={accessState.state}
      data-component="list"
      data-loading={loading ? 'true' : 'false'}
      data-testid="list-loading-state"
      aria-busy={loading || undefined}
      title={accessReason}
    >
      {title ? (
        <Text as="div" className="text-base font-semibold text-text-primary">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text variant="secondary" className="mt-1 block text-sm leading-6">
          {description}
        </Text>
      ) : null}

      <div className={`mt-4 overflow-hidden rounded-[26px] ${bordered ? 'border border-border-subtle' : ''} bg-surface-panel shadow-sm`}>
        {showEmpty ? (
          <div className="p-5">
            <Empty description={typeof emptyStateLabel === 'string' ? emptyStateLabel : 'Kayıt bulunamadı'} />
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <li key={`loading-${index}`} className={densityClass[density]}>
                    <div className="flex items-start gap-3">
                      <Skeleton variant="avatar" className="size-10 shrink-0" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton lines={1} />
                        <Skeleton lines={1} animated={false} />
                      </div>
                    </div>
                  </li>
                ))
              : items.map((item) => {
                  const itemTone = item.tone ?? 'default';
                  const selected = selectedKey === item.key;
                  const interactive = typeof onItemSelect === 'function';
                  const blocked = shouldBlockInteraction(accessState.state, item.disabled);
                  const sharedClassName = [
                    'w-full text-left transition-colors',
                    densityClass[density],
                    selected ? 'bg-state-info/40' : '',
                    blocked ? 'cursor-not-allowed opacity-70' : interactive ? 'hover:bg-surface-default active:bg-surface-default/80' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  const content = (
                    <div className="flex items-start gap-3">
                      {item.prefix ? <div className="flex shrink-0 pt-0.5">{item.prefix}</div> : null}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Text as="div" className="min-w-0 text-sm font-semibold text-text-primary">
                                {item.title}
                              </Text>
                              {item.badges?.map((badge, badgeIndex) =>
                                typeof badge === 'string' ? (
                                  <Badge key={`${item.key}-badge-${badgeIndex}`} tone={badgeToneMap[itemTone]}>
                                    {badge}
                                  </Badge>
                                ) : (
                                  <React.Fragment key={`${item.key}-badge-${badgeIndex}`}>{badge}</React.Fragment>
                                ),
                              )}
                            </div>
                            {item.description ? (
                              <Text variant="secondary" className="block text-sm leading-6">
                                {item.description}
                              </Text>
                            ) : null}
                          </div>
                          {(item.meta || item.suffix) ? (
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              {item.meta ? (
                                <Text variant="secondary" className="text-xs font-medium uppercase tracking-[0.16em]">
                                  {item.meta}
                                </Text>
                              ) : null}
                              {item.suffix}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <li key={item.key} className={toneClass[itemTone]} data-selected={selected ? 'true' : 'false'}>
                      {interactive ? (
                        <button
                          type="button"
                          className={sharedClassName}
                          aria-current={selected ? 'true' : undefined}
                          onClick={(event) => {
                            if (blocked) {
                              event.preventDefault();
                              event.stopPropagation();
                              return;
                            }
                            onItemSelect?.(item.key);
                          }}
                        >
                          {content}
                        </button>
                      ) : (
                        <div className={sharedClassName}>{content}</div>
                      )}
                    </li>
                  );
                })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default List;
