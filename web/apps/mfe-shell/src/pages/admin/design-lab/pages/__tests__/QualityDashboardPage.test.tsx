// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const MOCK_ITEMS = [
  {
    name: 'Button', kind: 'component', availability: 'exported', lifecycle: 'stable',
    group: 'general', subgroup: 'actions', taxonomyGroupId: 'general', taxonomySubgroup: 'actions',
    importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: 'Primary button',
    sectionIds: [], qualityGates: ['design_tokens', 'a11y_keyboard_support', 'ux_catalog_alignment'],
  },
  {
    name: 'Select', kind: 'component', availability: 'exported', lifecycle: 'beta',
    group: 'general', subgroup: 'inputs', taxonomyGroupId: 'general', taxonomySubgroup: 'inputs',
    importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: 'Select dropdown',
    sectionIds: [], qualityGates: ['design_tokens'],
  },
  {
    name: 'DataGrid', kind: 'component', availability: 'exported', lifecycle: 'stable',
    group: 'advanced', subgroup: 'data', taxonomyGroupId: 'advanced', taxonomySubgroup: 'data',
    importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: 'Grid component',
    sectionIds: [], qualityGates: [],
  },
];

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: {
      items: MOCK_ITEMS,
      pages: { currentFamilies: [] },
      recipes: { currentFamilies: [] },
      ecosystem: { currentFamilies: [] },
    },
    layer: 'components',
  }),
}));

vi.mock('../../DesignLabSidebarRouter', () => ({
  PRIMITIVE_NAMES: new Set(),
  ADVANCED_NAMES: new Set(['DataGrid']),
  API_NAMES: new Set(),
}));

vi.mock('../../components/QualityBadge', () => ({
  QualityBadge: ({ score }: { score: number }) => <span data-testid="quality-badge">{score}%</span>,
  getQualityTier: (score: number) => score >= 90 ? 'platinum' : score >= 70 ? 'gold' : score >= 50 ? 'silver' : 'bronze',
  countByTier: () => ({ platinum: 0, gold: 1, silver: 1, bronze: 1 }),
}));

vi.mock('../../components/PackageQualityScore', () => ({
  PackageQualityScore: ({ packageName }: { packageName: string }) => <div data-testid={`pkg-${packageName}`}>{packageName}</div>,
}));

vi.mock('../../components/AlertPanel', () => ({
  AlertPanel: ({ alerts }: { alerts: Array<{ title: string }> }) => (
    <div data-testid="alert-panel">{alerts.map((a, i) => <div key={i}>{a.title}</div>)}</div>
  ),
}));

vi.mock('../../components/SLOTracker', () => ({
  SLOTracker: ({ metrics }: { metrics: Array<{ name: string }> }) => (
    <div data-testid="slo-tracker">{metrics.map((m, i) => <div key={i}>{m.name}</div>)}</div>
  ),
}));

vi.mock('../../components/CoverageMatrix', () => ({
  CoverageMatrix: ({ items }: { items: unknown[] }) => <div data-testid="coverage-matrix">{items.length} items</div>,
}));

vi.mock('../../components/QualityGatesOverview', () => ({
  QualityGatesOverview: () => <div data-testid="quality-gates-overview">Quality Gates</div>,
}));

vi.mock('../../components/SecurityPosture', () => ({
  SecurityPosture: () => <div data-testid="security-posture">Security Posture</div>,
}));

vi.mock('../../components/DataProvenanceBadge', () => ({
  DataProvenanceBadge: ({ level }: { level: string }) => <span data-testid="provenance-badge">{level}</span>,
}));

vi.mock('../../evidence/useEvidence', () => ({
  useEvidence: () => ({ status: 'no_data' }),
  FALLBACK_REGISTRY: {
    tests: {},
    benchmarks: { workflow_exists: false, threshold_enforced: false, last_run: null, results: {} },
    visual_regression: { provider: 'none', workflow_exists: false, last_run: null, status: 'no_data', stats: { pass: 0, fail: 0, changed: 0, new: 0, skipped: 0 } },
    security: {},
  },
}));

vi.mock('../../docs/guideRegistry', () => ({ hasGuide: () => false }));
vi.mock('../../tabs/componentTokenMap', () => ({ hasTokens: () => false }));
vi.mock('../../examples/registry', () => ({ hasExamples: () => false }));
vi.mock('../../playground', () => ({ hasPlayground: () => false }));

import QualityDashboardPage from '../QualityDashboardPage';

function renderPage() {
  return render(<MemoryRouter><QualityDashboardPage /></MemoryRouter>);
}

describe('QualityDashboardPage', () => {
  it('renders the page title "Quality Command Center"', () => {
    renderPage();
    expect(screen.getByText('Quality Command Center')).toBeInTheDocument();
  });

  it('shows SLO Tracker section with metric names', () => {
    renderPage();
    expect(screen.getByText('SLO Tracker')).toBeInTheDocument();
    expect(screen.getByTestId('slo-tracker')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Latency P95')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
  });

  it('shows the alert panel', () => {
    renderPage();
    expect(screen.getByTestId('alert-panel')).toBeInTheDocument();
  });

  it('renders Security Posture section', () => {
    renderPage();
    expect(screen.getByTestId('security-posture')).toBeInTheDocument();
  });

  it('renders Quality Gates Overview', () => {
    renderPage();
    expect(screen.getByTestId('quality-gates-overview')).toBeInTheDocument();
  });

  it('renders the coverage matrix with scored component count', () => {
    renderPage();
    expect(screen.getByTestId('coverage-matrix')).toBeInTheDocument();
    expect(screen.getByText('3 items')).toBeInTheDocument();
  });

  it('shows Quality Distribution section with tier labels', () => {
    renderPage();
    expect(screen.getByText('Quality Distribution')).toBeInTheDocument();
    expect(screen.getAllByText('Platinum').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Silver').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bronze').length).toBeGreaterThan(0);
  });

  it('renders Bottom 20 section title', () => {
    renderPage();
    expect(screen.getByText(/Bottom 20/)).toBeInTheDocument();
  });
});
