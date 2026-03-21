import React from 'react';
import { Badge, Tabs, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../useDesignLabI18n';
import enterpriseDataSurfacesCatalogRaw from '../../design-lab.enterprise-data-surfaces.v1.json';
import { MigrationGovernancePanel } from './MigrationGovernancePanel';
import { BenchmarkParityPanel } from './BenchmarkParityPanel';
import { PlatformContractsCompliancePanel } from './PlatformContractsCompliancePanel';

type DesignLabDetailTab = 'general' | 'overview' | 'demo' | 'api' | 'ux' | 'quality';

type DesignLabEcosystemExtension = {
  extensionId: string;
  title?: string;
  clusterTitle?: string;
  clusterDescription?: string;
  intent: string;
  ownerBlocks: string[];
  tier?: 'pro' | 'enterprise' | 'community';
};

type DesignLabEcosystemItemSummary = {
  lifecycle: string;
  demoMode: string;
  tier: 'pro' | 'enterprise' | 'community';
};

/* ── Enterprise Data Surface Catalog Types ── */

type EnterpriseSurfaceReadinessChecks = {
  multiTenant: boolean;
  rbac: boolean;
  auditTrail: boolean;
  perfBenchmark: boolean;
  a11yWcag: boolean;
  i18nRtl: boolean;
};

type EnterpriseSurfaceApiContract = {
  importPath: string;
  propsInterface: string;
  dataProvider: string;
  serverSideModel: Record<string, unknown>;
};

type EnterpriseSurface = {
  surfaceId: string;
  title: string;
  group: string;
  tier: string;
  coreComponents: string[];
  description: string;
  capabilities: string[];
  benchmarkRef: { antDesign: string; mui: string };
  apiContract: EnterpriseSurfaceApiContract;
  qualityGates: string[];
  readinessChecks: EnterpriseSurfaceReadinessChecks;
};

type EnterpriseSurfaceCatalog = {
  surfaces: EnterpriseSurface[];
  crossSurfaceContracts: {
    sharedPatterns: Array<{ patternId: string; description: string; appliesTo: string[] }>;
    qualityMatrix: Record<string, string[]>;
  };
};

const enterpriseSurfaceCatalog = enterpriseDataSurfacesCatalogRaw as unknown as EnterpriseSurfaceCatalog;

/**
 * Match extension to enterprise catalog surfaces based on keyword overlap.
 */
const matchSurfacesForExtension = (extension: DesignLabEcosystemExtension | null): EnterpriseSurface[] => {
  if (!extension) return [];
  const normalized = `${extension.extensionId} ${extension.title ?? ''} ${extension.clusterTitle ?? ''}`.toLowerCase();
  const matched = enterpriseSurfaceCatalog.surfaces.filter((surface) => {
    const surfaceKey = `${surface.surfaceId} ${surface.title} ${surface.group}`.toLowerCase();
    // Match if any significant keyword overlaps
    const keywords = surfaceKey.split(/[\s_]+/).filter((w) => w.length > 2);
    return keywords.some((kw) => normalized.includes(kw));
  });
  // If no specific match, return all surfaces for broad visibility
  return matched.length > 0 ? matched : enterpriseSurfaceCatalog.surfaces;
};

export type DesignLabEcosystemOverviewPanelId = 'summary' | 'surfaces' | 'tiers';
export type DesignLabEcosystemApiPanelId = 'contract' | 'integration' | 'usage';
export type DesignLabEcosystemQualityPanelId = 'gates' | 'enterprise_readiness' | 'governance' | 'benchmark' | 'contracts';

type DesignLabEcosystemDetailSectionsProps = {
  activeTab: DesignLabDetailTab;
  activeOverviewPanel: DesignLabEcosystemOverviewPanelId;
  activeApiPanel: DesignLabEcosystemApiPanelId;
  activeQualityPanel: DesignLabEcosystemQualityPanelId;
  extension: DesignLabEcosystemExtension | null;
  generalContent: React.ReactNode;
  demoContent: React.ReactNode;
  extensionContractId: string | null;
  selectedExtensionSurfaces: string[];
  selectedExtensionTiers: string[];
  selectedExtensionQualityGates: string[];
  selectedExtensionItems: DesignLabEcosystemItemSummary[];
  onApiPanelChange: (panelId: DesignLabEcosystemApiPanelId) => void;
  onQualityPanelChange: (panelId: DesignLabEcosystemQualityPanelId) => void;
  onOverviewPanelChange: (panelId: DesignLabEcosystemOverviewPanelId) => void;
  DocsSectionComponent: any;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
};

const getEcosystemGuidance = (
  clusterTitle?: string,
  context: 'overview' | 'api' | 'quality' = 'overview',
) => {
  const normalized = (clusterTitle ?? '').toLowerCase();

  if (normalized.includes('data') || normalized.includes('grid') || normalized.includes('table')) {
    if (context === 'api') {
      return {
        useWhen: 'Data surface API contract, column model ve server-side integration birlikte planlanacaksa.',
        avoidWhen: 'Basit tablo gosterimi icin enterprise-grade API contract gerekmiyorsa.',
        outcome: 'Data surface API kontrati tum ekipler icin tek referans noktasi olur.',
      };
    }
    if (context === 'quality') {
      return {
        useWhen: 'Enterprise data surface icin performance, a11y ve large dataset gate\'leri gerekiyorsa.',
        avoidWhen: 'Kucuk veri setli prototype calismalarinda.',
        outcome: 'Data surface kalite beklentileri production-ready hale gelir.',
      };
    }
    return {
      useWhen: 'Enterprise-grade data grid, pivot table veya advanced table gerektiginde.',
      avoidWhen: 'Basit liste veya 10 satirdan az tablo gosterimlerinde.',
      outcome: 'Data-intensive ekranlar tutarli ve performansli calisir.',
      implementationCaution: 'Pro Data Grid server-side pagination ve virtual scrolling zorunludur; 10K+ satir client-side render edilmemelidir.',
    };
  }

  if (normalized.includes('admin') || normalized.includes('settings') || normalized.includes('user')) {
    if (context === 'api') {
      return {
        useWhen: 'Admin shell API, tenant isolation ve permission model birlikte ele alinacaksa.',
        avoidWhen: 'Single-tenant basit admin panellerinde.',
        outcome: 'Admin API kontrati multi-tenant guvenli hale gelir.',
      };
    }
    if (context === 'quality') {
      return {
        useWhen: 'Admin shell icin security, RBAC ve audit gate\'leri gerekiyorsa.',
        avoidWhen: 'Internal tool icin hafif admin panellerinde.',
        outcome: 'Admin shell enterprise-grade guvenlik beklentilerini karsilar.',
      };
    }
    return {
      useWhen: 'Multi-tenant admin dashboard, settings shell veya user/role management gerektiginde.',
      avoidWhen: 'Tek kullanicili basit uygulamalarda.',
      outcome: 'Admin deneyimi tutarli ve guvenli bir altyapida calisir.',
      implementationCaution: 'Tenant isolation boundary\'leri API katmaninda enforce edilmelidir; client-side guard yeterli degildir.',
    };
  }

  if (normalized.includes('analytics') || normalized.includes('dashboard') || normalized.includes('report')) {
    if (context === 'api') {
      return {
        useWhen: 'Analytics API, aggregation pipeline ve real-time data feed birlikte planlanacaksa.',
        avoidWhen: 'Statik ve onceden hesaplanmis raporlarda.',
        outcome: 'Analytics API kontrati real-time ve batch senaryolarini kapsar.',
      };
    }
    if (context === 'quality') {
      return {
        useWhen: 'Analytics surface icin data accuracy, refresh rate ve visual regression gate\'leri gerekiyorsa.',
        avoidWhen: 'Basit metrik gosterimlerinde.',
        outcome: 'Analytics kalite sinyalleri production-grade hale gelir.',
      };
    }
    return {
      useWhen: 'KPI dashboard builder, report designer veya real-time metrics gerektiginde.',
      avoidWhen: 'Tek bir sayi gosterimi icin tam analytics altyapisi gerekmiyorsa.',
      outcome: 'Analytics deneyimi tutarli ve guvenilir veri uzerine kurulur.',
      implementationCaution: 'Real-time metric\'lerde WebSocket/SSE baglantilari connection pool limitleriyle yonetilmelidir.',
    };
  }

  if (context === 'api') {
    return {
      useWhen: 'Enterprise extension API kontrati, versiyonlama ve integration pattern birlikte ele alinacaksa.',
      avoidWhen: 'Lokal prototype ve tek seferlik demelerde.',
      outcome: 'Extension API kontrati stable ve backward-compatible kalir.',
    };
  }
  if (context === 'quality') {
    return {
      useWhen: 'Enterprise extension icin readiness, compliance ve performance gate\'leri gerekiyorsa.',
      avoidWhen: 'Erken donem deneysel extension\'larda.',
      outcome: 'Extension kalite beklentileri enterprise-grade seviyeye ulasir.',
    };
  }
  return {
    useWhen: 'Enterprise-grade extension veya pro surface gerektiginde.',
    avoidWhen: 'Core component yeterli oldugunda.',
    outcome: 'Enterprise extension\'lar tutarli kalite ve API kontrati altinda calisir.',
  };
};

const EcosystemGuidancePanel: React.FC<{
  title: string;
  guidance: ReturnType<typeof getEcosystemGuidance>;
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
      {'implementationCaution' in guidance && guidance.implementationCaution ? (
        <div className="rounded-[20px] border border-border-subtle bg-surface-default px-4 py-3">
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

/* ── Surface Catalog Panel (Overview > Surfaces) ── */

const READINESS_LABELS: Record<keyof EnterpriseSurfaceReadinessChecks, string> = {
  multiTenant: 'Multi-tenant isolation',
  rbac: 'RBAC / Permission model',
  auditTrail: 'Audit trail support',
  perfBenchmark: 'Performance benchmark',
  a11yWcag: 'WCAG 2.1 AA compliance',
  i18nRtl: 'i18n + RTL support',
};

const EcosystemSurfaceCatalogPanel: React.FC<{
  extension: DesignLabEcosystemExtension | null;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
}> = ({ extension, DetailLabelComponent, SectionBadgeComponent, ShowcaseCardComponent }) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const ShowcaseCard = ShowcaseCardComponent;
  const matchedSurfaces = React.useMemo(() => matchSurfacesForExtension(extension), [extension]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DetailLabel>Enterprise data surfaces</DetailLabel>
        <SectionBadge label={`${matchedSurfaces.length} surfaces`} />
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {matchedSurfaces.map((surface) => {
          const readyCount = Object.values(surface.readinessChecks).filter(Boolean).length;
          const totalChecks = Object.keys(surface.readinessChecks).length;
          return (
            <div
              key={surface.surfaceId}
              className="rounded-[20px] border border-border-subtle bg-surface-panel p-4 transition hover:shadow-sm"
              data-testid={`ecosystem-surface-${surface.surfaceId}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    {surface.title}
                  </Text>
                  <Text variant="secondary" className="mt-1 block text-xs leading-5">
                    {surface.description}
                  </Text>
                </div>
                <div className="shrink-0">
                  <SectionBadge label={surface.tier === 'pro' ? 'Pro' : 'Enterprise'} />
                </div>
              </div>
              {/* Core components */}
              {surface.coreComponents.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {surface.coreComponents.map((comp) => (
                    <span
                      key={comp}
                      className="inline-flex items-center rounded-lg bg-surface-default px-2 py-0.5 text-[10px] font-medium text-text-secondary"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              ) : null}
              {/* Capabilities (top 5) */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {surface.capabilities.slice(0, 5).map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center rounded-md bg-violet-50 px-1.5 py-0.5 text-[9px] font-medium text-violet-600 dark:bg-violet-900/20 dark:text-violet-300"
                  >
                    {cap.replace(/_/g, ' ')}
                  </span>
                ))}
                {surface.capabilities.length > 5 ? (
                  <span className="inline-flex items-center rounded-md bg-surface-default px-1.5 py-0.5 text-[9px] font-medium text-text-secondary">
                    +{surface.capabilities.length - 5}
                  </span>
                ) : null}
              </div>
              {/* Benchmark refs */}
              <div className="mt-2.5 flex items-center gap-3">
                <Text variant="secondary" className="text-[10px]">
                  Ant: {surface.benchmarkRef.antDesign}
                </Text>
                <Text variant="secondary" className="text-[10px]">
                  MUI: {surface.benchmarkRef.mui}
                </Text>
              </div>
              {/* Readiness bar */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Object.values(surface.readinessChecks).map((ready, idx) => (
                    <span
                      key={idx}
                      className={`inline-block h-1.5 w-3 rounded-full ${ready ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    />
                  ))}
                </div>
                <Text variant="secondary" className="text-[10px]">
                  {readyCount}/{totalChecks} ready
                </Text>
              </div>
            </div>
          );
        })}
      </div>
      {/* Cross-surface patterns */}
      {enterpriseSurfaceCatalog.crossSurfaceContracts.sharedPatterns.length > 0 ? (
        <div className="mt-2">
          <DetailLabel>Cross-surface patterns</DetailLabel>
          <div className="mt-2 space-y-1.5">
            {enterpriseSurfaceCatalog.crossSurfaceContracts.sharedPatterns.map((pattern) => (
              <div
                key={pattern.patternId}
                className="flex items-start gap-2 rounded-xl bg-surface-panel px-3 py-2"
              >
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                <div className="min-w-0">
                  <Text className="text-xs font-medium text-text-primary">
                    {pattern.patternId.replace(/_/g, ' ')}
                  </Text>
                  <Text variant="secondary" className="mt-0.5 block text-[11px] leading-4">
                    {pattern.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ── Tier Breakdown Panel (Overview > Tiers) ── */

const EcosystemTierBreakdownPanel: React.FC<{
  extension: DesignLabEcosystemExtension | null;
  selectedExtensionTiers: string[];
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({ extension, selectedExtensionTiers, DetailLabelComponent, SectionBadgeComponent, MetricCardComponent }) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const matchedSurfaces = React.useMemo(() => matchSurfacesForExtension(extension), [extension]);

  const tierGroups = React.useMemo(() => {
    const groups: Record<string, EnterpriseSurface[]> = {};
    matchedSurfaces.forEach((surface) => {
      const tier = surface.tier;
      if (!groups[tier]) groups[tier] = [];
      groups[tier].push(surface);
    });
    return groups;
  }, [matchedSurfaces]);

  const tierColors: Record<string, string> = {
    pro: 'bg-violet-400',
    enterprise: 'bg-amber-400',
    community: 'bg-emerald-400',
  };

  return (
    <div className="space-y-4">
      <DetailLabel>Extension tier breakdown</DetailLabel>
      <div className="flex flex-wrap gap-2">
        {selectedExtensionTiers.length > 0 ? (
          selectedExtensionTiers.map((tier) => (
            <SectionBadge key={tier} label={tier} />
          ))
        ) : (
          <Text variant="secondary" className="text-sm">No tier information available.</Text>
        )}
      </div>
      {/* Catalog-based tier groups */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {Object.entries(tierGroups).map(([tier, surfaces]) => (
          <MetricCard key={tier} label={`${tier} tier`} value={String(surfaces.length)} />
        ))}
      </div>
      <div className="space-y-3">
        {Object.entries(tierGroups).map(([tier, surfaces]) => (
          <div key={tier} className="space-y-1.5">
            <div className="flex items-center gap-2 px-1">
              <span className={`inline-block h-2 w-2 rounded-full ${tierColors[tier] ?? 'bg-zinc-400'}`} />
              <Text className="text-xs font-semibold uppercase tracking-[0.06em] text-text-secondary">
                {tier}
              </Text>
              <SectionBadge label={String(surfaces.length)} />
            </div>
            {surfaces.map((surface) => (
              <div
                key={surface.surfaceId}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface-panel px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${tierColors[tier] ?? 'bg-zinc-400'}`} />
                  <Text className="text-xs font-medium text-text-primary">{surface.title}</Text>
                </div>
                <Text variant="secondary" className="shrink-0 text-[10px]">
                  {surface.capabilities.length} capabilities
                </Text>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const EcosystemOverviewTab: React.FC<{
  activeOverviewPanel: DesignLabEcosystemOverviewPanelId;
  extension: DesignLabEcosystemExtension | null;
  selectedExtensionSurfaces: string[];
  selectedExtensionTiers: string[];
  selectedExtensionItems: DesignLabEcosystemItemSummary[];
  onOverviewPanelChange: (panelId: DesignLabEcosystemOverviewPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
}> = ({
  activeOverviewPanel,
  extension,
  selectedExtensionSurfaces,
  selectedExtensionTiers,
  selectedExtensionItems,
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
  const guidance = getEcosystemGuidance(extension?.clusterTitle);

  if (!extension) {
    return (
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text variant="secondary">{t('designlab.ecosystem.overview.empty')}</Text>
      </div>
    );
  }

  const proCount = selectedExtensionItems.filter((item) => item.tier === 'pro').length;
  const enterpriseCount = selectedExtensionItems.filter((item) => item.tier === 'enterprise').length;
  const stableCount = selectedExtensionItems.filter((item) => item.lifecycle === 'stable').length;

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Enterprise extension overview</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {extension.intent}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <SectionBadge label={`${selectedExtensionItems.length} extensions`} />
        </div>
      </div>

      <Tabs
        value={activeOverviewPanel}
        onValueChange={(value) => onOverviewPanelChange(value as DesignLabEcosystemOverviewPanelId)}
        appearance="pill"
        listLabel="Extension overview panels"
        className="mt-5"
        items={[
          { value: 'summary', label: 'Summary', content: null },
          { value: 'surfaces', label: 'Surfaces', content: null },
          { value: 'tiers', label: 'Tiers', content: null },
        ]}
      />

      <div className="mt-5 space-y-4">
        {activeOverviewPanel === 'summary' ? (
          <>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <MetricCard label="Total extensions" value={String(selectedExtensionItems.length)} />
              <MetricCard label="Pro tier" value={String(proCount)} />
              <MetricCard label="Enterprise tier" value={String(enterpriseCount)} />
              <MetricCard label="Stable" value={String(stableCount)} />
            </div>
            <EcosystemGuidancePanel title="Extension guidance" guidance={guidance} />
          </>
        ) : activeOverviewPanel === 'surfaces' ? (
          <EcosystemSurfaceCatalogPanel
            extension={extension}
            DetailLabelComponent={DetailLabelComponent}
            SectionBadgeComponent={SectionBadgeComponent}
            ShowcaseCardComponent={ShowcaseCardComponent}
          />
        ) : (
          <EcosystemTierBreakdownPanel
            extension={extension}
            selectedExtensionTiers={selectedExtensionTiers}
            DetailLabelComponent={DetailLabelComponent}
            SectionBadgeComponent={SectionBadgeComponent}
            MetricCardComponent={MetricCardComponent}
          />
        )}
      </div>
    </div>
  );
};

/* ── API Content (renders real catalog contracts) ── */

const EcosystemApiContent: React.FC<{
  activeApiPanel: DesignLabEcosystemApiPanelId;
  extension: DesignLabEcosystemExtension;
  extensionContractId: string | null;
  selectedExtensionSurfaces: string[];
  guidance: ReturnType<typeof getEcosystemGuidance>;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
}> = ({
  activeApiPanel,
  extension,
  extensionContractId,
  selectedExtensionSurfaces,
  guidance,
  DetailLabelComponent,
  SectionBadgeComponent,
  CodeBlockComponent,
}) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const CodeBlock = CodeBlockComponent;
  const matchedSurfaces = React.useMemo(() => matchSurfacesForExtension(extension), [extension]);
  const primarySurface = matchedSurfaces[0] ?? null;

  if (activeApiPanel === 'contract') {
    return (
      <div className="mt-5 space-y-4">
        <div className="space-y-3">
          <DetailLabel>Extension contract</DetailLabel>
          <div className="flex flex-wrap gap-2">
            <SectionBadge label={extensionContractId ?? 'No contract'} />
            <SectionBadge label={`Extension: ${extension.extensionId}`} />
            {primarySurface ? <SectionBadge label={`Surface: ${primarySurface.title}`} /> : null}
          </div>
        </div>
        {/* Real import from catalog */}
        {primarySurface ? (
          <>
            <CodeBlock
              title={`Import — ${primarySurface.title}`}
              language="typescript"
              code={`import { ${primarySurface.apiContract.propsInterface.replace(/<.*>/, '')} } from '${primarySurface.apiContract.importPath}';\nimport type { ${primarySurface.apiContract.propsInterface} } from '${primarySurface.apiContract.importPath}/types';\nimport { ${primarySurface.apiContract.dataProvider.replace(/<.*>/, '')} } from '${primarySurface.apiContract.importPath}/provider';`}
            />
            <CodeBlock
              title="Server-Side Model"
              language="json"
              code={JSON.stringify(primarySurface.apiContract.serverSideModel, null, 2)}
            />
          </>
        ) : (
          <CodeBlock
            title="Extension Import"
            language="typescript"
            code={`import { ${extension.title ?? extension.extensionId} } from '@pro-extensions/${extension.extensionId}';\nimport type { ${extension.title ?? extension.extensionId}Props } from '@pro-extensions/${extension.extensionId}/types';`}
          />
        )}
        {/* All matched surface contracts */}
        {matchedSurfaces.length > 1 ? (
          <div className="space-y-2">
            <DetailLabel>Related surface contracts</DetailLabel>
            <div className="space-y-1.5">
              {matchedSurfaces.slice(1).map((surface) => (
                <div
                  key={surface.surfaceId}
                  className="flex items-center justify-between gap-3 rounded-xl bg-surface-panel px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    <Text className="text-xs font-medium text-text-primary">{surface.title}</Text>
                  </div>
                  <Text variant="secondary" className="shrink-0 text-[10px] font-mono">
                    {surface.apiContract.importPath}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (activeApiPanel === 'integration') {
    return (
      <div className="mt-5 space-y-4">
        <DetailLabel>Integration patterns</DetailLabel>
        <div className="flex flex-wrap gap-2">
          {matchedSurfaces.map((surface) => (
            <SectionBadge key={surface.surfaceId} label={surface.title} />
          ))}
        </div>
        {primarySurface ? (
          <CodeBlock
            title={`Server Integration — ${primarySurface.title}`}
            language="typescript"
            code={`// Data provider from catalog\nimport { ${primarySurface.apiContract.dataProvider.replace(/<.*>/, '')} } from '${primarySurface.apiContract.importPath}/provider';\n\nconst dataProvider = new ${primarySurface.apiContract.dataProvider}({\n  endpoint: '${(primarySurface.apiContract.serverSideModel as any).endpoint ?? `/api/v1/${extension.extensionId}`}',\n  pagination: {\n    modes: ${JSON.stringify((primarySurface.apiContract.serverSideModel as any).paginationModes ?? ['offset'])},\n    defaultPageSize: ${(primarySurface.apiContract.serverSideModel as any).defaultPageSize ?? 50},\n    maxPageSize: ${(primarySurface.apiContract.serverSideModel as any).maxPageSize ?? 500},\n  },\n});\n\n// Client binding\n<${primarySurface.title.replace(/\s+/g, '')}\n  dataProvider={dataProvider}\n  onError={handleSurfaceError}\n/>`}
          />
        ) : (
          <CodeBlock
            title="Server Integration"
            language="typescript"
            code={`const dataProvider = create${extension.title ?? extension.extensionId}Provider({\n  endpoint: '/api/v1/${extension.extensionId}',\n  pagination: { mode: 'cursor', pageSize: 50 },\n});\n\n<${extension.title ?? extension.extensionId}\n  dataProvider={dataProvider}\n  onError={handleExtensionError}\n/>`}
          />
        )}
        {/* Cross-surface patterns relevant to this extension */}
        {enterpriseSurfaceCatalog.crossSurfaceContracts.sharedPatterns
          .filter((p) => matchedSurfaces.some((s) => p.appliesTo.includes(s.surfaceId)))
          .map((pattern) => (
            <div
              key={pattern.patternId}
              className="rounded-[20px] border border-border-subtle bg-surface-panel px-4 py-3"
            >
              <Text className="text-xs font-semibold text-text-primary">
                {pattern.patternId.replace(/_/g, ' ')}
              </Text>
              <Text variant="secondary" className="mt-1 block text-[11px] leading-5">
                {pattern.description}
              </Text>
            </div>
          ))}
      </div>
    );
  }

  // Usage panel
  return (
    <div className="mt-5 space-y-4">
      <EcosystemGuidancePanel title="API guidance" guidance={guidance} />
      <DetailLabel>Consumer patterns</DetailLabel>
      {primarySurface ? (
        <CodeBlock
          title={`Consumer Hook — ${primarySurface.title}`}
          language="typescript"
          code={`import { use${primarySurface.title.replace(/\s+/g, '')} } from '${primarySurface.apiContract.importPath}/hooks';\nimport type { ${primarySurface.apiContract.propsInterface} } from '${primarySurface.apiContract.importPath}/types';\n\nconst {\n  data,\n  isLoading,\n  error,\n  refetch,\n  pagination,\n} = use${primarySurface.title.replace(/\s+/g, '')}({\n  filters: activeFilters,\n  sort: currentSort,\n  page: currentPage,\n});`}
        />
      ) : (
        <CodeBlock
          title="Consumer Hook"
          language="typescript"
          code={`import { use${extension.title ?? extension.extensionId} } from '@pro-extensions/${extension.extensionId}/hooks';\n\nconst { data, isLoading, error, refetch } = use${extension.title ?? extension.extensionId}({\n  filters: activeFilters,\n  sort: currentSort,\n  page: currentPage,\n});`}
        />
      )}
    </div>
  );
};

const EcosystemApiTab: React.FC<{
  activeApiPanel: DesignLabEcosystemApiPanelId;
  extension: DesignLabEcosystemExtension | null;
  extensionContractId: string | null;
  selectedExtensionSurfaces: string[];
  onApiPanelChange: (panelId: DesignLabEcosystemApiPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
}> = ({
  activeApiPanel,
  extension,
  extensionContractId,
  selectedExtensionSurfaces,
  onApiPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  CodeBlockComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const CodeBlock = CodeBlockComponent;
  const guidance = getEcosystemGuidance(extension?.clusterTitle, 'api');

  if (!extension) {
    return <Text variant="secondary">{t('designlab.ecosystem.api.empty')}</Text>;
  }

  const extensionId = extension.extensionId;

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Extension API workspace</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            Enterprise extension API contract, integration patterns ve consumer references.
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
        </div>
      </div>

      <Tabs
        value={activeApiPanel}
        onValueChange={(value) => onApiPanelChange(value as DesignLabEcosystemApiPanelId)}
        appearance="pill"
        listLabel="Extension API panels"
        className="mt-5"
        items={[
          { value: 'contract', label: 'Contract', content: null },
          { value: 'integration', label: 'Integration', content: null },
          { value: 'usage', label: 'Usage', content: null },
        ]}
      />

      <EcosystemApiContent
        activeApiPanel={activeApiPanel}
        extension={extension}
        extensionContractId={extensionContractId}
        selectedExtensionSurfaces={selectedExtensionSurfaces}
        guidance={guidance}
        DetailLabelComponent={DetailLabelComponent}
        SectionBadgeComponent={SectionBadgeComponent}
        CodeBlockComponent={CodeBlockComponent}
      />
    </div>
  );
};

/* ── Quality Content (renders real catalog gates + readiness) ── */

const EcosystemQualityContent: React.FC<{
  activeQualityPanel: DesignLabEcosystemQualityPanelId;
  extension: DesignLabEcosystemExtension;
  selectedExtensionQualityGates: string[];
  selectedExtensionItems: DesignLabEcosystemItemSummary[];
  stableCount: number;
  liveCount: number;
  guidance: ReturnType<typeof getEcosystemGuidance>;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({
  activeQualityPanel,
  extension,
  selectedExtensionQualityGates,
  selectedExtensionItems,
  stableCount,
  liveCount,
  guidance,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const matchedSurfaces = React.useMemo(() => matchSurfacesForExtension(extension), [extension]);

  // Aggregate quality gates from catalog
  const catalogQualityGates = React.useMemo(() => {
    const gates = matchedSurfaces.flatMap((s) => s.qualityGates);
    return Array.from(new Set(gates));
  }, [matchedSurfaces]);

  // Aggregate readiness from catalog (use per-surface breakdown)
  const catalogReadiness = React.useMemo(() => {
    if (matchedSurfaces.length === 0) return [];
    return matchedSurfaces.map((surface) => ({
      surfaceId: surface.surfaceId,
      title: surface.title,
      checks: surface.readinessChecks,
    }));
  }, [matchedSurfaces]);

  // Merged quality gates: catalog + any extra from props
  const allGates = React.useMemo(() => {
    const merged = new Set([...catalogQualityGates, ...selectedExtensionQualityGates]);
    return Array.from(merged);
  }, [catalogQualityGates, selectedExtensionQualityGates]);

  if (activeQualityPanel === 'gates') {
    return (
      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <MetricCard label="Quality gates" value={String(allGates.length)} />
          <MetricCard label="Stable" value={String(stableCount)} />
          <MetricCard label="Live demo" value={String(liveCount)} />
          <MetricCard label="Total" value={String(selectedExtensionItems.length)} />
        </div>
        <DetailLabel>Quality gate checklist</DetailLabel>
        <div className="space-y-1.5">
          {allGates.length > 0 ? (
            allGates.map((gate) => {
              const isCatalogGate = catalogQualityGates.includes(gate);
              return (
                <div
                  key={gate}
                  className="flex items-center justify-between gap-2 rounded-xl bg-surface-panel px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${isCatalogGate ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <Text className="text-xs font-medium text-text-primary">
                      {gate.replace(/_/g, ' ')}
                    </Text>
                  </div>
                  <SectionBadge label={isCatalogGate ? 'Catalog' : 'Custom'} />
                </div>
              );
            })
          ) : (
            <Text variant="secondary" className="text-sm">No quality gates defined yet.</Text>
          )}
        </div>
        {/* Quality matrix from catalog */}
        {Object.keys(enterpriseSurfaceCatalog.crossSurfaceContracts.qualityMatrix).length > 0 ? (
          <div className="mt-2">
            <DetailLabel>Quality matrix</DetailLabel>
            <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
              {Object.entries(enterpriseSurfaceCatalog.crossSurfaceContracts.qualityMatrix).map(
                ([dimension, surfaceIds]) => (
                  <div
                    key={dimension}
                    className="rounded-xl border border-border-subtle bg-surface-default px-3 py-2"
                  >
                    <Text className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-secondary">
                      {dimension}
                    </Text>
                    <Text className="mt-1 block text-sm font-semibold text-text-primary">
                      {surfaceIds.length} surfaces
                    </Text>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // Readiness panel — real data from catalog
  return (
    <div className="mt-5 space-y-4">
      <EcosystemGuidancePanel title="Enterprise readiness guidance" guidance={guidance} />
      {catalogReadiness.length > 0 ? (
        catalogReadiness.map((surface) => {
          const readyCount = Object.values(surface.checks).filter(Boolean).length;
          const totalChecks = Object.keys(surface.checks).length;
          return (
            <div key={surface.surfaceId} className="space-y-2">
              <div className="flex items-center justify-between">
                <DetailLabel>{surface.title}</DetailLabel>
                <SectionBadge label={`${readyCount}/${totalChecks} ready`} />
              </div>
              <div className="space-y-1.5">
                {(Object.entries(surface.checks) as [keyof EnterpriseSurfaceReadinessChecks, boolean][]).map(
                  ([checkId, status]) => (
                    <div
                      key={`${surface.surfaceId}-${checkId}`}
                      className="flex items-center justify-between gap-2 rounded-xl bg-surface-panel px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${status ? 'bg-emerald-400' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                        />
                        <Text className="text-xs font-medium text-text-primary">
                          {READINESS_LABELS[checkId] ?? checkId}
                        </Text>
                      </div>
                      <SectionBadge label={status ? 'Ready' : 'Pending'} />
                    </div>
                  ),
                )}
              </div>
            </div>
          );
        })
      ) : (
        <>
          <DetailLabel>Readiness checklist</DetailLabel>
          <div className="space-y-1.5">
            {(Object.entries(READINESS_LABELS) as [keyof EnterpriseSurfaceReadinessChecks, string][]).map(
              ([checkId, label]) => (
                <div
                  key={checkId}
                  className="flex items-center justify-between gap-2 rounded-xl bg-surface-panel px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    <Text className="text-xs font-medium text-text-primary">{label}</Text>
                  </div>
                  <SectionBadge label="Pending" />
                </div>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
};

const EcosystemQualityTab: React.FC<{
  activeQualityPanel: DesignLabEcosystemQualityPanelId;
  extension: DesignLabEcosystemExtension | null;
  selectedExtensionQualityGates: string[];
  selectedExtensionItems: DesignLabEcosystemItemSummary[];
  onQualityPanelChange: (panelId: DesignLabEcosystemQualityPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({
  activeQualityPanel,
  extension,
  selectedExtensionQualityGates,
  selectedExtensionItems,
  onQualityPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const guidance = getEcosystemGuidance(extension?.clusterTitle, 'quality');

  if (!extension) {
    return <Text variant="secondary">{t('designlab.ecosystem.quality.empty')}</Text>;
  }

  const stableCount = selectedExtensionItems.filter((item) => item.lifecycle === 'stable').length;
  const liveCount = selectedExtensionItems.filter((item) => item.demoMode === 'live').length;

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>Enterprise quality workspace</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            Enterprise extension quality gates, readiness signals ve compliance status.
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
        </div>
      </div>

      <Tabs
        value={activeQualityPanel}
        onValueChange={(value) => onQualityPanelChange(value as DesignLabEcosystemQualityPanelId)}
        appearance="pill"
        listLabel="Extension quality panels"
        className="mt-5"
        items={[
          { value: 'gates', label: 'Gates', content: null },
          { value: 'enterprise_readiness', label: 'Readiness', content: null },
          { value: 'governance', label: 'Governance', content: null },
          { value: 'benchmark', label: 'Benchmark', content: null },
          { value: 'contracts', label: 'Contracts', content: null },
        ]}
      />

      {activeQualityPanel === 'governance' ? (
        <div className="mt-5">
          <MigrationGovernancePanel
            layer="ecosystem"
            DetailLabelComponent={DetailLabelComponent}
            SectionBadgeComponent={SectionBadgeComponent}
            MetricCardComponent={MetricCardComponent}
          />
        </div>
      ) : activeQualityPanel === 'benchmark' ? (
        <div className="mt-5">
          <BenchmarkParityPanel
            layerFilter="ecosystem"
            DetailLabelComponent={DetailLabelComponent}
            SectionBadgeComponent={SectionBadgeComponent}
            MetricCardComponent={MetricCardComponent}
          />
        </div>
      ) : activeQualityPanel === 'contracts' ? (
        <div className="mt-5">
          <PlatformContractsCompliancePanel
            layerFilter="ecosystem"
            DetailLabelComponent={DetailLabelComponent}
            SectionBadgeComponent={SectionBadgeComponent}
            MetricCardComponent={MetricCardComponent}
          />
        </div>
      ) : (
        <EcosystemQualityContent
          activeQualityPanel={activeQualityPanel}
          extension={extension}
          selectedExtensionQualityGates={selectedExtensionQualityGates}
          selectedExtensionItems={selectedExtensionItems}
          stableCount={stableCount}
          liveCount={liveCount}
          guidance={guidance}
          DetailLabelComponent={DetailLabelComponent}
          SectionBadgeComponent={SectionBadgeComponent}
          MetricCardComponent={MetricCardComponent}
        />
      )}
    </div>
  );
};

export const DesignLabEcosystemDetailSections: React.FC<DesignLabEcosystemDetailSectionsProps> = ({
  activeTab,
  activeOverviewPanel,
  activeApiPanel,
  activeQualityPanel,
  extension,
  generalContent,
  demoContent,
  extensionContractId,
  selectedExtensionSurfaces,
  selectedExtensionTiers,
  selectedExtensionQualityGates,
  selectedExtensionItems,
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
    case 'general':
      return (
        <DocsSection
          id="design-lab-ecosystem-section-general"
          eyebrow="Workspace"
          title={t('designlab.tabs.general.label.ecosystem')}
          description={t('designlab.tabs.general.description.ecosystem')}
        >
          <div data-detail-section-id="general">{generalContent}</div>
        </DocsSection>
      );
    case 'demo':
      return (
        <DocsSection
          id="design-lab-ecosystem-section-demo"
          eyebrow="Workspace"
          title={t('designlab.tabs.demo.label.ecosystem')}
          description={t('designlab.tabs.demo.description.ecosystem')}
        >
          <div data-detail-section-id="demo">{demoContent}</div>
        </DocsSection>
      );
    case 'ux':
      return (
        <DocsSection
          id="design-lab-ecosystem-section-ux"
          eyebrow="Workspace"
          title={t('designlab.tabs.ux.label.ecosystem')}
          description={t('designlab.tabs.ux.description.ecosystem')}
        >
          <div data-detail-section-id="ux">
            {extension ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
                  <DetailLabel>Enterprise tier UX</DetailLabel>
                  <Text variant="secondary" className="mt-2 block text-sm leading-6">
                    Extension tier&apos;ina gore UX beklentisi ve gorsel standart.
                  </Text>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {extension.tier ? <SectionBadge label={`Tier: ${extension.tier}`} /> : null}
                    {extension.clusterTitle ? <SectionBadge label={extension.clusterTitle} /> : null}
                    {selectedExtensionTiers.length
                      ? selectedExtensionTiers.map((tier) => <SectionBadge key={tier} label={tier} />)
                      : null}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
                  <DetailLabel>Surface coverage</DetailLabel>
                  <Text variant="secondary" className="mt-2 block text-sm leading-6">
                    Extension&apos;in sagladi enterprise surface&apos;ler ve UX kapsami.
                  </Text>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedExtensionSurfaces.length
                      ? selectedExtensionSurfaces.map((surface) => <SectionBadge key={surface} label={surface} />)
                      : <Text variant="secondary">No surface binding declared.</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm xl:col-span-2">
                  <DetailLabel>Ecosystem UX guidance</DetailLabel>
                  <EcosystemGuidancePanel
                    title="Enterprise UX consistency"
                    guidance={getEcosystemGuidance(extension?.clusterTitle, 'quality')}
                    className="mt-3"
                  />
                </div>
              </div>
            ) : (
              <Text variant="secondary">{t('designlab.ecosystem.quality.empty')}</Text>
            )}
          </div>
        </DocsSection>
      );
    case 'api':
      return (
        <DocsSection
          id="design-lab-ecosystem-section-api"
          eyebrow="Workspace"
          title={t('designlab.tabs.api.label.ecosystem')}
          description={t('designlab.tabs.api.description.ecosystem')}
        >
          <div data-detail-section-id="api">
            <EcosystemApiTab
              activeApiPanel={activeApiPanel}
              extension={extension}
              extensionContractId={extensionContractId}
              selectedExtensionSurfaces={selectedExtensionSurfaces}
              onApiPanelChange={onApiPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              CodeBlockComponent={CodeBlockComponent}
            />
          </div>
        </DocsSection>
      );
    case 'quality':
      return (
        <DocsSection
          id="design-lab-ecosystem-section-quality"
          eyebrow="Workspace"
          title={t('designlab.tabs.quality.label.ecosystem')}
          description={t('designlab.tabs.quality.description.ecosystem')}
        >
          <div data-detail-section-id="quality">
            <EcosystemQualityTab
              activeQualityPanel={activeQualityPanel}
              extension={extension}
              selectedExtensionQualityGates={selectedExtensionQualityGates}
              selectedExtensionItems={selectedExtensionItems}
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
          id="design-lab-ecosystem-section-overview"
          eyebrow="Workspace"
          title={t('designlab.tabs.overview.label.ecosystem')}
          description={t('designlab.tabs.overview.description.ecosystem')}
        >
          <div data-detail-section-id="overview">
            <EcosystemOverviewTab
              activeOverviewPanel={activeOverviewPanel}
              extension={extension}
              selectedExtensionSurfaces={selectedExtensionSurfaces}
              selectedExtensionTiers={selectedExtensionTiers}
              selectedExtensionItems={selectedExtensionItems}
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
