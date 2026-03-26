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
      ],
      pages: { currentFamilies: [] },
      recipes: { currentFamilies: [] },
      ecosystem: { currentFamilies: [] },
    },
    layer: 'components',
  }),
}));

vi.mock('../../intelligence/ReleaseTimelinePanel', () => ({
  default: () => <div data-testid="release-timeline">Timeline Content</div>,
}));
vi.mock('../../intelligence/ROICalculator', () => ({
  default: () => <div data-testid="roi-calculator">ROI Calculator Content</div>,
}));
vi.mock('../../intelligence/useDesignLabAnalytics', () => ({
  useDesignLabAnalytics: () => ({
    getTopViewed: () => [
      { name: 'Button', views: 42 },
      { name: 'Select', views: 31 },
    ],
    getTopSearched: () => [
      { query: 'datepicker', count: 15 },
      { query: 'modal', count: 12 },
    ],
    getEngagement: () => ({
      totalViews: 256,
      uniqueComponents: 48,
      avgTimeMs: 12000,
    }),
  }),
}));

import LeadershipProofPage from '../LeadershipProofPage';

function renderPage() {
  return render(<MemoryRouter><LeadershipProofPage /></MemoryRouter>);
}

describe('LeadershipProofPage', () => {
  it('renders the hero title "Leadership Proof"', () => {
    renderPage();
    expect(screen.getByText('Leadership Proof')).toBeInTheDocument();
  });

  it('renders the Quality Badges section with badge values', () => {
    renderPage();
    expect(screen.getAllByText('Quality Badges').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tests: 5910 pass/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Coverage: 85%/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/TypeScript: strict/).length).toBeGreaterThanOrEqual(1);
    // Components badge should reflect the mock index items length (1)
    expect(screen.getAllByText(/Components: 1/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Benchmark Results section', () => {
    renderPage();
    expect(screen.getAllByText('Benchmark Results').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('6').length).toBeGreaterThanOrEqual(1); // packages benchmarked
    expect(screen.getAllByText('CI').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Certified Compatibility section with matrix rows', () => {
    renderPage();
    expect(screen.getAllByText('Certified Compatibility').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('React 18.2 + Node 20').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Vite 5.x').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('AG Grid 34.3.1').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the ROI Calculator section', () => {
    renderPage();
    expect(screen.getAllByTestId('roi-calculator').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Reference Applications with template names', () => {
    renderPage();
    expect(screen.getAllByText('Reference Applications').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Dashboard Demo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CRUD Demo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Admin Demo').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Release Timeline section', () => {
    renderPage();
    expect(screen.getAllByTestId('release-timeline').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Usage Analytics with engagement data', () => {
    renderPage();
    expect(screen.getAllByText('Usage Analytics').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('256').length).toBeGreaterThanOrEqual(1); // totalViews
    expect(screen.getAllByText('48').length).toBeGreaterThanOrEqual(1); // uniqueComponents
    expect(screen.getAllByText('12s').length).toBeGreaterThanOrEqual(1); // avgTime
  });
});
