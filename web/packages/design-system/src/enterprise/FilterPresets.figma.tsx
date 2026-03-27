import figma from '@figma/code-connect';
import { FilterPresets } from './FilterPresets';

figma.connect(FilterPresets, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <FilterPresets  />
  ),
});
