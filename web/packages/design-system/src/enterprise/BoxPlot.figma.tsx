import figma from '@figma/code-connect';
import { BoxPlot } from './BoxPlot';

figma.connect(BoxPlot, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    showOutliers: figma.boolean('ShowOutliers'),
    showMean: figma.boolean('ShowMean'),
  },
  example: ({ orientation, showOutliers, showMean }) => (
    <BoxPlot orientation={orientation} showOutliers={showOutliers} showMean={showMean} />
  ),
});
