import figma from '@figma/code-connect';
import { StatusTimeline } from './StatusTimeline';

figma.connect(StatusTimeline, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    compact: figma.boolean('Compact'),
  },
  example: ({ orientation, compact }) => (
    <StatusTimeline orientation={orientation} compact={compact} />
  ),
});
