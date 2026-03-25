import figma from '@figma/code-connect';
import { AgingBuckets } from './AgingBuckets';

figma.connect(AgingBuckets, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    showStackedBar: figma.boolean('ShowStackedBar'),
  },
  example: ({ orientation, showStackedBar }) => (
    <AgingBuckets orientation={orientation} showStackedBar={showStackedBar} />
  ),
});
