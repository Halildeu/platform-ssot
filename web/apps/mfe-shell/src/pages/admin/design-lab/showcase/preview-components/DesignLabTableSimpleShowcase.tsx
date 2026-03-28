import React from 'react';
import { Badge, TableSimple, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../../useDesignLabI18n';

type DesignLabTableSimpleLocaleText = {
  emptyFallbackDescription: string;
};

type TableSimpleSectionRow = {
  policy?: string;
  owner?: string;
  status?: string;
  statusTone?: React.ComponentProps<typeof Badge>['tone'];
  updatedAt?: string;
};

type DesignLabTableSimpleShowcaseProps = {
  policyTableRows: Array<TableSimpleSectionRow>;
  tableSimpleLocaleText: DesignLabTableSimpleLocaleText;
};

type DesignLabTranslate = (key: string, params?: Record<string, unknown>) => string;

type DesignLabShowcasePanelProps = {
  title: string;
  children: React.ReactNode;
};

const DesignLabTableSimplePanel: React.FC<DesignLabShowcasePanelProps> = ({ title, children }) => (
  <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
    <Text as="div" className="mb-2 text-sm font-semibold text-text-primary">
      {title}
    </Text>
    {children}
  </div>
);

export const DesignLabTableSimpleShowcase: React.FC<DesignLabTableSimpleShowcaseProps> = ({
  policyTableRows,
  tableSimpleLocaleText,
}) => {
  const { t } = useDesignLabI18n();

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DesignLabTableSimplePanel title={t('designlab.showcase.component.tableSimple.live.policyStatus.panel')}>
          <TableSimple
            caption={t('designlab.showcase.component.tableSimple.live.policyStatus.caption')}
            description={t('designlab.showcase.component.tableSimple.live.policyStatus.description')}
            localeText={tableSimpleLocaleText}
            columns={[
              { key: 'policy', label: t('designlab.showcase.component.tableSimple.shared.columns.policy'), accessor: 'policy', emphasis: true, truncate: true },
              { key: 'owner', label: t('designlab.showcase.component.tableSimple.shared.columns.owner'), accessor: 'owner' },
              {
                key: 'status',
                label: t('designlab.showcase.component.tableSimple.shared.columns.status'),
                align: 'center',
                render: (row) => <Badge variant={(row as TableSimpleSectionRow).statusTone}>{(row as TableSimpleSectionRow).status}</Badge>,
              },
            ]}
            rows={policyTableRows}
            stickyHeader
          />
        </DesignLabTableSimplePanel>
        <DesignLabTableSimplePanel title={t('designlab.showcase.component.tableSimple.live.loadingEmpty.panel')}>
          <div className="flex flex-col gap-4">
            <TableSimple
              caption={t('designlab.showcase.component.tableSimple.live.loadingEmpty.loadingCaption')}
              localeText={tableSimpleLocaleText}
              columns={[
                { key: 'policy', label: t('designlab.showcase.component.tableSimple.shared.columns.policy'), accessor: 'policy' },
                { key: 'owner', label: t('designlab.showcase.component.tableSimple.shared.columns.owner'), accessor: 'owner' },
              ]}
              rows={[]}
              loading
            />
            <TableSimple
              caption={t('designlab.showcase.component.tableSimple.live.loadingEmpty.emptyCaption')}
              localeText={tableSimpleLocaleText}
              columns={[
                { key: 'policy', label: t('designlab.showcase.component.tableSimple.shared.columns.policy'), accessor: 'policy' },
                { key: 'owner', label: t('designlab.showcase.component.tableSimple.shared.columns.owner'), accessor: 'owner' },
              ]}
              rows={[]}
              emptyStateLabel={t('designlab.showcase.component.tableSimple.live.loadingEmpty.emptyState')}
              density="compact"
            />
          </div>
        </DesignLabTableSimplePanel>
      </div>
    </div>
  );
};

type DesignLabShowcaseSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
  content: React.ReactNode;
  kind?: 'live' | 'reference' | 'recipe';
};

export const getDesignLabTableSimpleSectionShowcase = ({
  policyTableRows,
  tableSimpleLocaleText,
  t,
}: DesignLabTableSimpleShowcaseProps & { t: DesignLabTranslate }) => {
  const sections: DesignLabShowcaseSection[] = [
    {
      id: 'table-simple-policy-list',
      eyebrow: t('designlab.showcase.component.tableSimple.sections.policyList.eyebrow'),
      title: t('designlab.showcase.component.tableSimple.sections.policyList.title'),
      description: t('designlab.showcase.component.tableSimple.sections.policyList.description'),
      badges: [
        t('designlab.showcase.component.tableSimple.sections.policyList.badge.table'),
        t('designlab.showcase.component.tableSimple.sections.policyList.badge.beta'),
        t('designlab.showcase.component.tableSimple.sections.policyList.badge.status'),
      ],
      content: (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <DesignLabTableSimplePanel title={t('designlab.showcase.component.tableSimple.sections.policyList.panelMatrix')}>
            <TableSimple
              caption={t('designlab.showcase.component.tableSimple.sections.policyList.caption')}
              description={t('designlab.showcase.component.tableSimple.sections.policyList.tableDescription')}
              localeText={tableSimpleLocaleText}
              columns={[
                {
                  key: 'policy',
                  label: t('designlab.showcase.component.tableSimple.shared.columns.policy'),
                  accessor: 'policy',
                  emphasis: true,
                  truncate: true,
                },
                { key: 'owner', label: t('designlab.showcase.component.tableSimple.shared.columns.owner'), accessor: 'owner' },
                {
                  key: 'status',
                  label: t('designlab.showcase.component.tableSimple.shared.columns.status'),
                  align: 'center',
                  render: (row) => <Badge variant={(row as TableSimpleSectionRow).statusTone}>{(row as TableSimpleSectionRow).status}</Badge>,
                },
                {
                  key: 'updatedAt',
                  label: t('designlab.showcase.component.tableSimple.shared.columns.updatedAt'),
                  accessor: 'updatedAt',
                  align: 'right',
                },
              ]}
              rows={policyTableRows}
              stickyHeader
            />
          </DesignLabTableSimplePanel>
          <DesignLabTableSimplePanel title={t('designlab.showcase.component.tableSimple.sections.policyList.panelGuidance')}>
            <Text variant="secondary" className="block leading-7">
              {t('designlab.showcase.component.tableSimple.sections.policyList.guidance')}
            </Text>
          </DesignLabTableSimplePanel>
        </div>
      ),
    },
    {
      id: 'table-simple-loading-empty',
      eyebrow: t('designlab.showcase.component.tableSimple.sections.loadingEmpty.eyebrow'),
      title: t('designlab.showcase.component.tableSimple.sections.loadingEmpty.title'),
      description: t('designlab.showcase.component.tableSimple.sections.loadingEmpty.description'),
      badges: [
        t('designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.loading'),
        t('designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.empty'),
        t('designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.compact'),
      ],
      content: (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DesignLabTableSimplePanel title={t('designlab.showcase.component.tableSimple.sections.loadingEmpty.panelLoading')}>
            <TableSimple
              caption={t('designlab.showcase.component.tableSimple.sections.loadingEmpty.loadingCaption')}
              localeText={tableSimpleLocaleText}
              columns={[
                { key: 'policy', label: t('designlab.showcase.component.tableSimple.shared.columns.policy'), accessor: 'policy' },
                { key: 'owner', label: t('designlab.showcase.component.tableSimple.shared.columns.owner'), accessor: 'owner' },
              ]}
              rows={[]}
              loading
            />
          </DesignLabTableSimplePanel>
          <DesignLabTableSimplePanel title={t('designlab.showcase.component.tableSimple.sections.loadingEmpty.panelEmpty')}>
            <TableSimple
              caption={t('designlab.showcase.component.tableSimple.sections.loadingEmpty.emptyCaption')}
              localeText={tableSimpleLocaleText}
              columns={[
                { key: 'policy', label: t('designlab.showcase.component.tableSimple.shared.columns.policy'), accessor: 'policy' },
                { key: 'owner', label: t('designlab.showcase.component.tableSimple.shared.columns.owner'), accessor: 'owner' },
              ]}
              rows={[]}
              emptyStateLabel={t('designlab.showcase.component.tableSimple.sections.loadingEmpty.emptyState')}
              density="compact"
            />
          </DesignLabTableSimplePanel>
        </div>
      ),
    },
    {
      id: 'table-simple-comparison-grid',
      eyebrow: 'Data display',
      title: 'Karsilastirmali policy tablosu',
      description: 'Striped, compact ve hizalanmis hucre davranisini ayni recipe icinde gosteren daha analitik bir table alternatifidir.',
      badges: ['comparison', 'striped', 'compact'],
      content: (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <DesignLabTableSimplePanel title="Kompakt karar matrisi">
            <TableSimple
              caption="Policy owner matrisi"
              description="Owner, durum ve guncellenme tarihi ayni tabloda karsilastirilir."
              localeText={tableSimpleLocaleText}
              density="compact"
              striped
              columns={[
                { key: 'policy', label: t('designlab.showcase.component.tableSimple.shared.columns.policy'), accessor: 'policy', emphasis: true, truncate: true },
                { key: 'owner', label: t('designlab.showcase.component.tableSimple.shared.columns.owner'), accessor: 'owner' },
                {
                  key: 'status',
                  label: t('designlab.showcase.component.tableSimple.shared.columns.status'),
                  align: 'center',
                  render: (row) => <Badge variant={(row as TableSimpleSectionRow).statusTone}>{(row as TableSimpleSectionRow).status}</Badge>,
                },
                {
                  key: 'updatedAt',
                  label: t('designlab.showcase.component.tableSimple.shared.columns.updatedAt'),
                  accessor: 'updatedAt',
                  align: 'right',
                },
              ]}
              rows={policyTableRows.slice(0, 3)}
            />
          </DesignLabTableSimplePanel>
          <DesignLabTableSimplePanel title="Kullanim notu">
            <Text variant="secondary" className="block leading-7">
              TableSimple, grid kadar agir olmayan ama listeden daha cok kolon semantigi gereken policy, registry ve owner karsilastirmalarinda iyi bir orta seviye cozum sunar.
            </Text>
          </DesignLabTableSimplePanel>
        </div>
      ),
    },
  ];

  return sections;
};
