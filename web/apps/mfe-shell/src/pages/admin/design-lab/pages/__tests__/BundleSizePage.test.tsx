// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'designlab.bundleSize.title': 'Bundle Size Estimates',
        'designlab.bundleSize.description': 'Heuristic gzip size estimates for all design-system components',
      };
      return map[key] ?? key;
    },
    index: {
      items: [],
      pages: { currentFamilies: [] },
      recipes: { currentFamilies: [] },
      ecosystem: { currentFamilies: [] },
    },
    layer: 'components',
  }),
}));

vi.mock('../../DesignLabSidebarRouter', () => ({
  PRIMITIVE_NAMES: new Set(['Button', 'Text', 'Badge']),
  ADVANCED_NAMES: new Set(['EntityGrid', 'AgGridServer']),
}));

import BundleSizePage from '../BundleSizePage';

function renderPage() {
  return render(<MemoryRouter><BundleSizePage /></MemoryRouter>);
}

describe('BundleSizePage', () => {
  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText('Bundle Size Estimates')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    renderPage();
    expect(screen.getByText(/Heuristic gzip size estimates/)).toBeInTheDocument();
  });

  it('shows the component count badge in the header', () => {
    renderPage();
    // KNOWN_SIZES has many entries; "N components" appears in header badge and tier cards
    expect(screen.getAllByText(/components$/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders tier summary cards (Primitive, Component, Advanced, Pattern, Provider)', () => {
    renderPage();
    // Tier labels appear in both summary cards and table rows
    expect(screen.getAllByText('Primitive').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Component').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Advanced').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pattern').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Provider').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the sortable table with column headers', () => {
    renderPage();
    expect(screen.getByText('Gzip Size')).toBeInTheDocument();
    expect(screen.getByText('Tier')).toBeInTheDocument();
    expect(screen.getByText('Relative')).toBeInTheDocument();
  });

  it('renders known component names in the table', () => {
    renderPage();
    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.getByText('AgGridServer')).toBeInTheDocument();
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('shows the total size display', () => {
    renderPage();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('renders the search input for filtering', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Search components...')).toBeInTheDocument();
  });
});
