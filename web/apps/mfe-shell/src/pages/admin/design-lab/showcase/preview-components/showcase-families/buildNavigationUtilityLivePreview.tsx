import React from 'react';
import {
  AnchorToc,
  Empty,
  Text,
} from '@mfe/design-system';
import { DesignLabBreadcrumbShowcase } from '../DesignLabBreadcrumbShowcase';
import { DesignLabMenuBarShowcase } from '../DesignLabMenuBarShowcase';
import { DesignLabStepsShowcase } from '../DesignLabStepsShowcase';
import { isMenuBarShowcaseItemName } from '../menu-bar';
import type {
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type NavigationUtilityLivePreviewContext = {
  PreviewPanel: PreviewPanelComponent;
  anchorTocLocaleText: React.ComponentProps<typeof AnchorToc>['localeText'];
  anchorValue: string;
  emptyMessages: Record<string, string>;
  setAnchorValue: (nextValue: string) => void;
  setStepsStatusRichValue: (nextValue: string) => void;
  setStepsValue: (nextValue: string) => void;
  stepsStatusRichValue: string;
  stepsValue: string;
  t: DesignLabTranslate;
};

export const buildNavigationUtilityLivePreview = (
  componentName: string,
  context: NavigationUtilityLivePreviewContext,
): React.ReactNode | null => {
  const {
    PreviewPanel,
    anchorTocLocaleText,
    anchorValue,
    emptyMessages,
    setAnchorValue,
    setStepsStatusRichValue,
    setStepsValue,
    stepsStatusRichValue,
    stepsValue,
    t,
  } = context;

  if (isMenuBarShowcaseItemName(componentName)) {
    return <DesignLabMenuBarShowcase itemName={componentName} />;
  }

  switch (componentName) {
    case 'Breadcrumb':
      return <DesignLabBreadcrumbShowcase />;
    case 'Steps':
      return (
        <DesignLabStepsShowcase
          stepsValue={stepsValue}
          stepsStatusRichValue={stepsStatusRichValue}
          onStepsValueChange={setStepsValue}
          onStepsStatusRichValueChange={setStepsStatusRichValue}
        />
      );
    case 'AnchorToc':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
            <AnchorToc
              value={anchorValue}
              onValueChange={setAnchorValue}
              title={t('designlab.showcase.component.anchorToc.title')}
              localeText={anchorTocLocaleText}
              items={[
                { id: 'overview', label: t('designlab.showcase.component.anchorToc.items.overview'), meta: 'P1' },
                { id: 'ux', label: t('designlab.showcase.component.anchorToc.items.ux'), level: 2, meta: 'P2' },
                { id: 'security', label: t('designlab.showcase.component.anchorToc.items.security'), level: 2, meta: 'P3' },
                { id: 'release', label: t('designlab.showcase.component.anchorToc.items.release'), level: 3, meta: 'P4' },
              ]}
            />
            <div className="flex flex-col gap-4 rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
              <PreviewPanel title={t('designlab.showcase.component.anchorToc.deepLink.title')}>
                <div className="flex flex-col gap-4">
                  <section id="overview" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                    <Text preset="title">{t('designlab.showcase.component.anchorToc.items.overview')}</Text>
                    <Text variant="secondary" className="mt-2 block">
                      {t('designlab.showcase.component.anchorToc.deepLink.overview')}
                    </Text>
                  </section>
                  <section id="ux" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                    <Text preset="title">{t('designlab.showcase.component.anchorToc.items.ux')}</Text>
                    <Text variant="secondary" className="mt-2 block">
                      {t('designlab.showcase.component.anchorToc.deepLink.ux')}
                    </Text>
                  </section>
                  <section id="security" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                    <Text preset="title">{t('designlab.showcase.component.anchorToc.items.security')}</Text>
                    <Text variant="secondary" className="mt-2 block">
                      {t('designlab.showcase.component.anchorToc.deepLink.security')}
                    </Text>
                  </section>
                  <section id="release" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                    <Text preset="title">{t('designlab.showcase.component.anchorToc.items.release')}</Text>
                    <Text variant="secondary" className="mt-2 block">
                      {t('designlab.showcase.component.anchorToc.deepLink.release')}
                    </Text>
                  </section>
                </div>
              </PreviewPanel>
            </div>
          </div>
        </div>
      );
    case 'Empty':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <Empty description={t('designlab.showcase.component.empty.catalogGroup')} />
        </div>
      );
    default:
      return null;
  }
};
