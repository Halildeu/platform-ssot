import figma from '@figma/code-connect';
import { ControlChart } from './ControlChart';

figma.connect(ControlChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showZones: figma.boolean('ShowZones'),
    showViolations: figma.boolean('ShowViolations'),
    xLabel: figma.string('XLabel'),
    yLabel: figma.string('YLabel'),
  },
  example: (props) => (
    <ControlChart {...props} />
  ),
});
