import figma from '@figma/code-connect';
import { MetricComparisonCard } from './MetricComparisonCard';

figma.connect(MetricComparisonCard, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    title: figma.string('Title'),
    format: figma.enum('Format', {
      number: 'number',
      currency: 'currency',
      percent: 'percent',
    }),
    currencySymbol: figma.string('CurrencySymbol'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    invertTrend: figma.boolean('InvertTrend'),
  },
  example: (props) => (
    <MetricComparisonCard {...props} />
  ),
});
