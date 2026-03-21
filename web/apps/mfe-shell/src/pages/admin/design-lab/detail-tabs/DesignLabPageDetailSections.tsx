import React from 'react';
import { Badge, Tabs, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../useDesignLabI18n';
import { MigrationGovernancePanel } from './MigrationGovernancePanel';
import { BenchmarkParityPanel } from './BenchmarkParityPanel';
import { PlatformContractsCompliancePanel } from './PlatformContractsCompliancePanel';

type DesignLabDetailTab = 'general' | 'overview' | 'demo' | 'api' | 'ux' | 'quality';

type DesignLabPageTemplate = {
  recipeId: string;
  title?: string;
  clusterTitle?: string;
  clusterDescription?: string;
  intent: string;
  ownerBlocks: string[];
};

type DesignLabPageItemSummary = {
  lifecycle: string;
  demoMode: string;
};

export type DesignLabPageOverviewPanelId = 'summary' | 'regions' | 'adoption' | 'gallery';
export type DesignLabPageApiPanelId = 'contract' | 'regions' | 'dependencies';
export type DesignLabPageQualityPanelId = 'gates' | 'readiness' | 'governance' | 'benchmark' | 'contracts';

type DesignLabPageDetailSectionsProps = {
  activeTab: DesignLabDetailTab;
  activeOverviewPanel: DesignLabPageOverviewPanelId;
  activeApiPanel: DesignLabPageApiPanelId;
  activeQualityPanel: DesignLabPageQualityPanelId;
  template: DesignLabPageTemplate | null;
  generalContent: React.ReactNode;
  demoContent: React.ReactNode;
  templateContractId: string | null;
  selectedTemplateTracks: string[];
  selectedTemplateSections: string[];
  selectedTemplateThemes: string[];
  selectedTemplateQualityGates: string[];
  selectedTemplateItems: DesignLabPageItemSummary[];
  onApiPanelChange: (panelId: DesignLabPageApiPanelId) => void;
  onQualityPanelChange: (panelId: DesignLabPageQualityPanelId) => void;
  onOverviewPanelChange: (panelId: DesignLabPageOverviewPanelId) => void;
  DocsSectionComponent: React.ComponentType<any>;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
  UsageRecipesPanelComponent: React.ComponentType<any>;
};

const getPageGuidance = (
  clusterTitle?: string,
  context: 'overview' | 'ux' | 'quality' | 'api' = 'overview',
) => {
  const normalized = (clusterTitle ?? '').toLowerCase();

  if (normalized.includes('dashboard')) {
    return {
      useWhen:
        context === 'api'
          ? 'Dashboard shell icin layout bolgeleri, veri bloklari ve bagli bileşenler ayni contract altinda toplanacaksa.'
          : 'KPI, summary ve karar bloklari ayni sayfa shell icinde birlikte okunacaksa.',
      avoidWhen:
        context === 'ux'
          ? 'Tek kolonlu, gecici veya dashboard ritmi gerektirmeyen kucuk ekranlarda.'
          : 'Basit bir detay veya tek gorev ekranini dashboard kabuguna zorlamak gereksizse.',
      outcome: 'Dashboard template secimi daha hizli ve daha okunur olur.',
      implementationCaution:
        context === 'quality'
          ? 'Dashboard shell icinde birden fazla veri kaynagi varsa loading ve stale-data davranisi tek merkezden yonetilmelidir.'
          : 'Hero, summary strip ve grid ritmi ayni shell icinde asiri yogunlasmamali; ust alan ile is yuzeyi ayrik tutulmalidir.',
    };
  }

  if (normalized.includes('settings') || normalized.includes('configuration')) {
    return {
      useWhen:
        context === 'api'
          ? 'Section tab, secondary nav ve form alanlari ayni page contract ile dagitilacaksa.'
          : 'Ayar, preference ve governance yuzeyleri ayni shell icinde sakin bir ritimle toplanacaksa.',
      avoidWhen: 'Tek bir local preference veya modal-level ayar icin tam sayfa kabuk gerekmiyorsa.',
      outcome: 'Settings template hem governance hem de usability acisindan daha tutarli olur.',
      implementationCaution:
        context === 'quality'
          ? 'Settings ekranlarinda optimistic update ile kalici kayit davranisi karistirilirsa kullanici guveni zedelenir.'
          : 'Primary action, section nav ve unsaved-changes davranisi page shell seviyesinde netlesmelidir.',
    };
  }

  if (
    normalized.includes('detail')
    || normalized.includes('review')
    || normalized.includes('approval')
  ) {
    return {
      useWhen:
        context === 'ux'
          ? 'Primary entity, inspector paneli ve karar aksiyonlari ayni ekran ritminde okunacaksa.'
          : 'Detay, inceleme ve karar yuzeyi ayni shell ustunde standardize edilecekse.',
      avoidWhen: 'Sadece liste icinde acilan hafif drawer veya inline expansion yeterliyse.',
      outcome: 'Detail template varyantlari ekipler arasinda daha hizli align olur.',
      implementationCaution:
        context === 'api'
          ? 'Detail template bagimliliklari liste, detail ve action servisleri arasinda daginiksiz bir contract ile toplanmalidir.'
          : 'Yan panel, action rail ve content density ayni anda agresiflestirilirse ekran kolay boğulur.',
    };
  }

  if (
    normalized.includes('search')
    || normalized.includes('command')
    || normalized.includes('workspace')
    || normalized.includes('crud')
  ) {
    return {
      useWhen:
        context === 'api'
          ? 'Search shell, filter bar, result surface ve command entry ayni page dependency modeli icinde tutulacaksa.'
          : 'Arama, filtre, liste ve aksiyon ritmi ayni calisma yuzeyinde yasayacaksa.',
      avoidWhen: 'Tek adimli form veya minimal browse ekranlarinda bu kadar agir shell gerekmiyorsa.',
      outcome: 'Workspace template buyuk veri ve uzun akislar icin daha yonetilebilir kalir.',
      implementationCaution:
        context === 'quality'
          ? 'Search-first shell icinde pagination, empty state ve loading davranislari birlikte regression kapsaminda olmalidir.'
          : 'Header search, filter context ve result density ayni anda rekabet etmemeli; hiyerarsi net kalmalidir.',
    };
  }

  return {
    useWhen: 'Tam sayfa kabuk, layout bolgeleri ve app shell hizasi ayni anda karar verilmek isteniyorsa.',
    avoidWhen: 'Sadece tek bir component veya lokal recipe secimi yeterliyse.',
    outcome: 'Template secimi daha sistematik ve daha tekrar kullanilabilir olur.',
    implementationCaution:
      context === 'api'
        ? 'Page shell contracti component import listesine degil, layout bolgeleri ve dependency sınırlarına gore kurulmalidir.'
        : 'Template vitrininde ayni anda cok fazla secondary surface acilirsa bilgi kokusu tekrar yukselir.',
  };
};

/* ── Template Preview Gallery Constants ── */

const TEMPLATE_GALLERY_ITEMS = [
  {
    templateId: 'dashboard_kpi',
    title: 'Dashboard & KPI',
    regions: ['hero', 'summary_strip', 'grid_body', 'sidebar_filter'],
    intent: 'KPI, metric ve ozet bloklarini bir dashboard shell icinde birlestiren layout.',
    complexity: 'moderate' as const,
    previewLayout: 'grid-2x2',
  },
  {
    templateId: 'settings_config',
    title: 'Settings & Configuration',
    regions: ['nav_tabs', 'form_body', 'save_bar'],
    intent: 'Ayar ve preference yuzeylerini sakin bir ritimle yoneten layout.',
    complexity: 'simple' as const,
    previewLayout: 'sidebar-main',
  },
  {
    templateId: 'detail_review',
    title: 'Detail & Review',
    regions: ['header_bar', 'primary_content', 'inspector_panel', 'action_rail'],
    intent: 'Detay inceleme ve karar aksiyonlarini ayni ekranda toplayan layout.',
    complexity: 'complex' as const,
    previewLayout: 'main-aside',
  },
  {
    templateId: 'search_workspace',
    title: 'Search & Workspace',
    regions: ['search_header', 'filter_bar', 'result_list', 'preview_pane'],
    intent: 'Arama, filtre ve sonuc islemleri icin optimize edilmis calisma yuzeyi.',
    complexity: 'complex' as const,
    previewLayout: 'top-list-detail',
  },
  {
    templateId: 'form_wizard',
    title: 'Form & Wizard',
    regions: ['step_indicator', 'form_body', 'validation_summary', 'submit_bar'],
    intent: 'Cok adimli form ve onboarding akislarini yoneten sayfa kabugu.',
    complexity: 'complex' as const,
    previewLayout: 'stacked-steps',
  },
  {
    templateId: 'crud_management',
    title: 'CRUD Management',
    regions: ['toolbar', 'data_table', 'modal_layer', 'toast_layer'],
    intent: 'Kayit olusturma, okuma, guncelleme ve silme islemlerini toplayan yonetim ekrani.',
    complexity: 'complex' as const,
    previewLayout: 'full-table',
  },
] as const;

const COMPLEXITY_BADGE_TONE: Record<string, 'success' | 'warning' | 'muted'> = {
  simple: 'success',
  moderate: 'warning',
  complex: 'muted',
};

const LAYOUT_PREVIEW_CLASSES: Record<string, string> = {
  'grid-2x2': 'grid grid-cols-2 grid-rows-2 gap-1',
  'sidebar-main': 'grid grid-cols-[0.3fr_0.7fr] gap-1',
  'main-aside': 'grid grid-cols-[0.65fr_0.35fr] gap-1',
  'top-list-detail': 'grid grid-rows-[0.2fr_0.8fr] gap-1',
  'stacked-steps': 'flex flex-col gap-1',
  'full-table': 'grid grid-rows-[auto_1fr_auto] gap-1',
};

const GuidancePanel: React.FC<{
  title: string;
  guidance: ReturnType<typeof getPageGuidance>;
  className?: string;
}> = ({ title, guidance, className }) => (
  <div className={`rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm ${className ?? ''}`.trim()}>
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

const PageOverviewTab: React.FC<{
  activeOverviewPanel: DesignLabPageOverviewPanelId;
  template: DesignLabPageTemplate | null;
  selectedTemplateTracks: string[];
  selectedTemplateSections: string[];
  selectedTemplateThemes: string[];
  selectedTemplateQualityGates: string[];
  onOverviewPanelChange: (panelId: DesignLabPageOverviewPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
}> = ({
  activeOverviewPanel,
  template,
  selectedTemplateTracks,
  selectedTemplateSections,
  selectedTemplateThemes,
  selectedTemplateQualityGates,
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
  const guidance = getPageGuidance(template?.clusterTitle);

  if (!template) {
    return (
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text variant="secondary">No page template selected yet.</Text>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Pages workspace</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.tabs.overview.description.pages')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <SectionBadge label={t('designlab.common.panelCountPlural', { count: 4 })} />
        </div>
      </div>

      <Tabs
        value={activeOverviewPanel}
        onValueChange={(value) => onOverviewPanelChange(value as DesignLabPageOverviewPanelId)}
        appearance="pill"
        listLabel="Page overview panels"
        className="mt-5"
        items={[
          {
            value: 'summary',
            label: 'Summary',
            badge: <Badge variant="info">{template.ownerBlocks.length}</Badge>,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                    <DetailLabel>Template summary</DetailLabel>
                    <Text as="div" className="mt-3 text-lg font-semibold text-text-primary">
                      {template.title ?? template.recipeId}
                    </Text>
                    {template.clusterTitle ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <SectionBadge label={template.clusterTitle} />
                      </div>
                    ) : null}
                    <Text variant="secondary" className="mt-2 block leading-7">
                      {template.intent}
                    </Text>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {template.ownerBlocks.map((owner) => (
                        <SectionBadge key={owner} label={owner} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                    <DetailLabel>Quick status</DetailLabel>
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <MetricCard label="Building blocks" value={template.ownerBlocks.length} note="Shell icine baglanan canonical blocks" />
                      <MetricCard label="Tracks" value={selectedTemplateTracks.length} note="Release-track coverage" />
                      <MetricCard label="Regions" value={selectedTemplateSections.length} note="Bound layout or navigation regions" />
                      <MetricCard label="Themes" value={selectedTemplateThemes.length} note="Theme and UX coverage" />
                    </div>
                  </div>
                </div>

                <GuidancePanel title="Template guidance" guidance={guidance} />
              </div>
            ),
          },
          {
            value: 'regions',
            label: 'Regions',
            badge: <Badge variant="warning">{selectedTemplateSections.length}</Badge>,
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                  <DetailLabel>Layout building blocks</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {template.ownerBlocks.length ? template.ownerBlocks.map((owner) => <SectionBadge key={owner} label={owner} />) : <Text variant="secondary">No building blocks attached.</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                  <DetailLabel>Regions and navigation coverage</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTemplateSections.length ? selectedTemplateSections.map((section) => <SectionBadge key={section} label={section} />) : <Text variant="secondary">No layout regions declared.</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                  <DetailLabel>Theme coverage</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTemplateThemes.length ? selectedTemplateThemes.map((theme) => <SectionBadge key={theme} label={theme} />) : <Text variant="secondary">No theme binding declared.</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                  <DetailLabel>Quality coverage</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTemplateQualityGates.length ? selectedTemplateQualityGates.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">No template quality gates declared.</Text>}
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: 'adoption',
            label: 'Adoption',
            badge: <Badge variant="success">3 step</Badge>,
            content: (
              <ShowcaseCard
                eyebrow="Template adoption"
                title="Move from template selection to app shell delivery"
                description="The page lens should help teams move from an editorial template choice to a real app shell composition."
                badges={[
                  <SectionBadge key="template-id" label={template.recipeId} />,
                  <SectionBadge key="template-family" label={template.clusterTitle ?? 'Page family'} />,
                ]}
              >
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  <MetricCard label="Step 1" value="Choose template" note="Select a shell that matches the product problem." />
                  <MetricCard label="Step 2" value="Bind regions" note="Attach layout regions, nav zones and support surfaces." />
                  <MetricCard label="Step 3" value="Adopt in app shell" note="Hand the template to the product team with clear dependencies." />
                </div>
              </ShowcaseCard>
            ),
          },
          {
            value: 'gallery',
            label: 'Gallery',
            badge: <Badge variant="warning">{TEMPLATE_GALLERY_ITEMS.length}</Badge>,
            content: (
              <div className="space-y-4">
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                  <DetailLabel>Template preview gallery</DetailLabel>
                  <Text variant="secondary" className="mt-1 block text-sm leading-6">
                    Farkli sayfa sablonlarinin layout yapisi, region haritasi ve kullanim amaci bir arada.
                  </Text>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {TEMPLATE_GALLERY_ITEMS.map((item) => {
                    const isActive = template.clusterTitle?.toLowerCase().includes(item.templateId.replace(/_/g, ' ').split(' ')[0])
                      || template.recipeId.toLowerCase().includes(item.templateId.replace(/_/g, ' ').split(' ')[0]);
                    return (
                      <div
                        key={item.templateId}
                        className={`rounded-[24px] border p-4 shadow-sm transition-colors ${
                          isActive
                            ? 'border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20'
                            : 'border-border-subtle bg-surface-default'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Text className="text-sm font-semibold text-text-primary">{item.title}</Text>
                          <Badge variant={COMPLEXITY_BADGE_TONE[item.complexity] ?? 'muted'}>{item.complexity}</Badge>
                        </div>
                        <Text variant="secondary" className="mt-1.5 block text-xs leading-5">
                          {item.intent}
                        </Text>

                        {/* Layout preview */}
                        <div className={`mt-3 h-20 rounded-lg bg-surface-panel p-1.5 ${LAYOUT_PREVIEW_CLASSES[item.previewLayout] ?? ''}`}>
                          {item.regions.map((region) => (
                            <div
                              key={region}
                              className="flex items-center justify-center rounded bg-surface-default px-1"
                            >
                              <Text className="text-[8px] font-medium text-text-tertiary truncate">{region.replace(/_/g, ' ')}</Text>
                            </div>
                          ))}
                        </div>

                        {/* Region list */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {item.regions.map((region) => (
                            <span
                              key={region}
                              className="inline-block rounded-md bg-surface-panel px-1.5 py-0.5 text-[9px] font-medium text-text-secondary"
                            >
                              {region.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>

                        {isActive ? (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                            <Text className="text-[10px] font-semibold text-blue-600 dark:text-blue-300">Active match</Text>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

const PageApiTab: React.FC<{
  activeApiPanel: DesignLabPageApiPanelId;
  template: DesignLabPageTemplate | null;
  templateContractId: string | null;
  selectedTemplateTracks: string[];
  onApiPanelChange: (panelId: DesignLabPageApiPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
  UsageRecipesPanelComponent: React.ComponentType<any>;
}> = ({
  activeApiPanel,
  template,
  templateContractId,
  selectedTemplateTracks,
  onApiPanelChange,
  DetailLabelComponent,
  MetricCardComponent,
  CodeBlockComponent,
  UsageRecipesPanelComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const MetricCard = MetricCardComponent;
  const CodeBlock = CodeBlockComponent;
  const UsageRecipesPanel = UsageRecipesPanelComponent;
  const guidance = getPageGuidance(template?.clusterTitle, 'api');

  if (!template) {
    return <Text variant="secondary">No page template selected yet.</Text>;
  }

  const composeCode = `import { ${template.ownerBlocks.join(', ')} } from '@mfe/design-system';\n\nexport function ${template.recipeId.replace(/[^a-zA-Z0-9]+/g, ' ')}Template() {\n  return (\n    <div>{/* ${template.intent} */}</div>\n  );\n}`;
  const usageRecipes = [
    {
      title: 'Compose page shell',
      description: 'Bind the template shell to the owning route and app shell container.',
      code: composeCode,
    },
    {
      title: 'Consumer handoff',
      description: 'Show which layout regions and blocks the consumer team must wire.',
      code: `// Template intent\n// ${template.intent}\n// Building blocks: ${template.ownerBlocks.join(', ')}\n// Contract: ${templateContractId ?? 'template-contract'}`,
    },
  ];

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Page contract workspace</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.tabs.api.description.pages')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <Badge variant="muted">{t('designlab.common.panelCountPlural', { count: 3 })}</Badge>
        </div>
      </div>

      <GuidancePanel title="Dependency guidance" guidance={guidance} className="mt-5" />

      <Tabs
        value={activeApiPanel}
        onValueChange={(value) => onApiPanelChange(value as DesignLabPageApiPanelId)}
        appearance="pill"
        listLabel="Page API panels"
        className="mt-5"
        items={[
          {
            value: 'contract',
            label: 'Contract',
            badge: <Badge variant="info">{template.ownerBlocks.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                <DetailLabel>Template contract</DetailLabel>
                <CodeBlock code={composeCode} className="mt-3" />
              </div>
            ),
          },
          {
            value: 'regions',
            label: 'Regions',
            badge: <Badge variant="warning">{selectedTemplateTracks.length || '—'}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                <DetailLabel>Template region model</DetailLabel>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1">
                  <MetricCard label="Template ID" value={template.recipeId} note="Canonical page template key" />
                  <MetricCard label="Building blocks" value={template.ownerBlocks.length} note="Bound blocks and page regions" />
                  <MetricCard label="Tracks" value={selectedTemplateTracks.join(' / ') || '—'} note="Release tracks where the template is consumed" />
                  <MetricCard label="Contract" value={templateContractId ?? '—'} note="Template handoff contract" />
                </div>
              </div>
            ),
          },
          {
            value: 'dependencies',
            label: 'Dependencies',
            badge: <Badge variant="success">{usageRecipes.length}</Badge>,
            content: <UsageRecipesPanel title="Template consume patterns" recipes={usageRecipes} />,
          },
        ]}
      />
    </div>
  );
};

/* ── Region color mapping for composition builder ── */
const REGION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  hero: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-600 dark:text-violet-300' },
  header: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-300' },
  nav: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-300' },
  sidebar: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-300' },
  body: { bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-200 dark:border-sky-800', text: 'text-sky-600 dark:text-sky-300' },
  footer: { bg: 'bg-zinc-50 dark:bg-zinc-900/20', border: 'border-zinc-200 dark:border-zinc-800', text: 'text-zinc-600 dark:text-zinc-300' },
};

const resolveRegionColor = (regionId: string) => {
  const normalized = regionId.toLowerCase();
  if (normalized.includes('hero') || normalized.includes('summary')) return REGION_COLORS.hero;
  if (normalized.includes('header') || normalized.includes('toolbar') || normalized.includes('step')) return REGION_COLORS.header;
  if (normalized.includes('nav') || normalized.includes('tab') || normalized.includes('filter')) return REGION_COLORS.nav;
  if (normalized.includes('sidebar') || normalized.includes('inspector') || normalized.includes('preview') || normalized.includes('aside')) return REGION_COLORS.sidebar;
  if (normalized.includes('action') || normalized.includes('save') || normalized.includes('submit') || normalized.includes('toast') || normalized.includes('modal')) return REGION_COLORS.footer;
  return REGION_COLORS.body;
};

const PageUxTab: React.FC<{
  template: DesignLabPageTemplate | null;
  selectedTemplateSections: string[];
  selectedTemplateThemes: string[];
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({
  template,
  selectedTemplateSections,
  selectedTemplateThemes,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const guidance = getPageGuidance(template?.clusterTitle, 'ux');

  // Find matching template from gallery
  const matchedTemplate = React.useMemo(() => {
    if (!template) return null;
    const normalized = `${template.recipeId} ${template.title ?? ''} ${template.clusterTitle ?? ''}`.toLowerCase();
    return TEMPLATE_GALLERY_ITEMS.find((t) => {
      const tNorm = `${t.templateId} ${t.title}`.toLowerCase();
      return tNorm.split(/[\s_]+/).filter((w) => w.length > 2).some((kw) => normalized.includes(kw));
    }) ?? null;
  }, [template]);

  if (!template) {
    return <Text variant="secondary">No page template selected yet.</Text>;
  }

  const compositionRegions = matchedTemplate?.regions ?? template.ownerBlocks;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Theme and expression</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedTemplateThemes.length ? selectedTemplateThemes.map((theme) => <SectionBadge key={theme} label={theme} />) : <Text variant="secondary">No theme binding declared.</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Regions and navigation clarity</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedTemplateSections.length ? selectedTemplateSections.map((section) => <SectionBadge key={section} label={section} />) : <Text variant="secondary">No regions declared.</Text>}
          </div>
        </div>
      </div>

      {/* Composition builder */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DetailLabel>Page composition builder</DetailLabel>
            <Text variant="secondary" className="mt-1 block text-xs leading-5">
              Sayfa sablonunun bolge yapisi ve layout composition&apos;i. Her bolge renk koduyla gosterilir.
            </Text>
          </div>
          {matchedTemplate ? (
            <Badge variant={COMPLEXITY_BADGE_TONE[matchedTemplate.complexity] ?? 'muted'}>
              {matchedTemplate.complexity}
            </Badge>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.2fr]">
          {/* Layout wireframe */}
          <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
            <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Layout wireframe</Text>
            <div
              className={`mt-3 h-48 rounded-xl bg-surface-default p-2 ${
                matchedTemplate ? (LAYOUT_PREVIEW_CLASSES[matchedTemplate.previewLayout] ?? 'flex flex-col gap-1') : 'flex flex-col gap-1'
              }`}
            >
              {compositionRegions.map((region) => {
                const color = resolveRegionColor(region);
                return (
                  <div
                    key={region}
                    className={`flex min-h-[24px] items-center justify-center rounded-lg border px-2 py-1 ${color.bg} ${color.border}`}
                  >
                    <Text className={`text-[9px] font-semibold ${color.text}`}>
                      {region.replace(/_/g, ' ')}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Region detail list */}
          <div className="space-y-2">
            <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Region details</Text>
            {compositionRegions.map((region, idx) => {
              const color = resolveRegionColor(region);
              return (
                <div key={region} className="flex items-center gap-3 rounded-xl bg-surface-panel px-3 py-2.5">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold ${color.bg} ${color.text}`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Text className="text-xs font-semibold text-text-primary">{region.replace(/_/g, ' ')}</Text>
                    <Text variant="secondary" className="block text-[10px] leading-4">
                      {region.includes('hero') || region.includes('summary') ? 'Ust icerik bloku — ozet, metrik ve KPI' :
                       region.includes('nav') || region.includes('tab') || region.includes('filter') ? 'Navigasyon ve filtreleme yuzeyi' :
                       region.includes('sidebar') || region.includes('inspector') || region.includes('preview') ? 'Yan panel — detay ve inceleme alani' :
                       region.includes('action') || region.includes('save') || region.includes('submit') ? 'Aksiyon ve onay bari' :
                       region.includes('modal') || region.includes('toast') ? 'Overlay ve bildirim katmani' :
                       region.includes('table') || region.includes('grid') || region.includes('list') || region.includes('result') ? 'Veri goruntuleme — tablo, grid veya liste' :
                       region.includes('form') || region.includes('validation') ? 'Form ve validation yuzeyi' :
                       'Icerik bolumu'}
                    </Text>
                  </div>
                  <span className={`inline-block h-2 w-2 rounded-full ${color.bg.replace('50', '400').replace('/20', '')}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Composition metrics */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Regions" value={compositionRegions.length} note="Aktif bolge sayisi" />
          <MetricCard label="Layout" value={matchedTemplate?.previewLayout?.replace(/-/g, ' ') ?? 'custom'} note="Grid layout pattern" />
          <MetricCard label="Complexity" value={matchedTemplate?.complexity ?? 'unknown'} note="Sablon karmasikligi" />
          <MetricCard label="Owner blocks" value={template.ownerBlocks.length} note="Recipe building blocks" />
        </div>
      </div>

      <GuidancePanel title="Layout guidance" guidance={guidance} />
    </div>
  );
};

const PageQualityTab: React.FC<{
  activeQualityPanel: DesignLabPageQualityPanelId;
  template: DesignLabPageTemplate | null;
  selectedTemplateItems: DesignLabPageItemSummary[];
  selectedTemplateQualityGates: string[];
  onQualityPanelChange: (panelId: DesignLabPageQualityPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({
  activeQualityPanel,
  template,
  selectedTemplateItems,
  selectedTemplateQualityGates,
  onQualityPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const guidance = getPageGuidance(template?.clusterTitle, 'quality');

  if (!template) {
    return <Text variant="secondary">No page template selected yet.</Text>;
  }

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Page quality workspace</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.tabs.quality.description.pages')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <Badge variant="muted">{t('designlab.common.panelCountPlural', { count: 5 })}</Badge>
        </div>
      </div>

      <GuidancePanel title="Template quality guidance" guidance={guidance} className="mt-5" />

      <Tabs
        value={activeQualityPanel}
        onValueChange={(value) => onQualityPanelChange(value as DesignLabPageQualityPanelId)}
        appearance="pill"
        listLabel="Page quality panels"
        className="mt-5"
        items={[
          {
            value: 'gates',
            label: 'Gates',
            badge: <Badge variant="info">{selectedTemplateQualityGates.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                <DetailLabel>Template quality gates</DetailLabel>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTemplateQualityGates.length ? selectedTemplateQualityGates.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">No template quality gates declared.</Text>}
                </div>
              </div>
            ),
          },
          {
            value: 'readiness',
            label: 'Readiness',
            badge: <Badge variant="success">{selectedTemplateItems.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
                <DetailLabel>Template readiness</DetailLabel>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <MetricCard label="Stable" value={selectedTemplateItems.filter((item) => item.lifecycle === 'stable').length} note="Stable blocks bound to the template" />
                  <MetricCard label="Beta" value={selectedTemplateItems.filter((item) => item.lifecycle === 'beta').length} note="Still-moving parts inside the template" />
                  <MetricCard label="Live demo" value={selectedTemplateItems.filter((item) => item.demoMode === 'live').length} note="Blocks with live preview coverage" />
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
                layer="pages"
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
                layerFilter="pages"
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
                layerFilter="pages"
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

export const DesignLabPageDetailSections: React.FC<DesignLabPageDetailSectionsProps> = ({
  activeTab,
  activeOverviewPanel,
  activeApiPanel,
  activeQualityPanel,
  template,
  generalContent,
  demoContent,
  templateContractId,
  selectedTemplateTracks,
  selectedTemplateSections,
  selectedTemplateThemes,
  selectedTemplateQualityGates,
  selectedTemplateItems,
  onApiPanelChange,
  onQualityPanelChange,
  onOverviewPanelChange,
  DocsSectionComponent,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  ShowcaseCardComponent,
  CodeBlockComponent,
  UsageRecipesPanelComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DocsSection = DocsSectionComponent;

  switch (activeTab) {
    case 'general':
      return (
        <DocsSection
          id="design-lab-page-section-general"
          eyebrow="Workspace"
          title={t('designlab.tabs.general.label')}
          description={t('designlab.tabs.general.description.pages')}
        >
          <div data-detail-section-id="general">{generalContent}</div>
        </DocsSection>
      );
    case 'demo':
      return (
        <DocsSection
          id="design-lab-page-section-demo"
          eyebrow="Workspace"
          title={t('designlab.tabs.demo.label')}
          description={t('designlab.tabs.demo.description.pages')}
        >
          <div data-detail-section-id="demo">{demoContent}</div>
        </DocsSection>
      );
    case 'api':
      return (
        <DocsSection
          id="design-lab-page-section-api"
          eyebrow="Workspace"
          title={t('designlab.tabs.api.label')}
          description={t('designlab.tabs.api.description.pages')}
        >
          <div data-detail-section-id="api">
            <PageApiTab
              activeApiPanel={activeApiPanel}
              template={template}
              templateContractId={templateContractId}
              selectedTemplateTracks={selectedTemplateTracks}
              onApiPanelChange={onApiPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              MetricCardComponent={MetricCardComponent}
              CodeBlockComponent={CodeBlockComponent}
              UsageRecipesPanelComponent={UsageRecipesPanelComponent}
            />
          </div>
        </DocsSection>
      );
    case 'ux':
      return (
        <DocsSection
          id="design-lab-page-section-ux"
          eyebrow="Workspace"
          title={t('designlab.tabs.ux.label')}
          description={t('designlab.tabs.ux.description.pages')}
        >
          <div data-detail-section-id="ux">
            <PageUxTab
              template={template}
              selectedTemplateSections={selectedTemplateSections}
              selectedTemplateThemes={selectedTemplateThemes}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              MetricCardComponent={MetricCardComponent}
            />
          </div>
        </DocsSection>
      );
    case 'quality':
      return (
        <DocsSection
          id="design-lab-page-section-quality"
          eyebrow="Workspace"
          title={t('designlab.tabs.quality.label')}
          description={t('designlab.tabs.quality.description.pages')}
        >
          <div data-detail-section-id="quality">
            <PageQualityTab
              activeQualityPanel={activeQualityPanel}
              template={template}
              selectedTemplateItems={selectedTemplateItems}
              selectedTemplateQualityGates={selectedTemplateQualityGates}
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
          id="design-lab-page-section-overview"
          eyebrow="Workspace"
          title={t('designlab.tabs.overview.label')}
          description={t('designlab.tabs.overview.description.pages')}
        >
          <div data-detail-section-id="overview">
            <PageOverviewTab
              activeOverviewPanel={activeOverviewPanel}
              template={template}
              selectedTemplateTracks={selectedTemplateTracks}
              selectedTemplateSections={selectedTemplateSections}
              selectedTemplateThemes={selectedTemplateThemes}
              selectedTemplateQualityGates={selectedTemplateQualityGates}
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
