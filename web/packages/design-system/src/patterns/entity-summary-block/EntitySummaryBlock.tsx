import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import { Avatar } from "../../primitives/avatar/Avatar";
import {
  Descriptions,
  type DescriptionsItem,
} from "../../components/descriptions/Descriptions";
import { Text } from "../../primitives/text/Text";

/* ------------------------------------------------------------------ */
/*  EntitySummaryBlock — Summary card with avatar, title & key-values  */
/* ------------------------------------------------------------------ */

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

const entitySummarySurfaceClassName =
  "relative overflow-hidden rounded-[32px] border border-[var(--border-subtle)]/80 bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,246,255,0.94)))] p-6 shadow-[0_24px_52px_-36px_var(--shadow-color,rgba(15,23,42,0.28))] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-7 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--surface-card,rgba(255,255,255,0.9))] before:to-transparent";

export const EntitySummaryBlock: React.FC<EntitySummaryBlockProps> = ({
  title,
  subtitle,
  badge,
  avatar,
  actions,
  items,
  className,
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  return (
    <section
      className={cn(entitySummarySurfaceClassName, className)}
      data-access-state={accessState.state}
      data-component="entity-summary-block"
      data-surface-appearance="premium"
      title={accessReason}
    >
      <div className="flex flex-wrap gap-4 border-b border-[var(--border-subtle)]/70 pb-5" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="flex min-w-0 items-start gap-4">
          {avatar ? (
            <Avatar
              src={avatar.src}
              alt={avatar.alt}
              initials={avatar.name}
              icon={avatar.fallbackIcon}
              size="xl"
            />
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Text
                as="h3"
                className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] break-words"
              >
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

EntitySummaryBlock.displayName = "EntitySummaryBlock";

export default EntitySummaryBlock;
