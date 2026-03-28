import { describe, expect, it } from 'vitest';
import {
  filterDesignLabShowcaseSectionsForMode,
  getDesignLabPreviewPanelItems,
} from './DesignLabShowcaseContent';

describe('DesignLabShowcaseContent preview modeli', () => {
  const t = (key: string) => key;

  it('components modunda yalniz live ve reference panellerini sunar', () => {
    expect(getDesignLabPreviewPanelItems('components', t).map((panel) => panel.id)).toEqual([
      'live',
      'reference',
    ]);
  });

  it('recipes modunda recipe panelini de sunar', () => {
    expect(getDesignLabPreviewPanelItems('recipes', t).map((panel) => panel.id)).toEqual([
      'live',
      'reference',
      'recipe',
    ]);
  });

  it('pages modunda ucuncu paneli template olarak sunar', () => {
    expect(getDesignLabPreviewPanelItems('pages', t)).toEqual([
      {
        id: 'live',
        label: 'designlab.showcase.previewPanels.live.label',
        note: 'designlab.showcase.previewPanels.live.note',
      },
      {
        id: 'reference',
        label: 'designlab.showcase.previewPanels.reference.label',
        note: 'designlab.showcase.previewPanels.reference.note',
      },
      {
        id: 'recipe',
        label: 'Template',
        note: 'Page template handoff surface',
      },
    ]);
  });

  it('components modunda recipe sectionlarini gorunur vitrin listesinden cikarir', () => {
    const filtered = filterDesignLabShowcaseSectionsForMode('components', [
      {
        id: 'live-1',
        title: 'Live surface',
        kind: 'live',
        content: null,
      },
      {
        id: 'recipe-1',
        title: 'Recipe surface',
        kind: 'recipe',
        content: null,
      },
      {
        id: 'reference-1',
        title: 'Reference surface',
        kind: 'reference',
        content: null,
      },
    ]);

    expect(filtered.map((section) => section.id)).toEqual([
      'live-1',
      'reference-1',
    ]);
  });
});
