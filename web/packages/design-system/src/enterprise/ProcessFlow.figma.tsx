import figma from '@figma/code-connect';
import { ProcessFlow } from './ProcessFlow';

figma.connect(ProcessFlow, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
  },
  example: ({ orientation }) => (
    <ProcessFlow orientation={orientation} />
  ),
});
