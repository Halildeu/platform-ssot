import figma from '@figma/code-connect';
import { TreemapChart } from './TreemapChart';

figma.connect(TreemapChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <TreemapChart  />
  ),
});
