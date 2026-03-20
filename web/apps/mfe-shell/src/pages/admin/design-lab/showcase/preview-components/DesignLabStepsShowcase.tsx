import React from 'react';
import { Steps, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../../useDesignLabI18n';

type DesignLabStepsShowcaseProps = {
  stepsValue: string;
  stepsStatusRichValue: string;
  onStepsValueChange: (value: string) => void;
  onStepsStatusRichValueChange: (value: string) => void;
};

type DesignLabShowcasePanelProps = {
  title: string;
  children: React.ReactNode;
};

const DesignLabStepsPanel: React.FC<DesignLabShowcasePanelProps> = ({ title, children }) => (
  <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
    <Text as="div" preset="body-sm" className="mb-2 text-sm font-semibold text-text-primary">
      {title}
    </Text>
    {children}
  </div>
);

export const DesignLabStepsShowcase: React.FC<DesignLabStepsShowcaseProps> = ({
  stepsValue,
  stepsStatusRichValue,
  onStepsValueChange,
  onStepsStatusRichValueChange,
}) => {
  const { t } = useDesignLabI18n();

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DesignLabStepsPanel title={t('designlab.showcase.component.steps.interactive.title')}>
          <Steps
            value={stepsValue}
            onValueChange={onStepsValueChange}
            interactive
            items={[
              {
                value: 'draft',
                title: t('designlab.showcase.component.steps.interactive.draft.title'),
                description: t('designlab.showcase.component.steps.interactive.draft.description'),
              },
              {
                value: 'review',
                title: t('designlab.showcase.component.steps.interactive.review.title'),
                description: t('designlab.showcase.component.steps.interactive.review.description'),
              },
              {
                value: 'release',
                title: t('designlab.showcase.component.steps.interactive.release.title'),
                description: t('designlab.showcase.component.steps.interactive.release.description'),
              },
            ]}
          />
        </DesignLabStepsPanel>
        <DesignLabStepsPanel title={t('designlab.showcase.component.steps.vertical.title')}>
          <Steps
            value={stepsStatusRichValue}
            onValueChange={onStepsStatusRichValueChange}
            orientation="vertical"
            interactive
            items={[
              {
                value: 'scope',
                title: t('designlab.showcase.component.steps.vertical.scope.title'),
                description: t('designlab.showcase.component.steps.vertical.scope.description'),
              },
              {
                value: 'preview',
                title: t('designlab.showcase.component.steps.vertical.preview.title'),
                description: t('designlab.showcase.component.steps.vertical.preview.description'),
              },
              {
                value: 'security',
                title: t('designlab.showcase.component.steps.vertical.security.title'),
                description: t('designlab.showcase.component.steps.vertical.security.description'),
                optional: true,
              },
            ]}
          />
        </DesignLabStepsPanel>
      </div>
    </div>
  );
};
