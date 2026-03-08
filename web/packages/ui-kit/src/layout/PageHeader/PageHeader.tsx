import React from 'react';
import clsx from 'clsx';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../../runtime/access-controller';
import { Text } from '../../components/Text';

export interface PageHeaderProps extends AccessControlledProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  meta,
  status,
  actions,
  aside,
  compact = false,
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
      className={clsx(
        'rounded-[28px] border border-border-subtle bg-surface-panel shadow-sm',
        compact ? 'p-5' : 'p-6',
        className,
      )}
      data-access-state={accessState.state}
      data-component="page-header"
      aria-disabled={accessState.isDisabled || accessState.isReadonly || undefined}
      title={accessReason}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              {eyebrow}
            </Text>
          ) : null}
          <div className="mt-2 flex flex-wrap items-start gap-3">
            <Text as="h1" className="text-[2rem] font-semibold tracking-[-0.04em] text-text-primary">
              {title}
            </Text>
            {status ? <div className="pt-1">{status}</div> : null}
          </div>
          {description ? (
            <Text variant="secondary" className="mt-3 block max-w-3xl text-sm leading-7">
              {description}
            </Text>
          ) : null}
          {meta ? <div className="mt-4 flex flex-wrap gap-2">{meta}</div> : null}
        </div>
        {(actions || aside) ? (
          <div className="flex shrink-0 flex-col items-stretch gap-3 lg:max-w-[360px] lg:items-end">
            {actions ? <div className="flex flex-wrap justify-end gap-2">{actions}</div> : null}
            {aside ? <div className="w-full lg:w-auto">{aside}</div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PageHeader;
