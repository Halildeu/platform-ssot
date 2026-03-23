import React from 'react';
import { Badge, Tabs, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../useDesignLabI18n';
import { MigrationGovernancePanel } from './MigrationGovernancePanel';
import { BenchmarkParityPanel } from './BenchmarkParityPanel';
import { PlatformContractsCompliancePanel } from './PlatformContractsCompliancePanel';

type DesignLabDetailTab = 'overview' | 'demo' | 'api' | 'ux' | 'quality';

type DesignLabFoundationFamily = {
  foundationId: string;
  title?: string;
  groupTitle?: string;
  groupDescription?: string;
  intent: string;
  governanceBadges: string[];
};

type DesignLabFoundationItemSummary = {
  lifecycle: string;
  tokenCount: number;
  contractStatus: 'active' | 'draft' | 'deprecated';
};

export type DesignLabFoundationOverviewPanelId = 'summary' | 'tokens' | 'contracts';
export type DesignLabFoundationApiPanelId = 'runtime' | 'schema' | 'consumption';
export type DesignLabFoundationQualityPanelId = 'gates' | 'coverage' | 'a11y' | 'governance' | 'benchmark' | 'contracts';

type DesignLabFoundationDetailSectionsProps = {
  activeTab: DesignLabDetailTab;
  activeOverviewPanel: DesignLabFoundationOverviewPanelId;
  activeApiPanel: DesignLabFoundationApiPanelId;
  activeQualityPanel: DesignLabFoundationQualityPanelId;
  foundation: DesignLabFoundationFamily | null;
  demoContent: React.ReactNode;
  foundationContractId: string | null;
  selectedFoundationTokens: string[];
  selectedFoundationThemes: string[];
  selectedFoundationA11yGates: string[];
  selectedFoundationItems: DesignLabFoundationItemSummary[];
  onApiPanelChange: (panelId: DesignLabFoundationApiPanelId) => void;
  onQualityPanelChange: (panelId: DesignLabFoundationQualityPanelId) => void;
  onOverviewPanelChange: (panelId: DesignLabFoundationOverviewPanelId) => void;
  DocsSectionComponent: React.ComponentType<any>;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
};

const getFoundationGuidance = (
  groupTitle?: string,
  context: 'overview' | 'api' | 'quality' = 'overview',
) => {
  const normalized = (groupTitle ?? '').toLowerCase();

  if (normalized.includes('theme') || normalized.includes('token')) {
    return {
      useWhen:
        context === 'api'
          ? 'Token contract, CSS variable mapping ve runtime theme controller ayni API yuzeyinde toplanacaksa.'
          : 'Tema, token ve gorsel kimlik kararlari urun genelinde standardize edilecekse.',
      avoidWhen: 'Tek bir component icin lokal renk degisikligi yeterli oldugunda.',
      outcome: 'Theme ve token kararlari tek kaynaktan yonetilir; tutarsizlik azalir.',
      implementationCaution:
        context === 'quality'
          ? 'Token override zincirleri icinde orphan token ve circular reference kontrolu otomatik olmalidir.'
          : 'Semantic token → raw token mapping tek yonlu olmali; runtime icinde geriye donuk cozumleme yapmaktan kacinin.',
    };
  }

  if (normalized.includes('a11y') || normalized.includes('accessibility') || normalized.includes('i18n')) {
    return {
      useWhen:
        context === 'api'
          ? 'Accessibility contract, ARIA pattern ve focus-management kurallari API seviyesinde expose edilecekse.'
          : 'Erisilebirlik, lokalizasyon ve yon (RTL) kararlari tum katmanlara yatay olarak uygulanacaksa.',
      avoidWhen: 'Tek seferlik, prototip seviyesinde denemeler icin tam kontrat zorunlu degilse.',
      outcome: 'Platform genelinde a11y ve i18n tutarliligi artar; her component ayri caba harcamaz.',
      implementationCaution:
        'A11y gate check\'ler CI pipeline\'da non-blocking advisory olarak baslasin; blocker seviyesine kademeli gecilsin.',
    };
  }

  if (normalized.includes('dev') || normalized.includes('diagnostic') || normalized.includes('runtime')) {
    return {
      useWhen:
        context === 'api'
          ? 'Runtime hook, controller ve utility fonksiyonlari tek bir contract altinda sunulacaksa.'
          : 'Gelistirici araclar, hook\'lar ve runtime utility\'ler ortak bir katalog altinda izlenecekse.',
      avoidWhen: 'Sadece tek bir utility function icin tam foundation katalog gerekliligi yoksa.',
      outcome: 'Runtime utility ve hook kararlari tek kaynaktan takip edilir.',
      implementationCaution:
        'Hook ve utility signature\'lari semver-compatible tutulmali; breaking change icin migration guide zorunlu.',
    };
  }

  return {
    useWhen: 'Platform seviyesinde cross-cutting bir karar tum katmanlara yatay uygulanacaksa.',
    avoidWhen: 'Tek bir component veya recipe icin lokal karar yeterliyse.',
    outcome: 'Foundation kararlari tek merkezden yonetilir; katmanlar arasi tutarsizlik azalir.',
    implementationCaution:
      context === 'api'
        ? 'Foundation API contractlari component ve recipe katmanlarindan bagimsiz versiyonlanmalidir.'
        : 'Foundation degisiklikleri tum downstream katmanlari etkiler; impact analysis zorunlu.',
  };
};

const GuidancePanel: React.FC<{
  title: string;
  guidance: ReturnType<typeof getFoundationGuidance>;
  className?: string;
}> = ({ title, guidance, className }) => (
  <div className={`rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs ${className ?? ''}`.trim()}>
    <Text as="div" className="text-sm font-semibold text-text-primary">
      {title}
    </Text>
    <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
      <div className="rounded-[20px] border border-border-subtle bg-surface-default px-4 py-3">
        <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
          When to use
        </Text>
        <Text as="div" className="mt-2 text-sm font-semibold leading-6 text-text-primary">
          {guidance.useWhen}
        </Text>
      </div>
      <div className="rounded-[20px] border border-border-subtle bg-surface-default px-4 py-3">
        <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
          When not to use
        </Text>
        <Text as="div" className="mt-2 text-sm font-semibold leading-6 text-text-primary">
          {guidance.avoidWhen}
        </Text>
      </div>
      <div className="rounded-[20px] border border-border-subtle bg-surface-default px-4 py-3">
        <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
          Success outcome
        </Text>
        <Text as="div" className="mt-2 text-sm font-semibold leading-6 text-text-primary">
          {guidance.outcome}
        </Text>
      </div>
      {guidance.implementationCaution ? (
        <div className="rounded-[20px] border border-border-subtle bg-surface-default px-4 py-3 xl:col-span-3">
          <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
            Implementation caution
          </Text>
          <Text as="div" className="mt-2 text-sm font-semibold leading-6 text-text-primary">
            {guidance.implementationCaution}
          </Text>
        </div>
      ) : null}
    </div>
  </div>
);

const FoundationOverviewTab: React.FC<{
  activeOverviewPanel: DesignLabFoundationOverviewPanelId;
  foundation: DesignLabFoundationFamily | null;
  selectedFoundationTokens: string[];
  selectedFoundationThemes: string[];
  selectedFoundationA11yGates: string[];
  onOverviewPanelChange: (panelId: DesignLabFoundationOverviewPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
}> = ({
  activeOverviewPanel,
  foundation,
  selectedFoundationTokens,
  selectedFoundationThemes,
  selectedFoundationA11yGates,
  onOverviewPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  ShowcaseCardComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const ShowcaseCard = ShowcaseCardComponent;
  const guidance = getFoundationGuidance(foundation?.groupTitle);

  if (!foundation) {
    return (
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-xs">
        <Text variant="secondary">
          {t('designlab.foundation.overview.empty')}
        </Text>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.foundation.overview.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.foundation.overview.workspace.description')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <SectionBadge label={t('designlab.common.panelCountPlural', { count: 3 })} />
        </div>
      </div>

      <Tabs
        value={activeOverviewPanel}
        onValueChange={(value) => onOverviewPanelChange(value as DesignLabFoundationOverviewPanelId)}
        appearance="pill"
        listLabel={t('designlab.foundation.overview.workspace.title')}
        className="mt-5"
        items={[
          {
            value: 'summary',
            label: 'Summary',
            badge: <Badge variant="info">{foundation.governanceBadges.length}</Badge>,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                    <DetailLabel>{t('designlab.foundation.overview.summary')}</DetailLabel>
                    <Text as="div" className="mt-3 text-lg font-semibold text-text-primary">
                      {foundation.title ?? foundation.foundationId}
                    </Text>
                    {foundation.groupTitle ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <SectionBadge label={foundation.groupTitle} />
                      </div>
                    ) : null}
                    <Text variant="secondary" className="mt-2 block leading-7">
                      {foundation.intent}
                    </Text>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {foundation.governanceBadges.map((badge) => (
                        <SectionBadge key={badge} label={badge} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                    <DetailLabel>{t('designlab.foundation.overview.quickStatus')}</DetailLabel>
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <MetricCard label="Governance badges" value={foundation.governanceBadges.length} note="Cross-cutting platform signals" />
                      <MetricCard label="Tokens" value={selectedFoundationTokens.length} note="Design tokens governed by this foundation" />
                      <MetricCard label="Themes" value={selectedFoundationThemes.length} note="Theme presets covered" />
                      <MetricCard label="A11y gates" value={selectedFoundationA11yGates.length} note="Accessibility validation gates" />
                    </div>
                  </div>
                </div>

                <GuidancePanel title="Foundation governance guidance" guidance={guidance} />
              </div>
            ),
          },
          {
            value: 'tokens',
            label: 'Tokens',
            badge: <Badge variant="warning">{selectedFoundationTokens.length}</Badge>,
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>Design tokens</DetailLabel>
                  <Text variant="secondary" className="mt-2 block text-sm leading-6">
                    Semantic and raw tokens governed by this foundation family.
                  </Text>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedFoundationTokens.length
                      ? selectedFoundationTokens.map((token) => <SectionBadge key={token} label={token} />)
                      : <Text variant="secondary">No tokens declared yet.</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>Theme coverage</DetailLabel>
                  <Text variant="secondary" className="mt-2 block text-sm leading-6">
                    Theme presets where these tokens are active.
                  </Text>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedFoundationThemes.length
                      ? selectedFoundationThemes.map((theme) => <SectionBadge key={theme} label={theme} />)
                      : <Text variant="secondary">No theme binding declared.</Text>}
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: 'contracts',
            label: 'Contracts',
            badge: <Badge variant="success">3 layer</Badge>,
            content: (
              <ShowcaseCard
                eyebrow="Platform contract"
                title="Foundation governance across all layers"
                description="Foundations enforce cross-cutting rules that components, recipes and pages must comply with."
                badges={[
                  <SectionBadge key="foundation-id" label={foundation.foundationId} />,
                  <SectionBadge key="foundation-group" label={foundation.groupTitle ?? 'Foundation'} />,
                ]}
              >
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  <MetricCard label="Components" value="Must comply" note="All components inherit foundation tokens and a11y gates" />
                  <MetricCard label="Recipes" value="Must reference" note="Recipes reference foundation contracts in their binding" />
                  <MetricCard label="Pages" value="Must validate" note="Page shells validate foundation compliance at build time" />
                </div>
              </ShowcaseCard>
            ),
          },
        ]}
      />
    </div>
  );
};

const FoundationApiTab: React.FC<{
  activeApiPanel: DesignLabFoundationApiPanelId;
  foundation: DesignLabFoundationFamily | null;
  foundationContractId: string | null;
  selectedFoundationTokens: string[];
  onApiPanelChange: (panelId: DesignLabFoundationApiPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
}> = ({
  activeApiPanel,
  foundation,
  foundationContractId,
  selectedFoundationTokens,
  onApiPanelChange,
  DetailLabelComponent,
  MetricCardComponent,
  CodeBlockComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const MetricCard = MetricCardComponent;
  const CodeBlock = CodeBlockComponent;
  const guidance = getFoundationGuidance(foundation?.groupTitle, 'api');

  if (!foundation) {
    return <Text variant="secondary">{t('designlab.foundation.api.empty')}</Text>;
  }

  const runtimeCode = `import { useTheme, useTokens } from '@mfe/design-system';\n\n// Runtime access to foundation tokens\nconst theme = useTheme();\nconst tokens = useTokens('${foundation.foundationId}');\n\n// Contract: ${foundationContractId ?? 'foundation-contract'}\n// Intent: ${foundation.intent}`;

  const schemaCode = `// Token schema for ${foundation.foundationId}\n{\n  "tokenFamily": "${foundation.foundationId}",\n  "semanticTokens": ${JSON.stringify(selectedFoundationTokens.slice(0, 4), null, 2)},\n  "governance": ${JSON.stringify(foundation.governanceBadges.slice(0, 3), null, 2)}\n}`;

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Foundation runtime contract</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.tabs.api.description.foundations')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <Badge variant="muted">{t('designlab.common.panelCountPlural', { count: 3 })}</Badge>
        </div>
      </div>

      <GuidancePanel title="Runtime contract guidance" guidance={guidance} className="mt-5" />

      <Tabs
        value={activeApiPanel}
        onValueChange={(value) => onApiPanelChange(value as DesignLabFoundationApiPanelId)}
        appearance="pill"
        listLabel="Foundation API panels"
        className="mt-5"
        items={[
          {
            value: 'runtime',
            label: 'Runtime',
            badge: <Badge variant="info">{foundation.governanceBadges.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>Runtime hook contract</DetailLabel>
                <CodeBlock code={runtimeCode} className="mt-3" />
              </div>
            ),
          },
          {
            value: 'schema',
            label: 'Schema',
            badge: <Badge variant="warning">{selectedFoundationTokens.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>Token schema</DetailLabel>
                <CodeBlock code={schemaCode} className="mt-3" />
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <MetricCard label="Foundation ID" value={foundation.foundationId} note="Canonical foundation family key" />
                  <MetricCard label="Contract" value={foundationContractId ?? '-'} note="Platform governance contract" />
                  <MetricCard label="Tokens" value={selectedFoundationTokens.length} note="Total governed tokens" />
                  <MetricCard label="Governance" value={foundation.governanceBadges.length} note="Active governance badges" />
                </div>
              </div>
            ),
          },
          {
            value: 'consumption',
            label: 'Consumption',
            badge: <Badge variant="success">3</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>Consumer patterns</DetailLabel>
                <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                  <MetricCard label="Hook pattern" value="useTokens()" note="Access tokens via React hook in any component" />
                  <MetricCard label="CSS variable" value="var(--token-*)" note="Use CSS variables for style-level token consumption" />
                  <MetricCard label="Theme preset" value="ThemeProvider" note="Wrap subtree with preset to override tokens" />
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

const FoundationQualityTab: React.FC<{
  activeQualityPanel: DesignLabFoundationQualityPanelId;
  foundation: DesignLabFoundationFamily | null;
  selectedFoundationItems: DesignLabFoundationItemSummary[];
  selectedFoundationA11yGates: string[];
  selectedFoundationThemes: string[];
  onQualityPanelChange: (panelId: DesignLabFoundationQualityPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({
  activeQualityPanel,
  foundation,
  selectedFoundationItems,
  selectedFoundationA11yGates,
  selectedFoundationThemes,
  onQualityPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const guidance = getFoundationGuidance(foundation?.groupTitle, 'quality');

  if (!foundation) {
    return <Text variant="secondary">{t('designlab.foundation.quality.empty')}</Text>;
  }

  const activeContracts = selectedFoundationItems.filter((item) => item.contractStatus === 'active').length;
  const draftContracts = selectedFoundationItems.filter((item) => item.contractStatus === 'draft').length;
  const totalTokens = selectedFoundationItems.reduce((sum, item) => sum + item.tokenCount, 0);

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Foundation quality workspace</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.tabs.quality.description.foundations')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <Badge variant="muted">{t('designlab.common.panelCountPlural', { count: 6 })}</Badge>
        </div>
      </div>

      <GuidancePanel title="Foundation quality guidance" guidance={guidance} className="mt-5" />

      <Tabs
        value={activeQualityPanel}
        onValueChange={(value) => onQualityPanelChange(value as DesignLabFoundationQualityPanelId)}
        appearance="pill"
        listLabel="Foundation quality panels"
        className="mt-5"
        items={[
          {
            value: 'gates',
            label: 'Gates',
            badge: <Badge variant="info">{selectedFoundationA11yGates.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>Platform quality gates</DetailLabel>
                <Text variant="secondary" className="mt-2 block text-sm leading-6">
                  Cross-cutting quality gates enforced by this foundation family.
                </Text>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFoundationA11yGates.length
                    ? selectedFoundationA11yGates.map((gate) => <SectionBadge key={gate} label={gate} />)
                    : <Text variant="secondary">No foundation quality gates declared.</Text>}
                </div>
              </div>
            ),
          },
          {
            value: 'coverage',
            label: 'Coverage',
            badge: <Badge variant="warning">{selectedFoundationItems.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>Foundation coverage metrics</DetailLabel>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <MetricCard label="Active contracts" value={activeContracts} note="Stable and enforced foundation contracts" />
                  <MetricCard label="Draft contracts" value={draftContracts} note="In-progress foundation contracts" />
                  <MetricCard label="Total tokens" value={totalTokens} note="Design tokens across all foundation items" />
                </div>
              </div>
            ),
          },
          {
            value: 'a11y',
            label: 'Accessibility',
            badge: <Badge variant="success">{selectedFoundationThemes.length}</Badge>,
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>Accessibility compliance</DetailLabel>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <MetricCard label="Color contrast" value="WCAG AA" note="Minimum contrast ratio enforcement" />
                    <MetricCard label="Focus management" value="Keyboard-first" note="All interactive surfaces keyboard-navigable" />
                    <MetricCard label="Screen reader" value="ARIA patterns" note="Semantic ARIA roles enforced" />
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>Theme accessibility coverage</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedFoundationThemes.length
                      ? selectedFoundationThemes.map((theme) => <SectionBadge key={theme} label={theme} />)
                      : <Text variant="secondary">No theme coverage declared.</Text>}
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: 'governance',
            label: 'Governance',
            badge: <Badge variant="warning">5 dim</Badge>,
            content: (
              <MigrationGovernancePanel
                layer="foundations"
                DetailLabelComponent={DetailLabelComponent}
                SectionBadgeComponent={SectionBadgeComponent}
                MetricCardComponent={MetricCardComponent}
              />
            ),
          },
          {
            value: 'benchmark',
            label: 'Benchmark',
            badge: <Badge variant="info">12</Badge>,
            content: (
              <BenchmarkParityPanel
                layerFilter="foundations"
                DetailLabelComponent={DetailLabelComponent}
                SectionBadgeComponent={SectionBadgeComponent}
                MetricCardComponent={MetricCardComponent}
              />
            ),
          },
          {
            value: 'contracts',
            label: 'Contracts',
            badge: <Badge variant="success">8</Badge>,
            content: (
              <PlatformContractsCompliancePanel
                layerFilter="foundations"
                DetailLabelComponent={DetailLabelComponent}
                SectionBadgeComponent={SectionBadgeComponent}
                MetricCardComponent={MetricCardComponent}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export const DesignLabFoundationDetailSections: React.FC<DesignLabFoundationDetailSectionsProps> = ({
  activeTab,
  activeOverviewPanel,
  activeApiPanel,
  activeQualityPanel,
  foundation,
  demoContent,
  foundationContractId,
  selectedFoundationTokens,
  selectedFoundationThemes,
  selectedFoundationA11yGates,
  selectedFoundationItems,
  onApiPanelChange,
  onQualityPanelChange,
  onOverviewPanelChange,
  DocsSectionComponent,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  ShowcaseCardComponent,
  CodeBlockComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DocsSection = DocsSectionComponent;
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;

  switch (activeTab) {
    case 'demo':
      return (
        <DocsSection
          id="design-lab-foundation-section-demo"
          eyebrow="Workspace"
          title={t('designlab.tabs.demo.label.foundations')}
          description={t('designlab.tabs.demo.description.foundations')}
        >
          <div data-detail-section-id="demo">{demoContent}</div>
        </DocsSection>
      );
    case 'api':
      return (
        <DocsSection
          id="design-lab-foundation-section-api"
          eyebrow="Workspace"
          title={t('designlab.tabs.api.label.foundations')}
          description={t('designlab.tabs.api.description.foundations')}
        >
          <div data-detail-section-id="api">
            <FoundationApiTab
              activeApiPanel={activeApiPanel}
              foundation={foundation}
              foundationContractId={foundationContractId}
              selectedFoundationTokens={selectedFoundationTokens}
              onApiPanelChange={onApiPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              MetricCardComponent={MetricCardComponent}
              CodeBlockComponent={CodeBlockComponent}
            />
          </div>
        </DocsSection>
      );
    case 'ux':
      return (
        <DocsSection
          id="design-lab-foundation-section-ux"
          eyebrow="Workspace"
          title={t('designlab.tabs.ux.label.foundations')}
          description={t('designlab.tabs.ux.description.foundations')}
        >
          <div data-detail-section-id="ux">
            {foundation ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
                    <DetailLabel>Token visual identity</DetailLabel>
                    <Text variant="secondary" className="mt-2 block text-sm leading-6">
                      Foundation token&apos;larinin gorsel kimlik uzerine etkisi ve theme uyumu.
                    </Text>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedFoundationThemes.length
                        ? selectedFoundationThemes.map((theme) => <SectionBadge key={theme} label={theme} />)
                        : <Text variant="secondary">No theme coverage declared.</Text>}
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
                    <DetailLabel>Cross-cutting UX signals</DetailLabel>
                    <Text variant="secondary" className="mt-2 block text-sm leading-6">
                      Accessibility, i18n ve motion standard&apos;larinin governance durumu.
                    </Text>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedFoundationA11yGates.length
                        ? selectedFoundationA11yGates.map((gate) => <SectionBadge key={gate} label={gate} />)
                        : <Text variant="secondary">No a11y gates declared.</Text>}
                    </div>
                  </div>
                </div>

                {/* Token preview live renderer */}
                <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
                  <DetailLabel>Token preview renderer</DetailLabel>
                  <Text variant="secondary" className="mt-1 block text-xs leading-5">
                    Foundation token&apos;larinin canli gorsel on izlemesi. Her token CSS variable olarak gosterilir.
                  </Text>
                  <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {/* Color tokens preview */}
                    <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
                      <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Color tokens</Text>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {['primary', 'secondary', 'success', 'warning', 'error', 'info', 'surface', 'border'].map((tokenGroup) => (
                          <div key={tokenGroup} className="text-center">
                            <div
                              className="mx-auto h-8 w-8 rounded-lg border border-border-subtle shadow-xs"
                              style={{ backgroundColor: `var(--color-${tokenGroup}, var(--color-action-${tokenGroup}, #ddd))` }}
                            />
                            <Text variant="secondary" className="mt-1 block text-[8px]">{tokenGroup}</Text>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spacing tokens preview */}
                    <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
                      <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Spacing tokens</Text>
                      <div className="mt-3 space-y-2">
                        {[
                          { label: 'xs', width: '8px' },
                          { label: 'sm', width: '12px' },
                          { label: 'md', width: '16px' },
                          { label: 'lg', width: '24px' },
                          { label: 'xl', width: '32px' },
                          { label: '2xl', width: '48px' },
                        ].map((spacing) => (
                          <div key={spacing.label} className="flex items-center gap-2">
                            <Text variant="secondary" className="w-8 text-[9px] text-right">{spacing.label}</Text>
                            <div
                              className="h-3 rounded-xs bg-action-primary/20 border border-action-primary/30"
                              style={{ width: spacing.width }}
                            />
                            <Text variant="secondary" className="text-[9px]">{spacing.width}</Text>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typography tokens */}
                    <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
                      <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Typography scale</Text>
                      <div className="mt-3 space-y-2">
                        {[
                          { label: 'Display', size: '2rem', weight: '700' },
                          { label: 'Heading', size: '1.5rem', weight: '600' },
                          { label: 'Title', size: '1.125rem', weight: '600' },
                          { label: 'Body', size: '0.875rem', weight: '400' },
                          { label: 'Caption', size: '0.75rem', weight: '500' },
                          { label: 'Overline', size: '0.625rem', weight: '600' },
                        ].map((type) => (
                          <div key={type.label} className="flex items-baseline gap-2">
                            <span
                              className="text-text-primary"
                              style={{ fontSize: type.size, fontWeight: type.weight, lineHeight: '1.3' }}
                            >
                              {type.label}
                            </span>
                            <Text variant="secondary" className="text-[9px]">{type.size} / {type.weight}</Text>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Radius tokens */}
                    <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
                      <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Radius & shadow tokens</Text>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {[
                          { label: 'sm', radius: '8px' },
                          { label: 'md', radius: '12px' },
                          { label: 'lg', radius: '20px' },
                          { label: 'xl', radius: '28px' },
                          { label: 'full', radius: '9999px' },
                          { label: 'none', radius: '0px' },
                        ].map((rad) => (
                          <div key={rad.label} className="text-center">
                            <div
                              className="mx-auto h-10 w-10 border border-border-subtle bg-surface-panel shadow-xs"
                              style={{ borderRadius: rad.radius }}
                            />
                            <Text variant="secondary" className="mt-1 block text-[8px]">{rad.label} ({rad.radius})</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Token count summary */}
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <MetricCardComponent label="Token families" value={selectedFoundationTokens.length} note="Governed token sayisi" />
                    <MetricCardComponent label="Theme presets" value={selectedFoundationThemes.length} note="Active theme sayisi" />
                    <MetricCardComponent label="A11y gates" value={selectedFoundationA11yGates.length} note="Accessibility gate sayisi" />
                    <MetricCardComponent label="Governance" value={foundation.governanceBadges.length} note="Governance badge sayisi" />
                  </div>
                </div>

                <GuidancePanel
                  title="Foundation UX guidance"
                  guidance={getFoundationGuidance(foundation?.groupTitle)}
                />
              </div>
            ) : (
              <Text variant="secondary">{t('designlab.foundation.overview.empty')}</Text>
            )}
          </div>
        </DocsSection>
      );
    case 'quality':
      return (
        <DocsSection
          id="design-lab-foundation-section-quality"
          eyebrow="Workspace"
          title={t('designlab.tabs.quality.label.foundations')}
          description={t('designlab.tabs.quality.description.foundations')}
        >
          <div data-detail-section-id="quality">
            <FoundationQualityTab
              activeQualityPanel={activeQualityPanel}
              foundation={foundation}
              selectedFoundationItems={selectedFoundationItems}
              selectedFoundationA11yGates={selectedFoundationA11yGates}
              selectedFoundationThemes={selectedFoundationThemes}
              onQualityPanelChange={onQualityPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              MetricCardComponent={MetricCardComponent}
            />
          </div>
        </DocsSection>
      );
    case 'overview':
    default:
      return (
        <DocsSection
          id="design-lab-foundation-section-overview"
          eyebrow="Workspace"
          title={t('designlab.tabs.overview.label.foundations')}
          description={t('designlab.tabs.overview.description.foundations')}
        >
          <div data-detail-section-id="overview">
            <FoundationOverviewTab
              activeOverviewPanel={activeOverviewPanel}
              foundation={foundation}
              selectedFoundationTokens={selectedFoundationTokens}
              selectedFoundationThemes={selectedFoundationThemes}
              selectedFoundationA11yGates={selectedFoundationA11yGates}
              onOverviewPanelChange={onOverviewPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              MetricCardComponent={MetricCardComponent}
              ShowcaseCardComponent={ShowcaseCardComponent}
            />
          </div>
        </DocsSection>
      );
  }
};
