import figma from '@figma/code-connect';
import { Transfer } from './Transfer';

figma.connect(Transfer, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    searchable: figma.boolean('Searchable'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    showSelectAll: figma.boolean('ShowSelectAll'),
  },
  example: ({ searchable, size, showSelectAll }) => (
    <Transfer searchable={searchable} size={size} showSelectAll={showSelectAll} />
  ),
});
