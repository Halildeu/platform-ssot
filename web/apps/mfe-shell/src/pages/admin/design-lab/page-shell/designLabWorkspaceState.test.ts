import { describe, expect, it } from 'vitest';
import {
  applyFamilySelection,
  readFamilySelectionUrlParams,
  readLayerPanelUrlParams,
  resolveActiveFamilySelectionId,
  resolveActiveFamilySelectionIdFromState,
  resolveFallbackFamilySelection,
  resolveHydratedFamilySelection,
  resolvePreferredSectionId,
  resolveSectionChangeFamilySelection,
  resolveSidebarFamilySelection,
  resolveWorkspaceModeForSection,
  syncFamilySelectionUrlParams,
  syncLayerPanelUrlParams,
  stripInactiveLayerParams,
  stripInactiveWorkspaceParams,
} from './designLabWorkspaceState';

describe('designLabWorkspaceState', () => {
  it('tercih edilen section icerik tasiyorsa onu korur, degilse ilk uygun sectiona duser', () => {
    const sectionIds = ['foundations', 'components', 'recipes'];
    const hasContent = (sectionId: string) => sectionId === 'components' || sectionId === 'recipes';

    expect(resolvePreferredSectionId(sectionIds, 'components', hasContent)).toBe('components');
    expect(resolvePreferredSectionId(sectionIds, 'foundations', hasContent)).toBe('components');
  });

  it('aktif family id secimini pages ve recipes arasinda dogru cozer', () => {
    expect(
      resolveActiveFamilySelectionId({
        layerId: 'pages',
        selectedRecipeId: 'detail_summary',
        selectedPageTemplateId: 'dashboard_template',
      }),
    ).toBe('dashboard_template');

    expect(
      resolveActiveFamilySelectionId({
        layerId: 'recipes',
        selectedRecipeId: 'detail_summary',
        selectedPageTemplateId: 'dashboard_template',
      }),
    ).toBe('detail_summary');
  });

  it('aktif family id secimini ortak state objesi uzerinden de dogru cozer', () => {
    expect(
      resolveActiveFamilySelectionIdFromState({
        layerId: 'pages',
        selectionState: {
          recipes: 'detail_summary',
          pages: 'dashboard_template',
        },
      }),
    ).toBe('dashboard_template');

    expect(
      resolveActiveFamilySelectionIdFromState({
        layerId: 'recipes',
        selectionState: {
          recipes: 'detail_summary',
          pages: 'dashboard_template',
        },
      }),
    ).toBe('detail_summary');
  });

  it('URL hydrate sirasinda pages targetini canonical olarak cozer', () => {
    const result = resolveHydratedFamilySelection({
      workspaceMode: 'pages',
      layerId: 'pages',
      templateParam: null,
      recipeParam: 'dashboard_shell',
      legacyRecipeFallbackId: 'legacy_dashboard',
      sectionId: 'pages',
      resolveFamilySelectionForSection: () => 'fallback_dashboard',
    });

    expect(result).toEqual({
      selectionKind: 'pages',
      selectionId: 'dashboard_shell',
    });
  });

  it('family selection URL parametrelerini tek helper ile okur', () => {
    const result = readFamilySelectionUrlParams(
      new URLSearchParams('dl_recipe=detail_summary&dl_template=dashboard_shell'),
    );

    expect(result).toEqual({
      recipeParam: 'detail_summary',
      templateParam: 'dashboard_shell',
    });
  });

  it('panel URL parametrelerini layer-bagimsiz olarak okur (cross-layer fallback yok)', () => {
    const result = readLayerPanelUrlParams(
      new URLSearchParams(
        'dl_foundation_overview=tokens&dl_foundation_api=runtime&dl_foundation_quality=consistency&dl_foundation_preview=theme&dl_overview=release&dl_component_api=contract&dl_component_quality=gates&dl_component_preview=live&dl_recipe_overview=summary&dl_recipe_api=binding&dl_recipe_quality=lifecycle&dl_recipe_preview=reference&dl_template_overview=regions&dl_template_api=deps&dl_template_quality=readiness&dl_template_preview=gallery',
      ),
    );

    expect(result).toEqual({
      foundations: {
        overview: 'tokens',
        api: 'runtime',
        quality: 'consistency',
        preview: 'theme',
      },
      components: {
        overview: 'release',
        api: 'contract',
        quality: 'gates',
        preview: 'live',
      },
      recipes: {
        overview: 'summary',
        api: 'binding',
        quality: 'lifecycle',
        preview: 'reference',
      },
      pages: {
        overview: 'regions',
        api: 'deps',
        quality: 'readiness',
        preview: 'gallery',
      },
      ecosystem: {
        overview: null,
        api: null,
        quality: null,
        preview: null,
      },
    });
  });

  it('pages panel URL parametreleri artik recipe parametrelerine fallback yapmaz', () => {
    const result = readLayerPanelUrlParams(
      new URLSearchParams(
        'dl_recipe_overview=summary&dl_recipe_api=binding',
      ),
    );

    expect(result.pages.overview).toBeNull();
    expect(result.pages.api).toBeNull();
  });

  it('URL hydrate sirasinda recipes targetini recipe id uzerinden cozer', () => {
    const result = resolveHydratedFamilySelection({
      workspaceMode: 'recipes',
      layerId: 'recipes',
      templateParam: 'dashboard_shell',
      recipeParam: null,
      legacyRecipeFallbackId: 'detail_summary',
      sectionId: 'recipes',
      resolveFamilySelectionForSection: () => 'fallback_recipe',
    });

    expect(result).toEqual({
      selectionKind: 'recipes',
      selectionId: 'detail_summary',
    });
  });

  it('family secimi bosken ilgili layer icin ilk aileyi fallback olarak dondurur', () => {
    expect(
      resolveFallbackFamilySelection({
        layerId: 'pages',
        selectedFamilyId: null,
        familyItems: [{ recipeId: 'dashboard_template' }, { recipeId: 'settings_template' }],
      }),
    ).toEqual({
      selectionKind: 'pages',
      selectionId: 'dashboard_template',
    });

    expect(
      resolveFallbackFamilySelection({
        layerId: 'components',
        selectedFamilyId: null,
        familyItems: [{ recipeId: 'dashboard_template' }],
      }),
    ).toBeNull();
  });

  it('section degisiminde pages ve recipes icin hedef family secimini cozer', () => {
    expect(
      resolveSectionChangeFamilySelection({
        layerId: 'pages',
        selectedRecipeId: 'detail_summary',
        selectedPageTemplateId: null,
        resolveFamilySelectionForSection: (sectionId) =>
          sectionId === 'pages' ? 'dashboard_template' : 'detail_summary',
      }),
    ).toEqual({
      selectionKind: 'pages',
      selectionId: 'dashboard_template',
    });

    expect(
      resolveSectionChangeFamilySelection({
        layerId: 'recipes',
        selectedRecipeId: null,
        selectedPageTemplateId: 'dashboard_template',
        resolveFamilySelectionForSection: (sectionId) =>
          sectionId === 'recipes' ? 'detail_summary' : 'dashboard_template',
      }),
    ).toEqual({
      selectionKind: 'recipes',
      selectionId: 'detail_summary',
    });
  });

  it('section degisim helperi secim varsa veya component layer ise null doner', () => {
    expect(
      resolveSectionChangeFamilySelection({
        layerId: 'pages',
        selectedRecipeId: null,
        selectedPageTemplateId: 'dashboard_template',
        resolveFamilySelectionForSection: () => 'fallback_dashboard',
      }),
    ).toBeNull();

    expect(
      resolveSectionChangeFamilySelection({
        layerId: 'components',
        selectedRecipeId: null,
        selectedPageTemplateId: null,
        resolveFamilySelectionForSection: () => 'fallback_dashboard',
      }),
    ).toBeNull();
  });

  it('sidebar family select icin workspace, section ve selection targetini cozer', () => {
    expect(
      resolveSidebarFamilySelection({
        familyId: 'dashboard_template',
        familySectionId: 'pages',
        fallbackSectionId: 'recipes',
      }),
    ).toEqual({
      workspaceMode: 'pages',
      sectionId: 'pages',
      selectionKind: 'pages',
      selectionId: 'dashboard_template',
    });

    expect(
      resolveSidebarFamilySelection({
        familyId: 'detail_summary',
        familySectionId: 'patterns',
        fallbackSectionId: 'components',
      }),
    ).toEqual({
      workspaceMode: 'recipes',
      sectionId: 'patterns',
      selectionKind: 'recipes',
      selectionId: 'detail_summary',
    });
  });

  it('family selection helperi sadece ilgili recipe-like layer alanini gunceller', () => {
    expect(
      applyFamilySelection(
        {
          recipes: 'detail_summary',
          pages: 'dashboard_template',
        },
        {
          selectionKind: 'pages',
          selectionId: 'settings_template',
        },
      ),
    ).toEqual({
      recipes: 'detail_summary',
      pages: 'settings_template',
    });

    expect(
      applyFamilySelection(
        {
          recipes: 'detail_summary',
          pages: 'dashboard_template',
        },
        {
          selectionKind: 'recipes',
          selectionId: 'search_filter_listing',
        },
      ),
    ).toEqual({
      recipes: 'search_filter_listing',
      pages: 'dashboard_template',
    });
  });

  it('family selection stateini aktif layera gore canonical URL keylerine yazar', () => {
    const recipeSearch = syncFamilySelectionUrlParams({
      search: new URLSearchParams('dl_recipe=old_recipe&dl_template=old_template'),
      layerId: 'recipes',
      selectionState: {
        recipes: 'detail_summary',
        pages: 'dashboard_template',
      },
    });

    expect(recipeSearch.get('dl_recipe')).toBe('detail_summary');
    expect(recipeSearch.get('dl_template')).toBeNull();

    const pageSearch = syncFamilySelectionUrlParams({
      search: new URLSearchParams('dl_recipe=old_recipe&dl_template=old_template'),
      layerId: 'pages',
      selectionState: {
        recipes: 'detail_summary',
        pages: 'dashboard_template',
      },
    });

    expect(pageSearch.get('dl_template')).toBe('dashboard_template');
    expect(pageSearch.get('dl_recipe')).toBeNull();

    const componentSearch = syncFamilySelectionUrlParams({
      search: new URLSearchParams('dl_recipe=old_recipe&dl_template=old_template'),
      layerId: 'components',
      selectionState: {
        recipes: 'detail_summary',
        pages: 'dashboard_template',
      },
    });

    expect(componentSearch.get('dl_recipe')).toBeNull();
    expect(componentSearch.get('dl_template')).toBeNull();
  });

  it('panel stateini aktif layerin canonical URL keylerine yazar', () => {
    const panelState = {
      foundations: {
        overview: 'tokens',
        api: 'runtime',
        quality: 'consistency',
        preview: 'theme',
      },
      components: {
        overview: 'release',
        api: 'contract',
        quality: 'gates',
        preview: 'live',
      },
      recipes: {
        overview: 'summary',
        api: 'binding',
        quality: 'lifecycle',
        preview: 'reference',
      },
      pages: {
        overview: 'regions',
        api: 'dependencies',
        quality: 'readiness',
        preview: 'live',
      },
      ecosystem: {
        overview: 'summary',
        api: 'contract',
        quality: 'gates',
        preview: 'live',
      },
    } as const;

    const foundationSearch = syncLayerPanelUrlParams({
      search: new URLSearchParams(),
      layerId: 'foundations',
      panelState,
    });
    expect(foundationSearch.get('dl_foundation_overview')).toBe('tokens');
    expect(foundationSearch.get('dl_foundation_api')).toBe('runtime');
    expect(foundationSearch.get('dl_foundation_quality')).toBe('consistency');
    expect(foundationSearch.get('dl_foundation_preview')).toBe('theme');

    const recipeSearch = syncLayerPanelUrlParams({
      search: new URLSearchParams(),
      layerId: 'recipes',
      panelState,
    });
    expect(recipeSearch.get('dl_recipe_overview')).toBe('summary');
    expect(recipeSearch.get('dl_recipe_api')).toBe('binding');
    expect(recipeSearch.get('dl_recipe_quality')).toBe('lifecycle');
    expect(recipeSearch.get('dl_recipe_preview')).toBe('reference');

    const pageSearch = syncLayerPanelUrlParams({
      search: new URLSearchParams(),
      layerId: 'pages',
      panelState,
    });
    expect(pageSearch.get('dl_template_overview')).toBe('regions');
    expect(pageSearch.get('dl_template_api')).toBe('dependencies');
    expect(pageSearch.get('dl_template_quality')).toBe('readiness');
    expect(pageSearch.get('dl_template_preview')).toBe('live');

    const componentSearch = syncLayerPanelUrlParams({
      search: new URLSearchParams(),
      layerId: 'components',
      panelState,
    });
    expect(componentSearch.get('dl_overview')).toBe('release');
    expect(componentSearch.get('dl_component_api')).toBe('contract');
    expect(componentSearch.get('dl_component_quality')).toBe('gates');
    expect(componentSearch.get('dl_component_preview')).toBe('live');
  });

  it('recipes modunda component URL parametrelerini temizler', () => {
    const search = new URLSearchParams(
      'dl_mode=recipes&dl_section=recipes&dl_recipe=detail_summary&dl_template=dashboard_shell&dl_track=new_packages&dl_group=navigation&dl_subgroup=menus&dl_item=MenuBar',
    );

    stripInactiveWorkspaceParams(search, 'recipes');

    expect(search.get('dl_recipe')).toBe('detail_summary');
    expect(search.get('dl_template')).toBeNull();
    expect(search.get('dl_track')).toBeNull();
    expect(search.get('dl_group')).toBeNull();
    expect(search.get('dl_subgroup')).toBeNull();
    expect(search.get('dl_item')).toBeNull();
  });

  it('pages modunda component ve recipe URL parametrelerini temizler', () => {
    const search = new URLSearchParams(
      'dl_mode=pages&dl_section=pages&dl_template=dashboard_shell&dl_recipe=detail_summary&dl_track=new_packages&dl_group=navigation',
    );

    stripInactiveWorkspaceParams(search, 'pages');

    expect(search.get('dl_template')).toBe('dashboard_shell');
    expect(search.get('dl_recipe')).toBeNull();
    expect(search.get('dl_track')).toBeNull();
    expect(search.get('dl_group')).toBeNull();
  });

  it('components modunda recipe ve page URL parametrelerini temizler', () => {
    const search = new URLSearchParams(
      'dl_mode=components&dl_section=components&dl_recipe=detail_summary&dl_template=dashboard_shell&dl_track=new_packages&dl_group=navigation',
    );

    stripInactiveWorkspaceParams(search, 'components');

    expect(search.get('dl_recipe')).toBeNull();
    expect(search.get('dl_template')).toBeNull();
    expect(search.get('dl_track')).toBe('new_packages');
    expect(search.get('dl_group')).toBe('navigation');
  });

  it('foundations modunda component, recipe ve page URL parametrelerini temizler', () => {
    const search = new URLSearchParams(
      'dl_mode=foundations&dl_section=foundations&dl_foundation_track=theme&dl_track=new_packages&dl_group=navigation&dl_recipe=detail_summary&dl_template=dashboard_shell',
    );

    stripInactiveWorkspaceParams(search, 'foundations');

    expect(search.get('dl_foundation_track')).toBe('theme');
    expect(search.get('dl_track')).toBeNull();
    expect(search.get('dl_group')).toBeNull();
    expect(search.get('dl_recipe')).toBeNull();
    expect(search.get('dl_template')).toBeNull();
  });

  it('layer bazli temizlemede foundations icin diger tum layer keylerini kaldirir', () => {
    const search = new URLSearchParams(
      'dl_section=foundations&dl_foundation_overview=tokens&dl_foundation_api=runtime&dl_track=new_packages&dl_overview=release&dl_recipe=detail_summary&dl_recipe_overview=summary&dl_template=dashboard_shell&dl_template_overview=regions',
    );

    stripInactiveLayerParams(search, 'foundations');

    expect(search.get('dl_foundation_overview')).toBe('tokens');
    expect(search.get('dl_foundation_api')).toBe('runtime');
    expect(search.get('dl_track')).toBeNull();
    expect(search.get('dl_overview')).toBeNull();
    expect(search.get('dl_recipe')).toBeNull();
    expect(search.get('dl_recipe_overview')).toBeNull();
    expect(search.get('dl_template')).toBeNull();
    expect(search.get('dl_template_overview')).toBeNull();
  });

  it('layer bazli temizlemede pages icin dl_template disinda recipe/component URL keylerini kaldirir', () => {
    const search = new URLSearchParams(
      'dl_section=pages&dl_template=dashboard_shell&dl_template_overview=summary&dl_template_api=contract&dl_recipe=detail_summary&dl_recipe_overview=coverage&dl_recipe_api=binding&dl_track=new_packages&dl_group=navigation&dl_subgroup=menus&dl_item=MenuBar',
    );

    stripInactiveLayerParams(search, 'pages');

    expect(search.get('dl_template')).toBe('dashboard_shell');
    expect(search.get('dl_template_overview')).toBe('summary');
    expect(search.get('dl_template_api')).toBe('contract');
    expect(search.get('dl_recipe')).toBeNull();
    expect(search.get('dl_recipe_overview')).toBeNull();
    expect(search.get('dl_recipe_api')).toBeNull();
    expect(search.get('dl_track')).toBeNull();
    expect(search.get('dl_group')).toBeNull();
    expect(search.get('dl_subgroup')).toBeNull();
    expect(search.get('dl_item')).toBeNull();
  });

  it('layer bazli temizlemede recipes icin dl_recipe disinda pages/component URL keylerini kaldirir', () => {
    const search = new URLSearchParams(
      'dl_section=recipes&dl_recipe=detail_summary&dl_recipe_overview=summary&dl_template=dashboard_shell&dl_template_overview=coverage&dl_track=new_packages&dl_group=navigation',
    );

    stripInactiveLayerParams(search, 'recipes');

    expect(search.get('dl_recipe')).toBe('detail_summary');
    expect(search.get('dl_recipe_overview')).toBe('summary');
    expect(search.get('dl_template')).toBeNull();
    expect(search.get('dl_template_overview')).toBeNull();
    expect(search.get('dl_track')).toBeNull();
    expect(search.get('dl_group')).toBeNull();
  });

  it('layer bazli temizlemede components icin dl_recipe ve dl_template keylerini kaldirir', () => {
    const search = new URLSearchParams(
      'dl_section=components&dl_recipe=detail_summary&dl_recipe_overview=summary&dl_template=dashboard_shell&dl_template_overview=coverage&dl_track=new_packages&dl_group=navigation',
    );

    stripInactiveLayerParams(search, 'components');

    expect(search.get('dl_recipe')).toBeNull();
    expect(search.get('dl_recipe_overview')).toBeNull();
    expect(search.get('dl_template')).toBeNull();
    expect(search.get('dl_template_overview')).toBeNull();
    expect(search.get('dl_track')).toBe('new_packages');
    expect(search.get('dl_group')).toBe('navigation');
  });

  it('section id uzerinden canonical workspace mode cozer', () => {
    expect(resolveWorkspaceModeForSection('foundations')).toBe('foundations');
    expect(resolveWorkspaceModeForSection('components')).toBe('components');
    expect(resolveWorkspaceModeForSection('recipes')).toBe('recipes');
    expect(resolveWorkspaceModeForSection('pages')).toBe('pages');
    expect(resolveWorkspaceModeForSection('patterns')).toBe('recipes');
    expect(resolveWorkspaceModeForSection('templates')).toBe('pages');
    expect(resolveWorkspaceModeForSection('ai_ux')).toBe('recipes');
    expect(resolveWorkspaceModeForSection('content_language')).toBe('foundations');
    expect(resolveWorkspaceModeForSection('governance')).toBe('foundations');
    expect(resolveWorkspaceModeForSection('visualization')).toBe('components');
  });
});
