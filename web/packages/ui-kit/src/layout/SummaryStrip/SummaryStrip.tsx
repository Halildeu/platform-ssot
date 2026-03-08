import React from 'react';
import clsx from 'clsx';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../../runtime/access-controller';
import { Text } from '../../components/Text';

export type SummaryStripTone = 'default' | 'info' | 'success' | 'warning';

export interface SummaryStripItem {
  key: React.Key;
  label: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
  trend?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: SummaryStripTone;
}

export interface SummaryStripProps extends AccessControlledProps {
  items: SummaryStripItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnsClass: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
};

const toneClass: Record<SummaryStripTone, string> = {
  default: 'border-border-subtle bg-surface-default',
  info: 'border-state-info-border bg-surface-panel',
  success: 'border-state-success-border bg-surface-panel',
  warning: 'border-state-warning-border bg-surface-panel',
};

export const SummaryStrip: React.FC<SummaryStripProps> = ({
  items,
  title,
  description,
  columns = 4,
  className,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  return (
    <section
      className={clsx('w-full', className)}
      data-access-state={accessState.state}
      data-component="summary-strip"
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
      <div className={clsx('mt-4 grid grid-cols-1 gap-4', columnsClass[columns])}>
        {items.map((item) => (
          <article
            key={item.key}
            className={clsx('rounded-[24px] border p-4 shadow-sm', toneClass[item.tone ?? 'default'])}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  {item.label}
                </Text>
                <div className="mt-2 flex items-center gap-2">
                  {item.icon ? <div className="text-text-secondary">{item.icon}</div> : null}
                  <Text as="div" className="text-[1.75rem] font-semibold tracking-[-0.04em] text-text-primary">
                    {item.value}
                  </Text>
                </div>
              </div>
              {item.trend ? <div className="shrink-0">{item.trend}</div> : null}
            </div>
            {item.note ? (
              <Text variant="secondary" className="mt-3 block text-sm leading-6">
                {item.note}
              </Text>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default SummaryStrip;
