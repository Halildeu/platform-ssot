import figma from '@figma/code-connect';
import { HistogramChart } from './HistogramChart';

figma.connect(HistogramChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showNormalCurve: figma.boolean('ShowNormalCurve'),
    showMean: figma.boolean('ShowMean'),
    showMedian: figma.boolean('ShowMedian'),
    xLabel: figma.string('XLabel'),
    yLabel: figma.string('YLabel'),
    color: figma.string('Color'),
  },
  example: (props) => (
    <HistogramChart {...props} />
  ),
});
