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

import FigmaSyncPage from '../FigmaSyncPage';

function renderPage() {
  return render(<MemoryRouter><FigmaSyncPage /></MemoryRouter>);
}

describe('FigmaSyncPage', () => {
  it('renders the page title "Figma Token Sync"', () => {
    renderPage();
    expect(screen.getByText('Figma Token Sync')).toBeInTheDocument();
  });

  it('shows the sync status banner', () => {
    renderPage();
    expect(screen.getByText(/Token sync durumu/)).toBeInTheDocument();
  });

  it('renders the CSS Custom Properties stat card with 209 tokens', () => {
    renderPage();
    expect(screen.getByText('CSS Custom Properties')).toBeInTheDocument();
    expect(screen.getByText('209')).toBeInTheDocument();
  });

  it('renders the source file count stat card', () => {
    renderPage();
    expect(screen.getByText('Kaynak Dosya')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('renders Token Categories section with category names', () => {
    renderPage();
    expect(screen.getByText('Token Categories')).toBeInTheDocument();
    expect(screen.getByText('colors')).toBeInTheDocument();
    expect(screen.getByText('typography')).toBeInTheDocument();
    expect(screen.getByText('spacing')).toBeInTheDocument();
  });

  it('renders the Token Drift panel with "Veri Yok" (no data)', () => {
    renderPage();
    expect(screen.getByText('Token Drift')).toBeInTheDocument();
    expect(screen.getByText('Veri Yok')).toBeInTheDocument();
  });

  it('renders the Token Altyapi Ozeti section', () => {
    renderPage();
    expect(screen.getByText('Token Altyapi Ozeti')).toBeInTheDocument();
  });

  it('shows the provenance badge', () => {
    renderPage();
    expect(screen.getAllByTestId('provenance-badge').length).toBeGreaterThan(0);
  });
});
