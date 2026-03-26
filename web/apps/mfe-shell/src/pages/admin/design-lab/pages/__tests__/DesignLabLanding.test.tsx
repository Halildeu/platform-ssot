// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string, vars?: Record<string, unknown>) => {
      const map: Record<string, string> = {
        'designlab.landing.title': 'Design System',
        'designlab.landing.subtitle': 'Unified component library',
        'designlab.landing.search.placeholder': 'Search components...',
        'designlab.sidebar.itemCount': `${vars?.count ?? 0} items exported`,
        'designlab.landing.layer.design.title': 'Foundations',
        'designlab.landing.layer.design.description': 'Color, typography, spacing',
        'designlab.landing.layer.theme.title': 'Theme',
        'designlab.landing.layer.theme.description': 'Theme customization',
        'designlab.landing.layer.primitives.title': 'Primitives',
        'designlab.landing.layer.primitives.description': 'Base building blocks',
        'designlab.landing.layer.components.title': 'Components',
        'designlab.landing.layer.components.description': 'Reusable UI components',
        'designlab.landing.layer.patterns.title': 'Patterns',
        'designlab.landing.layer.patterns.description': 'Page-level patterns',
        'designlab.landing.layer.advanced.title': 'Advanced',
        'designlab.landing.layer.advanced.description': 'Complex data components',
        'designlab.landing.layer.recipes.title': 'Recipes',
        'designlab.landing.layer.recipes.description': 'Composition guides',
        'designlab.landing.layer.ecosystem.title': 'Ecosystem',
        'designlab.landing.layer.ecosystem.description': 'Extensions and plugins',
        'designlab.iconGallery.title': 'Icon Gallery',
        'designlab.bundleSize.title': 'Bundle Size',
        'designlab.bundleSize.description': 'Gzip size estimates',
        'designlab.landing.stats.title': 'Library Stats',
        'designlab.landing.stats.exported': 'Exported',
        'designlab.landing.stats.stable': 'Stable',
        'designlab.landing.stats.liveDemo': 'Live Demo',
        'designlab.landing.stats.apiCoverage': 'API Coverage',
      };
      return map[key] ?? key;
    },
    index: {
      items: [
        { name: 'Button', kind: 'component', availability: 'exported', lifecycle: 'stable', group: 'general', subgroup: 'actions', taxonomyGroupId: 'general', taxonomySubgroup: 'actions', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: 'A button', sectionIds: [], qualityGates: [] },
        { name: 'Select', kind: 'component', availability: 'exported', lifecycle: 'beta', group: 'general', subgroup: 'inputs', taxonomyGroupId: 'general', taxonomySubgroup: 'inputs', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: 'Select dropdown', sectionIds: [], qualityGates: [] },
      ],
      summary: { total: 2, exported: 2, planned: 0, liveDemo: 1, inspector: 0 },
      adoption: { apiCoverage: { coveragePercent: 72 } },
      pages: { currentFamilies: [{ pageId: 'p1', title: 'Dashboard', intent: 'CRUD', ownerBlocks: [] }] },
      recipes: { currentFamilies: [{ recipeId: 'r1', title: 'CRUD Recipe', intent: 'forms', ownerBlocks: [] }] },
      ecosystem: { currentFamilies: [] },
    },
    taxonomy: {
      sections: [{ id: 'components', groupIds: ['general'] }],
      groups: [{ id: 'general', label: 'General', subgroups: [{ label: 'actions', items: ['Button'] }] }],
    },
    layer: 'components',
  }),
}));

vi.mock('../../DesignLabSidebarRouter', () => ({
  API_NAMES: new Set(),
  PRIMITIVE_NAMES: new Set(),
  ADVANCED_NAMES: new Set(),
}));

import DesignLabLanding from '../DesignLabLanding';

function renderPage() {
  return render(<MemoryRouter><DesignLabLanding /></MemoryRouter>);
}

describe('DesignLabLanding', () => {
  it('renders the hero title', () => {
    renderPage();
    expect(screen.getAllByText('Design System').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the exported item count badge', () => {
    renderPage();
    expect(screen.getAllByText('2 items exported').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 9 layer cards by title', () => {
    renderPage();
    expect(screen.getAllByText('Foundations').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Theme').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Primitives').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Components').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Patterns').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Advanced').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Recipes').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Ecosystem').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Design System Layers section heading', () => {
    renderPage();
    expect(screen.getAllByText('Design System Layers').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the quick-access tool cards', () => {
    renderPage();
    expect(screen.getAllByText('Icon Gallery').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Bundle Size').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Quality Command Center').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Observability').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Governance').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Impact Intelligence').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Leadership Proof').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Library Stats section with stat cards', () => {
    renderPage();
    expect(screen.getAllByText('Library Stats').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Exported').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Stable').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Live Demo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('API Coverage').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the search input', () => {
    renderPage();
    expect(screen.getAllByTestId('design-lab-global-search').length).toBeGreaterThanOrEqual(1);
  });
});
