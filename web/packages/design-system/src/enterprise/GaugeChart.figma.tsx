import figma from '@figma/code-connect';
import { GaugeChart } from './GaugeChart';

figma.connect(GaugeChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    unit: figma.string('Unit'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    showValue: figma.boolean('ShowValue'),
    showLabel: figma.boolean('ShowLabel'),
    animate: figma.boolean('Animate'),
  },
  example: (props) => (
    <GaugeChart {...props} />
  ),
});
