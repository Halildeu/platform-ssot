import figma from '@figma/code-connect';
import { FilterBar } from './FilterBar';

figma.connect(FilterBar, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    moreLabel: figma.string('MoreLabel'),
    compact: figma.boolean('Compact'),
  },
  example: ({ moreLabel, compact }) => (
    <FilterBar moreLabel={moreLabel} compact={compact} />
  ),
});
