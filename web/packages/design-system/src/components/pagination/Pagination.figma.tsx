import figma from '@figma/code-connect';
import { Pagination } from './Pagination';

figma.connect(Pagination, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
    }),
    showTotal: figma.boolean('ShowTotal'),
  },
  example: ({ size, showTotal }) => (
    <Pagination size={size} showTotal={showTotal} />
  ),
});
