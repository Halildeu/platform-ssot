import figma from '@figma/code-connect';
import { RecommendationCard } from './RecommendationCard';

figma.connect(RecommendationCard, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    primaryActionLabel: figma.string('PrimaryActionLabel'),
    secondaryActionLabel: figma.string('SecondaryActionLabel'),
    tone: figma.enum('Tone', {
      info: 'info',
      success: 'success',
      warning: 'warning',
    }),
    compact: figma.boolean('Compact'),
  },
  example: (props) => (
    <RecommendationCard {...props} />
  ),
});
