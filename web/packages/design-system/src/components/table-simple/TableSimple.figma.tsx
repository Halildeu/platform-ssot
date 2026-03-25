import figma from '@figma/code-connect';
import { TableSimple } from './TableSimple';

figma.connect(TableSimple, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <TableSimple  />
  ),
});
