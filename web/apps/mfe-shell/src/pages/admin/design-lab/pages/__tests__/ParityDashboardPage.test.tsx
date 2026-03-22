import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockDocEntryMap = new Map([
  ['Button', {
    indexItem: { name: 'Button', kind: 'component', taxonomyGroupId: 'general', availability: 'exported', lifecycle: 'stable', group: 'general', subgroup: 'actions', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: '', sectionIds: [], qualityGates: [] },
    apiItem: {
      props: [{ name: 'variant' }, { name: 'size' }],
      stateModel: ['default', 'hover', 'active'],
      variantAxes: ['variant', 'size'],
      previewStates: ['primary', 'secondary'],
      behaviorModel: ['click', 'focus'],
      regressionFocus: ['theme', 'rtl'],
    },
  }],
  ['Select', {
    indexItem: { name: 'Select', kind: 'component', taxonomyGroupId: 'inputs', availability: 'exported', lifecycle: 'beta', group: 'general', subgroup: 'inputs', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: '', sectionIds: [], qualityGates: [] },
    apiItem: {
      props: [{ name: 'options' }],
      stateModel: [],
      variantAxes: [],
      previewStates: [],
      behaviorModel: [],
      regressionFocus: [],
    },
  }],
  ['useTheme', {
    indexItem: { name: 'useTheme', kind: 'hook', taxonomyGroupId: 'hooks', availability: 'exported', lifecycle: 'stable', group: 'hooks', subgroup: '', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: '', sectionIds: [], qualityGates: [] },
    apiItem: { props: [], stateModel: [], variantAxes: [], previewStates: [], behaviorModel: [], regressionFocus: [] },
  }],
]);

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: {
      items: [],
      pages: { currentFamilies: [] },
      recipes: { currentFamilies: [] },
      ecosystem: { currentFamilies: [] },
    },
    docEntryMap: mockDocEntryMap,
    layer: 'components',
  }),
}));

vi.mock('../../components/DataProvenanceBadge', () => ({
  DataProvenanceBadge: ({ level }: { level: string }) => <span data-testid="provenance-badge">{level}</span>,
}));

import ParityDashboardPage from '../ParityDashboardPage';

function renderPage() {
  return render(<MemoryRouter><ParityDashboardPage /></MemoryRouter>);
}

describe('ParityDashboardPage', () => {
  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText('Bilesen Kalite Paritesi')).toBeInTheDocument();
  });

  it('shows the component count in subtitle (only components, not hooks)', () => {
    renderPage();
    // Only Button and Select are kind=component; useTheme is hook — excluded
    expect(screen.getByText(/2 bilesen, 6 kalite boyutunda analiz ediliyor/)).toBeInTheDocument();
  });

  it('renders all 6 quality dimension labels', () => {
    renderPage();
    // Each dimension appears in both the progress ring and the table header
    expect(screen.getAllByText('Props Docs').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('State Model').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Variant Axes').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Preview States').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Behavior Model').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Regression Focus').length).toBeGreaterThanOrEqual(2);
  });

  it('renders component rows with parity scores', () => {
    renderPage();
    // Button has all 6 dimensions = 6/6
    expect(screen.getByText('6/6')).toBeInTheDocument();
    // Select has only props = 1/6
    expect(screen.getByText('1/6')).toBeInTheDocument();
  });

  it('renders the Genel Puan progress ring label', () => {
    renderPage();
    expect(screen.getByText('Genel Puan')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    renderPage();
    // "Tumu (2)" — all components
    expect(screen.getByText(/Tumu/)).toBeInTheDocument();
  });

  it('shows the provenance badge', () => {
    renderPage();
    expect(screen.getByTestId('provenance-badge')).toBeInTheDocument();
  });
});
