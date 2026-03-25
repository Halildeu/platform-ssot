import figma from '@figma/code-connect';
import { ConfidenceBadge } from './ConfidenceBadge';

figma.connect(ConfidenceBadge, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    level: figma.enum('Level', {
      low: 'low',
      medium: 'medium',
      high: 'high',
      very-high: 'very-high',
    }),
    compact: figma.boolean('Compact'),
    showScore: figma.boolean('ShowScore'),
  },
  example: ({ level, compact, showScore }) => (
    <ConfidenceBadge level={level} compact={compact} showScore={showScore} />
  ),
});
