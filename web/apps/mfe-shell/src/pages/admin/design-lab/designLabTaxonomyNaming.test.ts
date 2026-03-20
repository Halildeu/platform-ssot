import { describe, expect, it } from 'vitest';
import designLabTaxonomyRaw from '../design-lab.taxonomy.v1.json';

type DesignLabTaxonomy = {
  groups: Array<{
    id: string;
    subgroups: string[];
  }>;
};

const designLabTaxonomy = designLabTaxonomyRaw as DesignLabTaxonomy;

describe('designLabTaxonomy naming', () => {
  it('navigation grubunda canonical menubar alt isimlerini kullanir', () => {
    const navigationGroup = designLabTaxonomy.groups.find((group) => group.id === 'navigation');

    expect(navigationGroup).not.toBeNull();
    expect(navigationGroup?.subgroups).toContain('Search / Command Header');
    expect(navigationGroup?.subgroups).toContain('Action Header');
    expect(navigationGroup?.subgroups).not.toContain('Command Header');
    expect(navigationGroup?.subgroups).toContain('Action Bar');
  });
});
