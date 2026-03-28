// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DesignLabHero } from './DesignLabHero';
import { DesignLabSidebar } from './DesignLabSidebar';
import { DesignLabTaxonomyNavigator } from './DesignLabTaxonomyNavigator';

vi.mock('../useDesignLabI18n', () => ({
  useDesignLabI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params?.count !== undefined) {
        return `${key}:${String(params.count)}`;
      }
      if (params?.query !== undefined) {
        return `${key}:${String(params.query)}`;
      }
      if (params?.lens !== undefined) {
        return `${key}:${String(params.lens)}`;
      }
      return key;
    },
  }),
}));

const ProductTreeComponent = () => <div data-testid="product-tree">tree</div>;
const SectionBadgeComponent = ({ label }: { label: React.ReactNode }) => <span>{label}</span>;

const taxonomySections = [
  {
    id: 'foundations',
    title: 'Temeller',
    count: 6,
    description: 'Tema, token ve motion yapisi',
  },
  {
    id: 'components',
    title: 'Bilesenler',
    count: 34,
    description: 'Tekrar kullanilabilir UI yapi taslari',
  },
];

const TestHarness = () => {
  const [activeTaxonomySectionId, setActiveTaxonomySectionId] = React.useState('foundations');

  return (
    <div>
      <DesignLabHero
        breadcrumbs={<div>crumbs</div>}
        topBadges={<span>badge</span>}
        activeHeroLabel="Kutuphane"
        activeHeroTitle="Design Lab"
        activeHeroDescription="Header aciklamasi"
        sectionNavigator={(
          <DesignLabTaxonomyNavigator
            items={taxonomySections}
            activeId={activeTaxonomySectionId}
            onChange={setActiveTaxonomySectionId}
            variant="header"
            ariaLabel="Ana basliklar"
            itemTestIdPrefix="design-lab-hero-section"
          />
        )}
      />
      <DesignLabSidebar
        activeLayerId={activeTaxonomySectionId}
        sidebarHelpText="yardim"
        sidebarSearchValue=""
        sidebarSearchPlaceholder="Ara"
        activeTaxonomySectionTitle={taxonomySections.find((section) => section.id === activeTaxonomySectionId)?.title ?? null}
        familyItems={[]}
        selectedFamilyId={null}
        onFamilySelect={() => {}}
        onSearchChange={() => {}}
        treeTracks={[]}
        treeSelection={null}
        onTreeSelectionChange={() => {}}
        ProductTreeComponent={ProductTreeComponent}
        SectionBadgeComponent={SectionBadgeComponent}
      />
    </div>
  );
};

describe('DesignLab taxonomy shell integration', () => {
  afterEach(() => {
    cleanup();
  });

  it('header tek taxonomy giris noktasi olarak aktif section stateini yonetir', () => {
    render(<TestHarness />);

    expect(screen.getByTestId('design-lab-hero-section-foundations')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByTestId('design-lab-section-foundations')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('design-lab-hero-section-components'));

    expect(screen.getByTestId('design-lab-hero-section-components')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByTestId('design-lab-section-components')).not.toBeInTheDocument();
  });
});
