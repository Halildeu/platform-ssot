import figma from '@figma/code-connect';
import { TreeTable } from './TreeTable';

figma.connect(TreeTable, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <TreeTable  />
  ),
});
