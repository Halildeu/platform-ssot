import React from 'react';
import clsx from 'clsx';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../../runtime/access-controller';
import { Avatar } from '../../components/Avatar';
import { Descriptions, type DescriptionsItem } from '../../components/Descriptions';
import { Text } from '../../components/Text';

export interface EntitySummaryBlockProps extends AccessControlledProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  avatar?: {
    src?: string;
    alt?: string;
    name?: string;
    fallbackIcon?: React.ReactNode;
  };
  actions?: React.ReactNode;
  items: DescriptionsItem[];
  className?: string;
}

export const EntitySummaryBlock: React.FC<EntitySummaryBlockProps> = ({
  title,
  subtitle,
  badge,
  avatar,
  actions,
  items,
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
      className={clsx('rounded-[28px] border border-border-subtle bg-surface-panel p-6 shadow-sm', className)}
      data-access-state={accessState.state}
      data-component="entity-summary-block"
      title={accessReason}
    >
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {avatar ? (
            <Avatar src={avatar.src} alt={avatar.alt} name={avatar.name} fallbackIcon={avatar.fallbackIcon} size="xl" />
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Text as="h3" className="text-xl font-semibold text-text-primary">
                {title}
              </Text>
              {badge ? <div>{badge}</div> : null}
            </div>
            {subtitle ? (
              <Text variant="secondary" className="mt-2 block text-sm leading-7">
                {subtitle}
              </Text>
            ) : null}
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <Descriptions items={items} columns={2} className="mt-0" />
    </section>
  );
};

export default EntitySummaryBlock;
