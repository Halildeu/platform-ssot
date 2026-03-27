import figma from '@figma/code-connect';
import { Divider } from './Divider';

figma.connect(Divider, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    label: figma.string('Label'),
    spacing: figma.enum('Spacing', {
      none: 'none',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
  },
  example: ({ orientation, label, spacing }) => (
    <Divider orientation={orientation} label={label} spacing={spacing} />
  ),
});
