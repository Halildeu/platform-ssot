import figma from '@figma/code-connect';
import { ParetoChart } from './ParetoChart';

figma.connect(ParetoChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showCumulativeLine: figma.boolean('ShowCumulativeLine'),
    showPercentLabels: figma.boolean('ShowPercentLabels'),
    show80Line: figma.boolean('Show80Line'),
  },
  example: ({ showCumulativeLine, showPercentLabels, show80Line }) => (
    <ParetoChart showCumulativeLine={showCumulativeLine} showPercentLabels={showPercentLabels} show80Line={show80Line} />
  ),
});
