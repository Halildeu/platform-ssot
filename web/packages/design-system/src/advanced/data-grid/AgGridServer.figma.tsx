import figma from '@figma/code-connect';
import { AgGridServer } from './AgGridServer';

figma.connect(AgGridServer, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <AgGridServer  />
  ),
});
