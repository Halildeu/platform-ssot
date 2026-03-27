import figma from '@figma/code-connect';
import { RiskMatrix } from './RiskMatrix';

figma.connect(RiskMatrix, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showLegend: figma.boolean('ShowLegend'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    accessReason: figma.string('AccessReason'),
  },
  example: ({ showLegend, size, accessReason }) => (
    <RiskMatrix showLegend={showLegend} size={size} accessReason={accessReason} />
  ),
});
