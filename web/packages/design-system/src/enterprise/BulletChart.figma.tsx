import figma from '@figma/code-connect';
import { BulletChart } from './BulletChart';

figma.connect(BulletChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    subtitle: figma.string('Subtitle'),
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    barColor: figma.string('BarColor'),
    targetColor: figma.string('TargetColor'),
  },
  example: (props) => (
    <BulletChart {...props} />
  ),
});
