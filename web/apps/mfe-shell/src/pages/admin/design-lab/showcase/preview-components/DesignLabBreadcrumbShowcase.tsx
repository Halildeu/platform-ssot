import React from 'react';
import { Breadcrumb, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../../useDesignLabI18n';

type DesignLabShowcasePanelProps = {
  title: string;
  children: React.ReactNode;
};

const DesignLabBreadcrumbPanel: React.FC<DesignLabShowcasePanelProps> = ({ title, children }) => (
  <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
    <Text as="div" preset="body-sm" className="mb-2 text-sm font-semibold text-text-primary">
      {title}
    </Text>
    {children}
  </div>
);

export const DesignLabBreadcrumbShowcase: React.FC = () => {
  const { t } = useDesignLabI18n();

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DesignLabBreadcrumbPanel title={t('designlab.showcase.component.breadcrumb.basic.title')}>
          <Breadcrumb
            items={[
              { label: t('designlab.showcase.component.breadcrumb.basic.admin'), href: '#admin' },
              { label: t('designlab.showcase.component.breadcrumb.basic.uiKit'), href: '#ui-kit' },
              { label: t('designlab.showcase.component.breadcrumb.basic.navigation') },
            ]}
          />
        </DesignLabBreadcrumbPanel>
        <DesignLabBreadcrumbPanel title={t('designlab.showcase.component.breadcrumb.collapsed.title')}>
          <Breadcrumb
            maxItems={4}
            items={[
              { label: t('designlab.showcase.component.breadcrumb.collapsed.workspace'), href: '#workspace' },
              { label: t('designlab.showcase.component.breadcrumb.collapsed.cockpit'), href: '#cockpit' },
              { label: t('designlab.showcase.component.breadcrumb.collapsed.libraries'), href: '#libraries' },
              { label: t('designlab.showcase.component.breadcrumb.collapsed.uiSystem'), href: '#ui-system' },
              { label: t('designlab.showcase.component.breadcrumb.collapsed.tabs') },
            ]}
          />
        </DesignLabBreadcrumbPanel>
      </div>
    </div>
  );
};
