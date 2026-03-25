import figma from '@figma/code-connect';
import { RadarChart } from './RadarChart';

figma.connect(RadarChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showLabels: figma.boolean('ShowLabels'),
    showLegend: figma.boolean('ShowLegend'),
    showTooltip: figma.boolean('ShowTooltip'),
  },
  example: ({ showLabels, showLegend, showTooltip }) => (
    <RadarChart showLabels={showLabels} showLegend={showLegend} showTooltip={showTooltip} />
  ),
});
