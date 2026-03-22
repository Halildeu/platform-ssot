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
    expect(screen.getByText('Design System')).toBeInTheDocument();
  });

  it('renders the exported item count badge', () => {
    renderPage();
    expect(screen.getByText('2 items exported')).toBeInTheDocument();
  });

  it('renders all 9 layer cards by title', () => {
    renderPage();
    expect(screen.getByText('Foundations')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Primitives')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('Patterns')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
    expect(screen.getByText('Ecosystem')).toBeInTheDocument();
  });

  it('renders Design System Layers section heading', () => {
    renderPage();
    expect(screen.getByText('Design System Layers')).toBeInTheDocument();
  });

  it('renders the quick-access tool cards', () => {
    renderPage();
    expect(screen.getByText('Icon Gallery')).toBeInTheDocument();
    expect(screen.getByText('Bundle Size')).toBeInTheDocument();
    expect(screen.getByText('Quality Command Center')).toBeInTheDocument();
    expect(screen.getByText('Observability')).toBeInTheDocument();
    expect(screen.getByText('Governance')).toBeInTheDocument();
    expect(screen.getByText('Impact Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Leadership Proof')).toBeInTheDocument();
  });

  it('renders Library Stats section with stat cards', () => {
    renderPage();
    expect(screen.getByText('Library Stats')).toBeInTheDocument();
    expect(screen.getByText('Exported')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
    expect(screen.getByText('Live Demo')).toBeInTheDocument();
    expect(screen.getByText('API Coverage')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    renderPage();
    expect(screen.getByTestId('design-lab-global-search')).toBeInTheDocument();
  });
});
