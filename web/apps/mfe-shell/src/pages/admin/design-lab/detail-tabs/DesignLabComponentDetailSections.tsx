import React from 'react';
import { Badge, Button, Tabs, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../useDesignLabI18n';
import { MigrationGovernancePanel } from './MigrationGovernancePanel';
import { BenchmarkParityPanel } from './BenchmarkParityPanel';
import { PlatformContractsCompliancePanel } from './PlatformContractsCompliancePanel';
import navigationFamilyMatrixRaw from '../../design-lab.navigation-family-matrix.v1.json';

/* ── Navigation Family Matrix Types ── */

type NavigationFamily = {
  familyId: string;
  title: string;
  description: string;
  canonicalComponents: string[];
  recipeBindings: string[];
  pageShellBindings: string[];
  wayfindingRole: string;
  a11yPattern: string;
  responsiveBehavior: string;
};

type NavigationFamilyMatrix = {
  navigationFamilies: NavigationFamily[];
  crossFamilyPatterns: Array<{ patternId: string; title: string; description: string; families: string[] }>;
  wayfindingRoles: Record<string, string>;
};

const navigationMatrix = navigationFamilyMatrixRaw as unknown as NavigationFamilyMatrix;

const matchNavigationFamilies = (item: DesignLabIndexItem | null): NavigationFamily[] => {
  if (!item) return [];
  const normalized = `${item.name} ${item.taxonomyGroupId} ${item.taxonomySubgroup} ${item.kind}`.toLowerCase();
  return navigationMatrix.navigationFamilies.filter((family) => {
    return family.canonicalComponents.some((comp) => normalized.includes(comp.toLowerCase()));
  });
};

type DesignLabDetailTab = 'general' | 'overview' | 'demo' | 'api' | 'ux' | 'quality';
export type DesignLabComponentApiPanelId = 'contract' | 'model' | 'props' | 'usage';
export type DesignLabComponentQualityPanelId = 'gates' | 'usage' | 'governance' | 'benchmark' | 'contracts';

type DesignLabIndexItem = {
  name: string;
  importStatement: string;
  kind: string;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  sectionIds?: string[];
  qualityGates?: string[];
  whereUsed: string[];
};

type DesignLabApiProp = {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
};

type DesignLabApiItem = {
  variantAxes: string[];
  stateModel: string[];
  props: DesignLabApiProp[];
  previewFocus: string[];
  regressionFocus: string[];
};

type UsageRecipe = {
  title: string;
  description: string;
  code: string;
};

type DesignLabComponentDetailSectionsProps = {
  activeTab: DesignLabDetailTab;
  activeApiPanel: DesignLabComponentApiPanelId;
  activeQualityPanel: DesignLabComponentQualityPanelId;
  item: DesignLabIndexItem | null;
  generalContent: React.ReactNode;
  overviewContent: React.ReactNode;
  demoContent: React.ReactNode;
  apiItem: DesignLabApiItem | null;
  usageRecipes: UsageRecipe[];
  trackLabel: string | null;
  onApiPanelChange: (panelId: DesignLabComponentApiPanelId) => void;
  onQualityPanelChange: (panelId: DesignLabComponentQualityPanelId) => void;
  onCopyImport: () => void;
  DocsSectionComponent: any;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent?: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
  PropsTableComponent: React.ComponentType<any>;
  UsageRecipesPanelComponent: React.ComponentType<any>;
};

const ComponentApiTab: React.FC<{
  activeApiPanel: DesignLabComponentApiPanelId;
  item: DesignLabIndexItem | null;
  apiItem: DesignLabApiItem | null;
  usageRecipes: UsageRecipe[];
  trackLabel: string | null;
  onApiPanelChange: (panelId: DesignLabComponentApiPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
  PropsTableComponent: React.ComponentType<any>;
  UsageRecipesPanelComponent: React.ComponentType<any>;
}> = ({
  activeApiPanel,
  item,
  apiItem,
  usageRecipes,
  trackLabel,
  onApiPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  CodeBlockComponent,
  PropsTableComponent,
  UsageRecipesPanelComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const CodeBlock = CodeBlockComponent;
  const PropsTable = PropsTableComponent;
  const UsageRecipesPanel = UsageRecipesPanelComponent;

  if (!item) {
    return <Text variant="secondary">{t('designlab.component.api.empty')}</Text>;
  }

  const apiPanelItems = [
    {
      value: 'contract',
      label: 'Contract',
      badge: <Badge variant="info">{item.kind}</Badge>,
      content: (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
            <DetailLabel>{t('designlab.component.api.import')}</DetailLabel>
            <CodeBlock code={item.importStatement || t('designlab.component.api.import.planned')} className="mt-3" />
          </div>
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
            <DetailLabel>{t('designlab.component.api.registryFields')}</DetailLabel>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.kind')}</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.kind}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.taxonomy')}</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.taxonomyGroupId}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.subgroup')}</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.taxonomySubgroup}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.track')}</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{trackLabel ?? '—'}</Text>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: 'model',
      label: 'Model',
      badge: <Badge variant="muted">{apiItem ? `${apiItem.variantAxes.length + apiItem.stateModel.length}` : '—'}</Badge>,
      content: (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.component.api.model.title')}</DetailLabel>
          {apiItem ? (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.model.variantAxes')}</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {apiItem.variantAxes.map((entry) => <SectionBadge key={entry} label={entry} />)}
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.model.stateModel')}</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {apiItem.stateModel.map((entry) => <SectionBadge key={entry} label={entry} />)}
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.model.previewFocus')}</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {apiItem.previewFocus.map((entry) => <SectionBadge key={entry} label={entry} />)}
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>{t('designlab.component.api.model.regressionFocus')}</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {apiItem.regressionFocus.map((entry) => <SectionBadge key={entry} label={entry} />)}
                </div>
              </div>
            </div>
          ) : (
            <Text variant="secondary" className="mt-3 block">
              {t('designlab.component.api.model.noCatalog')}
            </Text>
          )}
        </div>
      ),
    },
    {
      value: 'props',
      label: 'Props',
      badge: <Badge variant="info">{apiItem?.props.length ?? 0}</Badge>,
      content: (
        <PropsTable
          rows={(apiItem?.props ?? []).map((prop) => ({
            name: prop.name,
            type: prop.type,
            defaultValue: prop.default,
            required: prop.required,
            description: prop.description,
          }))}
        />
      ),
    },
    {
      value: 'usage',
      label: 'Usage',
      badge: <Badge variant="success">{usageRecipes.length}</Badge>,
      content: <UsageRecipesPanel recipes={usageRecipes} />,
    },
  ] satisfies Array<{
    value: DesignLabComponentApiPanelId;
    label: string;
    badge: React.ReactNode;
    content: React.ReactNode;
  }>;

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.component.api.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.component.api.workspace.description')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <SectionBadge label={t('designlab.common.panelCountPlural', { count: apiPanelItems.length })} />
        </div>
      </div>

      <Tabs
        value={activeApiPanel}
        onValueChange={(value) => onApiPanelChange(value as DesignLabComponentApiPanelId)}
        appearance="pill"
        listLabel="Component API workspace panels"
        className="mt-5"
        items={apiPanelItems}
      />
    </div>
  );
};

const WAYFINDING_ROLE_COLORS: Record<string, string> = {
  global: 'bg-blue-400',
  local: 'bg-emerald-400',
  contextual: 'bg-amber-400',
  hierarchical: 'bg-violet-400',
  sequential: 'bg-cyan-400',
  action: 'bg-red-400',
};

const ComponentUxTab: React.FC<{
  item: DesignLabIndexItem | null;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
}> = ({ item, DetailLabelComponent, SectionBadgeComponent }) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;

  if (!item) {
    return <Text variant="secondary">{t('designlab.component.ux.empty')}</Text>;
  }

  const matchedFamilies = React.useMemo(() => matchNavigationFamilies(item), [item]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.component.ux.alignment')}</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.uxPrimaryThemeId ? <SectionBadge label={item.uxPrimaryThemeId} /> : <Text variant="secondary">{t('designlab.component.ux.primaryThemeMissing')}</Text>}
            {item.uxPrimarySubthemeId ? <SectionBadge label={item.uxPrimarySubthemeId} /> : <Text variant="secondary">{t('designlab.component.ux.primarySubthemeMissing')}</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.component.ux.northStar')}</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.sectionIds?.length ? item.sectionIds.map((sectionId) => <SectionBadge key={sectionId} label={sectionId} />) : <Text variant="secondary">{t('designlab.component.ux.sectionMissing')}</Text>}
          </div>
        </div>
      </div>

      {/* Navigation family matrix */}
      {matchedFamilies.length > 0 ? (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>Navigation family match</DetailLabel>
          <Text variant="secondary" className="mt-1 block text-xs leading-5">
            Bu component icin eslesen navigation family, recipe baglantilari ve page shell bindingleri.
          </Text>
          <div className="flex flex-col mt-4 gap-3">
            {matchedFamilies.map((family) => (
              <div key={family.familyId} className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${WAYFINDING_ROLE_COLORS[family.wayfindingRole] ?? 'bg-zinc-400'}`} />
                  <Text className="text-sm font-semibold text-text-primary">{family.title}</Text>
                  <SectionBadge label={family.wayfindingRole} />
                </div>
                <Text variant="secondary" className="mt-1 block text-xs leading-5">{family.description}</Text>
                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                  <div>
                    <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Components</Text>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {family.canonicalComponents.map((comp) => (
                        <span key={comp} className="inline-block rounded-md bg-surface-default px-1.5 py-0.5 text-[9px] font-medium text-text-secondary">{comp}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Recipe bindings</Text>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {family.recipeBindings.map((rb) => (
                        <span key={rb} className="inline-block rounded-md bg-surface-default px-1.5 py-0.5 text-[9px] font-medium text-text-secondary">{rb.replace(/_/g, ' ')}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Page shells</Text>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {family.pageShellBindings.map((ps) => (
                        <span key={ps} className="inline-block rounded-md bg-surface-default px-1.5 py-0.5 text-[9px] font-medium text-text-secondary">{ps.replace(/_/g, ' ')}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Text variant="secondary" className="text-[10px]">A11y: {family.a11yPattern}</Text>
                  <Text variant="secondary" className="text-[10px]">Responsive: {family.responsiveBehavior.replace(/_/g, ' ')}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>Navigation family matrix</DetailLabel>
          <Text variant="secondary" className="mt-2 block text-sm leading-6">
            Bu component icin navigation family eslesmesi bulunamadi. Navigation component&apos;leri secildiginde family, recipe ve page shell baglantilari burada gorunur.
          </Text>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {navigationMatrix.navigationFamilies.map((family) => (
              <span key={family.familyId} className="inline-flex items-center gap-1 rounded-md bg-surface-panel px-2 py-1 text-[10px] font-medium text-text-tertiary">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${WAYFINDING_ROLE_COLORS[family.wayfindingRole] ?? 'bg-zinc-400'}`} />
                {family.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cross-family patterns */}
      {navigationMatrix.crossFamilyPatterns.length > 0 ? (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>Cross-family navigation patterns</DetailLabel>
          <Text variant="secondary" className="mt-1 block text-xs leading-5">
            Birden fazla navigation family&apos;yi kesen ortak interaction pattern&apos;leri.
          </Text>
          <div className="flex flex-col mt-4 gap-3">
            {navigationMatrix.crossFamilyPatterns.map((pattern) => {
              const involvedFamilies = navigationMatrix.navigationFamilies.filter((f) =>
                pattern.families.includes(f.familyId),
              );
              const isRelevant = matchedFamilies.some((mf) => pattern.families.includes(mf.familyId));

              return (
                <div
                  key={pattern.patternId}
                  className={`rounded-[20px] border p-4 transition ${
                    isRelevant
                      ? 'border-action-primary/30 bg-surface-panel shadow-xs ring-1 ring-action-primary/10'
                      : 'border-border-subtle bg-surface-panel'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Text className="text-sm font-semibold text-text-primary">
                      {pattern.title}
                    </Text>
                    {isRelevant ? (
                      <Badge variant="info">active match</Badge>
                    ) : null}
                  </div>
                  <Text variant="secondary" className="mt-1 block text-xs leading-5">
                    {pattern.description}
                  </Text>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {involvedFamilies.map((family) => (
                      <span
                        key={family.familyId}
                        className="inline-flex items-center gap-1 rounded-md bg-surface-default px-2 py-1 text-[10px] font-medium text-text-secondary"
                      >
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${WAYFINDING_ROLE_COLORS[family.wayfindingRole] ?? 'bg-zinc-400'}`} />
                        {family.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Wayfinding roles legend */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
        <DetailLabel>Wayfinding roles</DetailLabel>
        <Text variant="secondary" className="mt-1 block text-xs leading-5">
          Navigation family&apos;lerin kullaniciya sagladigi yonlendirme rolleri.
        </Text>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
          {Object.entries(navigationMatrix.wayfindingRoles).map(([roleId, description]) => (
            <div key={roleId} className="flex items-start gap-2 rounded-xl bg-surface-panel px-3 py-2">
              <span className={`mt-1 inline-block h-2 w-2 shrink-0 rounded-full ${WAYFINDING_ROLE_COLORS[roleId] ?? 'bg-zinc-400'}`} />
              <div className="min-w-0">
                <Text className="text-[10px] font-semibold text-text-primary">{roleId}</Text>
                <Text variant="secondary" className="block text-[10px] leading-4">{description}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ComponentQualityTab: React.FC<{
  activeQualityPanel: DesignLabComponentQualityPanelId;
  item: DesignLabIndexItem | null;
  onQualityPanelChange: (panelId: DesignLabComponentQualityPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent?: React.ComponentType<any>;
}> = ({ activeQualityPanel, item, onQualityPanelChange, DetailLabelComponent, SectionBadgeComponent, MetricCardComponent }) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;

  if (!item) {
    return <Text variant="secondary">{t('designlab.component.quality.empty')}</Text>;
  }

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.component.quality.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.component.quality.workspace.description')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <SectionBadge label={t('designlab.common.panelCountPlural', { count: 5 })} />
        </div>
      </div>

      <Tabs
        value={activeQualityPanel}
        onValueChange={(value) => onQualityPanelChange(value as DesignLabComponentQualityPanelId)}
        appearance="pill"
        listLabel="Component quality workspace panels"
        className="mt-5"
        items={[
          {
            value: 'gates',
            label: t('designlab.component.quality.gates'),
            badge: <Badge variant="info">{item.qualityGates?.length ?? 0}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>{t('designlab.component.quality.gates')}</DetailLabel>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.qualityGates?.length ? item.qualityGates.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">{t('designlab.component.quality.noGates')}</Text>}
                </div>
              </div>
            ),
          },
          {
            value: 'usage',
            label: t('designlab.component.quality.usage'),
            badge: <Badge variant="success">{item.whereUsed.length}</Badge>,
            content: (
              <div className="flex flex-col gap-4">
                {/* Adoption metrics summary */}
                {MetricCardComponent ? (
                  <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                    <DetailLabel>Adoption metrics</DetailLabel>
                    <Text variant="secondary" className="mt-1 block text-xs leading-5">
                      Component adoption ve stability sinyalleri.
                    </Text>
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                      <MetricCardComponent
                        label="Consumer files"
                        value={item.whereUsed.length}
                        note="Bu component'i kullanan dosya sayisi"
                      />
                      <MetricCardComponent
                        label="Adoption tier"
                        value={item.whereUsed.length >= 10 ? 'Wide' : item.whereUsed.length >= 3 ? 'Growing' : 'Early'}
                        note={item.whereUsed.length >= 10 ? 'Genis adoption (10+ consumer)' : item.whereUsed.length >= 3 ? 'Buyuyen adoption (3-9)' : 'Erken adoption (0-2)'}
                      />
                      <MetricCardComponent
                        label="Quality gates"
                        value={item.qualityGates?.length ?? 0}
                        note="Tanimli quality gate sayisi"
                      />
                      <MetricCardComponent
                        label="Stability signal"
                        value={item.qualityGates?.length && item.whereUsed.length >= 3 ? 'Stable-ready' : 'Maturing'}
                        note={item.qualityGates?.length && item.whereUsed.length >= 3 ? 'Gate + adoption sinyali pozitif' : 'Gate veya adoption henuz yeterli degil'}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Usage file list */}
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>{t('designlab.component.quality.usage')}</DetailLabel>
                  <div className="flex flex-col mt-4 gap-2">
                    {item.whereUsed.length > 0 ? item.whereUsed.map((filePath) => (
                      <div key={filePath} className="rounded-2xl border border-border-subtle bg-surface-default px-3 py-3">
                        <div className="break-all text-xs text-text-secondary">{filePath}</div>
                      </div>
                    )) : <Text variant="secondary">{t('designlab.general.recipe.noBindings')}</Text>}
                  </div>
                </div>
              </div>
            ),
          },
          ...(MetricCardComponent ? [
            {
              value: 'governance' as const,
              label: 'Governance',
              badge: <Badge variant="warning">5 dim</Badge>,
              content: (
                <MigrationGovernancePanel
                  layer="components"
                  DetailLabelComponent={DetailLabelComponent}
                  SectionBadgeComponent={SectionBadgeComponent}
                  MetricCardComponent={MetricCardComponent}
                />
              ),
            },
            {
              value: 'benchmark' as const,
              label: 'Benchmark',
              badge: <Badge variant="info">12</Badge>,
              content: (
                <BenchmarkParityPanel
                  layerFilter="components"
                  DetailLabelComponent={DetailLabelComponent}
                  SectionBadgeComponent={SectionBadgeComponent as React.ComponentType<any>}
                  MetricCardComponent={MetricCardComponent}
                />
              ),
            },
            {
              value: 'contracts' as const,
              label: 'Contracts',
              badge: <Badge variant="success">8</Badge>,
              content: (
                <PlatformContractsCompliancePanel
                  layerFilter="components"
                  DetailLabelComponent={DetailLabelComponent}
                  SectionBadgeComponent={SectionBadgeComponent as React.ComponentType<any>}
                  MetricCardComponent={MetricCardComponent}
                />
              ),
            },
          ] : []),
        ]}
      />
    </div>
  );
};

export const DesignLabComponentDetailSections: React.FC<DesignLabComponentDetailSectionsProps> = ({
  activeTab,
  activeApiPanel,
  activeQualityPanel,
  item,
  generalContent,
  overviewContent,
  demoContent,
  apiItem,
  usageRecipes,
  trackLabel,
  onApiPanelChange,
  onQualityPanelChange,
  onCopyImport,
  DocsSectionComponent,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  CodeBlockComponent,
  PropsTableComponent,
  UsageRecipesPanelComponent,
}) => {
  const { t } = useDesignLabI18n();
  const DocsSection = DocsSectionComponent;
  const demoActions = item?.importStatement ? (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="secondary" size="sm" onClick={onCopyImport}>
        {t('designlab.general.component.import.action')}
      </Button>
    </div>
  ) : null;

  switch (activeTab) {
    case 'general':
      return (
        <DocsSection
          id="design-lab-section-general"
          eyebrow="Workspace"
          title={t('designlab.tabs.general.label')}
          description={t('designlab.tabs.general.description')}
        >
          <div data-detail-section-id="general">{generalContent}</div>
        </DocsSection>
      );
    case 'demo':
      return (
        <DocsSection
          id="design-lab-section-demo"
          eyebrow="Workspace"
          title={t('designlab.tabs.demo.label')}
          description={t('designlab.tabs.demo.description')}
          actions={demoActions}
        >
          <div data-detail-section-id="demo">{demoContent}</div>
        </DocsSection>
      );
    case 'api':
      return (
        <DocsSection
          id="design-lab-section-api"
          eyebrow="Workspace"
          title={t('designlab.tabs.api.label')}
          description={t('designlab.tabs.api.description')}
        >
          <div data-detail-section-id="api">
            <ComponentApiTab
              activeApiPanel={activeApiPanel}
              item={item}
              apiItem={apiItem}
              usageRecipes={usageRecipes}
              trackLabel={trackLabel}
              onApiPanelChange={onApiPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              CodeBlockComponent={CodeBlockComponent}
              PropsTableComponent={PropsTableComponent}
              UsageRecipesPanelComponent={UsageRecipesPanelComponent}
            />
          </div>
        </DocsSection>
      );
    case 'ux':
      return (
        <DocsSection
          id="design-lab-section-ux"
          eyebrow="Workspace"
          title={t('designlab.tabs.ux.label')}
          description={t('designlab.tabs.ux.description')}
        >
          <div data-detail-section-id="ux">
            <ComponentUxTab
              item={item}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
            />
          </div>
        </DocsSection>
      );
    case 'quality':
      return (
        <DocsSection
          id="design-lab-section-quality"
          eyebrow="Workspace"
          title={t('designlab.tabs.quality.label')}
          description={t('designlab.tabs.quality.description')}
        >
          <div data-detail-section-id="quality">
            <ComponentQualityTab
              activeQualityPanel={activeQualityPanel}
              item={item}
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
          id="design-lab-section-overview"
          eyebrow="Workspace"
          title={t('designlab.tabs.overview.label')}
          description={t('designlab.tabs.overview.description')}
        >
          <div data-detail-section-id="overview">{overviewContent}</div>
        </DocsSection>
      );
  }
};
