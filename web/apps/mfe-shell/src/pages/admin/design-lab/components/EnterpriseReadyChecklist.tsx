import React, { useMemo } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { Text } from '@mfe/design-system';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Maturity = 'experimental' | 'beta' | 'stable' | 'enterprise';
type ComponentCategory = 'display' | 'interactive' | 'form-field' | 'overlay' | 'container';

interface IndexItemSlice {
  maturity?: Maturity;
  qualityGates: string[];
}

interface ApiItemSlice {
  previewStates?: string[];
  stateModel: string[];
  behaviorModel?: string[];
  variantAxes?: string[];
  regressionFocus?: string[];
  props: Array<{ name: string }>;
}

/* ------------------------------------------------------------------ */
/*  Category-aware thresholds                                          */
/* ------------------------------------------------------------------ */

interface CategoryThreshold {
  minProps: number;
  minStates: number;
  minVariants: number;
  minPreview: number;
  minRegressionFocus: number;
  needsLabel: boolean;
  needsKeyboard: boolean;
  minQualityGates: number;
}

const CATEGORY_THRESHOLDS: Record<ComponentCategory, CategoryThreshold> = {
  'display':     { minProps: 3, minStates: 1, minVariants: 1, minPreview: 2, minRegressionFocus: 1, needsLabel: false, needsKeyboard: false, minQualityGates: 2 },
  'interactive': { minProps: 4, minStates: 2, minVariants: 2, minPreview: 3, minRegressionFocus: 2, needsLabel: false, needsKeyboard: true,  minQualityGates: 3 },
  'form-field':  { minProps: 6, minStates: 3, minVariants: 2, minPreview: 3, minRegressionFocus: 2, needsLabel: true,  needsKeyboard: true,  minQualityGates: 3 },
  'overlay':     { minProps: 4, minStates: 2, minVariants: 1, minPreview: 2, minRegressionFocus: 2, needsLabel: true,  needsKeyboard: true,  minQualityGates: 2 },
  'container':   { minProps: 3, minStates: 1, minVariants: 1, minPreview: 2, minRegressionFocus: 1, needsLabel: false, needsKeyboard: false, minQualityGates: 2 },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MATURITY_RANK: Record<Maturity, number> = {
  experimental: 0,
  beta: 1,
  stable: 2,
  enterprise: 3,
};

function maturityAtLeast(current: Maturity | undefined, threshold: Maturity): boolean {
  if (!current) return false;
  return MATURITY_RANK[current] >= MATURITY_RANK[threshold];
}

/* ------------------------------------------------------------------ */
/*  Criteria — category-aware depth scoring                            */
/* ------------------------------------------------------------------ */

interface Criterion {
  id: string;
  label: string;
  met: boolean;
  applicable: boolean; // false = N/A for this category, excluded from score
  detail?: string;     // shows actual vs expected
  group: 'documentation' | 'a11y' | 'theming' | 'engineering';
}

const GROUP_META: Record<Criterion['group'], { label: string; color: string }> = {
  documentation: { label: 'Documentation & API Coverage', color: 'blue' },
  a11y:          { label: 'Accessibility & States',       color: 'violet' },
  theming:       { label: 'Theming & Dark Mode',          color: 'amber' },
  engineering:   { label: 'Engineering & Test Readiness',  color: 'emerald' },
};

function evaluateCriteria(
  indexItem: IndexItemSlice,
  apiItem: ApiItemSlice | null | undefined,
  category: ComponentCategory,
): Criterion[] {
  const t = CATEGORY_THRESHOLDS[category];
  const maturity = indexItem.maturity;
  const previewStates = apiItem?.previewStates ?? [];
  const stateModel = apiItem?.stateModel ?? [];
  const behaviorModel = apiItem?.behaviorModel ?? [];
  const variantAxes = apiItem?.variantAxes ?? [];
  const regressionFocus = apiItem?.regressionFocus ?? [];
  const props = apiItem?.props ?? [];
  const propNames = new Set(props.map((p) => p.name));
  const propNamesLower = new Set(props.map((p) => p.name.toLowerCase()));
  const qualityGates = indexItem.qualityGates;

  const hasLabel = propNames.has('label') ||
    propNames.has('title') ||
    propNames.has('ariaLabel') ||
    Array.from(propNames).some((n) => n.includes('label') || n.includes('aria-label'));

  const hasKeyboardGate = qualityGates.includes('a11y_keyboard_support') ||
    Array.from(propNames).some((n) => n.includes('tabIndex') || n.includes('onKeyDown'));

  return [
    /* ── Documentation & API Coverage ── */
    {
      id: 'api-surface',
      label: 'API surface coverage',
      met: props.length >= t.minProps,
      applicable: true,
      detail: `${props.length}/${t.minProps} props`,
      group: 'documentation',
    },
    {
      id: 'state-depth',
      label: 'State model depth',
      met: stateModel.length >= t.minStates,
      applicable: true,
      detail: `${stateModel.length}/${t.minStates} states`,
      group: 'documentation',
    },
    {
      id: 'variant-coverage',
      label: 'Variant axes coverage',
      met: variantAxes.length >= t.minVariants,
      applicable: true,
      detail: `${variantAxes.length}/${t.minVariants} axes`,
      group: 'documentation',
    },
    {
      id: 'visual-test-coverage',
      label: 'Visual test scenarios',
      met: previewStates.length >= t.minPreview,
      applicable: true,
      detail: `${previewStates.length}/${t.minPreview} scenarios`,
      group: 'documentation',
    },
    {
      id: 'behavior-model',
      label: 'Behavior model defined',
      met: behaviorModel.length > 0,
      applicable: true,
      detail: `${behaviorModel.length} behaviors`,
      group: 'documentation',
    },
    {
      id: 'regression-depth',
      label: 'Regression focus areas',
      met: regressionFocus.length >= t.minRegressionFocus,
      applicable: true,
      detail: `${regressionFocus.length}/${t.minRegressionFocus} areas`,
      group: 'documentation',
    },

    /* ── Accessibility & States ── */
    {
      id: 'a11y-label',
      label: 'Accessible label / title',
      met: hasLabel,
      applicable: t.needsLabel,
      group: 'a11y',
    },
    {
      id: 'a11y-states',
      label: 'State management (disabled / loading / open)',
      met: stateModel.length >= 2 ||
           propNames.has('disabled') ||
           propNames.has('loading') ||
           propNames.has('open'),
      applicable: true,
      group: 'a11y',
    },
    {
      id: 'a11y-keyboard',
      label: 'Keyboard interaction support',
      met: hasKeyboardGate,
      applicable: t.needsKeyboard,
      group: 'a11y',
    },

    /* ── Theming & Dark Mode ── */
    {
      id: 'design-tokens',
      label: 'Design tokens gate',
      met: qualityGates.includes('design_tokens'),
      applicable: true,
      group: 'theming',
    },
    {
      id: 'density-support',
      label: 'Size / density variants',
      met: propNames.has('size') ||
           propNames.has('density') ||
           propNames.has('compact') ||
           Array.from(propNamesLower).some((n) => n.includes('size')),
      applicable: true,
      group: 'theming',
    },
    {
      id: 'customizable',
      label: 'Customizable (className / slotProps)',
      met: propNames.has('className') ||
           propNames.has('slotProps') ||
           Array.from(propNames).some((n) => n.includes('className')),
      applicable: true,
      group: 'theming',
    },
    {
      id: 'dark-mode',
      label: 'Dark mode readiness',
      met: qualityGates.includes('design_tokens') &&
           (previewStates.some((s) => s.toLowerCase().includes('dark')) ||
            propNames.has('colorScheme') ||
            propNames.has('appearance') ||
            behaviorModel.some((b) => b.toLowerCase().includes('theme') || b.toLowerCase().includes('dark'))),
      applicable: true,
      group: 'theming',
    },

    /* ── Engineering & Test Readiness ── */
    {
      id: 'quality-gates-depth',
      label: `Quality gates (≥ ${t.minQualityGates})`,
      met: qualityGates.length >= t.minQualityGates,
      applicable: true,
      detail: `${qualityGates.length}/${t.minQualityGates} gates`,
      group: 'engineering',
    },
    {
      id: 'maturity-level',
      label: 'Maturity ≥ beta',
      met: maturityAtLeast(maturity, 'beta'),
      applicable: true,
      group: 'engineering',
    },
    {
      id: 'ux-catalog',
      label: 'UX catalog alignment',
      met: qualityGates.includes('ux_catalog_alignment'),
      applicable: true,
      group: 'engineering',
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface EnterpriseReadyChecklistProps {
  indexItem: IndexItemSlice;
  apiItem: ApiItemSlice | null | undefined;
  componentCategory?: ComponentCategory;
}

export function EnterpriseReadyChecklist({
  indexItem,
  apiItem,
  componentCategory = 'display',
}: EnterpriseReadyChecklistProps) {
  const criteria = useMemo(
    () => evaluateCriteria(indexItem, apiItem, componentCategory),
    [indexItem, apiItem, componentCategory],
  );

  const applicable = criteria.filter((c) => c.applicable);
  const metCount = applicable.filter((c) => c.met).length;
  const total = applicable.length;
  const pct = total > 0 ? Math.round((metCount / total) * 100) : 0;

  const groups = useMemo(() => {
    const order: Criterion['group'][] = ['documentation', 'a11y', 'theming', 'engineering'];
    return order
      .map((g) => {
        const items = criteria.filter((c) => c.group === g);
        const applicableItems = items.filter((c) => c.applicable);
        const met = applicableItems.filter((c) => c.met).length;
        return { key: g, ...GROUP_META[g], items, applicableItems, met, total: applicableItems.length };
      })
      .filter((g) => g.items.length > 0);
  }, [criteria]);

  const categoryLabel: Record<ComponentCategory, string> = {
    'display': 'Display',
    'interactive': 'Interactive',
    'form-field': 'Form Field',
    'overlay': 'Overlay',
    'container': 'Container',
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-gradient-to-r from-indigo-500/5 to-transparent px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
            <svg
              className="h-4 w-4 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Component Quality Checklist
            </Text>
            <Text variant="secondary" className="text-[10px]">
              {metCount}/{total} criteria met · {categoryLabel[componentCategory]} profile
            </Text>
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative flex h-12 w-12 items-center justify-center">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-surface-muted"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              strokeWidth="3"
              strokeDasharray={`${(metCount / Math.max(total, 1)) * 113.1} 113.1`}
              strokeLinecap="round"
              className={
                metCount === total
                  ? 'text-emerald-500'
                  : metCount >= total * 0.7
                    ? 'text-indigo-500'
                    : metCount >= total * 0.4
                      ? 'text-amber-500'
                      : 'text-red-500'
              }
            />
          </svg>
          <span className="absolute text-[10px] font-bold tabular-nums text-text-primary">
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={[
              'h-full rounded-full transition-all duration-500',
              metCount === total
                ? 'bg-emerald-500'
                : metCount >= total * 0.7
                  ? 'bg-indigo-500'
                  : metCount >= total * 0.4
                    ? 'bg-amber-500'
                    : 'bg-red-500',
            ].join(' ')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Grouped checklist */}
      {groups.map((group) => (
        <div key={group.key}>
          <div className="flex items-center justify-between bg-surface-canvas/40 px-5 py-2">
            <Text variant="secondary" className="text-[10px] font-semibold uppercase tracking-widest">
              {group.label}
            </Text>
            <Text variant="secondary" className="text-[10px] font-semibold tabular-nums">
              {group.met}/{group.total}
            </Text>
          </div>
          <div className="divide-y divide-border-subtle">
            {group.items.map((criterion) => (
              <div
                key={criterion.id}
                className={[
                  'flex items-center gap-3 px-5 py-2.5 transition-colors',
                  criterion.applicable ? 'hover:bg-surface-canvas/30' : 'opacity-40',
                ].join(' ')}
              >
                {!criterion.applicable ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-500/5">
                    <span className="text-[8px] font-medium text-text-tertiary">N/A</span>
                  </span>
                ) : criterion.met ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </span>
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                  </span>
                )}
                <div className="flex flex-1 items-center justify-between gap-2">
                  <Text
                    className={[
                      'text-xs',
                      !criterion.applicable
                        ? 'text-text-tertiary italic'
                        : criterion.met
                          ? 'text-text-primary'
                          : 'text-text-secondary',
                    ].join(' ')}
                  >
                    {criterion.label}
                  </Text>
                  {criterion.detail && criterion.applicable && (
                    <Text
                      className={[
                        'text-[10px] tabular-nums',
                        criterion.met ? 'text-emerald-600' : 'text-amber-600',
                      ].join(' ')}
                    >
                      {criterion.detail}
                    </Text>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
