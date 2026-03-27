import figma from '@figma/code-connect';
import { FunnelChart } from './FunnelChart';

figma.connect(FunnelChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      vertical: 'vertical',
      horizontal: 'horizontal',
    }),
    animated: figma.boolean('Animated'),
  },
  example: ({ orientation, animated }) => (
    <FunnelChart orientation={orientation} animated={animated} />
  ),
});
