import figma from '@figma/code-connect';
import { SearchFilterListing } from './SearchFilterListing';

figma.connect(SearchFilterListing, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    selectable: figma.boolean('Selectable'),
    loading: figma.boolean('Loading'),
    size: figma.enum('Size', {
      default: 'default',
      compact: 'compact',
    }),
  },
  example: ({ selectable, loading, size }) => (
    <SearchFilterListing selectable={selectable} loading={loading} size={size} />
  ),
});
