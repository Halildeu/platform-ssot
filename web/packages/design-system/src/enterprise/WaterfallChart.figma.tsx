import figma from '@figma/code-connect';
import { WaterfallChart } from './WaterfallChart';

figma.connect(WaterfallChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showValues: figma.boolean('ShowValues'),
    showConnectors: figma.boolean('ShowConnectors'),
  },
  example: ({ showValues, showConnectors }) => (
    <WaterfallChart showValues={showValues} showConnectors={showConnectors} />
  ),
});
