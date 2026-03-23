import React from 'react';
import { Text } from '@mfe/design-system';

type DesignLabHeroProps = {
  breadcrumbs: React.ReactNode;
  topBadges: React.ReactNode;
  activeHeroLabel: string;
  activeHeroTitle: string;
  activeHeroDescription: string;
  supportingContent?: React.ReactNode;
  action?: React.ReactNode;
  copiedMessage?: string | null;
  sectionNavigator?: React.ReactNode;
};

export const DesignLabHero: React.FC<DesignLabHeroProps> = ({
  breadcrumbs,
  topBadges,
  activeHeroLabel,
  activeHeroTitle,
  activeHeroDescription,
  supportingContent,
  action,
  copiedMessage,
  sectionNavigator,
}) => {
  const hasTopBadges = React.Children.count(topBadges) > 0;

  return (
    <>
      {breadcrumbs}
      <section
        data-testid="design-lab-detail-hero"
        className="overflow-hidden rounded-[28px] border border-border-subtle bg-surface-default shadow-xs"
      >
        <div className="px-6 py-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              {hasTopBadges ? <div className="mb-3 flex flex-wrap items-center gap-2">{topBadges}</div> : null}
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                {activeHeroLabel}
              </Text>
              <Text as="h1" className="mt-2 text-[2.35rem] font-semibold tracking-[-0.03em] text-text-primary">
                {activeHeroTitle}
              </Text>
              <Text variant="secondary" className="mt-3 block max-w-3xl text-[15px] leading-7">
                {activeHeroDescription}
              </Text>
              {supportingContent ? <div className="mt-5">{supportingContent}</div> : null}
              {copiedMessage ? (
                <Text variant="secondary" className="mt-3 block text-xs">
                  {copiedMessage}
                </Text>
              ) : null}
            </div>
            {action ? <div className="shrink-0 xl:pt-7">{action}</div> : null}
          </div>
          {sectionNavigator ? (
            <div className="mt-6 border-t border-border-subtle pt-4" data-testid="design-lab-hero-section-navigator">
              {sectionNavigator}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};
