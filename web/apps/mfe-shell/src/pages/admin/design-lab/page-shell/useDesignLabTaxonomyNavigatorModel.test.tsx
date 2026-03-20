// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useDesignLabTaxonomyNavigatorModel } from './useDesignLabTaxonomyNavigatorModel';

const sections = [
  {
    id: 'foundations',
    title: 'Temeller',
    description: 'Tema ve token yapisi',
    groupIds: ['tokens'],
  },
  {
    id: 'recipes',
    title: 'Recipes',
    description: 'Workflow ve tekrar kullanilan recipe yuzeyleri',
    groupIds: ['flows'],
  },
];

const allItems = [
  {
    name: 'ColorToken',
    taxonomyGroupId: 'tokens',
    taxonomySubgroup: 'Theme',
    lifecycle: 'stable',
  },
  {
    name: 'SearchFilterListing',
    taxonomyGroupId: 'flows',
    taxonomySubgroup: 'Listing',
    lifecycle: 'stable',
  },
];

const familyItems = [
  {
    familyId: 'family-patterns',
    recipeId: 'recipe-patterns',
    ownerBlocks: ['SearchFilterListing'],
    intent: 'Pattern recipe',
  },
  {
    familyId: 'family-global',
    recipeId: 'recipe-global',
    ownerBlocks: [],
    intent: 'Global recipe',
  },
];

const sectionMap = new Map(sections.map((section) => [section.id, section] as const));

const resolveTaxonomySectionForGroup = (groupId: string | null | undefined) => {
  if (groupId === 'tokens') return 'foundations';
  if (groupId === 'flows') return 'recipes';
  return null;
};

const getFamilySectionIds = (family: { familyId: string }) => {
  if (family.familyId === 'family-patterns') {
    return ['recipes'];
  }
  return [];
};

const ComponentModeHarness = () => {
  const [activeSectionId, setActiveSectionId] = React.useState('foundations');
  const [selectedFamilyId, setSelectedFamilyId] = React.useState<string | null>(null);
  const [treeSelection, setTreeSelection] = React.useState({
    trackId: 'current_system',
    groupId: 'tokens',
    subgroupId: 'Theme',
    itemId: 'ColorToken',
  });

  const itemsForTrack = React.useMemo(
    () => allItems.filter((item) => resolveTaxonomySectionForGroup(item.taxonomyGroupId) === activeSectionId),
    [activeSectionId],
  );

  const { taxonomySectionItems, handleTaxonomySectionChange } = useDesignLabTaxonomyNavigatorModel({
    sections,
    workspaceMode: 'components',
    setActiveTaxonomySectionId: setActiveSectionId,
    filteredTrackItems: allItems,
    itemsForTrack,
    allItems,
    activeTrack: 'current_system',
    resolveItemTrack: () => 'current_system',
    setTreeSelection,
    sectionMap,
    resolveTaxonomySectionForGroup,
    getTaxonomySectionTitle: (_sectionId, fallbackTitle) => fallbackTitle,
    getTaxonomySectionDescription: (_sectionId, fallbackDescription) => fallbackDescription ?? null,
    familyItemsMatchingQuery: familyItems,
    getFamilySectionIds,
    setSelectedFamilyId,
  });

  return (
    <div>
      <div data-testid="component-count-foundations">
        {taxonomySectionItems.find((item) => item.id === 'foundations')?.count ?? 0}
      </div>
      <div data-testid="component-count-recipes">
        {taxonomySectionItems.find((item) => item.id === 'recipes')?.count ?? 0}
      </div>
      <div data-testid="component-active-section">{activeSectionId}</div>
      <div data-testid="component-tree-item">{treeSelection.itemId}</div>
      <div data-testid="component-selected-recipe">{selectedFamilyId ?? 'null'}</div>
      <button type="button" onClick={() => handleTaxonomySectionChange('recipes')}>
        recipes
      </button>
    </div>
  );
};

const RecipeModeHarness = () => {
  const [activeSectionId, setActiveSectionId] = React.useState('foundations');
  const [selectedFamilyId, setSelectedFamilyId] = React.useState<string | null>('family-global');
  const [treeSelection, setTreeSelection] = React.useState({
    trackId: 'current_system',
    groupId: 'tokens',
    subgroupId: 'Theme',
    itemId: 'ColorToken',
  });

  const itemsForTrack = React.useMemo(
    () => allItems.filter((item) => resolveTaxonomySectionForGroup(item.taxonomyGroupId) === activeSectionId),
    [activeSectionId],
  );

  const { taxonomySectionItems, handleTaxonomySectionChange } = useDesignLabTaxonomyNavigatorModel({
    sections,
    workspaceMode: 'recipes',
    setActiveTaxonomySectionId: setActiveSectionId,
    filteredTrackItems: allItems,
    itemsForTrack,
    allItems,
    activeTrack: 'current_system',
    resolveItemTrack: () => 'current_system',
    setTreeSelection,
    sectionMap,
    resolveTaxonomySectionForGroup,
    getTaxonomySectionTitle: (_sectionId, fallbackTitle) => fallbackTitle,
    getTaxonomySectionDescription: (_sectionId, fallbackDescription) => fallbackDescription ?? null,
    familyItemsMatchingQuery: familyItems,
    getFamilySectionIds,
    setSelectedFamilyId,
  });

  return (
    <div>
      <div data-testid="recipe-count-foundations">
        {taxonomySectionItems.find((item) => item.id === 'foundations')?.count ?? 0}
      </div>
      <div data-testid="recipe-count-recipes">
        {taxonomySectionItems.find((item) => item.id === 'recipes')?.count ?? 0}
      </div>
      <div data-testid="recipe-active-section">{activeSectionId}</div>
      <div data-testid="recipe-tree-item">{treeSelection.itemId}</div>
      <div data-testid="recipe-selected-recipe">{selectedFamilyId ?? 'null'}</div>
      <button type="button" onClick={() => handleTaxonomySectionChange('recipes')}>
        recipes
      </button>
    </div>
  );
};

describe('useDesignLabTaxonomyNavigatorModel', () => {
  afterEach(() => {
    cleanup();
  });

  it('component modunda section countlerini hesaplar ve uygun tree itema gecis yapar', () => {
    render(<ComponentModeHarness />);

    expect(screen.getByTestId('component-count-foundations')).toHaveTextContent('1');
    expect(screen.getByTestId('component-count-recipes')).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: 'recipes' }));

    expect(screen.getByTestId('component-active-section')).toHaveTextContent('recipes');
    expect(screen.getByTestId('component-tree-item')).toHaveTextContent('SearchFilterListing');
    expect(screen.getByTestId('component-selected-recipe')).toHaveTextContent('null');
  });

  it('recipe modunda section secimi sonrasi recipe secimini gunceller', () => {
    render(<RecipeModeHarness />);

    expect(screen.getByTestId('recipe-count-foundations')).toHaveTextContent('1');
    expect(screen.getByTestId('recipe-count-recipes')).toHaveTextContent('2');

    fireEvent.click(screen.getByRole('button', { name: 'recipes' }));

    expect(screen.getByTestId('recipe-active-section')).toHaveTextContent('recipes');
    expect(screen.getByTestId('recipe-selected-recipe')).toHaveTextContent('family-patterns');
    expect(screen.getByTestId('recipe-tree-item')).toHaveTextContent('ColorToken');
  });
});
