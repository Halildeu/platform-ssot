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
    expect(screen.getByText('Quality Badges')).toBeInTheDocument();
    expect(screen.getByText(/Tests: 5910 pass/)).toBeInTheDocument();
    expect(screen.getByText(/Coverage: 85%/)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript: strict/)).toBeInTheDocument();
  });

  it('renders the Benchmark Results section', () => {
    renderPage();
    expect(screen.getByText('Benchmark Results')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument(); // packages benchmarked
    expect(screen.getByText('CI')).toBeInTheDocument();
  });

  it('renders the Certified Compatibility section with matrix rows', () => {
    renderPage();
    expect(screen.getByText('Certified Compatibility')).toBeInTheDocument();
    expect(screen.getByText('React 18.2 + Node 20')).toBeInTheDocument();
    expect(screen.getByText('Vite 5.x')).toBeInTheDocument();
    expect(screen.getByText('AG Grid 34.3.1')).toBeInTheDocument();
  });

  it('renders the ROI Calculator section', () => {
    renderPage();
    expect(screen.getByTestId('roi-calculator')).toBeInTheDocument();
  });

  it('renders Reference Applications with template names', () => {
    renderPage();
    expect(screen.getByText('Reference Applications')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Demo')).toBeInTheDocument();
    expect(screen.getByText('CRUD Demo')).toBeInTheDocument();
    expect(screen.getByText('Admin Demo')).toBeInTheDocument();
  });

  it('renders the Release Timeline section', () => {
    renderPage();
    expect(screen.getByTestId('release-timeline')).toBeInTheDocument();
  });

  it('renders Usage Analytics with engagement data', () => {
    renderPage();
    expect(screen.getByText('Usage Analytics')).toBeInTheDocument();
    expect(screen.getByText('256')).toBeInTheDocument(); // totalViews
    expect(screen.getByText('48')).toBeInTheDocument(); // uniqueComponents
    expect(screen.getByText('12s')).toBeInTheDocument(); // avgTime
  });
});
