// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: {
      items: [
        { name: 'Button', kind: 'component', availability: 'exported', lifecycle: 'stable', group: 'general', subgroup: 'actions', taxonomyGroupId: 'general', taxonomySubgroup: 'actions', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: '', sectionIds: [], qualityGates: [] },
        { name: 'Select', kind: 'component', availability: 'exported', lifecycle: 'beta', group: 'general', subgroup: 'inputs', taxonomyGroupId: 'general', taxonomySubgroup: 'inputs', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: '', sectionIds: [], qualityGates: [] },
        { name: 'Modal', kind: 'component', availability: 'exported', lifecycle: 'stable', group: 'general', subgroup: 'overlays', taxonomyGroupId: 'general', taxonomySubgroup: 'overlays', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: '', sectionIds: [], qualityGates: [] },
      ],
      pages: { currentFamilies: [] },
      recipes: { currentFamilies: [] },
      ecosystem: { currentFamilies: [] },
    },
    layer: 'components',
  }),
}));

vi.mock('../../components/DataProvenanceBadge', () => ({
  DataProvenanceBadge: ({ level }: { level: string }) => <span data-testid="provenance-badge">{level}</span>,
}));

vi.mock('../../evidence/useEvidence', () => ({
  useEvidence: () => ({ status: 'no_data' }),
  FALLBACK_REGISTRY: {
    visual_regression: {
      provider: 'none',
      workflow_exists: false,
      last_run: null,
      status: 'no_data',
      stats: { pass: 0, fail: 0, changed: 0, new: 0, skipped: 0 },
    },
    security: {},
    tests: {},
    benchmarks: { workflow_exists: false, threshold_enforced: false, last_run: null, results: {} },
  },
}));

import VisualRegressionPage from '../VisualRegressionPage';

function renderPage() {
  return render(<MemoryRouter><VisualRegressionPage /></MemoryRouter>);
}

describe('VisualRegressionPage', () => {
  it('renders the page title "Visual Regression"', () => {
    renderPage();
    expect(screen.getByText('Visual Regression')).toBeInTheDocument();
  });

  it('shows the page subtitle', () => {
    renderPage();
    expect(screen.getByText(/Per-component snapshot comparison/)).toBeInTheDocument();
  });

  it('renders the Open Chromatic button', () => {
    renderPage();
    expect(screen.getByText('Open Chromatic')).toBeInTheDocument();
  });

  it('shows evidence status banner for no_data', () => {
    renderPage();
    expect(screen.getByText(/Evidence registry bulunamadi/)).toBeInTheDocument();
  });

  it('renders the browser list (Chromium, Firefox, WebKit)', () => {
    renderPage();
    expect(screen.getByText(/Chromium/)).toBeInTheDocument();
  });

  it('renders stat cards for Passed, Changed, Failed, Snapshots', () => {
    renderPage();
    expect(screen.getByText('Passed')).toBeInTheDocument();
    // "Changed" appears in both stat card and filter button
    expect(screen.getAllByText('Changed').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Snapshots')).toBeInTheDocument();
  });

  it('renders filter buttons (All, Pass, Changed, Fail, New)', () => {
    renderPage();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('Fail')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders the component count in footer', () => {
    renderPage();
    expect(screen.getByText(/Showing 3 of 3 components/)).toBeInTheDocument();
  });
});
