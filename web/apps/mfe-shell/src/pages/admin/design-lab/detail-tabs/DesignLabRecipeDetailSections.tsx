import React from 'react';
import { Badge, Tabs, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../useDesignLabI18n';
import recipeWorkflowCatalogRaw from '../../design-lab.recipe-workflow-catalog.v1.json';
import { MigrationGovernancePanel } from './MigrationGovernancePanel';
import { BenchmarkParityPanel } from './BenchmarkParityPanel';
import { PlatformContractsCompliancePanel } from './PlatformContractsCompliancePanel';

type DesignLabDetailTab = 'general' | 'overview' | 'demo' | 'api' | 'ux' | 'quality';

type DesignLabRecipeFamily = {
  recipeId: string;
  title?: string;
  clusterTitle?: string;
  clusterDescription?: string;
  intent: string;
  ownerBlocks: string[];
};

type DesignLabRecipeItemSummary = {
  lifecycle: string;
  demoMode: string;
};

export type DesignLabRecipeOverviewPanelId = 'summary' | 'coverage' | 'flow' | 'dependencies';
export type DesignLabRecipeApiPanelId = 'contract' | 'binding' | 'usage';
export type DesignLabRecipeQualityPanelId = 'gates' | 'lifecycle' | 'governance' | 'benchmark' | 'contracts';

/* ── Recipe Workflow Catalog Types ── */

type WorkflowState = {
  stateId: string;
  label: string;
  description: string;
  color: string;
};

type WorkflowTransition = {
  from: string;
  to: string;
  trigger: string;
  label: string;
};

type WorkflowPattern = {
  patternId: string;
  title: string;
  description: string;
  steps: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  ownerBlockPattern: string[];
  dependsOn: string[];
  qualityGates: string[];
};

type DependencyEdge = {
  from: string;
  to: string;
  type: 'extends' | 'consumes';
};

type DependencyCluster = {
  clusterId: string;
  title: string;
  patterns: string[];
};

type RecipeWorkflowCatalog = {
  workflowStates: {
    lifecycle: WorkflowState[];
    transitions: WorkflowTransition[];
  };
  workflowPatterns: WorkflowPattern[];
  dependencyGraph: {
    edges: DependencyEdge[];
    clusters: DependencyCluster[];
  };
  qualityContract: {
    requiredGatesPerComplexity: Record<string, number>;
    crossCuttingGates: string[];
  };
};

const recipeWorkflowCatalog = recipeWorkflowCatalogRaw as unknown as RecipeWorkflowCatalog;

/**
 * Match recipe to workflow patterns based on keyword overlap.
 */
const matchWorkflowPatterns = (recipe: DesignLabRecipeFamily | null): WorkflowPattern[] => {
  if (!recipe) return [];
  const normalized = `${recipe.recipeId} ${recipe.title ?? ''} ${recipe.clusterTitle ?? ''} ${recipe.intent}`.toLowerCase();
  const matched = recipeWorkflowCatalog.workflowPatterns.filter((pattern) => {
    const patternKey = `${pattern.patternId} ${pattern.title}`.toLowerCase();
    const keywords = patternKey.split(/[\s_]+/).filter((w) => w.length > 2);
    return keywords.some((kw) => normalized.includes(kw));
  });
  return matched.length > 0 ? matched : recipeWorkflowCatalog.workflowPatterns.slice(0, 3);
};

const STATE_COLORS: Record<string, string> = {
  zinc: 'bg-zinc-400',
  blue: 'bg-blue-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  violet: 'bg-violet-400',
  red: 'bg-red-400',
};

const COMPLEXITY_COLORS: Record<string, { dot: string; bg: string }> = {
  simple: { dot: 'bg-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  moderate: { dot: 'bg-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  complex: { dot: 'bg-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
};
type DesignLabRecipeSubjectKind = 'recipe' | 'page';

type DesignLabRecipeDetailSectionsProps = {
  activeTab: DesignLabDetailTab;
  activeOverviewPanel: DesignLabRecipeOverviewPanelId;
  activeApiPanel: DesignLabRecipeApiPanelId;
  activeQualityPanel: DesignLabRecipeQualityPanelId;
  recipe: DesignLabRecipeFamily | null;
  generalContent: React.ReactNode;
  demoContent: React.ReactNode;
  recipeContractId: string | null;
  selectedRecipeTracks: string[];
  selectedRecipeSections: string[];
  selectedRecipeThemes: string[];
  selectedRecipeQualityGates: string[];
  selectedRecipeItems: DesignLabRecipeItemSummary[];
  onApiPanelChange: (panelId: DesignLabRecipeApiPanelId) => void;
  onQualityPanelChange: (panelId: DesignLabRecipeQualityPanelId) => void;
  onOverviewPanelChange: (panelId: DesignLabRecipeOverviewPanelId) => void;
  DocsSectionComponent: any;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
  UsageRecipesPanelComponent: React.ComponentType<any>;
  subjectKind?: DesignLabRecipeSubjectKind;
};

const replaceRecipeTermForPage = (value: string) =>
  value
    .replace(/\bRecipe\b/g, 'Template')
    .replace(/\brecipe\b/g, 'template')
    .replace(/\bWorkflow\b/g, 'Template')
    .replace(/\bworkflow\b/g, 'template');

const resolveSubjectLabels = (subjectKind: DesignLabRecipeSubjectKind) => ({
  entity: subjectKind === 'page' ? 'Template' : 'Recipe',
  ownerBlocks: subjectKind === 'page' ? 'Building blocks' : 'Owner blocks',
  bindingEntityId: subjectKind === 'page' ? 'Template ID' : 'Recipe ID',
  bindingPanel: subjectKind === 'page' ? 'Regions' : 'Binding',
  usagePanel: subjectKind === 'page' ? 'Dependencies' : 'Usage',
  usageGuidance: subjectKind === 'page' ? 'Template guidance' : 'Usage guidance',
  apiGuidance: subjectKind === 'page' ? 'Dependency guidance' : 'API guidance',
  uxGuidance: subjectKind === 'page' ? 'Layout guidance' : 'UX guidance',
  qualityGuidance:
    subjectKind === 'page' ? 'Template quality guidance' : 'Quality guidance',
  usagePanelTitle:
    subjectKind === 'page' ? 'Template consume patterns' : 'Recipe consume patterns',
  emptySelection:
    subjectKind === 'page' ? 'No page template selected yet.' : null,
});

const adaptGuidanceForSubject = (
  guidance: ReturnType<typeof getRecipeGuidance>,
  subjectKind: DesignLabRecipeSubjectKind,
) => {
  if (subjectKind !== 'page') {
    return guidance;
  }

  return {
    useWhen: replaceRecipeTermForPage(guidance.useWhen),
    avoidWhen: replaceRecipeTermForPage(guidance.avoidWhen),
    outcome: replaceRecipeTermForPage(guidance.outcome),
    implementationCaution: guidance.implementationCaution
      ? replaceRecipeTermForPage(guidance.implementationCaution)
      : undefined,
  };
};

const getRecipeGuidance = (
  clusterTitle?: string,
  context: 'overview' | 'ux' | 'quality' | 'api' = 'overview',
) => {
  const normalized = (clusterTitle ?? '').toLowerCase();
  if (normalized.includes('search')) {
    if (context === 'ux') {
      return {
        useWhen: 'Arama, filtre ve listeleme etkileşimleri ayni UX ritminde toparlanacaksa.',
        avoidWhen: 'Tek adimli, filtre davranisi olmayan minimal yuzeylerde.',
        outcome: 'Arama ve filtre affordance dili daha tutarli kalir.',
      };
    }
    if (context === 'quality') {
      return {
        useWhen: 'Arama ve listing kalibi icin quality gate ve lifecycle sinyali birlikte okunacaksa.',
        avoidWhen: 'Sadece lokal bir liste denemesi icin ayri kalite kabugu gerekmiyorsa.',
        outcome: 'Arama odakli recipe kalite beklentileri daha gorunur hale gelir.',
      };
    }
    return {
      useWhen: 'Arama, filtre ve listeleme ayni shell altinda birlikte calisacaksa.',
      avoidWhen: 'Sadece tek alanli veya filtre gerektirmeyen kucuk yuzeylerde.',
      outcome: 'Arama ve filtreleme karar yukunu ekipler arasinda azaltir.',
      implementationCaution: 'Search-first akislarda API sınırlarını (pagination, throttling) defaultta kucuk tutup, keyset veya cursor modelini gerekirse acik tutun.',
    };
  }
  if (normalized.includes('review') || normalized.includes('approval')) {
    if (context === 'ux') {
      return {
        useWhen: 'Inspector, karar ve onay aksiyonlari ayni etkileşim diline baglanacaksa.',
        avoidWhen: 'Sadece pasif detay gosteren ekranlarda karar affordance'i gerekmiyorsa.',
        outcome: 'Inceleme ve karar akisi daha net UX sinyalleriyle calisir.',
      };
    }
    if (context === 'quality') {
      return {
        useWhen: 'Onay akisi icin gate, lifecycle ve release sinyali birlikte okunacaksa.',
        avoidWhen: 'Karar almayan, kalite kapisi baglanmayan hafif akislarda.',
        outcome: 'Inceleme recipe'leri icin kalite beklentisi daha kolay denetlenir.',
      };
    }
    return {
      useWhen: 'Karar, onay ve inspector ritmi ayni akista tekrar ediyorsa.',
      avoidWhen: 'Yalniz bilgi gosteren, karar almayan pasif detay sayfalarinda.',
      outcome: 'Inceleme ve onay dili ekipler arasinda tek ritme oturur.',
      implementationCaution: 'Onay akislarinda mutlak surec state machine endpoint'leri tekil idempotent olmalidir; retry davranisi tutarsiz ise kalite kapanislari gecikir.',
    };
  }
  if (normalized.includes('state') || normalized.includes('feedback')) {
    if (context === 'ux') {
      return {
        useWhen: 'Bos, hata ve loading durumlari ayni etkileşim ve ton kararlarini tasiyacaksa.',
        avoidWhen: 'Tek bir lokal state icin merkezi UX rehberi gerekmiyorsa.',
        outcome: 'State ve feedback affordance'lari daha sakin ve daha tutarli olur.',
      };
    }
    if (context === 'quality') {
      return {
        useWhen: 'State recipe'leri icin quality gate ve lifecycle etkisi birlikte gozden gecirilecekse.',
        avoidWhen: 'Anlik local state denemelerinde ayrik kalite kabugu gerekmiyorsa.',
        outcome: 'Feedback recipe'leri icin kalite sinyalleri daha gorunur hale gelir.',
      };
    }
    return {
      useWhen: 'Bos, hata ve loading halleri urun genelinde standardize edilecekse.',
      avoidWhen: 'Tek bir lokal state icin agir bir feedback shell gerekmiyorsa.',
      outcome: 'Durum dili daha sakin, daha tutarli ve daha tekrar kullanilabilir olur.',
      implementationCaution: 'State/feedback recipe'lerinde API contractlarında kodlanmis hata taxonomy si ekli degilse, UX fallback'leri bozulur.',
    };
  }
  if (normalized.includes('ai')) {
    if (context === 'ux') {
      return {
        useWhen: 'Prompt, sonuc ve guven sinyali tek bir interaction ritminde akacaksa.',
        avoidWhen: 'AI yardimi olmayan standart form veya tablo ekranlarinda.',
        outcome: 'AI handoff dili ve guven affordance'i daha netlesir.',
      };
    }
    if (context === 'quality') {
      return {
        useWhen: 'AI akisi icin kalite gate, human review ve lifecycle etkisi birlikte ele alinacaksa.',
        avoidWhen: 'Prototype seviyesinde, kalite sinyali gerektirmeyen hafif denemelerde.',
        outcome: 'AI recipe'leri icin guven ve kalite cizgisi daha izlenebilir olur.',
      };
    }
    return {
      useWhen: 'Prompt, sonuc ve guven sinyali ayni akis icinde birlikte akacaksa.',
      avoidWhen: 'AI yardimi olmayan basit form veya tablo ekranlarinda.',
      outcome: 'AI handoff ve guven sinyalleri daha net bir yapida kalir.',
      implementationCaution: 'AI tabanli akislarda API response timeout'ları ve trace id alanlarini her istekte expose edin; gizli context'i client tarafina actirmayin.',
    };
  }
  if (context === 'ux') {
    return {
      useWhen: 'Tekrarlanan recipe etkileşimleri ortak bir UX karar seti isteyince.',
      avoidWhen: 'Tek seferlik, deneysel veya yerel etkileşimler merkezi rehber gerektirmiyorsa.',
      outcome: 'Recipe etkileşimleri daha tutarli ve daha kolay okunur hale gelir.',
    };
  }
  if (context === 'quality') {
    return {
      useWhen: 'Recipe kalite sinyalleri ve lifecycle durumu ayni yerde gorulecekse.',
      avoidWhen: 'Kalite kapisi olmayan kucuk ve gecici recipe denemelerinde.',
      outcome: 'Recipe ailesi icin kalite beklentileri daha net takip edilir.',
      implementationCaution: 'Kalite gate\'larda mutabik lifecycle basamaklari ile API versiyonlarinin hizli degistigi akislarda warning'ler stale kalmamalidir.',
    };
  }
  if (context === 'api') {
    return {
      useWhen: 'API contract, owner blokları ve track baglantisi birlikte planlanacaksa.',
      avoidWhen: 'Sadece tek seferlik demo veya lokal denemelerde ve stabil contract olmadan.',
      outcome: 'Recipe konsumasyonu ile API lifecycle'i hizli hizlica izlenebilir hale gelir.',
      implementationCaution: 'Consumer tarafinda package import'lari birden fazla yerden import etmeden tek source-of-truth noktadan cekilmeli.',
    };
  }
  return {
    useWhen: 'Ayni urun problemi birden fazla ekipte tekrar ediyorsa.',
    avoidWhen: 'Tek seferlik, tekrar etmeyecek ozel ekranlarda.',
    outcome: 'Recipe ailesi tekrarli urun problemlerini daha hizli cozmeyi saglar.',
  };
};

const RecipeGuidancePanel: React.FC<{
  title: string;
  guidance: ReturnType<typeof getRecipeGuidance>;
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

/* ── State Machine Visualizer (Overview > Flow) ── */

const RecipeStateMachineVisualizer: React.FC<{
  recipe: DesignLabRecipeFamily | null;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({ recipe, DetailLabelComponent, SectionBadgeComponent, MetricCardComponent }) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const { lifecycle, transitions } = recipeWorkflowCatalog.workflowStates;
  const matchedPatterns = React.useMemo(() => matchWorkflowPatterns(recipe), [recipe]);
  const primaryPattern = matchedPatterns[0] ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* Lifecycle state machine */}
      <div>
        <div className="flex items-center justify-between">
          <DetailLabel>Recipe lifecycle states</DetailLabel>
          <SectionBadge label={`${lifecycle.length} states`} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {lifecycle.map((state, idx) => (
            <React.Fragment key={state.stateId}>
              <div
                className="flex items-center gap-2 rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2"
                data-testid={`recipe-state-${state.stateId}`}
              >
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATE_COLORS[state.color] ?? 'bg-zinc-400'}`} />
                <div className="min-w-0">
                  <Text className="text-xs font-semibold text-text-primary">{state.label}</Text>
                  <Text variant="secondary" className="block text-[10px] leading-4">
                    {state.description}
                  </Text>
                </div>
              </div>
              {idx < lifecycle.length - 1 ? (
                <svg width="20" height="12" viewBox="0 0 20 12" className="shrink-0 text-text-secondary opacity-40">
                  <path d="M0 6h14m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Transitions */}
      <div>
        <div className="flex items-center justify-between">
          <DetailLabel>State transitions</DetailLabel>
          <SectionBadge label={`${transitions.length} transitions`} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-1.5 xl:grid-cols-2">
          {transitions.map((t) => (
            <div
              key={`${t.from}-${t.to}`}
              className="flex items-center gap-2 rounded-xl bg-surface-panel px-3 py-2"
            >
              <Text className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider min-w-[60px]">
                {t.from}
              </Text>
              <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0 text-text-secondary opacity-50">
                <path d="M0 4h12m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Text className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider min-w-[60px]">
                {t.to}
              </Text>
              <Text variant="secondary" className="ml-auto shrink-0 text-[10px]">
                {t.label}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* Matched workflow pattern */}
      {primaryPattern ? (
        <div>
          <div className="flex items-center justify-between">
            <DetailLabel>Matched workflow pattern</DetailLabel>
            <SectionBadge label={primaryPattern.complexity} />
          </div>
          <div className="mt-3 rounded-[20px] border border-border-subtle bg-surface-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Text as="div" className="text-sm font-semibold text-text-primary">
                  {primaryPattern.title}
                </Text>
                <Text variant="secondary" className="mt-1 block text-xs leading-5">
                  {primaryPattern.description}
                </Text>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${COMPLEXITY_COLORS[primaryPattern.complexity]?.dot ?? 'bg-zinc-400'}`} />
                <Text variant="secondary" className="text-[10px]">{primaryPattern.complexity}</Text>
              </div>
            </div>
            {/* Steps flow */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {primaryPattern.steps.map((step, idx) => (
                <React.Fragment key={step}>
                  <span className="inline-flex items-center rounded-lg bg-surface-default px-2 py-1 text-[10px] font-medium text-text-primary">
                    {idx + 1}. {step.replace(/_/g, ' ')}
                  </span>
                  {idx < primaryPattern.steps.length - 1 ? (
                    <svg width="12" height="8" viewBox="0 0 12 8" className="shrink-0 text-text-secondary opacity-40">
                      <path d="M0 4h8m0 0l-2.5-2.5m2.5 2.5l-2.5 2.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
            {/* Owner blocks */}
            <div className="mt-3 flex flex-wrap gap-1">
              {primaryPattern.ownerBlockPattern.map((block) => (
                <span
                  key={block}
                  className="inline-flex items-center rounded-md bg-violet-50 px-1.5 py-0.5 text-[9px] font-medium text-violet-600 dark:bg-violet-900/20 dark:text-violet-300"
                >
                  {block}
                </span>
              ))}
            </div>
            {/* Quality gates */}
            <div className="mt-3 flex flex-wrap gap-1">
              {primaryPattern.qualityGates.map((gate) => (
                <span
                  key={gate}
                  className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300"
                >
                  {gate.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ── Dependency Graph (Overview > Dependencies) ── */

const RecipeDependencyGraph: React.FC<{
  recipe: DesignLabRecipeFamily | null;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({ recipe, DetailLabelComponent, SectionBadgeComponent, MetricCardComponent }) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const { edges, clusters } = recipeWorkflowCatalog.dependencyGraph;
  const allPatterns = recipeWorkflowCatalog.workflowPatterns;
  const matchedPatterns = React.useMemo(() => matchWorkflowPatterns(recipe), [recipe]);
  const matchedIds = React.useMemo(() => new Set(matchedPatterns.map((p) => p.patternId)), [matchedPatterns]);

  // Find relevant edges (any edge touching a matched pattern)
  const relevantEdges = React.useMemo(
    () => edges.filter((e) => matchedIds.has(e.from) || matchedIds.has(e.to)),
    [edges, matchedIds],
  );

  // Find relevant clusters
  const relevantClusters = React.useMemo(
    () => clusters.filter((c) => c.patterns.some((p) => matchedIds.has(p))),
    [clusters, matchedIds],
  );

  const EDGE_TYPE_COLORS: Record<string, string> = {
    extends: 'text-violet-500',
    consumes: 'text-blue-500',
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Cluster overview */}
      <div>
        <div className="flex items-center justify-between">
          <DetailLabel>Workflow clusters</DetailLabel>
          <SectionBadge label={`${clusters.length} clusters`} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {clusters.map((cluster) => {
            const isRelevant = relevantClusters.some((c) => c.clusterId === cluster.clusterId);
            return (
              <div
                key={cluster.clusterId}
                className={`rounded-[18px] border px-3 py-2.5 transition ${
                  isRelevant
                    ? 'border-action-primary/30 bg-surface-default shadow-xs ring-1 ring-action-primary/10'
                    : 'border-border-subtle bg-surface-panel'
                }`}
              >
                <Text className="text-xs font-semibold text-text-primary">{cluster.title}</Text>
                <div className="mt-2 flex flex-wrap gap-1">
                  {cluster.patterns.map((pId) => {
                    const isMatch = matchedIds.has(pId);
                    return (
                      <span
                        key={pId}
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                          isMatch
                            ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300'
                            : 'bg-surface-default text-text-secondary'
                        }`}
                      >
                        {pId.replace(/_/g, ' ')}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dependency edges */}
      <div>
        <div className="flex items-center justify-between">
          <DetailLabel>Dependency edges</DetailLabel>
          <SectionBadge label={`${edges.length} total, ${relevantEdges.length} relevant`} />
        </div>
        <div className="flex flex-col mt-3 gap-1.5">
          {edges.map((edge) => {
            const isRelevant = matchedIds.has(edge.from) || matchedIds.has(edge.to);
            return (
              <div
                key={`${edge.from}-${edge.to}`}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                  isRelevant ? 'bg-surface-default border border-border-subtle' : 'bg-surface-panel'
                }`}
              >
                <Text className={`text-[10px] font-semibold uppercase tracking-wider min-w-[100px] ${isRelevant ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {edge.from.replace(/_/g, ' ')}
                </Text>
                <div className={`flex items-center gap-1 ${EDGE_TYPE_COLORS[edge.type] ?? 'text-text-secondary'}`}>
                  <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0">
                    <path d="M0 4h12m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <Text className="text-[9px] font-medium">{edge.type}</Text>
                </div>
                <Text className={`text-[10px] font-semibold uppercase tracking-wider ${isRelevant ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {edge.to.replace(/_/g, ' ')}
                </Text>
              </div>
            );
          })}
        </div>
      </div>

      {/* All workflow patterns grid */}
      <div>
        <div className="flex items-center justify-between">
          <DetailLabel>All workflow patterns</DetailLabel>
          <SectionBadge label={`${allPatterns.length} patterns`} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
          {allPatterns.map((pattern) => {
            const isMatch = matchedIds.has(pattern.patternId);
            const deps = pattern.dependsOn;
            return (
              <div
                key={pattern.patternId}
                className={`rounded-[18px] border p-3 transition ${
                  isMatch
                    ? 'border-action-primary/30 bg-surface-default shadow-xs'
                    : 'border-border-subtle bg-surface-panel'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Text className="text-xs font-semibold text-text-primary">{pattern.title}</Text>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${COMPLEXITY_COLORS[pattern.complexity]?.dot ?? 'bg-zinc-400'}`} />
                    <Text variant="secondary" className="text-[9px]">{pattern.complexity}</Text>
                  </div>
                </div>
                <Text variant="secondary" className="mt-1 block text-[11px] leading-4">
                  {pattern.description}
                </Text>
                {deps.length > 0 ? (
                  <div className="mt-2 flex items-center gap-1">
                    <Text variant="secondary" className="text-[9px]">depends:</Text>
                    {deps.map((d) => (
                      <span key={d} className="inline-flex items-center rounded-md bg-blue-50 px-1 py-0.5 text-[8px] font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                        {d.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RecipeOverviewTab: React.FC<{
  activeOverviewPanel: DesignLabRecipeOverviewPanelId;
  recipe: DesignLabRecipeFamily | null;
  selectedRecipeTracks: string[];
  selectedRecipeSections: string[];
  selectedRecipeThemes: string[];
  selectedRecipeQualityGates: string[];
  onOverviewPanelChange: (panelId: DesignLabRecipeOverviewPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
  subjectKind: DesignLabRecipeSubjectKind;
}> = ({
  activeOverviewPanel,
  recipe,
  selectedRecipeTracks,
  selectedRecipeSections,
  selectedRecipeThemes,
  selectedRecipeQualityGates,
  onOverviewPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  ShowcaseCardComponent,
  subjectKind,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const ShowcaseCard = ShowcaseCardComponent;
  const subjectLabels = resolveSubjectLabels(subjectKind);
  const guidance = adaptGuidanceForSubject(
    getRecipeGuidance(recipe?.clusterTitle),
    subjectKind,
  );

  if (!recipe) {
    return (
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-xs">
        <Text variant="secondary">
          {subjectLabels.emptySelection ?? t('designlab.recipe.overview.empty')}
        </Text>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.recipe.overview.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.recipe.overview.workspace.description')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <SectionBadge label={t('designlab.common.panelCountPlural', { count: 4 })} />
        </div>
      </div>

      <Tabs
        value={activeOverviewPanel}
        onValueChange={(value) => onOverviewPanelChange(value as DesignLabRecipeOverviewPanelId)}
        appearance="pill"
        listLabel={t('designlab.recipe.overview.workspace.title')}
        className="mt-5"
        items={[
          {
            value: 'summary',
            label: 'Summary',
            badge: <Badge variant="info">{recipe.ownerBlocks.length}</Badge>,
            content: (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                    <DetailLabel>{t('designlab.recipe.overview.summary')}</DetailLabel>
                    <Text as="div" className="mt-3 text-lg font-semibold text-text-primary">
                      {recipe.title ?? recipe.recipeId}
                    </Text>
                    {recipe.clusterTitle ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <SectionBadge label={recipe.clusterTitle} />
                      </div>
                    ) : null}
                    <Text variant="secondary" className="mt-2 block leading-7">
                      {recipe.intent}
                    </Text>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {recipe.ownerBlocks.map((owner) => (
                        <SectionBadge key={owner} label={owner} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                    <DetailLabel>{t('designlab.recipe.overview.quickStatus')}</DetailLabel>
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <MetricCard label="Owner blocks" value={recipe.ownerBlocks.length} note={t('designlab.recipe.overview.quickStatus.ownerBlocks.note')} />
                      <MetricCard label="Tracks" value={selectedRecipeTracks.length} note={t('designlab.recipe.overview.quickStatus.tracks.note')} />
                      <MetricCard label="Sections" value={selectedRecipeSections.length} note={t('designlab.recipe.overview.quickStatus.sections.note')} />
                      <MetricCard label="Themes" value={selectedRecipeThemes.length} note={t('designlab.recipe.overview.quickStatus.themes.note')} />
                    </div>
                  </div>
                </div>

                <RecipeGuidancePanel
                  title={subjectLabels.usageGuidance}
                  guidance={guidance}
                />
              </div>
            ),
          },
          {
            value: 'coverage',
            label: 'Coverage',
            badge: <Badge variant="warning">{selectedRecipeTracks.length}</Badge>,
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>{t('designlab.recipe.overview.trackCoverage')}</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedRecipeTracks.length ? selectedRecipeTracks.map((track) => <SectionBadge key={track} label={track} />) : <Text variant="secondary">{t('designlab.recipe.overview.noTrackBinding')}</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>{t('designlab.recipe.overview.northStarCoverage')}</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedRecipeSections.length ? selectedRecipeSections.map((section) => <SectionBadge key={section} label={section} />) : <Text variant="secondary">{t('designlab.recipe.overview.noSectionBinding')}</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>{t('designlab.recipe.overview.themeCoverage')}</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedRecipeThemes.length ? selectedRecipeThemes.map((theme) => <SectionBadge key={theme} label={theme} />) : <Text variant="secondary">{t('designlab.recipe.overview.noThemeBinding')}</Text>}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                  <DetailLabel>{t('designlab.recipe.overview.qualityCoverage')}</DetailLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedRecipeQualityGates.length ? selectedRecipeQualityGates.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">{t('designlab.recipe.overview.noQualityGates')}</Text>}
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: 'flow',
            label: 'State Machine',
            badge: <Badge variant="success">{recipeWorkflowCatalog.workflowStates.lifecycle.length} states</Badge>,
            content: (
              <RecipeStateMachineVisualizer
                recipe={recipe}
                DetailLabelComponent={DetailLabelComponent}
                SectionBadgeComponent={SectionBadgeComponent}
                MetricCardComponent={MetricCardComponent}
              />
            ),
          },
          {
            value: 'dependencies',
            label: 'Dependencies',
            badge: <Badge variant="warning">{recipeWorkflowCatalog.dependencyGraph.edges.length}</Badge>,
            content: (
              <RecipeDependencyGraph
                recipe={recipe}
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

const RecipeApiTab: React.FC<{
  activeApiPanel: DesignLabRecipeApiPanelId;
  recipe: DesignLabRecipeFamily | null;
  recipeContractId: string | null;
  selectedRecipeTracks: string[];
  onApiPanelChange: (panelId: DesignLabRecipeApiPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
  UsageRecipesPanelComponent: React.ComponentType<any>;
  subjectKind: DesignLabRecipeSubjectKind;
}> = ({
  activeApiPanel,
  recipe,
  recipeContractId,
  selectedRecipeTracks,
  onApiPanelChange,
  DetailLabelComponent,
  MetricCardComponent,
  CodeBlockComponent,
  UsageRecipesPanelComponent,
  subjectKind,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const MetricCard = MetricCardComponent;
  const CodeBlock = CodeBlockComponent;
  const UsageRecipesPanel = UsageRecipesPanelComponent;
  const subjectLabels = resolveSubjectLabels(subjectKind);
  const guidance = adaptGuidanceForSubject(
    getRecipeGuidance(recipe?.clusterTitle, 'api'),
    subjectKind,
  );

  if (!recipe) {
    return (
      <Text variant="secondary">
        {subjectLabels.emptySelection ?? t('designlab.recipe.api.empty')}
      </Text>
    );
  }

  const composeCode = `import { ${recipe.ownerBlocks.join(', ')} } from '@mfe/design-system';\n\nexport function ${recipe.recipeId.replace(/[^a-zA-Z0-9]+/g, ' ')}${subjectLabels.entity.replace(/[^a-zA-Z0-9]+/g, '')}() {\n  return (\n    <div>{/* ${recipe.intent} */}</div>\n  );\n}`;
  const usageRecipes = [
    {
      title: t('designlab.recipe.api.compose.title'),
      description: t('designlab.recipe.api.compose.description'),
      code: composeCode,
    },
    {
      title: t('designlab.recipe.api.handoff.title'),
      description: t('designlab.recipe.api.handoff.description'),
      code: `// ${subjectLabels.entity} intent\n// ${recipe.intent}\n// ${subjectLabels.ownerBlocks}: ${recipe.ownerBlocks.join(', ')}\n// Contract: ${recipeContractId ?? 'recipe-contract'}`,
    },
  ];

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.recipe.api.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {subjectKind === 'page'
              ? t('designlab.tabs.api.description.pages')
              : t('designlab.recipe.api.workspace.description')}
          </Text>
        </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
        <Badge variant="muted">{t('designlab.common.panelCountPlural', { count: 3 })}</Badge>
      </div>
      </div>

      <RecipeGuidancePanel
        title={subjectLabels.apiGuidance}
        guidance={guidance}
        className="mt-5"
      />

      <Tabs
        value={activeApiPanel}
        onValueChange={(value) => onApiPanelChange(value as DesignLabRecipeApiPanelId)}
        appearance="pill"
        listLabel={t('designlab.recipe.api.listLabel')}
        className="mt-5"
        items={[
          {
            value: 'contract',
            label: t('designlab.recipe.api.contract'),
            badge: <Badge variant="info">{recipe.ownerBlocks.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>{t('designlab.recipe.api.contractTitle')}</DetailLabel>
                <CodeBlock code={composeCode} className="mt-3" />
              </div>
            ),
          },
          {
            value: 'binding',
            label:
              subjectKind === 'page'
                ? subjectLabels.bindingPanel
                : t('designlab.recipe.api.binding'),
            badge: <Badge variant="warning">{selectedRecipeTracks.length || '—'}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>{t('designlab.recipe.api.bindingTitle')}</DetailLabel>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1">
                  <MetricCard label={subjectLabels.bindingEntityId} value={recipe.recipeId} note={t('designlab.recipe.api.binding.recipeId.note')} />
                  <MetricCard label={subjectLabels.ownerBlocks} value={recipe.ownerBlocks.length} note={t('designlab.recipe.api.binding.ownerBlocks.note')} />
                  <MetricCard label="Tracks" value={selectedRecipeTracks.join(' / ') || '—'} note={t('designlab.recipe.api.binding.tracks.note')} />
                  <MetricCard label="Contract" value={recipeContractId ?? '—'} note={t('designlab.recipe.api.binding.contract.note')} />
                </div>
              </div>
            ),
          },
          {
            value: 'usage',
            label:
              subjectKind === 'page'
                ? subjectLabels.usagePanel
                : t('designlab.recipe.api.usage'),
            badge: <Badge variant="success">{usageRecipes.length}</Badge>,
            content: (
              <UsageRecipesPanel
                title={subjectLabels.usagePanelTitle}
                recipes={usageRecipes}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

const RecipeUxTab: React.FC<{
  recipe: DesignLabRecipeFamily | null;
  selectedRecipeSections: string[];
  selectedRecipeThemes: string[];
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  subjectKind: DesignLabRecipeSubjectKind;
}> = ({
  recipe,
  selectedRecipeSections,
  selectedRecipeThemes,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  subjectKind,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const subjectLabels = resolveSubjectLabels(subjectKind);
  const guidance = adaptGuidanceForSubject(
    getRecipeGuidance(recipe?.clusterTitle, 'ux'),
    subjectKind,
  );

  const matchedPatterns = React.useMemo(() => matchWorkflowPatterns(recipe), [recipe]);
  const primaryPattern = matchedPatterns[0] ?? null;
  const { lifecycle } = recipeWorkflowCatalog.workflowStates;

  if (!recipe) {
    return (
      <Text variant="secondary">
        {subjectLabels.emptySelection ?? t('designlab.component.ux.empty')}
      </Text>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.recipe.overview.themeCoverage')}</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedRecipeThemes.length ? selectedRecipeThemes.map((theme) => <SectionBadge key={theme} label={theme} />) : <Text variant="secondary">{t('designlab.recipe.overview.noThemeBinding')}</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.recipe.overview.northStarCoverage')}</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedRecipeSections.length ? selectedRecipeSections.map((section) => <SectionBadge key={section} label={section} />) : <Text variant="secondary">{t('designlab.recipe.overview.noSectionBinding')}</Text>}
          </div>
        </div>
      </div>

      {/* Live flow preview */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DetailLabel>Live flow preview</DetailLabel>
            <Text variant="secondary" className="mt-1 block text-xs leading-5">
              Recipe workflow akisinin canli on izlemesi. Eslesen pattern&apos;in adimlari ve lifecycle state&apos;leri gorsel olarak gosterilir.
            </Text>
          </div>
          {primaryPattern ? (
            <Badge variant={COMPLEXITY_COLORS[primaryPattern.complexity] ? 'info' : 'muted'}>
              {primaryPattern.complexity}
            </Badge>
          ) : null}
        </div>

        {primaryPattern ? (
          <div className="flex flex-col mt-4 gap-4">
            {/* Step flow visualization */}
            <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
              <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Workflow steps</Text>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {primaryPattern.steps.map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 ${
                      COMPLEXITY_COLORS[primaryPattern.complexity]?.bg ?? 'bg-surface-default'
                    } border-border-subtle`}>
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                        COMPLEXITY_COLORS[primaryPattern.complexity]?.dot ?? 'bg-zinc-400'
                      } text-white`}>
                        {idx + 1}
                      </span>
                      <Text className="text-xs font-medium text-text-primary">
                        {step.replace(/_/g, ' ')}
                      </Text>
                    </div>
                    {idx < primaryPattern.steps.length - 1 ? (
                      <svg width="20" height="12" viewBox="0 0 20 12" className="shrink-0 text-text-secondary opacity-40">
                        <path d="M0 6h14m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Lifecycle states mini-map */}
            <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-4">
              <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">Lifecycle state map</Text>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {lifecycle.map((state, idx) => (
                  <React.Fragment key={state.stateId}>
                    <div className="flex items-center gap-1.5 rounded-xl bg-surface-default px-2.5 py-1.5">
                      <span className={`inline-block h-2 w-2 rounded-full ${STATE_COLORS[state.color] ?? 'bg-zinc-400'}`} />
                      <Text className="text-[10px] font-semibold text-text-primary">{state.label}</Text>
                    </div>
                    {idx < lifecycle.length - 1 ? (
                      <svg width="12" height="8" viewBox="0 0 12 8" className="shrink-0 text-text-secondary opacity-30">
                        <path d="M0 4h8m0 0l-2.5-2.5m2.5 2.5l-2.5 2.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Pattern metrics */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <MetricCard label="Steps" value={primaryPattern.steps.length} note="Workflow adim sayisi" />
              <MetricCard label="Dependencies" value={primaryPattern.dependsOn.length} note="Bagli pattern sayisi" />
              <MetricCard label="Quality gates" value={primaryPattern.qualityGates.length} note="Gate sayisi" />
              <MetricCard label="Owner blocks" value={primaryPattern.ownerBlockPattern.length} note="Sahip blok sayisi" />
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-[20px] border border-border-subtle bg-surface-panel p-4">
            <Text variant="secondary" className="text-xs leading-5">
              Bu recipe icin eslesen workflow pattern bulunamadi. Workflow catalog&apos;unda tanimli pattern&apos;ler secilen recipe&apos;ye gore otomatik eslesir.
            </Text>
          </div>
        )}
      </div>

      <RecipeGuidancePanel
        title={subjectLabels.uxGuidance}
        guidance={guidance}
      />
    </div>
  );
};

/* ── Quality Gates Content (enriched with catalog) ── */

const RecipeQualityGatesContent: React.FC<{
  recipe: DesignLabRecipeFamily;
  selectedRecipeQualityGates: string[];
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
}> = ({ recipe, selectedRecipeQualityGates, DetailLabelComponent, SectionBadgeComponent, MetricCardComponent }) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const matchedPatterns = React.useMemo(() => matchWorkflowPatterns(recipe), [recipe]);
  const { crossCuttingGates, requiredGatesPerComplexity } = recipeWorkflowCatalog.qualityContract;

  // Collect catalog gates from matched patterns
  const catalogGates = React.useMemo(() => {
    const gates = matchedPatterns.flatMap((p) => p.qualityGates);
    return Array.from(new Set(gates));
  }, [matchedPatterns]);

  const allGates = React.useMemo(() => {
    const merged = new Set([...selectedRecipeQualityGates, ...catalogGates, ...crossCuttingGates]);
    return Array.from(merged);
  }, [selectedRecipeQualityGates, catalogGates, crossCuttingGates]);

  const primaryComplexity = matchedPatterns[0]?.complexity ?? 'moderate';
  const requiredCount = requiredGatesPerComplexity[primaryComplexity] ?? 3;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        <DetailLabel>{t('designlab.component.quality.gates')}</DetailLabel>
        {/* Complexity-based requirement */}
        <div className="mt-3 flex items-center gap-3">
          <MetricCard label="Matched complexity" value={primaryComplexity} />
          <MetricCard label="Required gates" value={String(requiredCount)} />
          <MetricCard label="Current gates" value={String(allGates.length)} />
        </div>
        {/* Gate list */}
        <div className="flex flex-col mt-4 gap-1.5">
          {allGates.map((gate) => {
            const isCatalog = catalogGates.includes(gate);
            const isCrossCutting = crossCuttingGates.includes(gate);
            const source = isCrossCutting ? 'Cross-cutting' : isCatalog ? 'Pattern' : 'Custom';
            return (
              <div
                key={gate}
                className="flex items-center justify-between gap-2 rounded-xl bg-surface-default px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                    isCrossCutting ? 'bg-blue-400' : isCatalog ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <Text className="text-xs font-medium text-text-primary">
                    {gate.replace(/_/g, ' ')}
                  </Text>
                </div>
                <SectionBadge label={source} />
              </div>
            );
          })}
        </div>
      </div>
      {/* Cross-cutting gates summary */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        <DetailLabel>Cross-cutting quality gates</DetailLabel>
        <Text variant="secondary" className="mt-1 block text-xs leading-5">
          Bu gate'ler tum recipe pattern'lerine complexity'den bagimsiz uygulanir.
        </Text>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {crossCuttingGates.map((gate) => (
            <span
              key={gate}
              className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
            >
              {gate.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecipeQualityTab: React.FC<{
  activeQualityPanel: DesignLabRecipeQualityPanelId;
  recipe: DesignLabRecipeFamily | null;
  selectedRecipeItems: DesignLabRecipeItemSummary[];
  selectedRecipeQualityGates: string[];
  onQualityPanelChange: (panelId: DesignLabRecipeQualityPanelId) => void;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  subjectKind: DesignLabRecipeSubjectKind;
}> = ({
  activeQualityPanel,
  recipe,
  selectedRecipeItems,
  selectedRecipeQualityGates,
  onQualityPanelChange,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  subjectKind,
}) => {
  const { t } = useDesignLabI18n();
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;
  const subjectLabels = resolveSubjectLabels(subjectKind);
  const guidance = adaptGuidanceForSubject(
    getRecipeGuidance(recipe?.clusterTitle, 'quality'),
    subjectKind,
  );

  if (!recipe) {
    return (
      <Text variant="secondary">
        {subjectLabels.emptySelection ?? t('designlab.recipe.quality.empty')}
      </Text>
    );
  }

  return (
    <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.recipe.quality.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {t('designlab.recipe.quality.workspace.description')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
          <Badge variant="muted">{t('designlab.common.panelCountPlural', { count: 5 })}</Badge>
        </div>
      </div>

      <RecipeGuidancePanel
        title={subjectLabels.qualityGuidance}
        guidance={guidance}
        className="mt-5"
      />

      <Tabs
        value={activeQualityPanel}
        onValueChange={(value) => onQualityPanelChange(value as DesignLabRecipeQualityPanelId)}
        appearance="pill"
        listLabel={t('designlab.recipe.quality.listLabel')}
        className="mt-5"
        items={[
          {
            value: 'gates',
            label: 'Gates',
            badge: <Badge variant="info">{selectedRecipeQualityGates.length}</Badge>,
            content: (
              <RecipeQualityGatesContent
                recipe={recipe}
                selectedRecipeQualityGates={selectedRecipeQualityGates}
                DetailLabelComponent={DetailLabelComponent}
                SectionBadgeComponent={SectionBadgeComponent}
                MetricCardComponent={MetricCardComponent}
              />
            ),
          },
          {
            value: 'lifecycle',
            label: t('designlab.recipe.quality.lifecycle'),
            badge: <Badge variant="success">{selectedRecipeItems.length}</Badge>,
            content: (
              <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
                <DetailLabel>{t('designlab.recipe.quality.lifecycle.title')}</DetailLabel>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <MetricCard label="Stable" value={selectedRecipeItems.filter((item) => item.lifecycle === 'stable').length} note={t('designlab.recipe.quality.lifecycle.stable.note')} />
                  <MetricCard label="Beta" value={selectedRecipeItems.filter((item) => item.lifecycle === 'beta').length} note={t('designlab.recipe.quality.lifecycle.beta.note')} />
                  <MetricCard label="Live demo" value={selectedRecipeItems.filter((item) => item.demoMode === 'live').length} note={t('designlab.recipe.quality.lifecycle.liveDemo.note')} />
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
                layer={subjectKind === 'page' ? 'pages' : 'recipes'}
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
                layerFilter="recipes"
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
                layerFilter="recipes"
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

export const DesignLabRecipeDetailSections: React.FC<DesignLabRecipeDetailSectionsProps> = ({
  activeTab,
  activeOverviewPanel,
  activeApiPanel,
  activeQualityPanel,
  recipe,
  generalContent,
  demoContent,
  recipeContractId,
  selectedRecipeTracks,
  selectedRecipeSections,
  selectedRecipeThemes,
  selectedRecipeQualityGates,
  selectedRecipeItems,
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
  subjectKind = 'recipe',
}) => {
  const { t } = useDesignLabI18n();
  const DocsSection = DocsSectionComponent;

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
          description={
            subjectKind === 'page'
              ? t('designlab.tabs.api.description.pages')
              : t('designlab.recipe.api.workspace.description')
          }
        >
          <div data-detail-section-id="api">
            <RecipeApiTab
              activeApiPanel={activeApiPanel}
              recipe={recipe}
              recipeContractId={recipeContractId}
              selectedRecipeTracks={selectedRecipeTracks}
              onApiPanelChange={onApiPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              MetricCardComponent={MetricCardComponent}
              CodeBlockComponent={CodeBlockComponent}
              UsageRecipesPanelComponent={UsageRecipesPanelComponent}
              subjectKind={subjectKind}
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
            <RecipeUxTab
              recipe={recipe}
              selectedRecipeSections={selectedRecipeSections}
              selectedRecipeThemes={selectedRecipeThemes}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              MetricCardComponent={MetricCardComponent}
              subjectKind={subjectKind}
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
            <RecipeQualityTab
              activeQualityPanel={activeQualityPanel}
              recipe={recipe}
              selectedRecipeItems={selectedRecipeItems}
              selectedRecipeQualityGates={selectedRecipeQualityGates}
              onQualityPanelChange={onQualityPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              MetricCardComponent={MetricCardComponent}
              subjectKind={subjectKind}
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
          <div data-detail-section-id="overview">
            <RecipeOverviewTab
              activeOverviewPanel={activeOverviewPanel}
              recipe={recipe}
              selectedRecipeTracks={selectedRecipeTracks}
              selectedRecipeSections={selectedRecipeSections}
              selectedRecipeThemes={selectedRecipeThemes}
              selectedRecipeQualityGates={selectedRecipeQualityGates}
              onOverviewPanelChange={onOverviewPanelChange}
              DetailLabelComponent={DetailLabelComponent}
              SectionBadgeComponent={SectionBadgeComponent}
              MetricCardComponent={MetricCardComponent}
              ShowcaseCardComponent={ShowcaseCardComponent}
              subjectKind={subjectKind}
            />
          </div>
        </DocsSection>
      );
  }
};
