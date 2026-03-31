import type { DesignLabComponentDocEntry } from '../types';
const entry: DesignLabComponentDocEntry = {
  name: 'Statistic',
  indexItem: {
    name: 'Statistic', kind: 'component', availability: 'exported', lifecycle: 'stable', maturity: 'stable',
    group: 'data_display', subgroup: 'statistic', taxonomyGroupId: 'general', taxonomySubgroup: 'Data Display',
    demoMode: 'live',
    description: 'Numeric value display with optional title, prefix/suffix, trend indicator (up/down arrows with semantic colors), countdown timer, and loading skeleton. Compound: Statistic + Statistic.Countdown.',
    sectionIds: ['component_library_management'], qualityGates: ['design_tokens', 'preview_visibility'],
    tags: ['wave-3', 'data-display', 'statistic', 'dashboard', 'stable'],
    importStatement: "import { Statistic } from '@mfe/design-system';", whereUsed: [], dependsOn: [],
  },
  apiItem: {
    name: 'Statistic',
    variantAxes: ['size: sm | md | lg', 'trend: up | down | neutral'],
    previewStates: ['default', 'with-trend', 'with-prefix', 'countdown', 'loading'],
    behaviorModel: ['tabular-nums for aligned digits', 'trend arrows with semantic token colors', 'Countdown via setInterval (1s)', 'loading skeleton placeholder'],
    props: [
      { name: 'value', type: 'number | string', default: '-', required: false, description: 'The numeric or string value.' },
      { name: 'title', type: 'ReactNode', default: '-', required: false, description: 'Label above value.' },
      { name: 'prefix', type: 'ReactNode', default: '-', required: false, description: 'Before value (e.g. "$").' },
      { name: 'suffix', type: 'ReactNode', default: '-', required: false, description: 'After value (e.g. "%").' },
      { name: 'trend', type: "'up' | 'down' | 'neutral'", default: '-', required: false, description: 'Trend direction.' },
      { name: 'trendValue', type: 'string', default: '-', required: false, description: 'Trend delta text.' },
      { name: 'precision', type: 'number', default: '-', required: false, description: 'Decimal places.' },
    ],
    previewFocus: ['KPI card grid', 'trend up/down', 'countdown timer', 'loading state'],
    regressionFocus: ['countdown cleanup on unmount', 'tabular-nums alignment', 'skeleton dimensions'],
  },
};
export default entry;
