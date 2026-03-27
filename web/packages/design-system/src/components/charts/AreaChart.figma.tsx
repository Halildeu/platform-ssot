import figma from '@figma/code-connect';
import { AreaChart } from './AreaChart';

figma.connect(AreaChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    stacked: figma.boolean('Stacked'),
    showDots: figma.boolean('ShowDots'),
    showGrid: figma.boolean('ShowGrid'),
    showLegend: figma.boolean('ShowLegend'),
    gradient: figma.boolean('Gradient'),
    curved: figma.boolean('Curved'),
    animate: figma.boolean('Animate'),
    title: figma.string('Title'),
    description: figma.string('Description'),
  },
  example: (props) => (
    <AreaChart {...props} />
  ),
});
