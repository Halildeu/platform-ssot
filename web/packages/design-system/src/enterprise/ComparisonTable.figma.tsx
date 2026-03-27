import figma from '@figma/code-connect';
import { ComparisonTable } from './ComparisonTable';

figma.connect(ComparisonTable, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    invertVarianceColors: figma.boolean('InvertVarianceColors'),
  },
  example: ({ invertVarianceColors }) => (
    <ComparisonTable invertVarianceColors={invertVarianceColors} />
  ),
});
