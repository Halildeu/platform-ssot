import figma from '@figma/code-connect';
import { OrgChart } from './OrgChart';

figma.connect(OrgChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      vertical: 'vertical',
      horizontal: 'horizontal',
    }),
    compact: figma.boolean('Compact'),
  },
  example: ({ orientation, compact }) => (
    <OrgChart orientation={orientation} compact={compact} />
  ),
});
