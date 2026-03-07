import React from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';
import { Empty } from './Empty';
import { Text } from './Text';

export type DescriptionsDensity = 'comfortable' | 'compact';
export type DescriptionsTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

export type DescriptionsItem = {
  key: string;
  label: React.ReactNode;
  value?: React.ReactNode;
  helper?: React.ReactNode;
  tone?: DescriptionsTone;
  span?: 1 | 2 | 3;
};

export interface DescriptionsProps extends AccessControlledProps {
  items: DescriptionsItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  columns?: 1 | 2 | 3;
  density?: DescriptionsDensity;
  bordered?: boolean;
  emptyStateLabel?: React.ReactNode;
  fullWidth?: boolean;
}

const densityClass: Record<DescriptionsDensity, string> = {
  comfortable: 'p-4',
  compact: 'p-3',
};

const toneClass: Record<DescriptionsTone, string> = {
  default: 'border-border-subtle bg-surface-default',
  info: 'border-state-info-border bg-surface-panel',
  success: 'border-state-success-border bg-surface-panel',
  warning: 'border-state-warning-border bg-surface-panel',
  danger: 'border-state-danger-border bg-surface-panel',
};

const columnClassMap: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 lg:grid-cols-2',
  3: 'grid-cols-1 lg:grid-cols-3',
};

const itemSpanClass = (span?: 1 | 2 | 3) => {
  if (span === 2) return 'lg:col-span-2';
  if (span === 3) return 'lg:col-span-3';
  return '';
};

export const Descriptions: React.FC<DescriptionsProps> = ({
  items,
  title,
  description,
  columns = 2,
  density = 'comfortable',
  bordered = true,
  emptyStateLabel = 'Gösterilecek detay bulunamadı.',
  fullWidth = true,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);

  if (accessState.isHidden) {
    return null;
  }

  return (
    <section
      className={fullWidth ? 'w-full' : undefined}
      data-access-state={accessState.state}
      data-component="descriptions"
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

      {items.length === 0 ? (
        <div className="mt-4 rounded-[26px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <Empty description={typeof emptyStateLabel === 'string' ? emptyStateLabel : 'Detay bulunamadı'} />
        </div>
      ) : (
        <div className={`mt-4 grid gap-4 ${columnClassMap[columns]}`}>
          {items.map((item) => (
            <div
              key={item.key}
              className={[
                'rounded-[24px] shadow-sm',
                bordered ? 'border' : '',
                toneClass[item.tone ?? 'default'],
                densityClass[density],
                itemSpanClass(item.span),
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {item.label}
              </Text>
              <div className="mt-2">
                {typeof item.value === 'string' || typeof item.value === 'number' ? (
                  <Text as="div" className="text-base font-semibold text-text-primary">
                    {item.value}
                  </Text>
                ) : item.value ? (
                  item.value
                ) : (
                  <Text variant="secondary">—</Text>
                )}
              </div>
              {item.helper ? (
                <Text variant="secondary" className="mt-2 block text-sm leading-6">
                  {item.helper}
                </Text>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Descriptions;
