import figma from '@figma/code-connect';
import { Skeleton } from './Skeleton';

figma.connect(Skeleton, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    circle: figma.boolean('Circle'),
    animated: figma.boolean('Animated'),
  },
  example: ({ circle, animated }) => (
    <Skeleton circle={circle} animated={animated} />
  ),
});
