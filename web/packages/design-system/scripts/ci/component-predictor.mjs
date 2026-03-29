#!/usr/bin/env node
/**
 * component-predictor.mjs — Predictive Component Suggestion
 *
 * Given a page/feature description, suggests design system components.
 * Usage: node scripts/ci/component-predictor.mjs "user management dashboard"
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const query = process.argv.slice(2).join(' ').toLowerCase();
if (!query) {
  console.log('Usage: node scripts/ci/component-predictor.mjs "<page description>"');
  process.exit(0);
}

// Component-keyword mapping
const COMPONENT_KEYWORDS = {
  // Data display
  'DataGrid/AgGridServer': ['table', 'grid', 'data', 'list', 'records', 'rows', 'columns'],
  'PivotTable': ['pivot', 'cross-tab', 'analysis', 'dimension', 'aggregate'],
  'TableSimple': ['table', 'simple', 'display', 'list'],
  'Descriptions': ['detail', 'summary', 'key-value', 'info', 'metadata'],
  'JsonViewer': ['json', 'api', 'payload', 'response', 'debug'],

  // Charts
  'BarChart': ['chart', 'bar', 'comparison', 'revenue', 'sales'],
  'LineChart': ['chart', 'line', 'trend', 'time-series', 'growth'],
  'PieChart': ['chart', 'pie', 'distribution', 'share', 'percentage'],
  'AreaChart': ['chart', 'area', 'cumulative', 'stack'],
  'BulletChart': ['kpi', 'target', 'actual', 'performance', 'metric'],
  'GaugeChart': ['gauge', 'speedometer', 'score', 'sla', 'compliance'],
  'FunnelChart': ['funnel', 'conversion', 'pipeline', 'stage', 'sales'],
  'RadarChart': ['radar', 'comparison', 'multi-dimension', 'skill', 'competency'],
  'SankeyDiagram': ['flow', 'sankey', 'source', 'destination', 'budget'],
  'TreemapChart': ['treemap', 'hierarchy', 'proportion', 'budget'],
  'HeatmapCalendar': ['heatmap', 'calendar', 'activity', 'attendance', 'frequency'],
  'ParetoChart': ['pareto', '80-20', 'quality', 'defect', 'complaint'],
  'WaterfallChart': ['waterfall', 'p&l', 'profit', 'loss', 'breakdown', 'financial'],
  'BoxPlot': ['boxplot', 'distribution', 'statistics', 'outlier', 'salary'],
  'HistogramChart': ['histogram', 'frequency', 'distribution', 'age', 'range'],
  'ControlChart': ['spc', 'control', 'process', 'quality', 'manufacturing'],

  // Dashboard
  'ExecutiveKPIStrip': ['kpi', 'dashboard', 'metric', 'executive', 'summary'],
  'MetricComparisonCard': ['comparison', 'period', 'month', 'year', 'trend'],
  'MicroChart': ['sparkline', 'inline', 'mini', 'compact'],
  'SmartDashboard': ['dashboard', 'overview', 'panel', 'widget'],

  // Workflow
  'ProcessFlow': ['workflow', 'bpmn', 'process', 'flow', 'step', 'approval'],
  'ValueStream': ['value-stream', 'lean', 'cycle-time', 'waste', 'manufacturing'],
  'ApprovalWorkflow': ['approval', 'workflow', 'review', 'sign-off'],
  'GanttTimeline': ['gantt', 'timeline', 'project', 'schedule', 'task'],
  'StatusTimeline': ['status', 'history', 'audit', 'tracking', 'log'],

  // Risk
  'RiskMatrix': ['risk', 'matrix', 'impact', 'probability', 'assessment'],
  'FineKinney': ['fine-kinney', 'osh', 'safety', 'hazard', 'isg'],
  'SWOTMatrix': ['swot', 'strategy', 'strength', 'weakness', 'opportunity', 'threat'],
  'DecisionMatrix': ['decision', 'scoring', 'criteria', 'weight', 'alternative'],

  // Forms
  'AdaptiveForm': ['form', 'input', 'submit', 'create', 'edit'],
  'DatePicker': ['date', 'calendar', 'schedule'],
  'DateRangePicker': ['date-range', 'period', 'from-to'],
  'FilterPresets': ['filter', 'preset', 'saved', 'view'],
  'SearchInput': ['search', 'query', 'find'],
  'FileUploadZone': ['upload', 'file', 'attachment', 'document'],
  'InlineEdit': ['inline', 'edit', 'quick-edit'],

  // Collaboration
  'CommentThread': ['comment', 'discussion', 'reply', 'feedback'],
  'ActivityFeed': ['activity', 'feed', 'log', 'audit', 'timeline'],
  'NotificationCenter': ['notification', 'alert', 'message', 'bell'],

  // Organization
  'OrgChart': ['org', 'organization', 'hierarchy', 'team', 'department'],
  'GovernanceBoard': ['governance', 'compliance', 'board', 'policy'],
  'TrainingTracker': ['training', 'education', 'certification', 'compliance'],

  // Navigation
  'Tabs': ['tab', 'section', 'category'],
  'Breadcrumb': ['breadcrumb', 'navigation', 'path'],
  'Steps': ['step', 'wizard', 'multi-step'],
  'Pagination': ['pagination', 'page', 'next', 'previous'],
  'CommandPalette': ['command', 'palette', 'shortcut', 'quick-action'],

  // Layout
  'MasterDetail': ['master-detail', 'list-detail', 'split'],
  'DetailSummary': ['detail', 'summary', 'overview'],
  'PageLayout': ['page', 'layout', 'sidebar'],
  'Accordion': ['accordion', 'collapse', 'expand', 'faq'],
  'EmptyState': ['empty', 'no-data', 'placeholder', 'onboarding'],

  // Export
  'DataExportDialog': ['export', 'download', 'pdf', 'excel', 'csv'],
  'ComparisonTable': ['compare', 'versus', 'before-after', 'diff'],
  'AgingBuckets': ['aging', 'overdue', 'bucket', 'receivable', 'payable'],
};

// Score each component
const scores = {};
for (const [component, keywords] of Object.entries(COMPONENT_KEYWORDS)) {
  let score = 0;
  for (const kw of keywords) {
    if (query.includes(kw)) score += 10;
    // Partial match
    if (kw.length > 4 && query.includes(kw.slice(0, 4))) score += 3;
  }
  if (score > 0) scores[component] = score;
}

// Sort and display
const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

console.log(`\n\ud83d\udd2e Component Predictions for: "${query}"\n`);

if (sorted.length === 0) {
  console.log('  No strong matches. Try more specific keywords.\n');
  process.exit(0);
}

const maxScore = sorted[0][1];
for (const [component, score] of sorted.slice(0, 15)) {
  const confidence = score >= maxScore * 0.8 ? '\ud83d\udfe2 High' : score >= maxScore * 0.5 ? '\ud83d\udfe1 Medium' : '\u26aa Low';
  const bar = '\u2588'.repeat(Math.ceil(score / 3));
  console.log(`  ${confidence} ${component.padEnd(25)} ${bar} (${score})`);
}

console.log(`\n  ${sorted.length} components matched, showing top ${Math.min(15, sorted.length)}\n`);

// Suggest import
console.log('  Suggested imports:');
for (const [component] of sorted.slice(0, 5)) {
  console.log(`    import { ${component} } from '@mfe/design-system';`);
}
console.log('');
